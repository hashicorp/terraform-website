const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const path = require('path')
const redirects = require('./redirects.next.js')

module.exports = withHashicorp({
  nextOptimizedImages: true,
  mdx: { resolveIncludes: path.join(__dirname, 'pages/partials') },
})({
  svgo: { plugins: [{ removeViewBox: false }] },
  async redirects() {
    return await redirects
  },
  env: {
    HASHI_ENV: process.env.HASHI_ENV || 'development',
    SEGMENT_WRITE_KEY: 'EnEETDWhfxp1rp09jVvJr66LdvwI6KVP',
    BUGSNAG_CLIENT_KEY: 'eab8d5350ab3b12d77b7498b23f9a89a',
    BUGSNAG_SERVER_KEY: '1f55a49019f70f94a17dd6d93210f09d',
    IS_CONTENT_PREVIEW: process.env.IS_CONTENT_PREVIEW,
  },
})
