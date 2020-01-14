---
layout: "cloud"
page_title: "Installing Software in the Run Environment - Runs - Terraform Cloud"
---

# Installing Software in the Run Environment

Terraform relies on provider plugins to manage resources. In most cases, Terraform can automatically download the required plugins, but there are cases where plugins must be managed explicitly.

In rare cases, it might also be necessary to install extra software on the Terraform worker, such as a configuration management tool or cloud CLI.

## Installing Terraform Providers

### Providers Distributed by HashiCorp

Terraform Cloud runs `terraform init` before every plan or apply, which automatically downloads any [providers](/docs/configuration/providers.html) Terraform needs.

Terraform Enterprise instances can automatically install providers as long as they can access `releases.hashicorp.com`. If that isn't feasible due to security requirements, you can manually install providers. Use [the `terraform-bundle` tool][bundle] to build a custom version of Terraform that includes the necessary providers, and configure your workspaces to use that bundled version.

[bundle]: https://github.com/hashicorp/terraform/tree/master/tools/terraform-bundle#installing-a-bundle-in-on-premises-terraform-enterprise

### Custom and Community Providers

-> **Note:** We are investigating how to improve custom provider installation, so this information might change in the near future.

Terraform only automatically installs plugins from [the main list of providers](/docs/providers/index.html); to use community providers or your own custom providers, you must install them yourself.

Currently, there are two ways to use custom provider plugins with Terraform Cloud.

- Add the provider binary to the VCS repo (or manually-uploaded configuration version) for any workspace that uses it. Place the compiled `linux_amd64` version of the plugin at `terraform.d/plugins/linux_amd64/<PLUGIN NAME>` (as a relative path from the root of the working directory). The plugin name should follow the [naming scheme](/docs/configuration/providers.html#plugin-names-and-versions) and the plugin file must have read and execute permissions. (Third-party plugins are often distributed with an appropriate filename already set in the distribution archive.)

    You can add plugins directly to a configuration repo, or you can add them as Git submodules and symlink the files into `terraform.d/plugins/linux_amd64/`. Submodules are a good choice when many workspaces use the same custom provider, since they keep your repos smaller. If using submodules, enable the ["Include submodules on clone" setting](../workspaces/vcs.html#include-submodules-on-clone) on any affected workspace.

- **Terraform Enterprise only:** Use [the `terraform-bundle` tool][bundle] to add custom providers to a custom Terraform version. This keeps custom providers out of your configuration repos entirely, and is easier to update when many workspaces use the same provider.

## Installing Additional Tools

### Avoid Installing Extra Software

Whenever possible, don't install software on the worker. There are a number of reasons for this:

- Provisioners are a last resort in Terraform; they greatly increase the risk of creating unknown states with unmanaged and partially-managed infrastructure, and the `local-exec` provisioner is especially hazardous. [The Terraform CLI docs on provisioners](/docs/provisioners/index.html#provisioners-are-a-last-resort) explain the hazards in more detail, with more information about the preferred alternatives. (In summary: use Packer, use cloud-init, try to make your infrastructure more immutable, and always prefer real provider features.)
- We don't guarantee the stability of the operating system on the Terraform build workers. It's currently the latest version of Ubuntu LTS, but we reserve the right to change that at any time.
- The build workers are disposable and are destroyed after each use, which makes managing extra software even more complex than when running Terraform CLI in a persistent environment. Custom software must be installed on every run, which also increases run times.

### Only Install Standalone Binaries

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

-> **Note:** Terraform Enterprise instances can be configured to allow `sudo` commands during Terraform runs. However, even when `sudo` is allowed, using the worker OS's package tools during runs is still usually a bad idea. You will have a much better experience if you can move your provisioner actions into a custom provider or an immutable machine image.
