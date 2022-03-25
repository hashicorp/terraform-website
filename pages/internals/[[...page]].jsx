import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
// Imports below are only used server-side
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'

//  Configure the docs path
const BASE_ROUTE = 'internals'
const NAV_DATA = 'data/internals-nav-data.json'
const CONTENT_DIR = 'content/internals'
const PRODUCT = { name: productName, slug: productSlug }

export default function InternalsLayout(props) {
  return (
    <DocsPage baseRoute={BASE_ROUTE} product={PRODUCT} staticProps={props} />
  )
}

export async function getStaticPaths() {
  const paths = await generateStaticPaths({
    navDataFile: NAV_DATA,
    localContentDir: CONTENT_DIR,
    product: PRODUCT,
  })
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const props = await generateStaticProps({
    navDataFile: NAV_DATA,
    localContentDir: CONTENT_DIR,
    params,
    product: PRODUCT,
    githubFileUrl(path) {
      const filepath = path.replace('content/', '')
      return `https://github.com/hashicorp/${PRODUCT.slug}/blob/main/website/docs/${filepath}`
    },
  })
  return { props }
}
