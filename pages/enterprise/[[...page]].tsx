import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import otherDocsData from 'data/other-docs-nav-data.json'

// Imports below are only used server-side
import { getStaticGenerationFunctions } from '@hashicorp/react-docs-page/server'

//  Configure the docs path
const BASE_ROUTE = 'enterprise'
const NAV_DATA = 'data/enterprise-nav-data.json'
const CONTENT_DIR = 'content/enterprise'
const PRODUCT = { name: productName, slug: 'terraform' } as const

const SOURCE_REPO = 'terraform-website'
const DEFAULT_BRANCH = 'master'

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
    />
  )
}

const { getStaticPaths, getStaticProps: _getStaticProps } =
  getStaticGenerationFunctions({
    strategy: 'fs',
    localContentDir: CONTENT_DIR,
    navDataFile: NAV_DATA,
    product: SOURCE_REPO,
    githubFileUrl(filepath) {
      return `https://github.com/hashicorp/${SOURCE_REPO}/blob/${DEFAULT_BRANCH}/${filepath}`
    },
  })

export { getStaticPaths }

/**
 * This is temporary helper to enable `/enterprise` to use "cloud-docs" nav data
 * which now lives in https://github.com/hashicorp/terraform-docs-common, and is
 * available via the "Content API".
 */
async function fetchCloudDocsNavData() {
  const url = new URL(
    `/api/content/terraform-docs-common/nav-data/v0.0.x/cloud-docs`,
    process.env.MKTG_CONTENT_API
  )
  const response = await fetch(url)
  const data = await response.json()

  return data.result.navData
}

// This is a temporary workaround to fetch cloud-docs nav-data from the Content API
// serverside, and allow the enterprise page to use it.
export const getStaticProps = async (context) => {
  const cloudDocsNavData = await fetchCloudDocsNavData()
  const res = await _getStaticProps(context)

  // @ts-ignore
  res.props.cloudDocsNavData = cloudDocsNavData
  // @ts-ignore — make sure revalidate is serializable
  res.props.revalidate = null
  // @ts-ignore
  return { props: res.props }
}

// This function is used specifically to modify the data from the cloud docs
// navigation so that it works on the enterprise page.
function transformCloudDocsData(_data) {
  let data = JSON.parse(JSON.stringify(_data))
  // remove the top headline, it is worded differently on this page
  data.splice(0, 1)
  // remove the final two items which link to the enterprise docs, not needed since
  // we are already on that page
  data.splice(data.length - 2, 2)
  // change over every "path" prop to be an "href" instead
  // path props are used to link directly to a category's own nav items, where
  // href can be used to arbitrarily link outside a category, which is what we're doing
  // here, since we're listing out cloud docs from the enterprise page
  data = pathToHref(data)
  return data
}

// we have to recurse here in order to get all the nested nodes
function pathToHref(data) {
  data.map((item) => {
    if (item.path) {
      item.href = `/cloud-docs/${item.path}`
      delete item.path
    }

    if (item.routes) item.routes = pathToHref(item.routes)

    return item
  })
  return data
}
