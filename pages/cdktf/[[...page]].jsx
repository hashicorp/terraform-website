import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import otherDocsData from 'data/other-docs-nav-data.json'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import visit from 'unist-util-visit'
import path from 'path'

//  Configure the docs path
const BASE_ROUTE = 'cdktf'
const NAV_DATA = path.join(process.env.NAV_DATA_DIRNAME, BASE_ROUTE + '-nav-data.json')
const CONTENT_DIR = path.join(process.env.CONTENT_DIRNAME, BASE_ROUTE)
const PRODUCT = { name: productName, slug: 'terraform-cdk' }

export default function CDKLayout(props) {
  // add the "other docs" section to the bottom of the nav data
  const modifiedProps = Object.assign({}, props)
  modifiedProps.navData = modifiedProps.navData.concat(otherDocsData)

  return (
    <DocsPage
      baseRoute={BASE_ROUTE}
      product={PRODUCT}
      staticProps={modifiedProps}
    />
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
  process.env.IS_CONTENT_PREVIEW && process.env.PREVIEW_FROM_REPO === 'terraform-cdk'
    ? {
        strategy: 'fs',
        basePath: BASE_ROUTE,
        localContentDir: CONTENT_DIR,
        navDataFile: NAV_DATA,
        product: PRODUCT.slug,
        githubFileUrl(filepath) {
          // This path rewriting is meant for local preview from `terraform-cdk`.
          filepath = filepath.replace('preview/', '')
          return `https://github.com/hashicorp/${PRODUCT.slug}/blob/main/website/${filepath}`
        },
        remarkPlugins: (params) => [
          () => {
            const product = PRODUCT.slug
            const version = 'main'
            return function transform(tree) {
              visit(tree, 'image', (node) => {
                const originalUrl = node.url
                const assetPath = params.page
                  ? path.posix.join(
                      ...params.page,
                      node.url.startsWith('.')
                        ? `.${node.url}`
                        : `../${node.url}`
                    )
                  : node.url
                const asset = path.posix.join('website/docs/cdktf', assetPath)
                node.url = `https://mktg-content-api.vercel.app/api/assets?product=${product}&version=${version}&asset=${asset}`
                console.log(`Rewriting asset url for local preview:
- Found: ${originalUrl}
- Replaced with: ${node.url}

If this is a net-new asset, it may not be available in the preview yet.`)
              })
            }
          },
        ],
      }
    : {
        strategy: 'remote',
        basePath: BASE_ROUTE,
        product: PRODUCT.slug,
      }
)

export { getStaticPaths, getStaticProps }
