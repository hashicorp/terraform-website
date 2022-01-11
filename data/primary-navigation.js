export default [
  {
    text: 'Overview',
    url: '/',
  },
  {
    text: 'Editions',
    type: 'anchor',
    submenu: [
      { url: '/', text: 'Terraform CLI' },
      {
        url: 'https://cloud.hashicorp.com/products/terraform',
        text: 'Terraform Cloud',
      },
      {
        url: 'https://www.hashicorp.com/products/terraform',
        text: 'Terraform Enterprise',
      },
    ],
  },
  {
    text: 'Registry',
    url: 'https://registry.terraform.io/',
  },
  {
    text: 'Tutorials',
    url: 'https://learn.hashicorp.com/terraform/?utm_source=terraform_io',
  },
  {
    text: 'Docs',
    type: 'anchor',
    submenu: [
      { url: '/docs', text: 'About the Docs' },
      {
        url: '/intro',
        text: 'Intro to Terraform',
      },
      {
        url: '/language',
        text: 'Configuration Language',
      },
      { url: '/cli', text: 'Terraform CLI' },
      { url: '/cloud-docs/', text: 'Terraform Cloud' },
      {
        url: '/enterprise',
        text: 'Terraform Enterprise',
      },
      { url: '/language/providers', text: 'Provider Use' },
      {
        url: '/plugin',
        text: 'Plugin Development',
      },
      {
        url: '/registry',
        text: 'Registry Publishing',
      },
      {
        url: '/docs/partnerships',
        text: 'Integration Program',
      },
      {
        url: '/docs/terraform-tools',
        text: 'Terraform Tools',
      },
      {
        url: '/cdktf',
        text: 'CDK for Terraform',
      },
      { url: '/docs/glossary', text: 'Glossary' },
    ],
  },
  {
    text: 'Community',
    url: '/community',
  },
  {
    text: 'GitHub',
    url: 'https://github.com/hashicorp/terraform',
  },
]
