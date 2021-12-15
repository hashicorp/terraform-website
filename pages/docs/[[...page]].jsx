import { productName, productSlug } from 'data/metadata'
import { docsRedirects } from 'data/docs-redirects'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
// Imports below are only used server-side
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'
import { glob } from 'glob'

//  Configure the docs path
const BASE_ROUTE = 'docs'
const NAV_DATA = 'data/docs-nav-data.json'
const CONTENT_DIR = 'content/docs'
const PRODUCT = { name: productName, slug: productSlug }

function DocsLayout(props) {
  return (
    <DocsPage
      additionalComponents={{ ProviderTable }}
      baseRoute={BASE_ROUTE}
      product={PRODUCT}
      staticProps={props}
    />
  )
}

export async function getStaticPaths() {
  console.log({ cwd: process.cwd() })
  const files = glob.sync('**/*')
  console.log(JSON.stringify(files, null, 2))
  const paths = await generateStaticPaths({
    navDataFile: NAV_DATA,
    localContentDir: CONTENT_DIR,
  })
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  if (params.page) {
    const path = ['/docs', ...params.page].join('/')
    if (path in docsRedirects) {
      return {
        redirect: {
          destination: docsRedirects[path],
          permanent: true,
        },
      }
    }
  }
  const props = await generateStaticProps({
    navDataFile: NAV_DATA,
    localContentDir: CONTENT_DIR,
    params,
    product: PRODUCT,
  })
  return { props }
}

export default DocsLayout
