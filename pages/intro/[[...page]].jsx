import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import otherDocsData from 'data/other-docs-nav-data.json'
// Imports below are only used server-side
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'
import Image from 'next/image'
import visit from 'unist-util-visit'
import imageSizeOf from 'image-size'
import { promisify } from 'util'

const sizeOf = promisify(imageSizeOf)

//  Configure the docs path
const BASE_ROUTE = 'intro'
const NAV_DATA = 'data/intro-nav-data.json'
const CONTENT_DIR = 'content/intro'
const PRODUCT = { name: productName, slug: productSlug }

export default function IntroLayout(props) {
  // add the "other docs" section to the bottom of the nav data
  const modifiedProps = Object.assign({}, props)
  modifiedProps.navData = modifiedProps.navData.concat(otherDocsData)

  return (
    <DocsPage
      baseRoute={BASE_ROUTE}
      product={PRODUCT}
      staticProps={modifiedProps}
      additionalComponents={{ Image }}
    />
  )
}

export async function getStaticPaths() {
  const paths = await generateStaticPaths({
    navDataFile: NAV_DATA,
    localContentDir: CONTENT_DIR,
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
    remarkPlugins: [
      () => {
        return async function transform(tree) {
          const promises = []

          visit(tree, 'image', (node, index, parent) => {
            // Only use next/image for local images
            if (!node.url.startsWith('http')) {
              const promise = (async () => {
                try {
                  // Assume that images are stored in public/
                  const relativePath = `./public${node.url}`
                  // Get image dimensions
                  const { width, height } = await sizeOf(relativePath)
                  const props = [
                    ['src', `"${node.url}"`],
                    ['alt', `"${node.alt}"`],
                    ['width', `{${width}}`],
                    ['height', `{${height}}`],
                  ]
                    .map((p) => p.join('='))
                    .join(' ')
                  // Build the replacement JSX node
                  const replacementNode = {
                    type: 'jsx',
                    value: `<Image ${props} />`,
                  }

                  // Replace original img element with the JSX node
                  parent.children.splice(index, 1, replacementNode)
                } catch (err) {
                  // If we encounter any error, log it, but leave the img
                  // tag in its original state.
                  console.warn(err)
                }
              })()

              // Collect all promises.
              promises.push(promise)
            }
          })

          // Await all promises.
          await Promise.all(promises)
        }
      },
    ],
  })
  return { props }
}
