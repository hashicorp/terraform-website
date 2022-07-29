import { SemVer, gt, gte, lt, lte } from 'semver'
import * as unified from 'unified'

import visit from 'unist-util-visit'
import type { Literal, Position, Parent } from 'unist'
import type { TestFunction } from 'unist-util-is'

class ContentExclusionError extends Error {
  constructor(message, position: Position) {
    super(message)
    this.name = 'ContentExclusionError'
    this.message = message + `\n` + ` - at line: ${position.start.line}`
  }
}

export const remarkTfeContentExclusion: unified.Pluggable<
  [{ version: string }]
> = (params) => {
  // console.log('remarkTfeContentExclusion', params)
  const { version } = params
  return function visitor(root: Parent) {
    let begin: string | null = null
    let end: string | null = null
    const BEGIN_REGEX = /\s+begin:\s+/i
    const END_REGEX = /\s+end:\s+/i

    // 1. ensure all comments are paired
    visit(root, 'comment', ({ value, position }: Literal<string>) => {
      // expects BEGIN
      if (begin === null && end === null) {
        if (value.match(BEGIN_REGEX)) {
          begin = value.replace(BEGIN_REGEX, '')
          return
        } else {
          throw new ContentExclusionError(
            `Expected 'BEGIN: ...' comment, found '${value}'`,
            position
          )
        }
      }

      // expects END
      if (begin !== null && end === null) {
        if (value.match(END_REGEX)) {
          end = value.replace(END_REGEX, '')

          // expects BEGIN to match ENG
          if (begin !== end) {
            throw new ContentExclusionError(
              `Expected a matching 'END: ...' comment, found '${value}'`,
              position
            )
          } else {
            // OK
            begin = null
            end = null
            return
          }
        } else {
          throw new ContentExclusionError(
            `Expected 'END: ...' comment, found '${value}'`,
            position
          )
        }
      }
    })

    // 2. Determine which nodes to remove...
    //    Iterate through the nodes backwards, and remove as needed
    //    At this point, we can assume that all comments are paired
    begin = null
    end = null
    let shouldRemove = false
    const indexesToRemove: number[] = []

    // don't strip nodes when on "latest"
    if (version !== 'latest') {
      visit(
        root,
        // visit all nodes
        (() => true) as unknown as TestFunction<any>,
        (node: Literal<string>, index) => {
          // only deal with immediate children of the root node
          const indexOf = root.children.indexOf(node)
          if (indexOf < 0) return

          // if comment, check things
          if (node.type === 'comment') {
            const { value } = node
            // expects END
            if (begin === null && end === null) {
              // if we find a matching END
              if (value.match(END_REGEX)) {
                end = value.replace(END_REGEX, '')
                shouldRemove = !tryGetVersionSatisfies(version, end)
                if (shouldRemove) {
                  indexesToRemove.push(indexOf)
                }
              }
              return
            }

            // expects BEGIN
            if (begin === null && end !== null) {
              if (value.match(BEGIN_REGEX)) {
                if (shouldRemove) {
                  indexesToRemove.push(indexOf)

                  // reset
                  shouldRemove = false
                }
                begin = null
                end = null
              }
            }
          } else {
            // if not comment, check if we should remove
            if (shouldRemove) {
              indexesToRemove.push(indexOf)
            }
          }
        },
        true
      )
    }

    // REMOVE NODES
    // sort DESC
    indexesToRemove
      .sort((a, b) => b - a)
      .forEach((i) => {
        console.log('remove', i)
        root.children.splice(i, 1)
      })

    // 3. inject DOM elements
    visit(root, 'comment', (node: Literal<string>) => {
      // return
      // console.log(value)
      node.type = 'jsx'

      const type = node.value.match(/begin/i)
        ? 'begin'
        : node.value.match(/end/i)
        ? 'end'
        : ''

      if (type === 'begin') {
        node.value =
          `<div className="content_exclusion begin">` +
          `<div className="content_exclusion_inner" >` +
          node.value.replace('<', '&lt;') +
          `</div>` +
          `</div>`
      }
      if (type === 'end') {
        node.value =
          `<div className="content_exclusion end">` +
          `<div className="content_exclusion_inner" >` +
          node.value.replace('<', '&lt;') +
          `</div>` +
          `</div>`
      }
    })
  }
}

const DIRECTIVE_RE =
  /^(?<product>TF[CE]):(?<comparator>only|[<>]=?)(v(?<version>[0-9]{6}-[0-9]+))?$/i

/**
 * This returns a boolean value indicating if a given TFE version
 * satisfies a given exclusion directive.
 *
 * Will throw if the block is invalid.
 *
 * @param version a string like `v202001-1`
 * @param block a string like `TFE:>=v202205-1`
 * @returns {boolean} true if the version satisfies the block
 */
export const tryGetVersionSatisfies = (
  version: string,
  block: string
): boolean => {
  const [flag, ...meta] = block.split(/\s+/)
  const directive = flag.match(DIRECTIVE_RE)

  if (!directive) {
    throw new Error('Directive could not be parsed')
  }

  if (!directive.groups) {
    throw new Error('Directive is possibly malformed')
  }

  const { groups } = directive

  switch (groups.product) {
    case 'TFE': {
      const versionSemVer = getTfeSemver(version)
      const directiveSemVer = getTfeSemver(groups.version)

      const compare = getComparisonFn(groups.comparator)
      return compare(versionSemVer, directiveSemVer)
    }
    case 'TFC': {
      if (groups.comparator === 'only') {
        return false
      } else {
        throw new Error(`TFC only supports [only] comparator`)
      }
    }
    default: {
      // We should never get here, but throw an error just in case
      throw new Error('Unexpected error')
    }
  }
}

const getComparisonFn = (operator: string) => {
  switch (operator) {
    case '<=':
      return (a: SemVer, b: SemVer) => lte(a, b)
    case '>=':
      return (a: SemVer, b: SemVer) => gte(a, b)
    case '<':
      return (a: SemVer, b: SemVer) => lt(a, b)
    case '>':
      return (a: SemVer, b: SemVer) => gt(a, b)
    default:
      throw new Error('Invalid comparator: ' + operator)
  }
}

/**
 * converts a TFE version string into a `SemVer` instance
 */
export const getTfeSemver = (tfeVersionString: string) => {
  const [series, release] = tfeVersionString.replace(/^v/, '').split('-')

  const year = parseInt(series.slice(0, 4))
  const month = parseInt(series.slice(4, 6))

  return new SemVer(`${year}.${month}.${release || 0}`)
}
