---
layout: "enterprise2"
page_title: "SSH Keys for Cloning Modules - Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-workspaces-ssh-keys"
---

# Using SSH Keys for Cloning Modules

Terraform configurations can pull in modules from [a variety of different sources](/docs/modules/sources.html), and private Git repositories are the most common source for private modules.

To access a private Git repository, Terraform either needs login credentials (for HTTPS access) or an SSH key. Terraform Enterprise (TFE) can store private SSH keys centrally, and you can easily use them in any workspace that clones modules from a Git server.

~> **Note:** SSH keys for cloning modules from Git repos are only used during Terraform runs. They are managed separately from any [keys used for bringing VCS content into TFE.](../vcs/index.html#ssh-keys)

TFE manages SSH keys at the organization level, and you can add or delete keys via your organization's settings. Once a key is uploaded, the text of the key is not displayed to users.

To assign a key to a workspace, go to its settings and choose a previously added key from a drop-down menu. Each workspace can only use one SSH key.

## Adding and Deleting Keys

To add or delete an SSH private key, use the main menu to go to your organization's settings and choose "Manage SSH Keys" from the navigation sidebar. This page has a form for adding new keys and a list of existing keys.

![TFE screenshot: the manage SSH keys page](./images/keys-manage.png)

To add a key:

1. Obtain an SSH keypair that TFE can use to download modules during a Terraform run. You might already have an appropriate key; if not, create one on a secure workstation and distribute the public key to your VCS provider(s).

    The exact command to create a keypair depends on your OS, but is usually something like `ssh-keygen -t rsa -f "/Users/<NAME>/.ssh/service_tfe" -C "service_terraform_enterprise"`. This creates a `service_tfe` file with the private key, and a `service_tfe.pub` file with the public key.
2. Enter a name for the key in the "Name" field. Choose something identifiable, since the name is the only way to tell two SSH keys apart once the key text is hidden.
3. Paste the text of the **private key** in the "Private SSH Key" field.
4. Click the "Add Private SSH Key" button.

After the key is saved, it will appear below in the list of keys. Keys are only listed by name; TFE retains the text of the private key, but will never again display it for any purpose.

To delete a key, find it in the list of keys and click its "Delete" button. Before deleting a key, you should assign a new key to any workspaces that are using it.

~> **Important:** If any workspaces are still using a key when you delete it, they will be unable to clone modules from private repos until you assign them a new key. This might cause Terraform runs to fail.

## Assigning Keys to Workspaces

To assign a key to a workspace, navigate to that workspace's page and click the "Integrations" link.

![TFE screenshot: the integrations link on a workspace's page](./images/keys-integrations.png)

Scroll down and locate the "SSH Key" dropdown menu. Select a named key from the list in this dropdown, then click the "Update VCS Settings" button at the bottom of the page.

![TFE screenshot: the SSH key dropdown menu](./images/keys-dropdown.png)

In subsequent runs, TFE will use the selected SSH key in this workspace when cloning modules from Git.
