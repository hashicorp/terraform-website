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
    oci: 'hashicorp/oci',
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
    '/language/resources/provisioners': '/language/resources/provisioners/syntax',
    '/enterprise/before-installing/cluster-architecture': '/enterprise/install/automated/active-active',
    '/enterprise/install/cluster-aws': '/enterprise/install/automated/active-active',
    '/enterprise/install/cluster-azure': '/enterprise/install/automated/active-active',
    '/enterprise/install/cluster-custom': '/enterprise/install/automated/active-active',
    '/enterprise/install/cluster-gcp': '/enterprise/install/automated/active-active',
    '/enterprise/admin/infrastructure/active-active': '/enterprise/admin/infrastructure/admin-cli',
    '/enterprise/release': '/enterprise/releases',
    '/cloud-docs/registry/publish': '/cloud-docs/registry/publish-modules',
    '/cloud-docs/api-docs/providers': '/cloud-docs/api-docs/private-registry/providers',
    '/cloud-docs/api-docs/modules': '/cloud-docs/api-docs/private-registry/modules',
  }
  const miscRedirects = Object.entries(miscRedirectsMap).map(
    ([source, destination]) => {
      return { source, destination, permanent: true }
    }
  )

  // /plugin content split
  // https://github.com/hashicorp/terraform-website/pull/2258
  //
  // these are redirects for /index pages that are required but not yet leveraged
  const pluginRedirects = [
    { source: '/plugin/log', destination: '/plugin/log/managing', permanent: false },
  ]

  return [
    ...registryTopLevelRedirects,
    ...registryDocsRedirects,
    ...miscRedirects,
    ...pluginRedirects,
  ]
})()
