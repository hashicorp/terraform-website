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
  assetPathBuilder?: (nodeUrl: string) => string[]
}): Plugin {
  const { product, version, assetPathBuilder = (nodeUrl) => [nodeUrl] } = args

  return function plugin() {
    return function transform(tree) {
      visit<Image>(tree, 'image', (node) => {
        const originalUrl = node.url
        const asset = path.posix.join(...assetPathBuilder(originalUrl))

        const url = new URL('https://mktg-content-api.vercel.app/api/assets')
        url.searchParams.append('asset', asset)
        url.searchParams.append('version', version)
        url.searchParams.append('product', product)

        node.url = url.toString()
        console.log(`Rewriting asset url for local preview:
- Found: ${originalUrl}
- Replaced with: ${node.url}

If this is a net-new asset, you'll need to commit and push it to GitHub.\n`)
      })
    }
  }
}
