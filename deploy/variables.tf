variable "name" {
  default     = "terraform-www"
  description = "Name of the website in slug format."
}

variable "github_repo" {
  default     = "hashicorp/terraform"
  description = "GitHub repository of the provider in 'org/name' format."
}

variable "github_branch" {
  default     = "master"
  description = "GitHub branch which netlify will continuously deploy."
}
