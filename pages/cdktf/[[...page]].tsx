import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import otherDocsData from 'data/other-docs-nav-data.json'
// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import path from 'path'
import { rehypePlugins, remarkPlugins } from 'lib/remark-rehype-plugins'
import { remarkRewriteAssets } from 'lib/remark-rewrite-assets'

//  Configure the docs path
const BASE_ROUTE = 'cdktf'
const NAV_DATA = path.join(
  process.env.NAV_DATA_DIRNAME,
  BASE_ROUTE + '-nav-data.json'
)
const CONTENT_DIR = path.join(process.env.CONTENT_DIRNAME, BASE_ROUTE)
const PRODUCT = { name: productName, slug: 'terraform' } as const

const SOURCE_REPO = 'terraform-cdk'

export default function CDKLayout(props) {
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

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
  process.env.IS_CONTENT_PREVIEW &&
    process.env.PREVIEW_FROM_REPO === 'terraform-cdk'
    ? {
        strategy: 'fs',
        localContentDir: CONTENT_DIR,
        navDataFile: NAV_DATA,
        product: SOURCE_REPO,
        githubFileUrl(filepath) {
          // This path rewriting is meant for local preview from `terraform-cdk`.
          filepath = filepath.replace('preview/', '')
          return `https://github.com/hashicorp/${SOURCE_REPO}/blob/main/website/${filepath}`
        },
        remarkPlugins: (params) => [
          ...remarkPlugins,
          remarkRewriteAssets({
            product: SOURCE_REPO,
            version: process.env.CURRENT_GIT_BRANCH,
            getAssetPathParts: (nodeUrl) =>
              Array.isArray(params.page)
                ? [
                    'website/docs/cdktf',
                    ...params.page,
                    nodeUrl.startsWith('.') ? `.${nodeUrl}` : `../${nodeUrl}`,
                  ]
                : ['website/docs/cdktf', nodeUrl],
          }),
        ],
        rehypePlugins,
      }
    : {
        fallback: 'blocking',
        revalidate: 3600, // 1 hour
        strategy: 'remote',
        basePath: BASE_ROUTE,
        product: SOURCE_REPO,
        remarkPlugins,
        rehypePlugins,
      }
)

export { getStaticPaths, getStaticProps }
