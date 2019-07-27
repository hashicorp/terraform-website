---
layout: "cloud"
page_title: "Installing Software in the Run Environment - Runs - Terraform Cloud"
---

#  Installing Software in the Run Environment

In some cases, it may be useful to install certain software on the Terraform worker,
such as a configuration management tool or cloud CLI.

Terraform's `local-exec` [provisioner](/docs/provisioners/local-exec.html) can be used in Terraform Enterprise (TFE). This will execute commands on the host machine running Terraform. In general, the provisioner configuration block containing the local-exec provisioner should be added to the resource(s) the software being installed will interact with.

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

Using software installed via local-exec to create unmanaged infrastructure is not recommended. Instead, if possible, use a provider that can manage the resource using a Terraform configuration. See [Terraform Runs: Custom and Community Providers](index.html#custom-and-community-providers) for information on how to use custom and community providers in TFE.

Please note that the machines that run Terraform (containers, in Private Terraform Enterprise) exist in an isolated environment and are destroyed after each use. Very little is pre-installed and nothing is persisted between Terraform runs, so you will need to install any custom software on each run.

Because the run environments are disposable, using a null resource with a `local-exec` provisioner to install software, rather than a related resource, is only appropriate if the null resource can be properly configured with [triggers](/docs/provisioners/null_resource.html#example-usage). Otherwise, a null resource with the `local-exec` provisioner will only install software on the initial run where the `null_resource` is created. The `null_resource` will not be automatically recreated in subsequent runs and the related software won't be installed, which may cause runs to encounter errors.

Currently, the Terraform workers run the latest version of Ubuntu LTS, but this may change in the future.