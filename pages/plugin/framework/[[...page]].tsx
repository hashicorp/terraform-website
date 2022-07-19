import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
import otherPluginsData from 'data/other-plugins-nav-data.json'

// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import path from 'path'
import { rehypePlugins, remarkPlugins } from 'lib/remark-rehype-plugins'

//  Configure the docs path
const BASE_ROUTE = 'plugin/framework'
const NAV_DATA_PREFIX = 'plugin-framework'
const NAV_DATA = path.join(
  process.env.NAV_DATA_DIRNAME,
  NAV_DATA_PREFIX + '-nav-data.json'
)

const CONTENT_DIR = path.join(process.env.CONTENT_DIRNAME, BASE_ROUTE)
const PRODUCT = { name: productName, slug: 'terraform' } as const

const SOURCE_REPO = 'terraform-plugin-framework'
const PROJECT_NAME = 'Plugin Framework'
const DEFAULT_BRANCH = 'main'

export default function PluginFrameworkLayout(props) {
  // display "Other Plugin Docs" section
  const modifiedProps = Object.assign({}, props)
  // filter out the link for this page
  modifiedProps.navData = modifiedProps.navData.concat(
    otherPluginsData.filter(({ href }) => !href?.includes(BASE_ROUTE))
  )
  return (
    <>
      <DocsPage
        additionalComponents={{ ProviderTable }}
        baseRoute={BASE_ROUTE}
        product={PRODUCT}
        projectName={PROJECT_NAME}
        staticProps={modifiedProps}
      />
    </>
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
  process.env.IS_CONTENT_PREVIEW &&
    process.env.PREVIEW_FROM_REPO === 'terraform-plugin-framework'
    ? {
        strategy: 'fs',
        localContentDir: CONTENT_DIR,
        navDataFile: NAV_DATA,
        product: SOURCE_REPO,
        githubFileUrl(path) {
          return `https://github.com/hashicorp/${SOURCE_REPO}/blob/${DEFAULT_BRANCH}/${path}`
        },
        remarkPlugins,
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
      }
)

export { getStaticPaths, getStaticProps }
