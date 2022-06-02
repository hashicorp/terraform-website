import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import path from 'path'
import { remarkRewriteAssets } from 'lib/remark-rewrite-assets'

//  Configure the docs path
const BASE_ROUTE = 'internals'
const NAV_DATA = path.join(
  process.env.NAV_DATA_DIRNAME,
  BASE_ROUTE + '-nav-data.json'
)
const CONTENT_DIR = path.join(process.env.CONTENT_DIRNAME, BASE_ROUTE)
const PRODUCT = { name: productName, slug: productSlug } as const

export default function InternalsLayout(props) {
  return (
    <DocsPage baseRoute={BASE_ROUTE} product={PRODUCT} staticProps={props} />
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
  process.env.IS_CONTENT_PREVIEW &&
    process.env.PREVIEW_FROM_REPO === 'terraform'
    ? {
        strategy: 'fs',
        localContentDir: CONTENT_DIR,
        navDataFile: NAV_DATA,
        product: PRODUCT.slug,
        githubFileUrl(filepath) {
          // This path rewriting is meant for local preview from `terraform`.
          filepath = filepath.replace('preview/', '')
          return `https://github.com/hashicorp/${PRODUCT.slug}/blob/main/website/${filepath}`
        },
        remarkPlugins: (params) => [
          remarkRewriteAssets({
            product: PRODUCT.slug,
            version: process.env.CURRENT_GIT_BRANCH,
            getAssetPathParts: (nodeUrl) => ['website', nodeUrl],
          }),
        ],
      }
    : {
        fallback: 'blocking',
        revalidate: 360, // 1 hour
        strategy: 'remote',
        basePath: BASE_ROUTE,
        product: PRODUCT.slug,
      }
)

export { getStaticPaths, getStaticProps }
