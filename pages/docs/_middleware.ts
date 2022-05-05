import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { docsRedirects } from 'data/docs-redirects'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // To prevent an infinite redirect loop, we only look for a defined redirect
  // for pages that aren't explicitly defined here.
  const DEFINED_DOCS_PAGES = [
    '/docs',
    '/docs/glossary',
    '/docs/partnerships',
    '/docs/terraform-tools',
  ]

  if (
    req.nextUrl.pathname &&
    !DEFINED_DOCS_PAGES.includes(req.nextUrl.pathname)
  ) {
    const path = req.nextUrl.pathname
    const pathIndexHtml = [path, 'index.html'].join('/')
    const pathHtml = `${path}.html`

    for (const key of [path, pathIndexHtml, pathHtml]) {
      if (key in docsRedirects) {
        const destination = docsRedirects[key]
        
        if (destination.startsWith('https://') || destination.startsWith('http://')) {
          // If the URL is NOT relative, don't construct a new URL from the current one. This prevents
          // learn redirects from going to https://terraform.io/https://learn.hashicorp.com/..., for example.
          return NextResponse.redirect(destination, 308)
        }
        
        // cloning the URL so we can provide an absolute URL to the .redirect() call,
        // per: https://nextjs.org/docs/messages/middleware-relative-urls
        const newUrl = req.nextUrl.clone()
        newUrl.pathname = destination
        return NextResponse.redirect(newUrl, 308)
      }
    }
  }

  return NextResponse.next()
}
