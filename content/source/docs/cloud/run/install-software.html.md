---
layout: "cloud"
page_title: "Installing Software in the Run Environment - Runs - Terraform Cloud"
---

#  Installing Software in the Run Environment

In rare cases, it might be necessary to install extra software on the Terraform worker, such as a configuration management tool or cloud CLI. This page describes your options for using additional tools within the Terraform worker.

## Avoid Installing Extra Software

Whenever possible, don't install software on the worker. There are a number of reasons for this:

- Provisioners are a last resort in Terraform; they greatly increase the risk of creating unknown states with unmanaged and partially-managed infrastructure, and the `local-exec` provisioner is especially hazardous. [The Terraform CLI docs on provisioners](/docs/provisioners/index.html#provisioners-are-a-last-resort) explain the hazards in more detail, with more information about the preferred alternatives. (In summary: use Packer, use cloud-init, try to make your infrastructure more immutable, and always prefer real provider features.)
- We don't guarantee the stability of the operating system on the Terraform build workers. It's currently the latest version of Ubuntu LTS, but we reserve the right to change that at any time.
- The build workers are disposable and are destroyed after each use, which makes managing extra software even more complex than when running Terraform CLI in a persistent environment. Custom software must be installed on every run, which also increases run times.

## Only Install Standalone Binaries

Terraform Cloud does not allow you to elevate a command's permissions with `sudo` during Terraform runs. This means you cannot install packages using the worker OS's normal package management tools. However, you can install and execute standalone binaries in Terraform's working directory.

You have two options for getting extra software into the configuration directory:

- Include it in the configuration repository as a submodule. (Make sure the workspace is configured to clone submodules.)
- Use `local-exec` to download it with `curl`. For example:

    ```hcl
    resource "aws_instance" "example" {
      ami           = "${var.ami}"
      instance_type = "t2.micro"
      provisioner "local-exec" {
        command = <<EOH
    curl -o jq https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64
    chmod 0755 jq
    # Do some kind of JSON processing with ./jq
    EOH
      }
    }
    ```

When downloading software with `local-exec`, try to associate the provisioner block with the resource(s) that the software will interact with. If you use a null resource with a `local-exec` provisioner, you must ensure it can be properly configured with [triggers](/docs/provisioners/null_resource.html#example-usage). Otherwise, a null resource with the `local-exec` provisioner will only install software on the initial run where the `null_resource` is created. The `null_resource` will not be automatically recreated in subsequent runs and the related software won't be installed, which may cause runs to encounter errors.

-> **Note:** Terraform Enterprise instances can sometimes allow `sudo` commands during Terraform runs. However, even when `sudo` is allowed, using the worker OS's package tools during runs is still usually a bad idea. You will have a much better experience if you can move your provisioner actions into a custom provider or an immutable machine image.
