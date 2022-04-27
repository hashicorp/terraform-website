import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'

// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

//  Configure the docs path
const BASE_ROUTE = 'plugin/framework'
const NAV_DATA = 'data/plugin-framework-nav-data.json'
const CONTENT_DIR = 'content/plugin/framework'
const PRODUCT = { name: productName, slug: 'terraform' }

// TODO: update to terraform-plugin-framework
const SOURCE_REPO = 'terraform-website'

export default function PluginFrameworkLayout(props) {
  // add the "other docs" section to the bottom of the nav data
  const modifiedProps = Object.assign({}, props)
  modifiedProps.navData = modifiedProps.navData.concat([
    { heading: 'Other Plugin Docs' },
    { title: 'Plugin Development', href: '/plugin' },
    { title: 'SDKv2', href: '/plugin/sdkv2/sdkv2-intro' },
    // { title: 'Framework', href: '/plugin/framework' },
    { title: 'Logging', href: '/plugin/log' },
    { title: 'Combining and Translating', href: '/plugin/mux' },
  ])
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
