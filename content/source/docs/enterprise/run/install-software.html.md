---
layout: "enterprise2"
page_title: "Installing Software - Runs - Terraform Enterprise"
sidebar_current: "docs-enterprise2-run-install"
---

# Installing Custom Software

In some cases it may be useful to install certain software on the Terraform worker, 
such as a configuration management tool or cloud CLI.

Terraform's local-exec provisioner provisioner can be used in Terraform Enterprise (TFE). This will execute commands on the host machine running Terraform. In general, the provisioner configuration block containing the local-exec provisioner should be added to the resource(s) the software being installed will be used to interact with.

```hcl
resource "aws_instance" "example" {
  ami           = "${var.ami}"
  instance_type = "t2.micro"
  provisioner "local-exec" {
    command = <<EOH
sudo apt-get update
sudo apt-get install -y ansible
EOH
  }
}
```

Using software installed via local-exec to create unmanaged infrastructure is not recommended. Instead, if possible, use a provider that can manage the resource using a Terraform configuration. See [Terraform Runs: Custom and Community Providers](index.html#custom-and-community-providers) in the documentation for information on how to use custom and community providers in TFE.

Please note that the machines that run Terraform (containers, in Private Terraform Enterprise) exist in an isolated environment and are destroyed after each use. Very little is pre-installed and nothing is persisted between Terraform runs, so you will need to install any custom software on each run.

For this reason, a null resource with the `local-exec` provisioner will only install software on the first run when the `null_resource` is created. The `null_resource` will not be automatically recreated in subsequent runs, so the software will not be reinstalled into the new container, which may cause runs to encounter errors.

However, it may be appropriate to use a null resource with a `local-exec` provisioner to install software if the null resource can be properly configured with [triggers](https://www.terraform.io/docs/provisioners/null_resource.html#example-usage).

Currently, the Terraform workers run the latest version of Ubuntu LTS, however this is subject to change in the future.
