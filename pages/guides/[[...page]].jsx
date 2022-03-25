import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
// Imports below are only used server-side
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'
import visit from 'unist-util-visit'

//  Configure the docs path
const BASE_ROUTE = 'guides'
const NAV_DATA = 'data/guides-nav-data.json'
const CONTENT_DIR = 'content/guides'
const PRODUCT = { name: productName, slug: productSlug }

export default function GuidesLayout(props) {
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
  const paths = await generateStaticPaths({
    navDataFile: NAV_DATA,
    localContentDir: CONTENT_DIR,
    product: PRODUCT
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
      return `https://github.com/hashicorp/${PRODUCT.slug}/blob/main/website/${filepath}`
    },
  })
  return { props }
}
