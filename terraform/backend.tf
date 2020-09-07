terraform {
  required_version = ">= 0.13"
  required_providers {
    fastly = {
      source = "terraform-providers/fastly"
    }
  }

  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "hashicorp-terraform"

    workspaces {
      name = "static-sites-terraform-website-fastly"
    }
  }
}
