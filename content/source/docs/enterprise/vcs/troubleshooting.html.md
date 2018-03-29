---
layout: enterprise2
page_title: "Troubleshooting - VCS Providers - Terraform Enterprise"
sidebar_current: "docs-enterprise2-vcs-troubleshooting"
---

# Troubleshooting VCS Integration in Terraform Enterprise

This page collects solutions to the most common problems our users encounter with VCS integration in Terraform Enterprise (TFE).

## Bitbucket Server

### Clicking "Connect organization <X>" with Bitbucket Server causes 500 error in Terraform Enterprise

Bitbucket Server uses OAuth 1 to authenticate the user to Bitbucket Server. The first step in the authentication process is for Terraform Enterprise (TFE) to call Bitbucket Server to obtain a "request token". After the call completes TFE will redirect you to Bitbucket Server with the request token.



The 500 error occurs when the call to Bitbucket Server to obtain the request token but the request is rejected. The request may be rejected for a number of reasons:

- The API endpoint is unreachable, this may happen if the address is incorrect or the domain name doesn't resolve.
- The cert used on Bitbucket Server is rejected by the TFE HTTP Client because the SSL verification fails. This is often the case with self-signed certificates or the server with TFE is not configured to trust the signing chain of the  Bitbucket Server SSL Cert.
- Bitbucket Server rejects the API request



To fix this issue, do the following:

- Verify that the docker instance running Terraform Enterprise can resolve the domain name and can reach Bitbucket Server.
- Verify that the TFE client accepts the HTTPS connection to Bitbucket Server. This can be done by perform a `curl` from the TFE docker instance to the Bitbucket Server; it should not return any SSL errors.
- Verify that the Consumer Key, Consumer Name, and the Public Key is configured properly in Bitbucket Server.
- Verify that the HTTP URL and API URL in TFE are configured correctly to the Bitbucket Server. This includes the proper scheme (HTTP vs HTTPS), as well as the port.
- Verify that the webhook URL is blank in the POST Receive Hooks Plugin



## Bitbucket Cloud

### Terraform Enterprise fails to obtain the list of repositories from Bitbucket Cloud.

This typically happens when the TFE application in Bitbucket Cloud wasn't configured to have the full set of permissions.



## GitHub

### Host key verification failed error in init when attempting to ingress Terraform modules via Git over SSH

The customer may be running Terraform 0.10.3 or 0.10.4, which had a bug in handling SSH submodule ingress. Encourage them to upgrade to the latest version or 0.10.8 (latest in the 0.10 series).

### Customer can't ingress Git submodules, auth errors during init

At the moment it's confusing to customers where they need to configure an SSH key to ingress Git submodules. This has to be done in the OAuth section and then "Include submodules on clone" selected. It's not done in the SSH keys list in the Org / Workspace settings SSH key selection (that's for TF modules). We've tried to make this more clear in the docs but it may still come up.

## General

### Terraform Enterprise returns 500 after authenticating with the VCS provider (other than Bitbucket Server)

The Callback URL in the OAuth application configuration in the VCS provider probably wasn't updated in the last step of the instructions and therefore points to the default "/" path instead of the full callback url.



### Customer can't delete a workspace or module, gets inscrutable 500 errors

This often happens when the VCS connection has been somehow broken, either revoked, reconfigured, or possibly had the repository removed, so make sure to ask if that might have happened if they don't mention it.



If that is the cause, this is a bug and should be treated as such; it's rarely possible for the customer to fix the issue themselves.



### [SaaS] redirect_uri_mismatch error on "Connect"

The domain name for Terraform Enterprise changed on 02/22 at 9AM from atlas.hashicorp.com to app.terraform.io. If a user has an OAuth application configured on the old domain (atlas.hashicorp.com) but tries to Connect now on the new domain, they may get this error after login when they get redirected to TFE. This is possible if a user created the app before the switch but didn't connect it until after (very unlikely). Or if they created the app before the switch, but then disconnected and tried to reconnect.



The fix is to update their OAuth Callback URL in the VCS provider to use app.terraform.io instead of atlas.hashicorp.com,