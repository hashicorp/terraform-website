import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import otherDocsData from 'data/other-docs-nav-data.json'
import cloudDocsData from 'data/cloud-docs-nav-data.json'
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
    .concat(transformCloudDocsData(cloudDocsData))
    .concat(otherDocsData)

  return (
    <DocsPage
      baseRoute={BASE_ROUTE}
      product={PRODUCT}
      staticProps={modifiedProps}
    />
  )
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  strategy: 'fs',
  localContentDir: CONTENT_DIR,
  navDataFile: NAV_DATA,
  product: SOURCE_REPO,
  githubFileUrl(filepath) {
    return `https://github.com/hashicorp/${SOURCE_REPO}/blob/${DEFAULT_BRANCH}/${filepath}`
  },
})
export { getStaticPaths, getStaticProps }

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
