---
layout: "enterprise2"
page_title: "Installing Software - Runs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-run-install"
---

# Installing Custom Software

In some cases, it may be useful to install certain software on the Terraform worker, 
such as a configuration management tool or cloud CLI.

Terraform's `local-exec` [provisioner](https://www.terraform.io/docs/provisioners/local-exec.html) is available for use in Terraform Enterprise (TFE). This will execute commands on the host machine running Terraform.

```hcl
resource "null_resource" "local-software" {
  provisioner "local-exec" {
    command = <<EOH
sudo apt-get update
sudo apt-get install -y ansible
EOH
  }
}
```

Using `local-exec` is only recommended where using a more standard provider-based action is not possible or feasible. See [Terraform Runs: Custom and Community Providers](https://www.terraform.io/docs/enterprise/run/index.html#custom-and-community-providers) in the documentation for information on how to use custom and community providers in TFE.

Please note that the machines that run Terraform (containers, in Private Terraform Enterprise) exist in an isolated environment and are destroyed after each use. Very little is pre-installed and nothing is persisted between Terraform runs, so you will need
to install any custom software on each run.

Currently, the Terraform workers run the latest version of Ubuntu LTS (16.04).