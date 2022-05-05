import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
import otherDocsData from 'data/other-docs-nav-data.json'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

//  Configure the path
const BASE_ROUTE = 'registry'
const NAV_DATA = 'data/registry-nav-data.json'
const CONTENT_DIR = 'content/registry'
const PRODUCT = { name: productName, slug: 'terraform' } as const

const SOURCE_REPO = 'terraform-website'
const DEFAULT_BRANCH = 'master'

function RegistryLayout(props) {
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

export default RegistryLayout
