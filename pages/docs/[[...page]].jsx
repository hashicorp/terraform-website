import { productName, productSlug } from 'data/metadata'
import { docsRedirects } from 'data/docs-redirects'
import DocsPage from '@hashicorp/react-docs-page'
import ProviderTable from 'components/provider-table'
// Imports below are only used server-side
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'

//  Configure the docs path
const BASE_ROUTE = 'docs'
const NAV_DATA = 'data/docs-nav-data.json'
const CONTENT_DIR = 'content/docs'
const PRODUCT = { name: productName, slug: 'terraform-website' }

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
  const paths = await generateStaticPaths({
    navDataFile: NAV_DATA,
    localContentDir: CONTENT_DIR,
  })
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const DEFINED_DOCS_PAGES = ['glossary', 'partnerships', 'terraform-tools']

  if (params.page && !DEFINED_DOCS_PAGES.includes(params.page[0])) {
    const path = ['/docs', ...params.page].join('/')
    const pathIndexHtml = [path, 'index.html'].join('/')
    const pathHtml = `${path}.html`

    for (const key of [path, pathIndexHtml, pathHtml]) {
      if (key in docsRedirects) {
        return {
          redirect: {
            destination: docsRedirects[key],
            permanent: true,
          },
        }
      }
    }

    // We've hit a /docs page that's not in our redirects, and isn't one of the
    // defined /docs routes, so return a 404 instead of trying to call the
    // generateStaticProps method which returns a 500 error.
    return {
      notFound: true,
    }
  }

  const props = await generateStaticProps({
    navDataFile: NAV_DATA,
    localContentDir: CONTENT_DIR,
    params,
    product: PRODUCT,
    githubFileUrl(path) {
      return `https://github.com/hashicorp/${PRODUCT.slug}/blob/master/${path}`
    },
  })
  return { props }
}

export default DocsLayout
