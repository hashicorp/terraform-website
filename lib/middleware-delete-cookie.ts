import type { NextRequest, NextResponse } from 'next/server'

/**
 * Copied from https://github.com/vercel/next.js/issues/40146#issuecomment-1236392823
 *
 * Works around a bug in Next.js middleware which does not delete a cookie when only response.cookies.delete is called.
 */
export const deleteCookie = (
  request: NextRequest,
  response: NextResponse,
  cookie: string
) => {
  const { value, options } = request.cookies.getWithOptions(cookie)
  if (value) {
    response.cookies.set(cookie, value, options)
    response.cookies.delete(cookie)
  }
}
