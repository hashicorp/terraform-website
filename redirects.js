/**
 * Redirects in this file are intended to be for documentation content only. The redirects will be applied to developer.hashicorp.com.
 */
module.exports = [
  // Redirects for restructured Terraform Plugin Framework docs for GA release of the Framework
  // - https://github.com/hashicorp/terraform-plugin-framework/pull/554
  // - https://github.com/hashicorp/terraform-docs-common/pull/252
  {
    source: '/terraform/plugin/which-sdk',
    destination: '/terraform/plugin/framework-benefits',
    permanent: true,
  },
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
  {
    source: '/terraform/cloud-docs/workspaces/naming',
    destination: '/terraform/cloud-docs/workspaces/creating',
    permanent: true,
  },
  // Moving TF Plugin Development best practice info
  // - https://github.com/hashicorp/terraform-plugin-sdk/issues/1151
  {
    source: '/terraform/plugin/sdkv2/best-practices/other-languages',
    destination: '/terraform/plugin/best-practices/provider-code',
    permanent: true,
  },
  {
    source: '/terraform/plugin/sdkv2/best-practices/testing',
    destination: '/terraform/plugin/testing/testing-patterns',
    permanent: true,
  },
  {
    source: '/terraform/plugin/sdkv2/best-practices/versioning',
    destination: '/terraform/plugin/best-practices/versioning',
    permanent: true,
  },
  {
    source: '/terraform/plugin/sdkv2/best-practices/sensitive-state',
    destination: '/terraform/plugin/best-practices/sensitive-state',
    permanent: true,
  },
  {
    source: '/terraform/plugin/sdkv2/best-practices/depending-on-providers',
    destination: '/terraform/plugin/best-practices/interacting-with-providers',
    permanent: true,
  },
  {
    source: '/terraform/plugin/sdkv2/best-practices/naming',
    destination: '/terraform/plugin/best-practices/naming',
    permanent: true,
  },
  {
    source: '/terraform/plugin/hashicorp-provider-design-principles',
    destination: '/terraform/plugin/best-practices/hashicorp-provider-design-principles',
    permanent: true,
  },
]
