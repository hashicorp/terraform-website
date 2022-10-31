/**
 * Redirects in this file are intended to be for documentation content only. The redirects will be applied to developer.hashicorp.com.
 */
module.exports = [
  // Temporary Redirects to defer new/moved cloud-docs pages to their older respective enterprise pages
  // - https://github.com/hashicorp/terraform-docs-common-internal/pull/6
  // - https://github.com/hashicorp/terraform-docs-common/pull/141
  {
    source: '/terraform/enterprise/policy-enforcement',
    destination: '/terraform/enterprise/sentinel',
    permanent: false,
  },
  {
    source: '/terraform/enterprise/policy-enforcement/sentinel',
    destination: '/terraform/enterprise/sentinel',
    permanent: false,
  },
  {
    source: '/terraform/enterprise/policy-enforcement/:path*',
    destination: '/terraform/enterprise/sentinel/:path*',
    permanent: false,
  },
  {
    source: '/terraform/enterprise/policy-enforcement/sentinel/:path*',
    destination: '/terraform/enterprise/sentinel/:path*',
    permanent: false,
  },
]
