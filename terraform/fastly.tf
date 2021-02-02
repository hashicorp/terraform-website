locals {
  static_sites_service_id              = "7GrxRJP3PVBuqQbyxYQ0MV"
  tf_registry_docs_type_dictionary_id  = "2meQ4j47Me81w1jSb5m9lh"
  tf_provider_namespaces_dictionary_id = "7Rye8KM48sHfEE7kzcZTWU"
  tf_external_redirects_dictionary_id  = "44DagwD5TIm8Qq4jPTsEMi"
}

# The following dictionaries update Terraform redirects for the terraform.io/docs -> registry.terraform.io move.
# We do not currently manage the VCL in this Terraform configuration. The relevant VCL configuration that uses these dictionaries
# are shown below and the relevant RFC is "TFR-013: Deprecating provider docs on terraform.io":

# # Redirect docs to the registry.terraform.io
# # This is for the index page only
# if (req.url ~ "/docs/providers/([^/]+)/index.html$") {
#     if (table.lookup(tf_provider_namespaces, re.group.1)) {
#         set req.http.x-varnish-redirect = "https://registry.terraform.io/providers/" table.lookup(tf_provider_namespaces, re.group.1) "/latest/docs";
#         error 750 req.http.x-varnish-redirect;
#     }
# }
# # This is for resources, data sources, guides
# # re.group.1 = provider name; ex: github
# # re.group.2 = doc type; r/d/guides
# # re.group.3 = doc path including optional anchor; issue_label.html#argument-reference
# declare local var.doc_path STRING;
# if (req.url ~ "/docs/providers/([^/]+)/([^/]+)/([^/]+)$") {
#     if (table.lookup(tf_provider_namespaces, re.group.1)) {
#         if(table.lookup(tf_registry_docs_type, re.group.2)){
#             set var.doc_path = regsub(re.group.3, "\.[^#]+", "");
#             set req.http.x-varnish-redirect = "https://registry.terraform.io/providers/" table.lookup(tf_provider_namespaces, re.group.1) "/latest/docs/" table.lookup(tf_registry_docs_type, re.group.2) "/" var.doc_path;
#             error 750 req.http.x-varnish-redirect;
#         }
#     }
# }
# # Redirects any external links
# if (table.lookup(tf_external_redirects, req.url.path)) {
#   set req.http.x-varnish-redirect = table.lookup(tf_external_redirects, req.url.path);
#   error 750 req.http.x-varnish-redirect;
# }

resource "fastly_service_dictionary_items_v1" "tf_provider_namespaces_dictionary_id" {
  service_id    = local.static_sites_service_id # we do not manage this service in Terraform at this time
  dictionary_id = local.tf_provider_namespaces_dictionary_id
  items = {
    # verified partners
    "aci" : "CiscoDevNet/aci"
    "acme" : "vancluever/acme"
    "ado" : "microsoft/azuredevops" # legacy naming of azuredevops
    "akamai" : "akamai/akamai"
    "alicloud" : "aliyun/alicloud"
    "auth0" : "alexkappa/auth0"
    "aviatrix" : "AviatrixSystems/aviatrix"
    "azuredevops" : "microsoft/azuredevops"
    "baiducloud" : "baidubce/baiducloud"
    "bigip" : "F5Networks/bigip"
    "brightbox" : "brightbox/brightbox"
    "checkpoint" : "CheckPointSW/checkpoint"
    "circonus" : "circonus-labs/circonus"
    "cloudamqp" : "cloudamqp/cloudamqp"
    "cloudflare" : "cloudflare/cloudflare"
    "cloudscale" : "cloudscale-ch/cloudscale"
    "cobbler" : "cobber/cobbler"
    "constellix" : "Constellix/constellix"
    "datadog" : "DataDog/datadog"
    "digitalocean" : "digitalocean/digitalocean"
    "dme" : "DNSMadeEasy/dme"
    "dnsimple" : "dnsimple/dnsimple"
    "do" : "digitalocean/digitalocean" # legacy website naming of digitalocean
    "docker" : "kreuzwerker/docker"
    "dome9" : "dome9/dome9"
    "ecl" : "nttcom/ecl"
    "exoscale" : "exoscale/exoscale"
    "fastly" : "fastly/fastly"
    "flexibleengine" : "FlexibleEngineCloud/flexibleengine"
    "fortios" : "fortinetdev/fortios"
    "github" : "integrations/github"
    "gitlab" : "gitlabhq/gitlab"
    "grafana" : "grafana/grafana"
    "gridscale" : "gridscale/gridscale"
    "hcloud" : "hetznercloud/hcloud"
    "heroku" : "heroku/heroku"
    "huaweicloud" : "huaweicloud/huaweicloud"
    "huaweicloudstack" : "huaweicloud/huaweicloudstack"
    "icinga2" : "Icinga/icinga2"
    "incapsula" : "imperva/incapsula"
    "ksyun" : "kingsoftcloud/ksyun"
    "lacework" : "lacework/lacework"
    "launchdarkly" : "launchdarkly/launchdarkly"
    "linode" : "linode/linode"
    "logicmonitor" : "logicmonitor/logicmonitor"
    "mailgun" : "wgebis/mailgun"
    "mongodbatlas" : "mongodb/mongodbatlas"
    "mso" : "CiscoDevNet/mso"
    "ncloud" : "NaverCloudPlatform/ncloud" # unverified
    "newrelic" : "newrelic/newrelic"
    "ns1" : "ns1-terraform/ns1"
    "nsxt" : "vmware/nsxt"
    "nutanix" : "nutanix/nutanix"
    "okta" : "oktadeveloper/okta"
    "oktaasa" : "oktadeveloper/oktaasa"
    "opennebula" : "OpenNebula/opennebula"
    "openstack" : "terraform-provider-openstack/openstack"   # unverified
    "opentelekomcloud" : "opentelekomcloud/opentelekomcloud" # unverified
    "opsgenie" : "opsgenie/opsgenie"
    "ovh" : "ovh/ovh" # unverified?
    "packet" : "packethost/packet"
    "pagerduty" : "PagerDuty/pagerduty"
    "panos" : "PaloAltoNetworks/panos" # unverified
    "postgresql" : "cyrilgdn/postgresql"
    "powerdns" : "pan-net/powerdns"
    "prismacloud" : "PaloAltoNetworks/prismacloud" # unverified
    "profitbricks" : "ionos-cloud/profitbricks"
    "rabbitmq" : "cyrilgdn/rabbitmq"
    "rancher2" : "rancher/rancher2"
    "scaleway" : "scaleway/scaleway"
    "selectel" : "selectel/selectel" # unverified
    "signalfx" : "splunk-terraform/signalfx"
    "skytap" : "skytap/skytap"
    "spotinst" : "spotinst/spotinst"
    "stackpath" : "stackpath/stackpath" # unverified
    "statuscake" : "StatusCakeDev/statuscake"
    "sumologic" : "SumoLogic/sumologic"
    "tencentcloud" : "tencentcloudstack/tencentcloud"
    "triton" : "joyent/triton"
    "turbot" : "turbot/turbot"
    "ucloud" : "ucloud/ucloud" # unverified
    "vcd" : "vmware/vcd"
    "venafi" : "Venafi/venafi"
    "vmc" : "vmware/vmc"
    "vra7" : "vmware/vra7"
    "vthunder" : "a10networks/thunder"
    "vultr" : "vultr/vultr"
    "wavefront" : "vmware/wavefront"
    "yandex" : "yandex-cloud/yandex"

    # HashiCorp providers, if moving more of these, you may need the Registry to
    # manually enable Google indexing, contact the team / Paul Tyng for more
    "archive" : "hashicorp/archive"
    "aws" : "hashicorp/aws"
    "azuread" : "hashicorp/azuread"
    "azurerm" : "hashicorp/azurerm"
    "azurestack" : "hashicorp/azurestack"
    "ciscoasa" : "hashicorp/ciscoasa"
    "cloudinit" : "hashicorp/cloudinit"
    "consul" : "hashicorp/consul"
    "dns" : "hashicorp/dns"
    "external" : "hashicorp/external"
    "google" : "hashicorp/google"
    "helm" : "hashicorp/helm"
    "http" : "hashicorp/http"
    "kubernetes" : "hashicorp/kubernetes"
    "local" : "hashicorp/local"
    "nomad" : "hashicorp/nomad"
    "null" : "hashicorp/null"
    "oci" : "hashicorp/oci"
    "opc" : "hashicorp/opc"
    "oraclepaas" : "hashicorp/oraclepaas"
    "random" : "hashicorp/random"
    "template" : "hashicorp/template"
    "tfe" : "hashicorp/tfe"
    "time" : "hashicorp/time"
    "tls" : "hashicorp/tls"
    "vault" : "hashicorp/vault"
    "vsphere" : "hashicorp/vsphere"
  }

  # prevent destroying this dictionary to cause redirects to break
  lifecycle {
    prevent_destroy = true
  }
}

locals {
  external_redirects_csv = csvdecode(file("${path.module}/external-redirects.csv"))
  external_redirects     = { for redir in local.external_redirects_csv : redir.src => redir.dst }
}

resource "fastly_service_dictionary_items_v1" "tf_external_redirects_dictionary_id" {
  service_id    = local.static_sites_service_id # we do not manage this service in Terraform at this time
  dictionary_id = local.tf_external_redirects_dictionary_id
  items         = local.external_redirects

  # prevent destroying this dictionary to cause redirects to break
  lifecycle {
    prevent_destroy = true
  }
}

# These should not need changing, these are static mappings of r,d,guides in the old docs site to the equivalents
# in the Terraform Registry
resource "fastly_service_dictionary_items_v1" "tf_registry_docs_type" {
  service_id    = local.static_sites_service_id # we do not manage this service in Terraform at this time
  dictionary_id = local.tf_registry_docs_type_dictionary_id
  items = {
    "r" : "resources"
    "d" : "data-sources"
    "guides" : "guides"
  }

  # prevent destroying this dictionary to cause redirects to break
  lifecycle {
    prevent_destroy = true
  }
}
