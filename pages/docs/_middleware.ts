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
        return NextResponse.redirect(docsRedirects[key], 308)
      }
    }
  }

  return NextResponse.next()
}
