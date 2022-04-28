import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
import otherPluginsData from 'data/other-plugins-nav-data.json'

// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

//  Configure the docs path
const BASE_ROUTE = 'plugin/sdkv2'
const NAV_DATA = 'data/plugin-sdk-nav-data.json'
const CONTENT_DIR = 'content/plugin/sdkv2'
const PRODUCT = { name: productName, slug: 'terraform' } as const

// TODO: update to terraform-plugin-sdk
const SOURCE_REPO = 'terraform-website'

export default function PluginSdkv2Layout(props) {
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
        staticProps={modifiedProps}
      />
    </>
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  strategy: 'fs',
  localContentDir: CONTENT_DIR,
  navDataFile: NAV_DATA,
  product: SOURCE_REPO,
  githubFileUrl(path) {
    return `https://github.com/hashicorp/${SOURCE_REPO}/blob/master/${path}`
  },
})

export { getStaticPaths, getStaticProps }
