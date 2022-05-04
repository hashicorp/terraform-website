import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import path from 'path'

import { remarkRewriteAssets } from 'lib/remark-rewrite-assets'

//  Configure the docs path
const BASE_ROUTE = 'cloud-docs/agents'
// const NAV_DATA = 'data/cloud-docs-agents-nav-data.json'
const NAV_DATA = path.join(
  process.env.NAV_DATA_DIRNAME,
  'cloud-docs-agents' + '-nav-data.json'
)
// const CONTENT_DIR = 'content/cloud-docs/agents'
const CONTENT_DIR = path.join(process.env.CONTENT_DIRNAME, BASE_ROUTE)
const PRODUCT = { name: productName, slug: 'terraform' } as const

// TODO (kevinwang): update to `terraform-docs-agents`
const SOURCE_REPO = 'terraform-docs-agents'
const DEFAULT_BRANCH = 'main'

export default function CloudDocsAgentsLayout(props) {
  // append additional nav data
  const modifiedProps = Object.assign({}, props)
  modifiedProps.navData = modifiedProps.navData.concat([
    { divider: true },
    { title: 'Back to Cloud and Enterprise', href: '/cloud-docs' },
  ])

  return (
    <DocsPage
      baseRoute={BASE_ROUTE}
      product={PRODUCT}
      staticProps={modifiedProps}
    />
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
  process.env.IS_CONTENT_PREVIEW &&
    process.env.PREVIEW_FROM_REPO === SOURCE_REPO
    ? {
        strategy: 'fs',
        localContentDir: CONTENT_DIR,
        navDataFile: NAV_DATA,
        product: SOURCE_REPO,
        githubFileUrl(filepath) {
          // This path rewriting is meant for local preview from `terraform`.
          filepath = filepath.replace('preview/', '')
          return `https://github.com/hashicorp/${PRODUCT.slug}/blob/${DEFAULT_BRANCH}/website/${filepath}`
        },
        remarkPlugins: (params) => [
          remarkRewriteAssets({
            product: PRODUCT.slug,
            version: process.env.CURRENT_GIT_BRANCH,
            getAssetPathParts: (nodeUrl) => [nodeUrl],
          }),
        ],
      }
    : {
        strategy: 'remote',
        basePath: BASE_ROUTE,
        product: PRODUCT.slug,
      }
)
export { getStaticPaths, getStaticProps }
