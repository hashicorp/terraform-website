import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import otherDocsData from 'data/other-docs-nav-data.json'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'

//  Configure the docs path
const BASE_ROUTE = 'cloud-docs'
const NAV_DATA = 'data/cloud-docs-nav-data.json'
const CONTENT_DIR = 'content/cloud-docs'
const PRODUCT = { name: productName, slug: 'terraform' } as const

const SOURCE_REPO = 'terraform-website'
const DEFAULT_BRANCH = 'master'

export default function CloudDocsLayout(props) {
  // add the "other docs" section to the bottom of the nav data
  const modifiedProps = Object.assign({}, props)
  modifiedProps.navData = modifiedProps.navData.concat(otherDocsData)

  return (
    <DocsPage
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
 * TODO (kevinwang): This is a temporary hack until /cloud-docs sources remote content.
 */
const getStaticPaths = async (ctx) => {
  const res = await _getStaticPaths(ctx)
  const paths = res.paths.filter((p: { params: NextParsedUrlQuery }) => {
    return !/agents/i.test(p.params.page?.[0])
  })

  // update getStaticPaths object before returning it to Next.js
  res.paths = paths
  return res
}
export { getStaticPaths, getStaticProps }
