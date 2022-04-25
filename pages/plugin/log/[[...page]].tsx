import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
import otherDocsData from 'data/other-docs-nav-data.json'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

//  Configure the docs path
const BASE_ROUTE = 'plugin/log'
const NAV_DATA = 'data/plugin-log-nav-data.json'
const CONTENT_DIR = 'content/plugin/log'
const PRODUCT = { name: productName, slug: 'terraform-website' }

export default function PluginLogLayout(props) {
  // add the "other docs" section to the bottom of the nav data
  const modifiedProps = Object.assign({}, props)
  modifiedProps.navData = modifiedProps.navData.concat([
    { heading: 'Other Plugin Docs' },
    { title: 'Plugin Development', href: '/plugin' },
    { title: 'SDKv2', href: '/plugin/sdkv2/sdkv2-intro' },
    { title: 'Framework', href: '/plugin/framework' },
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
