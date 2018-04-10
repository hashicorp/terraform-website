---
layout: enterprise2
page_title: "Troubleshooting - VCS Providers - Terraform Enterprise"
sidebar_current: "docs-enterprise2-vcs-troubleshooting"
---

# Troubleshooting VCS Integration in Terraform Enterprise

This page collects solutions to the most common problems our users encounter with VCS integration in Terraform Enterprise (TFE).

## Bitbucket Server

### Clicking "Connect organization `<X>`" with Bitbucket Server raises an error message in Terraform Enterprise

TFE uses OAuth 1 to authenticate the user to Bitbucket Server. The first step in the authentication process is for TFE to call Bitbucket Server to obtain a "request token". After the call completes TFE will redirect you to Bitbucket Server with the request token.

An error occurs when TFE calls to Bitbucket Server to obtain the request token but the request is rejected. Some common reasons for the request to be rejected are:

- The API endpoint is unreachable; this can happen if the address or port is incorrect or the domain name doesn't resolve.
- The certificate used on Bitbucket Server is rejected by the TFE HTTP client because the SSL verification fails. This is often the case with self-signed certificates or when the server with TFE is not configured to trust the signing chain of the Bitbucket Server SSL certificate.

To fix this issue, do the following:

- Verify that the instance running Terraform Enterprise can resolve the domain name and can reach Bitbucket Server.
- Verify that the TFE client accepts the HTTPS connection to Bitbucket Server. This can be done by performing a `curl` from the TFE instance to Bitbucket Server; it should not return any SSL errors.
- Verify that the Consumer Key, Consumer Name, and the Public Key are configured properly in Bitbucket Server.
- Verify that the HTTP URL and API URL in TFE are correct for your Bitbucket Server instance. This includes the proper scheme (HTTP vs HTTPS), as well as the port.

### Creating a workspace from a repository hangs indefinitely, displaying a spinner on the confirm button

If you were able to connect TFE to Bitbucket Server but cannot create workspaces, it often means TFE isn't able to automatically add webhook URLs for that repository.

To fix this issue:

- Make sure you haven't manually entered any webhook URLs for the affected repository or project. Although the Bitbucket Web Post Hooks Plugin documentation describes how to manually enter a hook URL, TFE handles this automatically. Manually entered URLs can sometimes interfere with TFE's operation.

    To check the hook URLs for a repository, go to the repository's settings, then go to the "Hooks" page (in the "Workflow" section) and click on the "Post-Receive WebHooks" link.

    Also note that some Bitbucket Server versions might allow you to set per-project or server-wide hook URLs in addition to per-repository hooks. These should all be empty; if you set a hook URL that might affect more than one repo when installing the plugin, go back and delete it.
- Make sure you aren't trying to connect too many workspaces to a single repository. Bitbucket Server's webhooks plugin can only attach five hooks to a given repo, and TFE can have problems if you exceed the limit. You might need to create additional repositories if you need to make more than five workspaces from a single configuration repo.

## Bitbucket Cloud

### Terraform Enterprise fails to obtain the list of repositories from Bitbucket Cloud.

This typically happens when the TFE application in Bitbucket Cloud wasn't configured to have the full set of permissions. Go to the OAuth section of the Bitbucket settings, find your TFE OAuth consumer, click the edit link in the "..." menu, and ensure it has the required permissions enabled:

Permission type | Permission level
----------------|-----------------
Account         | Write
Repositories    | Admin
Pull requests   | Write
Webhooks        | Read and write

## GitHub

### "Host key verification failed" error in `terraform init` when attempting to ingress Terraform modules via Git over SSH

This is most common when running Terraform 0.10.3 or 0.10.4, which had a bug in handling SSH submodule ingress. Try upgrading affected TFE workspaces to the latest Terraform version or 0.10.8 (the latest in the 0.10 series).

### TFE can't ingress Git submodules, with auth errors during init

This usually happens when an SSH key isn't associated with the VCS provider's OAuth client.

- Go to your organization's "VCS Provider" settings page and check your GitHub client. If it still says "You can add a private SSH key to this connection to be used for git clone operations" (instead of "A private SSH key has been added..."), you need to click the "add a private SSH key" link and add a key.
- Check the settings page for affected workspaces and ensure that "Include submodules on clone" is enabled.

Note that the "SSH Key" section in a workspace's settings is only used for mid-run operations like cloning Terraform modules. It isn't used when cloning the linked repository before a run.

## General

### Terraform Enterprise returns 500 after authenticating with the VCS provider (other than Bitbucket Server)

The Callback URL in the OAuth application configuration in the VCS provider probably wasn't updated in the last step of the instructions and still points to the default "/" path (or an example.com link) instead of the full callback url.

The fix is to update the callback URL in your VCS provider's application settings. You can look up the real callback URL in TFE's settings.

### Can't delete a workspace or module, resulting in 500 errors

This often happens when the VCS connection has been somehow broken: it might have had permissions revoked, been reconfigured, or had the repository removed. Check for these possibilities and contact HashiCorp support for further assistance, including any information you collected in your support ticket.

### On TFE's SaaS version: `redirect_uri_mismatch` error on "Connect"

The domain name for Terraform Enterprise changed on 02/22 at 9AM from atlas.hashicorp.com to app.terraform.io. If the OAuth client was originally configured on the old domain, using it for a new VCS connection can result in this error.

The fix is to update the OAuth Callback URL in your VCS provider to use app.terraform.io instead of atlas.hashicorp.com.
