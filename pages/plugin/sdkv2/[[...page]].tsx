import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

//  Configure the docs path
const BASE_ROUTE = 'plugin/sdkv2'
const NAV_DATA = 'data/plugin-sdk-nav-data.json'
const CONTENT_DIR = 'content/plugin/sdkv2'
const PRODUCT = { name: productName, slug: 'terraform-website' }

export default function PluginSdkv2Layout(props) {
  // add the "other docs" section to the bottom of the nav data
  const modifiedProps = Object.assign({}, props)
  modifiedProps.navData = modifiedProps.navData.concat([
    { heading: 'Other Plugin Docs' },
    { title: 'Plugin Development', href: '/plugin' },
    { title: 'Framework', href: '/plugin/framework' },
    { title: 'Logging', href: '/plugin/log' },
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
  product: PRODUCT.slug,
  githubFileUrl(path) {
    return `https://github.com/hashicorp/${PRODUCT.slug}/blob/master/${path}`
  },
})

export { getStaticPaths, getStaticProps }
