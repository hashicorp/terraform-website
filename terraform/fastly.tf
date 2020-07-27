provider "fastly" {
  version = "~> 0.17.0"
}

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
    # Partners
    "brightbox" : "brightbox/brightbox"
    "digitalocean" : "digitalocean/digitalocean"
    "do" : "digitalocean/digitalocean" # legacy website naming of digitalocean
    "exoscale" : "exoscale/exoscale"
    "hcloud" : "hetznercloud/hcloud"
    "huaweicloudstack" : "huaweicloud/huaweicloudstack"
    "linode" : "linode/linode"
    "ncloud" : "NaverCloudPlatform/ncloud"
    "newrelic" : "newrelic/newrelic"
    "rancher2" : "rancher/rancher2"
    "signalfx" : "splunk-terraform/signalfx"
    "sumologic" : "SumoLogic/sumologic"
    "tencentcloud" : "tencentcloudstack/tencentcloud"
    "triton" : "joyent/triton"

    # HashiCorp providers, if moving more of these, you may need the Registry to
    # manually enable Google indexing, contact the team / Paul Tyng for more
    "archive" : "hashicorp/archive"
    "aws" : "hashicorp/aws"
    "cloudinit" : "hashicorp/cloudinit"
    "dns" : "hashicorp/dns"
    "external" : "hashicorp/external"
    "http" : "hashicorp/http"
    "local" : "hashicorp/local"
    "null" : "hashicorp/null"
    "random" : "hashicorp/random"
    "template" : "hashicorp/template"
    "time" : "hashicorp/time"
    "tls" : "hashicorp/tls"
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
