/**
 * Redirects in this file are intended to be for documentation content only. The redirects will be applied to developer.hashicorp.com.
 */
module.exports = [
   {
     source: '/terraform/enterprise/policy-enforcement/:path*',
     destination: '/terraform/enterprise/sentinel/:path*',
     permanent: true,
   },
  {
     source: '/terraform/enterprise/policy-enforcement/sentinel/:path*',
     destination: '/terraform/enterprise/sentinel/:path*',
     permanent: true,
   }
]
