terraform {
  required_version = ">= 0.13"
  required_providers {
    fastly = {
      source = "terraform-providers/fastly"
      version = "~> 0.17.0"
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
