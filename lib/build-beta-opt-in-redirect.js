/**
 * Construct a redirect definition for beta product opt-in, based on cookies and host conditions
 *
 * copied from hashicorp/dev-portal
 *
 * @param {*} product  string
 * @param {*} basePaths string[]
 * @returns {Redirect} redirect
 */
function buildBetaProductOptInRedirect(product, basePaths) {
  return {
    source: `/:base(${basePaths.join('|')})/:path*`,
    destination: `https://developer.hashicorp.com/${product}/:base/:path*`,
    permanent: false,
    has: [
      {
        type: 'cookie',
        key: `${product}-io-beta-opt-in`,
        value: 'true',
      },
    ],
  }
}

module.exports = buildBetaProductOptInRedirect
