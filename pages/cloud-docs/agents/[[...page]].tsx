import { productName, productSlug } from 'data/metadata'
import DocsPage from 'components/docs-page'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import path from 'path'
import { rehypePlugins, remarkPlugins } from 'lib/remark-rehype-plugins'
import { remarkRewriteAssets } from 'lib/remark-rewrite-assets'

//  Configure the docs path
const BASE_ROUTE = 'cloud-docs/agents'
const NAV_DATA_PREFIX = 'cloud-docs-agents'
const NAV_DATA = path.join(
  process.env.NAV_DATA_DIRNAME,
  NAV_DATA_PREFIX + '-nav-data.json'
)
// const CONTENT_DIR = 'content/cloud-docs/agents'
const CONTENT_DIR = path.join(process.env.CONTENT_DIRNAME, BASE_ROUTE)
const PRODUCT = { name: productName, slug: 'terraform' } as const

const SOURCE_REPO = 'terraform-docs-agents'
const DEFAULT_BRANCH = 'main'
const PROJECT_NAME = 'Terraform Cloud Agents'

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
      projectName={PROJECT_NAME}
      showVersionSelect
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
          return `https://github.com/hashicorp/${SOURCE_REPO}/blob/${DEFAULT_BRANCH}/website/${filepath}`
        },
        remarkPlugins: (params) => [
          ...remarkPlugins,
          remarkRewriteAssets({
            product: SOURCE_REPO,
            version: process.env.CURRENT_GIT_BRANCH,
            getAssetPathParts: (nodeUrl) => ['website', nodeUrl],
          }),
        ],
        rehypePlugins,
      }
    : {
        fallback: 'blocking',
        revalidate: 3600, // 1 hour
        strategy: 'remote',
        basePath: BASE_ROUTE,
        navDataPrefix: NAV_DATA_PREFIX,
        product: SOURCE_REPO,
        remarkPlugins,
        rehypePlugins,
        enabledVersionedDocs: true,
      }
)
export { getStaticPaths, getStaticProps }
