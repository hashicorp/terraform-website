import setGeoCookie from '@hashicorp/platform-edge-utils/lib/set-geo-cookie'
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { docsRedirects } from 'data/docs-redirects'
import { deleteCookie } from 'lib/middleware-delete-cookie'
import { getEdgeFlags } from 'flags/edge'

// To prevent an infinite redirect loop, we only look for a defined redirect
// for pages that aren't explicitly defined here.
const DEFINED_DOCS_PAGES = [
  '/docs',
  '/docs/glossary',
  '/docs/partnerships',
  '/docs/terraform-tools',
]

const BASE_PATHS = [
  'cdktf',
  'cli',
  'cloud-docs',
  'docs',
  'enterprise',
  'internals',
  'intro',
  'language',
  'plugin',
  'registry',
]

const devDotRedirectCheck = new RegExp(`^/(${BASE_PATHS.join('|')})/?`)

function setHappyKitCookie(
  cookie: Parameters<NextResponse['cookies']['set']>,
  response: NextResponse
): NextResponse {
  response.cookies.set(...cookie)
  return response
}

export default async function middleware(request: NextRequest) {
  let response: NextResponse

  /**
   * If the betaOptOut query param exists, clear it, delete the opt-in cookie, and redirect back to the current URL without the betaOptOut query param
   */
  if (request.nextUrl.searchParams.get('betaOptOut') === 'true') {
    const url = request.nextUrl.clone()
    url.searchParams.delete('betaOptOut')

    const response = NextResponse.redirect(url)

    deleteCookie(request, response, `terraform-io-beta-opt-in`)

    return response
  }

  /**
   * Apply redirects to nested docs pages from a static list in data/docs-redirects.
   */
  if (
    request.nextUrl.pathname &&
    !DEFINED_DOCS_PAGES.includes(request.nextUrl.pathname)
  ) {
    const path = request.nextUrl.pathname
    const pathIndexHtml = [path, 'index.html'].join('/')
    const pathHtml = `${path}.html`

    for (const key of [path, pathIndexHtml, pathHtml]) {
      if (key in docsRedirects) {
        const destination = docsRedirects[key]

        if (
          destination.startsWith('https://') ||
          destination.startsWith('http://')
        ) {
          // If the URL is NOT relative, don't construct a new URL from the current one. This prevents
          // learn redirects from going to https://terraform.io/https://learn.hashicorp.com/..., for example.
          return NextResponse.redirect(destination, 308)
        }

        // cloning the URL so we can provide an absolute URL to the .redirect() call,
        // per: https://nextjs.org/docs/messages/middleware-relative-urls
        const newUrl = request.nextUrl.clone()
        newUrl.pathname = destination
        return NextResponse.redirect(newUrl, 308)
      }
    }
  }

  /**
   * We are running A/B tests on a subset of routes, so we are limiting the call to resolve flags from HappyKit to only those routes. This limits the impact of any additional latency to the routes which need the data.
   */
  if (['/'].includes(request.nextUrl.pathname)) {
    try {
      const edgeFlags = await getEdgeFlags({ request })
      const { flags, cookie } = edgeFlags

      if (flags?.ioHomeHeroCtas) {
        const url = request.nextUrl.clone()
        url.pathname = '/home/without-cta-links'
        response = setHappyKitCookie(cookie.args, NextResponse.rewrite(url))
      }
    } catch {
      // Fallback to default URLs
    }
  }

  const hasOptInCookie = Boolean(
    request.cookies.get(`terraform-io-beta-opt-in`)
  )
  const url = request.nextUrl.clone()

  /**
   * Redirect opted-in users to Developer based on the existence of the terraform-io-beta-opt-in cookie.
   */
  if (hasOptInCookie && devDotRedirectCheck.test(url.pathname)) {
    const redirectUrl = new URL('https://developer.hashicorp.com')
    redirectUrl.pathname = `terraform${url.pathname}`
    redirectUrl.search = url.search

    const response = NextResponse.redirect(redirectUrl)

    return response
  }

  // Sets a cookie named hc_geo on the response
  return setGeoCookie(request, response)
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for those starting with:
     * - /api/ (API routes)
     * - /_next/ (Static assets and images)
     * - /favicon.svg (favicon)
     * - /img/ (images in the public dir)
     */
    '/((?!api\\/|_next\\/|favicon\\.ico|img\\/).*)',
  ],
}
