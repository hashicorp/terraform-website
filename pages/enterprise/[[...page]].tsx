import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import otherDocsData from 'data/other-docs-nav-data.json'

// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'
import path from 'path'
import { rehypePlugins, remarkPlugins } from 'lib/remark-rehype-plugins'
import { remarkRewriteAssets } from 'lib/remark-rewrite-assets'
import { remarkTfeContentExclusion } from 'lib/remark-tfe-content-exclusion'

//  Configure the docs path
const BASE_ROUTE = 'enterprise'
const NAV_DATA = path.join(
  process.env.NAV_DATA_DIRNAME,
  BASE_ROUTE + '-nav-data.json'
)
const CONTENT_DIR = path.join(process.env.CONTENT_DIRNAME, BASE_ROUTE)
const PRODUCT = { name: productName, slug: 'terraform' } as const

const SOURCE_REPO = 'ptfe-releases'
// const DEFAULT_BRANCH = 'main'

export default function EnterpriseLayout(props) {
  // add the "other docs" section to the bottom of the nav data
  const modifiedProps = Object.assign({}, props)
  // This specific page is a special case as it refelcts an exact copy of the cloud docs.
  // To do this, we pull the cloud docs data directly and massage it a little so that it
  // works out of context on this page.
  modifiedProps.navData = modifiedProps.navData
    .concat(transformCloudDocsData(props.cloudDocsNavData))
    .concat(otherDocsData)

  return (
    <DocsPage
      baseRoute={BASE_ROUTE}
      product={PRODUCT}
      staticProps={modifiedProps}
      showEditPage={false}
      projectName="Terraform Enterprise"
      showVersionSelect
    />
  )
}


const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions(
  process.env.IS_CONTENT_PREVIEW &&
  process.env.PREVIEW_FROM_REPO === SOURCE_REPO
    ? {
        strategy: 'fs',
        localContentDir: CONTENT_DIR,
        navDataFile: NAV_DATA,
        product: SOURCE_REPO,
        scope: {
          product: SOURCE_REPO,
        },
        githubFileUrl(filepath) {
          // enterprise pages will not be editable by contributors.
          //
          // todo: maybe link to a GitHub issue?
          return null
        },
        remarkPlugins: (params, version) => [
          ...remarkPlugins,
          remarkRewriteAssets({
            product: SOURCE_REPO,
            version: process.env.CURRENT_GIT_BRANCH,
            getAssetPathParts: (nodeUrl) => ['website', nodeUrl],
          }),
          [remarkTfeContentExclusion, { version }],
        ],
        rehypePlugins,
      }
    : {
        fallback: 'blocking',
        revalidate: 60, // 1 hour
        strategy: 'remote',
        basePath: BASE_ROUTE,
        product: SOURCE_REPO,
        remarkPlugins,
        rehypePlugins,
      }
)

  // @ts-ignore
  res.props.cloudDocsNavData = cloudDocsNavData
  // @ts-ignore
  return { props: res.props }
}
