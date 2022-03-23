const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const path = require('path')
const redirects = require('./redirects.next.js')

module.exports = (phase, { defaultConfig }) => {
  const env = {
    HASHI_ENV: process.env.HASHI_ENV || 'development',
    SEGMENT_WRITE_KEY: 'EnEETDWhfxp1rp09jVvJr66LdvwI6KVP',
    BUGSNAG_CLIENT_KEY: 'eab8d5350ab3b12d77b7498b23f9a89a',
    BUGSNAG_SERVER_KEY: '1f55a49019f70f94a17dd6d93210f09d',
    IS_CONTENT_PREVIEW: process.env.IS_CONTENT_PREVIEW || true,
    NAV_DATA_PATH: process.env.NAV_DATA_PATH || '../../../website/data/cdktf-nav-data.json',
    CONTENT_DIR: process.env.CONTENT_DIR || "../../../website/docs/cdktf",
  }

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    console.log()
    console.log("==================phase: ", phase)
    console.log(env)
    console.log()
  }

  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    svgo: { plugins: [{ removeViewBox: false }] },
    async redirects() {
      return await redirects
    },
    env: env,
  }

  return withHashicorp({
    nextOptimizedImages: true,
    mdx: { resolveIncludes: path.join(__dirname, 'pages/partials') },
  })(nextConfig)
}
