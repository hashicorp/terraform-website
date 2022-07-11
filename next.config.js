const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const path = require('path')
const redirects = require('./redirects.next.js')

module.exports = withHashicorp({
  dato: {
    // This token is safe to be in this public repository, it only has access to content that is publicly viewable on the website
    token: '88b4984480dad56295a8aadae6caad',
  },
  nextOptimizedImages: true,
  transpileModules: ['@hashicorp/flight-icons'],
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
    IS_CONTENT_PREVIEW: process.env.IS_CONTENT_PREVIEW || false,
    PREVIEW_FROM_REPO: process.env.PREVIEW_FROM_REPO,
    NAV_DATA_DIRNAME: process.env.NAV_DATA_DIRNAME || '',
    CONTENT_DIRNAME: process.env.CONTENT_DIRNAME || '',
    CURRENT_GIT_BRANCH: process.env.CURRENT_GIT_BRANCH || 'main',
    ENABLE_VERSIONED_DOCS: process.env.ENABLE_VERSIONED_DOCS || 'true',
  },
  images: {
    domains: ['www.datocms-assets.com'],
    disableStaticImages: true,
  },
})
