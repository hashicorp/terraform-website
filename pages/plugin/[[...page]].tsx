import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
import otherDocsData from 'data/other-docs-nav-data.json'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import type { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import path from 'path'

import { remarkRewriteAssets } from 'lib/remark-rewrite-assets'

//  Configure the docs path
const BASE_ROUTE = 'plugin'
// const NAV_DATA = 'data/plugin-nav-data.json'
const NAV_DATA = path.join(
  process.env.NAV_DATA_DIRNAME,
  BASE_ROUTE + '-nav-data.json'
)

// const CONTENT_DIR = 'content/plugin'
const CONTENT_DIR = path.join(process.env.CONTENT_DIRNAME, BASE_ROUTE)
const PRODUCT = { name: productName, slug: 'terraform' } as const

const SOURCE_REPO = 'terraform-docs-common'
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

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
  process.env.IS_CONTENT_PREVIEW &&
    process.env.PREVIEW_FROM_REPO === 'terraform-docs-common'
    ? {
        strategy: 'fs',
        localContentDir: CONTENT_DIR,
        navDataFile: NAV_DATA,
        product: SOURCE_REPO,
        githubFileUrl(filepath) {
          return `https://github.com/hashicorp/${SOURCE_REPO}/blob/${DEFAULT_BRANCH}/${filepath}`
        },
        remarkPlugins: (params) => [
          remarkRewriteAssets({
            product: SOURCE_REPO,
            version: process.env.CURRENT_GIT_BRANCH,
            getAssetPathParts: (nodeUrl) => ['website', nodeUrl],
          }),
        ],
      }
    : {
        strategy: 'remote',
        basePath: BASE_ROUTE,
        product: SOURCE_REPO,
      }
)

export { getStaticPaths, getStaticProps }

export default PluginLayout
