---
layout: enterprise2
page_title: "Troubleshooting - VCS Providers - Terraform Enterprise"
sidebar_current: "docs-enterprise2-vcs-troubleshooting"
---

# Troubleshooting VCS Integration in Terraform Enterprise

This page collects solutions to the most common problems our users encounter with VCS integration in Terraform Enterprise (TFE).

## Bitbucket Server

### Clicking "Connect organization `<X>`" with Bitbucket Server causes 500 error in Terraform Enterprise

TFE uses OAuth 1 to authenticate the user to Bitbucket Server. The first step in the authentication process is for TFE to call Bitbucket Server to obtain a "request token". After the call completes TFE will redirect you to Bitbucket Server with the request token.

The 500 error occurs when TFE calls to Bitbucket Server to obtain the request token but the request is rejected. The request might be rejected for a number of reasons:

- The API endpoint is unreachable; this can happen if the address or port is incorrect or the domain name doesn't resolve.
- The cert used on Bitbucket Server is rejected by the TFE HTTP client because the SSL verification fails. This is often the case with self-signed certificates or when the server with TFE is not configured to trust the signing chain of the Bitbucket Server SSL Cert.
- Bitbucket Server rejects the API request.

To fix this issue, do the following:

- Verify that the Docker instance running Terraform Enterprise can resolve the domain name and can reach Bitbucket Server.
- Verify that the TFE client accepts the HTTPS connection to Bitbucket Server. This can be done by performing a `curl` from the TFE docker instance to Bitbucket Server; it should not return any SSL errors.
- Verify that the Consumer Key, Consumer Name, and the Public Key is configured properly in Bitbucket Server.
- Verify that the HTTP URL and API URL in TFE are correct for your Bitbucket Server instance. This includes the proper scheme (HTTP vs HTTPS), as well as the port.
- Verify that the webhook URL is blank in Bitbucket Server's POST Receive Hooks Plugin

## Bitbucket Cloud

### Terraform Enterprise fails to obtain the list of repositories from Bitbucket Cloud.

This typically happens when the TFE application in Bitbucket Cloud wasn't configured to have the full set of permissions.

## GitHub

### "Host key verification failed"" error in `terraform init` when attempting to ingress Terraform modules via Git over SSH

This is most common when running Terraform 0.10.3 or 0.10.4, which had a bug in handling SSH submodule ingress. Try upgrading affected TFE workspaces to the latest Terraform version or 0.10.8 (the latest in the 0.10 series).

### TFE can't ingress Git submodules, with auth errors during init

This usually happens when an SSH key isn't associated with the VCS provider's OAuth client.

- Go to your organization's "OAuth Configuration" settings page and check your GitHub client. If it still says "You can add a private SSH key to this connection to be used for git clone operations" (instead of "A private SSH key has been added..."), you need to click the "add a private SSH key" link and add a key.
- Check the settings page for affected workspaces and ensure that "Include submodules on clone" is enabled.

Note that the "SSH Key" section in a workspace's settings is only used for mid-run operations like cloning Terraform modules. It isn't used when cloning the configuration repo before a run.

## General

### Terraform Enterprise returns 500 after authenticating with the VCS provider (other than Bitbucket Server)

The Callback URL in the OAuth application configuration in the VCS provider probably wasn't updated in the last step of the instructions and still points to the default "/" path (or an example.com link) instead of the full callback url.

### Can't delete a workspace or module, with inscrutable 500 errors

This often happens when the VCS connection has been somehow broken: it might have had permissions revoked, been reconfigured, or had the repository removed. Check for all three possibilities, take notes on what you find, and then contact HashiCorp support for further assistance.

### On TFE's SaaS version: `redirect_uri_mismatch` error on "Connect"

The domain name for Terraform Enterprise changed on 02/22 at 9AM from atlas.hashicorp.com to app.terraform.io. If you have an OAuth application configured on the old domain (atlas.hashicorp.com) but tries to Connect now on the new domain, you can get this error after login when you get redirected to TFE. This is possible if you created the app before the switch but didn't connect it until after (very uncommon) or if you created the app before the switch, but then disconnected and tried to reconnect.

The fix is to update the OAuth Callback URL in your VCS provider to use app.terraform.io instead of atlas.hashicorp.com.
