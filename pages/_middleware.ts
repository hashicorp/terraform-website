import setGeoCookie from '@hashicorp/platform-edge-utils/lib/set-geo-cookie'
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  /**
   * If the betaOptOut query param exists, clear it, delete the opt-in cookie, and redirect back to the current URL without the betaOptOut query param
   */
  if (request.nextUrl.searchParams.get('betaOptOut') === 'true') {
    const url = request.nextUrl.clone()
    url.searchParams.delete('betaOptOut')
    return NextResponse.redirect(url).clearCookie(`terraform-io-beta-opt-in`)
  }

  // Sets a cookie named hc_geo on the response
  const response = setGeoCookie(request)

  return response
}
