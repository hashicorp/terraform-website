---
layout: "extend"
page_title: "Home - Extending Terraform"
sidebar_current: "docs-extend-how-terraform-works"
description: |-
  Extending Terraform is a section for content dedicated to developing Plugins
  to extend Terraform's core offering.
---


# How Terraform Works

Terraform is a tool for building, changing, and versioning infrastructure safely
and efficiently. Terraform is built on a plugin-based architecture, enabling
developers to extend Terraform by writing new plugins or compiling modified
versions of existing plugins.

Terraform is logically split into two main parts: **Terraform Core** and
**Terraform Plugins**. Terraform Core uses remote procedure calls (RPC) to
communicate with Terraform Plugins, and offers multiple ways to discover and
load plugins to use.  Terraform Plugins expose an implementation for a specific
service, such as AWS, or provisioner, such as bash.

## Terraform Core

Terraform Core is a [statically-compiled binary][0] written in the [Go
programming language][1]. The compiled binary is the command line tool (CLI)
`terraform`, the entrypoint for anyone using Terraform. The code is open source
and hosted at github.com/hashicorp/terraform.

### The primary responsibilities of Terraform Core are:

- Infrastructure as code: reading and interpolating configuration files and
modules
- Resource state management
- Construction of the [Resource Graph](/docs/internals/graph.html)
- Plan execution
- Communication with plugins over RPC


## Terraform Plugins

Terraform Plugins are written in Go and are executable binaries invoked by
Terraform Core over RPC. Each plugin exposes an implementation for a specific
service, such as AWS, or provisioner, such as bash. All Providers and
Provisioners used in Terraform configurations are plugins. They are executed as
a separate process and communicate with the main Terraform binary over an RPC
interface. Terraform has several Provisioners built-in, while Providers are
discovered dynamically as needed (See **Discovery** below). Terraform Core provides
a high-level framework that abstracts away the details of plugin discovery and
RPC communication so developers do not need to manage either.

Terraform Plugins are responsible for the domain specific implementation of
their type.

### The primary responsibilities of Provider Plugins are:

- Initialization of any included libraries used to make API calls
- Authentication with the Infrastructure Provider
- Define Resources that map to specific Services

### The primary responsibilities of Provisioner Plugins are:

- Executing commands or scripts on the designated Resource after creation, or on
destruction.

## Discovery

~> **Advanced topic:** This section describes Terraform's plugin discovery
behavior at the level of detail a plugin developer might need. For instructions
suited to normal Terraform use, see [Configuring Providers](/docs/configuration/providers.html).

When `terraform init` is run, Terraform reads configuration files in the working
directory to determine which plugins are necessary, searches for installed
plugins in several locations, sometimes downloads additional plugins, decides
which plugin versions to use, and writes a lock file to ensure Terraform will
use the same plugin versions in this directory until `terraform init` runs
again.

For purposes of discovery, Terraform plugins behave in one of three ways:

Kind                                   | Behavior
---------------------------------------|------------------------------------------------
Built-in provisioners                  | Always available; included in Terraform binary.
Providers distributed by HashiCorp     | Automatically downloaded if not already installed.
Third-party providers and provisioners | Must be manually installed.

### Plugin Locations

-> **Note:** Third-party plugins should usually be installed in the user
plugins directory, which is located at `~/.terraform.d/plugins` on most
operating systems and `%APPDATA%\terraform.d\plugins` on Windows.

By default, `terraform init` searches the following directories for plugins.
Some of these directories are static, and some are relative to the current
working directory.

Directory                                                                           | Purpose
------------------------------------------------------------------------------------|------------
`.`                                                                                 | For convenience during plugin development.
Location of the `terraform` binary (`/usr/local/bin`, for example.)                 | For airgapped installations; see [`terraform bundle`][bundle].
`terraform.d/plugins/<OS>_<ARCH>`                                                   | For checking custom providers into a configuration's VCS repository. Not usually desirable, but sometimes necessary in Terraform Enterprise.
`.terraform/plugins/<OS>_<ARCH>`                                                    | Automatically downloaded providers.
`~/.terraform.d/plugins` or `%APPDATA%\terraform.d\plugins`                         | The user plugins directory.
`~/.terraform.d/plugins/<OS>_<ARCH>` or `%APPDATA%\terraform.d\plugins\<OS>_<ARCH>` | The user plugins directory, with explicit OS and architecture.

-> **Note:** `<OS>` and `<ARCH>` use the Go language's standard OS and
architecture names; for example, `darwin_amd64`.

If `terraform init` is run with the `-plugin-dir=<PATH>` option (with a
non-empty `<PATH>`), it overrides the default plugin locations and searches
only the specified path.

Provider and provisioner plugins can be installed in the same directories.
Provider plugin binaries are named with the scheme `terraform-provider-<NAME>_vX.Y.Z`,
while provisioner plugins use the scheme `terraform-provisioner-<NAME>_vX.Y.Z`.
Terraform relies on filenames to determine plugin types, names, and versions.

[bundle]: https://github.com/hashicorp/terraform/tree/master/tools/terraform-bundle

### Selecting Plugins

After locating any installed plugins, `terraform init` compares them to the
configuration's [version constraints](/docs/configuration/providers.html#provider-versions)
and chooses a version for each plugin as follows:

- If any acceptable versions are installed, Terraform uses the newest
  _installed_ version that meets the constraint (even if releases.hashicorp.com
  has a newer acceptable version).
- If no acceptable versions are installed and the plugin is one of the
  [providers distributed by HashiCorp](/docs/providers/index.html),
  Terraform downloads the newest acceptable version from
  releases.hashicorp.com and saves it in `.terraform/plugins/<OS>_<ARCH>`.

    - This step is skipped if `terraform init` is run with the
      `-plugin-dir=<PATH>` or `-get-plugins=false` options.
- If no acceptable versions are installed and the plugin is not distributed
  by HashiCorp, initialization fails and the user must manually install an
  appropriate version.

### Upgrading Plugins

When `terraform init` is run with the `-upgrade` option, it re-checks
releases.hashicorp.com for newer acceptable provider versions and downloads them
if available.

This behavior only applies to providers whose _only_ acceptable versions are in
`.terraform/plugins/<OS>_<ARCH>` (the automatic downloads directory); if any
acceptable version of a given provider is installed elsewhere,
`terraform init -upgrade` will not download a newer version of it.

[0]: https://en.wikipedia.org/wiki/Static_build#Static_building
[1]: https://golang.org/
