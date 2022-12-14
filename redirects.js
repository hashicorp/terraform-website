/**
 * Redirects in this file are intended to be for documentation content only. The redirects will be applied to developer.hashicorp.com.
 */
module.exports = [
  // Temporary Redirects to defer new/moved cloud-docs pages to their older respective enterprise pages
  // - https://github.com/hashicorp/terraform-docs-common-internal/pull/6
  // - https://github.com/hashicorp/terraform-docs-common/pull/141
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
  // Redirects for restructured Terraform Plugin Framework docs for GA release of the Framework
  // - https://github.com/hashicorp/terraform-plugin-framework/pull/554
  {
    source: '/terraform/plugin/framework/schemas',
    destination: '/terraform/plugin/framework/handling-data/schemas',
    permanent: true,
  },
  {
    source: '/terraform/plugin/framework/types',
    destination: '/terraform/plugin/framework/handling-data/attributes',
    permanent: true,
  },
  {
    source: '/terraform/plugin/framework/paths',
    destination: '/terraform/plugin/framework/handling-data/paths',
    permanent: true,
  },
  {
    source: '/terraform/plugin/framework/path-expressions',
    destination: '/terraform/plugin/framework/handling-data/path-expressions',
    permanent: true,
  },
  {
    source: '/terraform/plugin/framework/accessing-values',
    destination: '/terraform/plugin/framework/handling-data/accessing-values',
    permanent: true,
  },
  {
    source: '/terraform/plugin/framework/writing-state',
    destination: '/terraform/plugin/framework/handling-data/writing-state',
    permanent: true,
  },
]
