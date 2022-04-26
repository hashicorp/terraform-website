import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'

// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

//  Configure the docs path
const BASE_ROUTE = 'plugin/framework'
const NAV_DATA = 'data/plugin-framework-nav-data.json'
const CONTENT_DIR = 'content/plugin/framework'
const PRODUCT = { name: productName, slug: 'terraform-website' }

export default function PluginFrameworkLayout(props) {
  // add the "other docs" section to the bottom of the nav data
  const modifiedProps = Object.assign({}, props)
  modifiedProps.navData = modifiedProps.navData.concat([
    { heading: 'Other Plugin Docs' },
    { title: 'Plugin Development', href: '/plugin' },
    { title: 'SDKv2', href: '/plugin/sdkv2/sdkv2-intro' },
    { title: 'Logging', href: '/plugin/log/managing' },
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
