import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
import otherDocsData from 'data/other-docs-nav-data.json'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import type { NextParsedUrlQuery } from 'next/dist/server/request-meta'

//  Configure the docs path
const BASE_ROUTE = 'plugin'
const NAV_DATA = 'data/plugin-nav-data.json'
const CONTENT_DIR = 'content/plugin'
const PRODUCT = { name: productName, slug: 'terraform' } as const

// TODO: update to terraform-plugin-common
const SOURCE_REPO = 'terraform-website'
const DEFAULT_BRANCH = 'master'

function PluginLayout(props) {
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

const { getStaticPaths: _getStaticPaths, getStaticProps } =
  getStaticGenerationFunctions({
    strategy: 'fs',
    localContentDir: CONTENT_DIR,
    navDataFile: NAV_DATA,
    product: SOURCE_REPO,
    githubFileUrl(filepath) {
      return `https://github.com/hashicorp/${SOURCE_REPO}/blob/${DEFAULT_BRANCH}/${filepath}`
    },
  })

/**
 * This is a temporary hack to allow multiple `plugin` page components that
 * may generate duplicate static paths. When `plugin` content is split into
 * terraform-docs-common, this can be removed.
 *
 * - https://nextjs.org/docs/messages/conflicting-ssg-paths
 */
const getStaticPaths = async (ctx) => {
  const res = await _getStaticPaths(ctx)

  // remove paths for "framework", "log", "mux", and "sdkv2"
  const paths = res.paths.filter((p: { params: NextParsedUrlQuery }) => {
    return !/framework|log|mux|sdkv2/i.test(p.params.page?.[0])
  })

  // update getStaticPaths object before returning it to Next.js
  res.paths = paths
  return res
}
export { getStaticPaths, getStaticProps }

export default PluginLayout
