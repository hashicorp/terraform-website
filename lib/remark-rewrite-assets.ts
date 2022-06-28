import * as path from 'path'
import visit from 'unist-util-visit'

import type { Plugin } from 'unified'
import type { Image } from 'mdast'

/**
 * This is a generator function that returns a remark plugin
 * to rewrite asset urls in markdown files.
 */
export function remarkRewriteAssets(args: {
  product: string
  version: string
  getAssetPathParts?: (nodeUrl: string) => string[]
}): Plugin {
  const { product, version, getAssetPathParts = (nodeUrl) => [nodeUrl] } = args

  return function plugin() {
    return function transform(tree) {
      visit<Image>(tree, 'image', (node) => {
        const originalUrl = node.url
        const asset = path.posix.join(...getAssetPathParts(originalUrl))

        const url = new URL(`${process.env.MKTG_CONTENT_API}/api/assets`)
        url.searchParams.append('asset', asset)
        url.searchParams.append('version', version)
        url.searchParams.append('product', product)

        node.url = url.toString()
        logOnce(
          node.url,
          `Rewriting asset url for local preview:
- Found: ${originalUrl}
- Replaced with: ${node.url}

If this is a net-new asset, you'll need to commit and push it to GitHub.\n`
        )
      })
    }
  }
}

// A simple cache & util to prevent logging the same message multiple times
const cache = new Map<string, boolean>()
const logOnce = (id: string, message: string) => {
  if (process.env.CI) return
  if (cache.get(id)) return
  cache.set(id, true)
  console.log(message)
}
