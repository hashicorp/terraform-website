import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

//  Configure the docs path
const BASE_ROUTE = 'cloud-docs/agents'
const NAV_DATA = 'data/cloud-docs-agents-nav-data.json'
const CONTENT_DIR = 'content/cloud-docs/agents'
const PRODUCT = { name: productName, slug: 'terraform' } as const

// TODO (kevinwang): update to `terraform-docs-agents`
const SOURCE_REPO = 'terraform-website'
const DEFAULT_BRANCH = 'master'

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

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  strategy: 'fs',
  localContentDir: CONTENT_DIR,
  navDataFile: NAV_DATA,
  product: SOURCE_REPO,
  githubFileUrl(filepath) {
    return `https://github.com/hashicorp/${SOURCE_REPO}/blob/${DEFAULT_BRANCH}/${filepath}`
  },
})
export { getStaticPaths, getStaticProps }
