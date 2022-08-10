import { SemVer, gt, gte, lt, lte } from 'semver'

// This is largely copied from
// https://github.com/hashicorp/mktg-content-workflows/blob/main/shared/transforms/strip-terraform-enterprise-content.ts
export function tfeContentExclusionHook(
  content: string,
  version: string
): string {
  const incomingVersion = version
  // console.log({ incomingVersion })
  if (incomingVersion === 'latest') {
    let lines = content.split('\n')
    lines = lines.filter((e) => !(e.match(BEGIN_RE) || e.match(END_RE)))
    const result = lines.join('\n')
    console.log(result)
    return result
  }

  if (!version.match(/^v[0-9]{6}-[0-9]+$/i)) {
    throw new Error(
      `Invalid faked version: ${version}.\n` +
        `Ensure the version in the URL is valid TFE format: v######-#`
    )
  }
  // get each line of our mdx content
  const lines = content.split(/\r?\n/)

  let matching = false

  // accumulate the content exclusion blocks
  const matches: { start: number; block: string; end: number }[] = []
  lines.map((line, idx) => {
    if (!matching) {
      // Wait for a BEGIN block to be matched

      // throw if an END block is matched first
      const endMatch = line.match(END_RE)
      if (endMatch) {
        throw new StripTerraformEnterpriseContentError(
          `Unexpected END block: line ${idx + 1}`
        )
      }

      const beginMatch = line.match(BEGIN_RE)

      if (beginMatch) {
        matching = true

        if (!beginMatch.groups?.block) {
          throw new StripTerraformEnterpriseContentError(
            'No block could be parsed from BEGIN comment'
          )
        }

        matches.push({
          start: idx,
          block: beginMatch.groups.block,
          end: -1,
        })
      }
    } else {
      // If we are actively matching within a block, monitor for the end

      // throw if a BEGIN block is matched again
      const beginMatch = line.match(BEGIN_RE)
      if (beginMatch) {
        throw new StripTerraformEnterpriseContentError(
          `Unexpected BEGIN block: line ${idx + 1}`
        )
      }

      const endMatch = line.match(END_RE)
      if (endMatch) {
        const latestMatch = matches[matches.length - 1]

        if (!endMatch.groups?.block) {
          throw new StripTerraformEnterpriseContentError(
            'No block could be parsed from END comment'
          )
        }

        // If we reach and end with an un-matching block name, throw an error
        if (endMatch.groups.block !== latestMatch.block) {
          const errMsg =
            `Mismatched block names: Block opens with "${latestMatch.block}", and closes with "${endMatch[1]}".` +
            `\n` +
            `Please make sure opening and closing block names are matching. Blocks cannot be nested.` +
            `\n` +
            `- Open:  ${latestMatch.start + 1}: ${latestMatch.block}` +
            `\n` +
            `- Close: ${idx + 1}: ${endMatch[1]}` +
            `\n`
          // logger.error(errMsg)
          throw new StripTerraformEnterpriseContentError(
            'Mismatched block names'
          )
        }

        // Push the ending index of the block into the match result and set matching to false
        latestMatch.end = idx
        matching = false
      }
    }
  })

  // iterate through the list of matches backwards to remove lines
  matches.reverse().forEach(({ start, end, block }, i) => {
    const satisfies = tryGetVersionSatisfies(incomingVersion, block)

    // if a version does not satisfy the directive, remove the block
    if (!satisfies) {
      lines.splice(start, end - start + 1)
    }
  })

  return lines.join('\n')
}

export const BEGIN_RE = /^(\s+)?<!--\s+BEGIN:\s+(?<block>.*?)\s+-->(\s+)?$/
export const END_RE = /^(\s+)?<!--\s+END:\s+(?<block>.*?)\s+-->(\s+)?$/
export const DIRECTIVE_RE =
  /^(?<product>TF[CE]):(?<comparator>only|[<>]=?)(v(?<version>[0-9]{6}-[0-9]+))?$/i

export const tryGetVersionSatisfies = (
  version: string,
  block: string
): boolean => {
  const [flag, ...meta] = block.split(/\s+/)
  const directive = flag.match(DIRECTIVE_RE)

  if (!directive) {
    throw new StripTerraformEnterpriseContentError(
      'Directive could not be parsed'
    )
  }

  if (!directive.groups) {
    throw new StripTerraformEnterpriseContentError(
      'Directive is possibly malformed'
    )
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
        throw new StripTerraformEnterpriseContentError(
          `TFC only supports [only] comparator`
        )
      }
    }
    default: {
      // We should never get here, but throw an error just in case
      throw new StripTerraformEnterpriseContentError('Unexpected error')
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
      throw new StripTerraformEnterpriseContentError(
        'Invalid comparator: ' + operator
      )
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

// this is a courtesy wrapper to prepend [strip-terraform-enterprise-content]
// to error messages
class StripTerraformEnterpriseContentError extends Error {
  constructor(message: string) {
    super(`[strip-terraform-enterprise-content] ${message}`)
    this.name = 'StripTerraformEnterpriseContentError'
  }
}
