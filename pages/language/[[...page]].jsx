import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
import otherDocsData from 'data/other-docs-nav-data.json'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import visit from 'unist-util-visit'
import path from 'path'

//  Configure the path
const BASE_ROUTE = 'language'
const NAV_DATA = path.join(
  process.env.NAV_DATA_DIRNAME,
  BASE_ROUTE + '-nav-data.json'
)
const CONTENT_DIR = path.join(process.env.CONTENT_DIRNAME, BASE_ROUTE)
const PRODUCT = { name: productName, slug: productSlug }

export default function LanguageLayout(props) {
  // add the "other docs" section to the bottom of the nav data
  const modifiedProps = Object.assign({}, props)
  modifiedProps.navData = modifiedProps.navData.concat(otherDocsData)

  return (
    <DocsPage
      additionalComponents={{ ProviderTable }}
      baseRoute={BASE_ROUTE}
      product={PRODUCT}
      staticProps={modifiedProps}
    />
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
  process.env.IS_CONTENT_PREVIEW &&
    process.env.PREVIEW_FROM_REPO === 'terraform'
    ? {
        strategy: 'fs',
        basePath: BASE_ROUTE,
        localContentDir: CONTENT_DIR,
        navDataFile: NAV_DATA,
        product: PRODUCT.slug,
        githubFileUrl(filepath) {
          // This path rewriting is meant for local preview from `terraform`.
          filepath = filepath.replace('preview/', '')
          return `https://github.com/hashicorp/${PRODUCT.slug}/blob/main/website/${filepath}`
        },
        remarkPlugins: (params) => [
          () => {
            const product = PRODUCT.slug
            const version = process.env.CURRENT_GIT_BRANCH
            return function transform(tree) {
              visit(tree, 'image', (node) => {
                const originalUrl = node.url
                const asset = path.posix.join('website', originalUrl)
                const url = new URL(
                  'https://mktg-content-api.vercel.app/api/assets'
                )
                url.searchParams.append('asset', asset)
                url.searchParams.append('version', version)
                url.searchParams.append('product', product)

                node.url = url.toString()
                console.log(`Rewriting asset url for local preview:
- Found: ${originalUrl}
- Replaced with: ${node.url}

If this is a net-new asset, you'll need to commit and push it to GitHub.`)
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
