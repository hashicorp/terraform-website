---
layout: "cloud"
page_title: "SSH Keys for Cloning Modules - Workspaces - Terraform Cloud"
---

# Using SSH Keys for Cloning Modules

Terraform configurations can pull in Terraform modules from [a variety of different sources](/docs/modules/sources.html), and private Git repositories are a common source for private modules.

-> **Note:** The [private module registry](../registry/index.html) is an easier way to manage private Terraform modules in Terraform Cloud, and doesn't require setting SSH keys for workspaces. The rest of this page only applies to configurations that fetch modules directly from a private Git repository.

To access a private Git repository, Terraform either needs login credentials (for HTTPS access) or an SSH key. Terraform Cloud can store private SSH keys centrally, and you can easily use them in any workspace that clones modules from a Git server.

-> **Note:** SSH keys for cloning Terraform modules from Git repos are only used during Terraform runs. They are managed separately from any [keys used for bringing VCS content into Terraform Cloud](../vcs/index.html#ssh-keys).

Terraform Cloud manages SSH keys used to clone Terraform modules at the organization level, and allows multiple keys to be added for the organization. You can add or delete keys via the organization's settings. Once a key is uploaded, the text of the key is not displayed to users.

To assign a key to a workspace, go to its settings and choose a previously added key from the drop-down menu on Integrations under "SSH Key". Each workspace can only use one SSH key.

## Adding and Deleting Keys

-> **API:** See the [SSH Keys API](../api/ssh-keys.html). <br/>
**Terraform:** See the `tfe` provider's [`tfe_ssh_key` resource](/docs/providers/tfe/r/ssh_key.html).

To add or delete an SSH private key, use the main menu to go to your organization's settings and choose "Manage SSH Keys" from the navigation sidebar. This page has a form for adding new keys and a list of existing keys.

![Terraform Cloud screenshot: the manage SSH keys page](./images/keys-manage.png)

To add a key:

1. Obtain an SSH keypair that Terraform Cloud can use to download modules during a Terraform run. You might already have an appropriate key; if not, create one on a secure workstation and distribute the public key to your VCS provider(s). Do not use or generate a key that has a passphrase; Git is running non-interactively and won't be able to prompt for it.

-> **Note:** The exact command to create a keypair depends on your OS, but is usually something like `ssh-keygen -t rsa -f ~/.ssh/service_terraform -C "service_terraform_enterprise"`. MacOS systems output SSH2 formats by default, so you will need to add `-m PEM` to the prior command to output the PEM format. You can tell by the header of your private key, it should be `-----BEGIN RSA PRIVATE KEY-----`. This creates a `service_terraform` file with the private key, and a `service_terraform.pub` file with the public key.

2. Enter a name for the key in the "Name" field. Choose something identifiable, since the name is the only way to tell two SSH keys apart once the key text is hidden.
3. Paste the text of the **private key** in the "Private SSH Key" field.
4. Click the "Add Private SSH Key" button.

After the key is saved, it will appear below in the list of keys. Keys are only listed by name; Terraform Cloud retains the text of the private key, but will never again display it for any purpose.

To delete a key, find it in the list of keys and click its "Delete" button. Before deleting a key, you should assign a new key to any workspaces that are using it.

~> **Important:** If any workspaces are still using a key when you delete it, they will be unable to clone modules from private repos until you assign them a new key. This might cause Terraform runs to fail.

## Assigning Keys to Workspaces

-> **API:** See the [Assign an SSH Key to a Workspace endpoint](../api/workspaces.html#assign-an-ssh-key-to-a-workspace).

To assign a key to a workspace, navigate to that workspace's page and choose "SSH Key" from the "Settings" menu.

![Terraform Cloud screenshot: the settings menu on a workspace's page](./images/settings-tabs.png)

Select a named key from the "SSH Key" dropdown menu, then click the "Update SSH key" button.

![Terraform Cloud screenshot: the SSH key dropdown menu](./images/keys-dropdown.png)

In subsequent runs, Terraform Cloud will use the selected SSH key in this workspace when cloning modules from Git.
