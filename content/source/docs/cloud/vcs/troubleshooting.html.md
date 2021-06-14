---
layout: "cloud"
page_title: "Troubleshooting - VCS Providers - Terraform Cloud and Terraform Enterprise"
---

# Troubleshooting VCS Integration in Terraform Cloud

This page collects solutions to the most common problems our users encounter with VCS integration in Terraform Cloud.

## Bitbucket Server

### Clicking "Connect organization `<X>`" with Bitbucket Server raises an error message in Terraform Cloud

Terraform Cloud uses OAuth 1 to authenticate the user to Bitbucket Server. The first step in the authentication process is for Terraform Cloud to call Bitbucket Server to obtain a "request token". After the call completes, Terraform Cloud redirects you to Bitbucket Server with the request token.

An error occurs when Terraform Cloud calls to Bitbucket Server to obtain the request token but the request is rejected. Some common reasons for the request to be rejected are:

- The API endpoint is unreachable; this can happen if the address or port is incorrect or the domain name doesn't resolve.
- The certificate used on Bitbucket Server is rejected by the Terraform Cloud HTTP client because the SSL verification fails. This is often the case with self-signed certificates or when the Terraform Enterprise instance is not configured to trust the signing chain of the Bitbucket Server SSL certificate.

To fix this issue, do the following:

- Verify that the instance running Terraform Enterprise can resolve the domain name and can reach Bitbucket Server.
- Verify that the Terraform Cloud client accepts the HTTPS connection to Bitbucket Server. This can be done by performing a `curl` from the Terraform Enterprise instance to Bitbucket Server; it should not return any SSL errors.
- Verify that the Consumer Key, Consumer Name, and the Public Key are configured properly in Bitbucket Server.
- Verify that the HTTP URL and API URL in Terraform Cloud are correct for your Bitbucket Server instance. This includes the proper scheme (HTTP vs HTTPS), as well as the port.

### Creating a workspace from a repository hangs indefinitely, displaying a spinner on the confirm button

If you were able to connect Terraform Cloud to Bitbucket Server but cannot create workspaces, it often means Terraform Cloud isn't able to automatically add webhook URLs for that repository.

To fix this issue:

- Make sure you haven't manually entered any webhook URLs for the affected repository or project. Although the Bitbucket Web Post Hooks Plugin documentation describes how to manually enter a hook URL, Terraform Cloud handles this automatically. Manually entered URLs can interfere with Terraform Cloud's operation.

    To check the hook URLs for a repository, go to the repository's settings, then go to the "Hooks" page (in the "Workflow" section) and click on the "Post-Receive WebHooks" link.

    Also note that some Bitbucket Server versions might allow you to set per-project or server-wide hook URLs in addition to per-repository hooks. These should all be empty; if you set a hook URL that might affect more than one repo when installing the plugin, go back and delete it.
- Make sure you aren't trying to connect too many workspaces to a single repository. Bitbucket Server's webhooks plugin can only attach five hooks to a given repo. You might need to create additional repositories if you need to make more than five workspaces from a single configuration repo.

## Bitbucket Cloud

### Terraform Cloud fails to obtain the list of repositories from Bitbucket Cloud.

This typically happens when the Terraform Cloud application in Bitbucket Cloud wasn't configured to have the full set of permissions. Go to the OAuth section of the Bitbucket settings, find your Terraform Cloud OAuth consumer, click the edit link in the "..." menu, and ensure it has the required permissions enabled:

Permission type | Permission level
----------------|-----------------
Account         | Write
Repositories    | Admin
Pull requests   | Write
Webhooks        | Read and write

## GitHub

### "Host key verification failed" error in `terraform init` when attempting to ingress Terraform modules via Git over SSH

This is most common when running Terraform 0.10.3 or 0.10.4, which had a bug in handling SSH submodule ingress. Try upgrading affected Terraform Cloud workspaces to the latest Terraform version or 0.10.8 (the latest in the 0.10 series).

### Terraform Cloud can't ingress Git submodules, with auth errors during init

This usually happens when an SSH key isn't associated with the VCS provider's OAuth client.

- Go to your organization's "VCS Provider" settings page and check your GitHub client. If it still says "You can add a private SSH key to this connection to be used for git clone operations" (instead of "A private SSH key has been added..."), you need to click the "add a private SSH key" link and add a key.
- Check the settings page for affected workspaces and ensure that "Include submodules on clone" is enabled.

Note that the "SSH Key" section in a workspace's settings is only used for mid-run operations like cloning Terraform modules. It isn't used when cloning the linked repository before a run.

## General

### Terraform Cloud returns 500 after authenticating with the VCS provider (other than Bitbucket Server)

The Callback URL in the OAuth application configuration in the VCS provider probably wasn't updated in the last step of the instructions and still points to the default "/" path (or an example.com link) instead of the full callback url.

The fix is to update the callback URL in your VCS provider's application settings. You can look up the real callback URL in Terraform Cloud's settings.

### Can't delete a workspace or module, resulting in 500 errors

This often happens when the VCS connection has been somehow broken: it might have had permissions revoked, been reconfigured, or had the repository removed. Check for these possibilities and contact HashiCorp support for further assistance, including any information you collected in your support ticket.

### `redirect_uri_mismatch` error on "Connect"

The domain name for Terraform Cloud's SaaS release changed on 02/22 at 9AM from atlas.hashicorp.com to app.terraform.io. If the OAuth client was originally configured on the old domain, using it for a new VCS connection can result in this error.

The fix is to update the OAuth Callback URL in your VCS provider to use app.terraform.io instead of atlas.hashicorp.com.

### Changing the URL for a VCS provider

On rare occasions, you might need Terraform Cloud to change the URL it uses to reach your VCS provider. This usually only happens if you move your VCS server or the VCS vendor changes their supported API versions.

Terraform Cloud does not allow you to change the API URL for an existing VCS connection, but you can create a new VCS connection and update existing resources to use it. This is most efficient if you script the necessary updates using Terraform Cloud's API. In brief:

1. [Configure a new VCS connection](./index.html) with the updated URL.
1. Obtain the [oauth-token IDs](../api/oauth-tokens.html) for the old and new OAuth clients.
1. [List all workspaces](../api/workspaces.html#list-workspaces) (dealing with pagination if necessary), and use a JSON filtering tool like `jq` to make a list of all workspace IDs whose `attributes.vcs-repo.oauth-token-id` matches the old VCS connection.
1. Iterate over the list of workspaces and [PATCH each one](../api/workspaces.html#update-a-workspace) to use the new `oauth-token-id`.
1. [List all registry modules](../../registry/api.html#list-modules) and use their `source` property to determine which ones came from the old VCS connection.
1. [Delete each affected module](../api/modules.html#delete-a-module), then [create a new module](../api/modules.html#publish-a-private-module-from-a-vcs) from the new connection's version of the relevant repo.
1. Delete the old VCS connection.

## Certificate Errors on Terraform Enterprise

When debugging failures of VCS connections due to certifcate errors, running additional diagnostics using the OpenSSL command may provide more information about the failure.

First, attach a bash session to the application container:

```
docker exec -it ptfe_atlas sh -c "stty rows 50 && stty cols 150 && bash"
```

Then run the `openssl s_client` command, using the certificate at `/tmp/cust-ca-certificates.crt` in the container:

```
openssl s_client -showcerts -CAfile /tmp/cust-ca-certificates.crt -connect git-server-hostname:443
```

For example, a Gitlab server that uses a self-signed certificate might result in an error like `verify error:num=18:self signed certificate`, as shown in the output below:

```
bash-4.3# openssl s_client -showcerts -CAfile /tmp/cust-ca-certificates.crt -connect gitlab.local:443
CONNECTED(00000003)
depth=0 CN = gitlab.local
verify error:num=18:self signed certificate
verify return:1
depth=0 CN = gitlab.local
verify return:1
---
Certificate chain
 0 s:/CN=gitlab.local
   i:/CN=gitlab.local
-----BEGIN CERTIFICATE-----
MIIC/DCCAeSgAwIBAgIJAIhG2GWtcj7lMA0GCSqGSIb3DQEBCwUAMCAxHjAcBgNV
BAMMFWdpdGxhYi1sb2NhbC5oYXNoaS5jbzAeFw0xODA2MDQyMjAwMDhaFw0xOTA2
MDQyMjAwMDhaMCAxHjAcBgNVBAMMFWdpdGxhYi1sb2NhbC5oYXNoaS5jbzCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMMgrpo3zsoy2BP/AoGIgrYwEMnj
PwSOFGNHbclmiVBCW9jvrZrtva8Qh+twU7CSQdkeSP34ZgLrRp1msmLvUuVMgPts
i7isrI5hug/IHLLOGO5xMvxOcrHknvySYJRmvYFriEBPNRPYJGJ9O1ZUVUYeNwW/
l9eegBDpJrdsjGmFKCOzZEdUA3zu7PfNgf788uIi4UkVXZNa/OFHsZi63OYyfOc2
Zm0/vRKOn17dewOOesHhw77yYbBH8OFsEiC10JCe5y3MD9yrhV1h9Z4niK8rHPXz
XEh3JfV+BBArodmDbvi4UtT+IGdDueUllXv7kbwqvQ67OFmmek0GZOY7ZvMCAwEA
AaM5MDcwIAYDVR0RBBkwF4IVZ2l0bGFiLWxvY2FsLmhhc2hpLmNvMBMGA1UdJQQM
MAoGCCsGAQUFBwMBMA0GCSqGSIb3DQEBCwUAA4IBAQCfkukNV/9vCA/8qoEbPt1M
mvf2FHyUD69p/Gq/04IhGty3sno4eVcwWEc5EvfNt8vv1FykFQ6zMJuWA0jL9x2s
LbC8yuRDnsAlukSBvyazCZ9pt3qseGOLskaVCeOqG3b+hJqikZihFUD95IvWNFQs
RpvGvnA/AH2Lqqeyk2ITtLYj1AcSB1hBSnG/0fdtao9zs0JQsrS59CD1lbbTPPRN
orbKtVTWF2JlJxl2watfCNTw6nTCPI+51CYd687T3MuRN7LsTgglzP4xazuNjbWB
QGAiQRd6aKj+xAJnqjzXt9wl6a493m8aNkyWrxZGHfIA1W70RtMqIC/554flZ4ia
-----END CERTIFICATE-----
---
Server certificate
subject=/CN=gitlab.local
issuer=/CN=gitlab.local
---
No client certificate CA names sent
Peer signing digest: SHA512
Server Temp Key: ECDH, P-256, 256 bits
---
SSL handshake has read 1443 bytes and written 433 bytes
---
New, TLSv1/SSLv3, Cipher is ECDHE-RSA-AES256-GCM-SHA384
Server public key is 2048 bit
Secure Renegotiation IS supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
SSL-Session:
    Protocol  : TLSv1.2
    Cipher    : ECDHE-RSA-AES256-GCM-SHA384
    Session-ID: AF5286FB7C7725D377B4A5F556DEB6DDC38B302153DDAE90C552ACB5DC4D86B8
    Session-ID-ctx:
    Master-Key: DB75AEC12C6E7B62246C653C8CB8FC3B90DE86886D68CB09898A6A6F5D539007F7760BC25EC4563A893D34ABCFAAC28A
    Key-Arg   : None
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - 03 c1 35 c4 ff 6d 24 a8-6c 70 61 fb 2c dc 2e b8   ..5..m$.lpa.,...
    0010 - de 4c 6d b0 2c 13 8e b6-63 95 18 ee 4d 33 a6 dc   .Lm.,...c...M3..
    0020 - 0d 64 24 f0 8d 3f 9c aa-b8 a4 e2 4f d3 c3 4d 88   .d$..?.....O..M.
    0030 - 58 99 10 73 83 93 70 4a-2c 61 e7 2d 41 74 d3 e9   X..s..pJ,a.-At..
    0040 - 83 8c 4a 7f ae 7b e8 56-5c 51 fc 6f fe e3 a0 ec   ..J..{.V\Q.o....
    0050 - 3c 2b 6b 13 fc a0 e5 15-a8 31 16 19 11 98 56 43   <+k......1....VC
    0060 - 16 86 c4 cd 53 e6 c3 61-e2 6c 1b 99 86 f5 a8 bd   ....S..a.l......
    0070 - 3c 49 c0 0a ce 81 a9 33-9b 95 2c e1 f4 6d 05 1e   <I.....3..,..m..
    0080 - 18 fa bf 2e f2 27 cc 0b-df 08 13 7e 4d 5a c8 41   .....'.....~MZ.A
    0090 - 93 26 23 90 f1 bb ba 3a-15 17 1b 09 6a 14 a8 47   .&#....:....j..G
    00a0 - 61 eb d9 91 0a 5c 4d e0-4a 8f 4d 50 ab 4b 81 aa   a....\M.J.MP.K..

    Start Time: 1528152434
    Timeout   : 300 (sec)
    Verify return code: 18 (self signed certificate)
---
closed
```
