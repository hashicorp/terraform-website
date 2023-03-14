/**
 * These redirects apply to the terraform.io domain.
 */
module.exports = (async () => {
  const tfProviderNamespaces = {
    aci: 'CiscoDevNet/aci',
    acme: 'vancluever/acme',
    ado: 'microsoft/azuredevops',
    akamai: 'akamai/akamai',
    alicloud: 'aliyun/alicloud',
    archive: 'hashicorp/archive',
    auth0: 'alexkappa/auth0',
    aviatrix: 'AviatrixSystems/aviatrix',
    aws: 'hashicorp/aws',
    azuread: 'hashicorp/azuread',
    azuredevops: 'microsoft/azuredevops',
    azurerm: 'hashicorp/azurerm',
    azurestack: 'hashicorp/azurestack',
    baiducloud: 'baidubce/baiducloud',
    bigip: 'F5Networks/bigip',
    brightbox: 'brightbox/brightbox',
    checkpoint: 'CheckPointSW/checkpoint',
    circonus: 'circonus-labs/circonus',
    ciscoasa: 'hashicorp/ciscoasa',
    cloudamqp: 'cloudamqp/cloudamqp',
    cloudflare: 'cloudflare/cloudflare',
    cloudinit: 'hashicorp/cloudinit',
    cloudscale: 'cloudscale-ch/cloudscale',
    cobbler: 'cobber/cobbler',
    constellix: 'Constellix/constellix',
    consul: 'hashicorp/consul',
    datadog: 'DataDog/datadog',
    digitalocean: 'digitalocean/digitalocean',
    dme: 'DNSMadeEasy/dme',
    dns: 'hashicorp/dns',
    dnsimple: 'dnsimple/dnsimple',
    do: 'digitalocean/digitalocean',
    docker: 'kreuzwerker/docker',
    dome9: 'dome9/dome9',
    ecl: 'nttcom/ecl',
    exoscale: 'exoscale/exoscale',
    external: 'hashicorp/external',
    fastly: 'fastly/fastly',
    flexibleengine: 'FlexibleEngineCloud/flexibleengine',
    fortios: 'fortinetdev/fortios',
    github: 'integrations/github',
    gitlab: 'gitlabhq/gitlab',
    google: 'hashicorp/google',
    grafana: 'grafana/grafana',
    gridscale: 'gridscale/gridscale',
    hcloud: 'hetznercloud/hcloud',
    helm: 'hashicorp/helm',
    heroku: 'heroku/heroku',
    http: 'hashicorp/http',
    huaweicloud: 'huaweicloud/huaweicloud',
    huaweicloudstack: 'huaweicloud/huaweicloudstack',
    icinga2: 'Icinga/icinga2',
    incapsula: 'imperva/incapsula',
    ksyun: 'kingsoftcloud/ksyun',
    kubernetes: 'hashicorp/kubernetes',
    lacework: 'lacework/lacework',
    launchdarkly: 'launchdarkly/launchdarkly',
    linode: 'linode/linode',
    local: 'hashicorp/local',
    logicmonitor: 'logicmonitor/logicmonitor',
    mailgun: 'wgebis/mailgun',
    mongodbatlas: 'mongodb/mongodbatlas',
    mso: 'CiscoDevNet/mso',
    ncloud: 'NaverCloudPlatform/ncloud',
    newrelic: 'newrelic/newrelic',
    nomad: 'hashicorp/nomad',
    ns1: 'ns1-terraform/ns1',
    nsxt: 'vmware/nsxt',
    null: 'hashicorp/null',
    nutanix: 'nutanix/nutanix',
    oci: 'oracle/oci',
    okta: 'oktadeveloper/okta',
    oktaasa: 'oktadeveloper/oktaasa',
    opc: 'hashicorp/opc',
    opennebula: 'OpenNebula/opennebula',
    openstack: 'terraform-provider-openstack/openstack',
    opentelekomcloud: 'opentelekomcloud/opentelekomcloud',
    opsgenie: 'opsgenie/opsgenie',
    oraclepaas: 'hashicorp/oraclepaas',
    ovh: 'ovh/ovh',
    packet: 'packethost/packet',
    pagerduty: 'PagerDuty/pagerduty',
    panos: 'PaloAltoNetworks/panos',
    postgresql: 'cyrilgdn/postgresql',
    powerdns: 'pan-net/powerdns',
    prismacloud: 'PaloAltoNetworks/prismacloud',
    profitbricks: 'ionos-cloud/profitbricks',
    rabbitmq: 'cyrilgdn/rabbitmq',
    rancher2: 'rancher/rancher2',
    random: 'hashicorp/random',
    scaleway: 'scaleway/scaleway',
    selectel: 'selectel/selectel',
    signalfx: 'splunk-terraform/signalfx',
    skytap: 'skytap/skytap',
    spotinst: 'spotinst/spotinst',
    stackpath: 'stackpath/stackpath',
    statuscake: 'StatusCakeDev/statuscake',
    sumologic: 'SumoLogic/sumologic',
    template: 'hashicorp/template',
    tencentcloud: 'tencentcloudstack/tencentcloud',
    tfe: 'hashicorp/tfe',
    time: 'hashicorp/time',
    tls: 'hashicorp/tls',
    triton: 'joyent/triton',
    turbot: 'turbot/turbot',
    ucloud: 'ucloud/ucloud',
    vault: 'hashicorp/vault',
    vcd: 'vmware/vcd',
    venafi: 'Venafi/venafi',
    vmc: 'vmware/vmc',
    vra7: 'vmware/vra7',
    vsphere: 'hashicorp/vsphere',
    vthunder: 'a10networks/thunder',
    vultr: 'vultr/vultr',
    wavefront: 'vmware/wavefront',
    yandex: 'yandex-cloud/yandex',
  }

  const tfRegistryDocsType = {
    d: 'data-sources',
    guides: 'guides',
    r: 'resources',
  }

  const registryTopLevelRedirects = Object.entries(tfProviderNamespaces).map(
    ([namespace, repo]) => {
      return {
        source: `/docs/providers/${namespace}(/index.html)?`,
        destination: `https://registry.terraform.io/providers/${repo}/latest/docs`,
        permanent: true,
      }
    }
  )

  const registryDocsRedirects = []

  Object.entries(tfProviderNamespaces).forEach(([namespace, repo]) => {
    for (let [docsTypeShort, docsTypeFull] of Object.entries(
      tfRegistryDocsType
    )) {
      registryDocsRedirects.push({
        source: `/docs/providers/${namespace}/${docsTypeShort}/:path*`,
        destination: `https://registry.terraform.io/providers/${repo}/latest/docs/${docsTypeFull}/:path*`,
        permanent: true,
      })
    }
  })

  const miscRedirectsMap = {
    '/cloud': 'https://cloud.hashicorp.com/products/terraform',
    '/cloud/how-it-works': 'https://cloud.hashicorp.com/products/terraform',
    '/community.html': '/community',
    '/downloads.html': '/downloads',
    '/guides/core-workflow.html': '/intro/core-workflow',
    '/guides/index.html': '/guides',
    '/guides/terraform-integration-program.html': '/docs/partnerships',
    '/guides/terraform-provider-development-program.html': '/docs/partnerships',
    '/guides/writing-custom-terraform-providers.html':
      '/docs/extend/writing-custom-providers.html',
    '/index.html': '/',
    '/intro/index.html': '/intro',
    '/intro/use-cases.html': '/intro/use-cases',
    '/intro/vs/boto.html': '/intro/vs/boto',
    '/intro/vs/chef-puppet.html': '/intro/vs/chef-puppet',
    '/intro/vs/cloudformation.html': '/intro/vs/cloudformation',
    '/intro/vs/custom.html': '/intro/vs/custom',
    '/intro/vs/index.html': '/intro/vs',
    '/plugin/sdkv2/sdkv2-intro': '/plugin/sdkv2',
    '/security.html': '/security',
    '/upgrade-guides': '/language/upgrade-guides',
    '/upgrade-guides/0-10.html': '/language/upgrade-guides/0-10',
    '/upgrade-guides/0-11.html': '/language/upgrade-guides/0-11',
    '/upgrade-guides/0-12.html': '/language/upgrade-guides/0-12',
    '/upgrade-guides/0-13.html': '/language/upgrade-guides/0-13',
    '/upgrade-guides/0-14.html': '/language/upgrade-guides/0-14',
    '/upgrade-guides/0-15.html': '/language/upgrade-guides/0-15',
    '/upgrade-guides/0-7.html': '/language/upgrade-guides/0-7',
    '/upgrade-guides/0-8.html': '/language/upgrade-guides/0-8',
    '/upgrade-guides/0-9.html': '/language/upgrade-guides/0-9',
    '/upgrade-guides/1-0.html': '/language/upgrade-guides/1-0',
    '/upgrade-guides/index.html': '/language/upgrade-guides',
    '/language/resources/provisioners':
      '/language/resources/provisioners/syntax',
    '/enterprise/before-installing/cluster-architecture':
      '/enterprise/install/automated/active-active',
    '/enterprise/install/cluster-aws':
      '/enterprise/install/automated/active-active',
    '/enterprise/install/cluster-azure':
      '/enterprise/install/automated/active-active',
    '/enterprise/install/cluster-custom':
      '/enterprise/install/automated/active-active',
    '/enterprise/install/cluster-gcp':
      '/enterprise/install/automated/active-active',
    '/enterprise/admin/infrastructure/active-active':
      '/enterprise/admin/infrastructure/admin-cli',
    '/enterprise/release': '/enterprise/releases',
    '/cloud-docs/registry/publish': '/cloud-docs/registry/publish-modules',
    '/cloud-docs/api-docs/providers':
      '/cloud-docs/api-docs/private-registry/providers',
    '/cloud-docs/api-docs/modules':
      '/cloud-docs/api-docs/private-registry/modules',
    '/enterprise/install': '/enterprise/install/pre-install-checklist',
    '/enterprise/before-installing':
      '/enterprise/install/pre-install-checklist',
    '/enterprise/before-installing/reference-architecture':
      '/enterprise/reference-architecture',
    '/enterprise/before-installing/reference-architecture/:part':
      '/enterprise/reference-architecture/:part',

    '/enterprise/before-installing/os-specific/rhel-requirements':
      '/enterprise/requirements/os-specific/rhel-requirements',
    '/enterprise/before-installing/os-specific/centos-requirements':
      '/enterprise/requirements/os-specific/centos-requirements',
    '/enterprise/before-installing/network-requirements':
      '/enterprise/requirements/network',
    '/enterprise/user-management/saml': '/enterprise/saml/configuration',
    '/enterprise/user-management/saml/:path*': '/enterprise/saml/:path*',
    '/enterprise/before-installing/data-storage-requirements/postgres-requirements':
      '/enterprise/requirements/data-storage/postgres-requirements',
    '/enterprise/before-installing/data-storage-requirements/disk-requirements':
      '/enterprise/requirements/data-storage/operational-mode-requirements',
    '/enterprise/before-installing/data-storage-requirements/minio-setup-guide':
      '/enterprise/requirements/data-storage/mineo-setup-guide',
    '/enterprise/before-installing/data-storage-requirements/vault':
      '/enterprise/requirements/data-storage/vault',
    '/cloud-docs/users-teams-organizations/index':
      '/cloud-docs/users-teams-organizations/users',
    '/cloud-docs/guides/recommended-practices':
      '/cloud-docs/recommended-practices',
    '/cloud-docs/guides/recommended-practices/:path*':
      '/cloud-docs/recommended-practices/:path*',
    '/cloud-docs/paid': '/cloud-docs/overview',
    '/cloud-docs/run': '/cloud-docs/run/remote-operations',
    '/language/settings/backends': '/language/settings/backends/configuration',
    '/cloud-docs/api-docs/run-tasks':
      '/cloud-docs/api-docs/run-tasks/run-tasks',
    '/cloud-docs/api-docs/run-tasks-integration':
      '/cloud-docs/api-docs/run-tasks/run-tasks-integration',
    '/language/provider-checksum-verification':
      '/language/files/dependency-lock#checksum-verification', // Used by the Terraform CLI to short-link to documentation.
    '/cdktf/concepts/providers-and-resources': '/cdktf/concepts/providers',
    // The /configuration pages have been deleted.
    '/configuration/expressions': '/language/expressions',
    '/configuration/modules': '/language/modules',
    '/configuration/resources': '/language/resources',
    // The /guides pages have been deleted.
    '/guides': '/intro',
    '/guides/terraform-provider-development-program': '/docs/partnerships',
    '/cloud-docs/api-docs/admin': '/enterprise/api-docs/admin',
    '/cloud-docs/api-docs/admin/module-sharing':
      '/enterprise/api-docs/admin/module-sharing',
    '/cloud-docs/api-docs/admin/organizations':
      '/enterprise/api-docs/admin/organizations',
    '/cloud-docs/api-docs/admin/runs': '/enterprise/api-docs/admin/runs',
    '/cloud-docs/api-docs/admin/settings':
      '/enterprise/api-docs/admin/settings',
    '/cloud-docs/api-docs/admin/terraform-versions':
      '/enterprise/api-docs/admin/terraform-versions',
    '/cloud-docs/api-docs/admin/users': '/enterprise/api-docs/admin/users',
    '/cloud-docs/api-docs/admin/workspaces':
      '/enterprise/api-docs/admin/workspaces',
    '/language/configuration-0-11': '/language/v1.1.x/configuration-0-11',
    '/language/configuration-0-11/:slug*':
      '/language/v1.1.x/configuration-0-11/:slug*',
    '/cloud-docs/workspaces/settings/drift-detection':
      '/cloud-docs/workspaces/settings/health-assessments',
    '/language/resources/provisioners/chef':
      '/language/v1.1.x/resources/provisioners/chef',
    '/language/resources/provisioners/habitat':
      '/language/v1.1.x/resources/provisioners/habitat',
    '/language/resources/provisioners/puppet':
      '/language/v1.1.x/resources/provisioners/puppet',
    '/language/resources/provisioners/salt-masterless':
      '/language/v1.1.x/resources/provisioners/salt-masterless',
    '/docs/language/functions/defaults':
      '/docs/language/expressions/type-constraints#optional-object-type-attributes',
    // Policy Enforcement refactor
    '/cloud-docs/sentinel': '/cloud-docs/policy-enforcement',
    '/cloud-docs/sentinel/sentinel-tf-012':
      '/cloud-docs/policy-enforcement/sentinel/sentinel-tf-012',
    '/cloud-docs/sentinel/manage-policies':
      '/cloud-docs/policy-enforcement/manage-policy-sets',
    '/cloud-docs/sentinel/enforce':
      '/cloud-docs/policy-enforcement/policy-results',
    '/cloud-docs/sentinel/mock': '/cloud-docs/policy-enforcement/sentinel/mock',
    '/cloud-docs/sentinel/json': '/cloud-docs/policy-enforcement/sentinel/json',
    '/cloud-docs/sentinel/examples': '/cloud-docs/policy-enforcement/sentinel',
    '/cloud-docs/sentinel/import':
      '/cloud-docs/policy-enforcement/sentinel#sentinel-imports',
    '/cloud-docs/sentinel/import/tfconfig':
      '/cloud-docs/policy-enforcement/sentinel/import/tfconfig',
    '/cloud-docs/sentinel/import/tfconfig-v2':
      '/cloud-docs/policy-enforcement/sentinel/import/tfconfig-v2',
    '/cloud-docs/sentinel/import/tfplan':
      '/cloud-docs/policy-enforcement/sentinel/import/tfplan',
    '/cloud-docs/sentinel/import/tfplan-v2':
      '/cloud-docs/policy-enforcement/sentinel/import/tfplan-v2',
    '/cloud-docs/sentinel/import/tfstate':
      '/cloud-docs/policy-enforcement/sentinel/import/tfstate',
    '/cloud-docs/sentinel/import/tfstate-v2':
      '/cloud-docs/policy-enforcement/sentinel/import/tfstate-v2',
    '/cloud-docs/sentinel/import/tfrun':
      '/cloud-docs/policy-enforcement/sentinel/import/tfrun',
    // Health
    '/cloud-docs/workspaces/settings/health-assessments':
      '/cloud-docs/workspaces/health',
    // Registry Sharing
    '/enterprise/admin/application/module-sharing':
      '/enterprise/admin/application/registry-sharing',
    // Moving TF Plugin Development best practice info
    '/plugin/sdkv2/best-practices/other-languages': '/plugin/best-practices/provider-code',
    '/plugin/sdkv2/best-practices/testing': '/plugin/testing/testing-patterns',
    '/plugin/sdkv2/best-practices/versioning': '/plugin/best-practices/versioning',
    '/plugin/sdkv2/best-practices/sensitive-state': '/plugin/best-practices/sensitive-state',
    '/plugin/sdkv2/best-practices/depending-on-providers': '/plugin/best-practices/interacting-with-providers',
    '/plugin/sdkv2/best-practices/naming': '/plugin/best-practices/naming',
    '/plugin/hashicorp-provider-design-principles': '/plugin/best-practices/hashicorp-provider-design-principles',
  }
  const miscRedirects = Object.entries(miscRedirectsMap).map(
    ([source, destination]) => {
      return { source, destination, permanent: true }
    }
  )

  // Sub-pages of "upgrade-guides" are a legacy situation from before we had
  // versioned docs. Now the v1.1 and earlier upgrade guides live under the
  // v1.1.x version while subsequent versions each contain only a single
  // upgrade guide, which is always at /language/upgrade-guides with no
  // suffix.
  const legacyUpgradeGuides = [
    '1-1',
    '1-0',
    '0-15',
    '0-14',
    '0-13',
    '0-12',
    '0-11',
    '0-10',
    '0-9',
    '0-8',
    '0-7',
  ]
  const upgradeGuideRedirects = [
    ...legacyUpgradeGuides.map((slug) => ({
      source: '/language/upgrade-guides/' + slug,
      destination: '/language/v1.1.x/upgrade-guides/' + slug,
      permanent: true,
    })),
    ...legacyUpgradeGuides.map((slug) => ({
      source: '/language/v1.2.x/upgrade-guides/' + slug,
      destination: '/language/v1.1.x/upgrade-guides/' + slug,
      permanent: true,
    })),
    // The v1.2.x version was live before we made this change, so it previously
    // had its own upgrade guide at a sub-path and we now need to hoist it
    // up to the main upgrade-guides URL as a special case. Everything else
    // on that branch should now redirect to the v1.1.x branch just as we
    // do for the latest version URL.
    {
      source: '/language/upgrade-guides/1-2',
      destination: '/language/v1.2.x/upgrade-guides',
      permanent: true,
    },
    {
      source: '/language/v1.2.x/upgrade-guides/1-2',
      destination: '/language/v1.2.x/upgrade-guides',
      permanent: true,
    },
  ]

  // Some backends were removed in Terraform v1.3 so their old URLs will
  // redirect into the v1.2.x docs.
  const legacyBackendRedirects = [
    'artifactory',
    'etcd',
    'etcdv3',
    'manta',
    'swift',
  ].map((slug) => ({
    source: '/language/settings/backends/' + slug,
    destination: '/language/v1.2.x/settings/backends/' + slug,
    permanent: true,
  }))

  return [
    ...registryTopLevelRedirects,
    ...registryDocsRedirects,
    ...upgradeGuideRedirects,
    ...legacyBackendRedirects,
    ...miscRedirects,
  ]
})()
