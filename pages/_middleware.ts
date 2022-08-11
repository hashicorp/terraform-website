import setGeoCookie from '@hashicorp/platform-edge-utils/lib/set-geo-cookie'
// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  // Sets a cookie named hc_geo on the response
  const response = setGeoCookie(request)

  return response
}
