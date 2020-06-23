terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "hashicorp-terraform"

    workspaces {
      name = "static-sites-terraform-website-fastly"
    }
  }
}
