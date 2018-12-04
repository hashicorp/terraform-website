---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Diagnostics"
sidebar_current: "docs-enterprise2-private-diagnostics"
---

# Private Terraform Enterprise Diagnostics

This document contains information on how to provide HashiCorp with diagnostic information about a Private Terraform Enterprise (PTFE) installation that requires assistance from HashiCorp support.

## Installer-based Instances

Diagnostic information is available via in the Installer dashboard on port 8800 of your installation.

On the dashboard, click on the Support tab:

![PTFE Dashboard Top](./assets/ptfe-dashboard.png)

On the next page, click the _Download Support Bundle_ button which will download the support bundle directly to your web browser.

![PTFE Support](./assets/ptfe-support.png)

Then, attach the bundle to your support ticket. If possible, use the SendSafely integration (as it allows for large file uploads).

### Scrubbing Sensitive Information

Installer-based support bundles contain high level information about the configuration of your instance. This could include items such as repository names, branch names, and VCS hostnames. If these items are extremely sensitive, you may opt to omit these from the support bundle. However, this may impede our efforts to diagnose any problems you are encountering. The following directories may contain sensitive information:

* `/atlas/admin-settings` - Configuration details for SAML, SMTP, and other integrations
* `/atlas/vcs-settings` - Configuration for VCS providers, the workspaces they're associated with and repository names.
* `/system/journald` - Recent system logs from journald.
* `/system/root-ca` - Root CA bundle on the host system.

To create a custom support bundle, extract the file you downloaded above and remove any directories that may be sensitive. You can then re-compress the archive and send the support bundle to us as outlined above. Please note in your support ticket how the bundle has been modified so we can account for the information's absense.

## AMI-based installs

!> **Deprecation warning**: The AMI will no longer be actively developed as of 201808-1 and will be fully decommissioned on November 30, 2018. Please see our [Migration Guide](./migrate.html) for instructions to migrate to the new Private Terraform Enterprise Installer.

To generate a support bundle, connect to the instance via ssh and run `sudo hashicorp-support`. Below is a sample session:

```
local$ ssh -i ~/.ssh/hc-eng-emp.pem tfe-admin@1.2.3.4
Last login: Thu Mar 29 14:39:14 2018 from 5.6.7.8

             H        H
          HHHH        HHH
      HHHHHHHH        HHHHH
   HHHHHHHHHH         HHHHH   H
 HHHHHHHHH            HHHHH   HHH
 HHHHHH      H        HHHHH   HHHHH   _  _         _    _  ___
 HHHHH     HHH        HHHHH   HHHHH  | || |__ _ __| |_ (_)/ __|___ _ _ _ __
 HHHHH   HHHHH        HHHHH   HHHHH  | __ / _` (_-< ' \| | (__/ _ \ '_| '_ \
 HHHHH   HHHHH        HHHHH   HHHHH  |_||_\__,_/__/_||_|_|\___\___/_| | .__/
 HHHHH   HHHHHHHHHHHHHHHHHH   HHHHH                                   |_|
 HHHHH   HHHHHHHHHHHHHHHHHH   HHHHH
 HHHHH   HHHHHHHHHHHHHHHHHH   HHHHH      TFE Hostname: tfe.mycompany.com
 HHHHH   HHHHH        HHHHH   HHHHH            Region: us-west-2
 HHHHH   HHHHH        HHH     HHHHH        IP Address: 4.3.2.1
 HHHHH   HHHHH        H      HHHHHH              User: tfe-admin
   HHH   HHHHH            HHHHHHHHH
     H   HHHHH          HHHHHHHHH        Distribution: Ubuntu 16.04
         HHHHH        HHHHHHHH                 Kernel: 4.4.0-98-generic
           HHH        HHHH
             H        H

      Memory Usage:     11.5%           System Uptime:  62 days
        Usage On /:     6%                 Swap Usage:  1.3%
       Local Users:     2                   Processes:  762
       System Load:     0.14, 0.26, 0.30

tfe.mycompany.com:~$ sudo hashicorp-support
==> Creating HashiCorp Support Bundle in /var/lib/hashicorp-support
==> Wrote support tarball to /var/lib/hashicorp-support/hashicorp-support.tar.gz
gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: PGP
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: next trustdb check due at 2019-04-14
==> Wrote encrypted support tarball to /var/lib/hashicorp-support/hashicorp-support.tar.gz.enc
Please send your support bundle to HashiCorp support.

tfe.mycompany.com:~$ ls -F /var/lib/hashicorp-support/
gnupg/  hashicorp-support.tar.gz  hashicorp-support.tar.gz.enc
```

For your privacy and security, the entire contents of the support bundle are encrypted with a 2048
bit RSA key to generate the `tar.gz.enc` file. Once the process is complete, copy the `hashicorp-support.tar.gz.enc` file listed above off the instance. This can be done via scp or another tool that can interface with the system over SSH/SFTP. For example, on Linux and Mac OS X:

```
local$ scp -i ~/.ssh/hc-eng-emp.pem tfe-admin@1.2.3.4:/var/lib/hashicorp-support/hashicorp-support.tar.gz.enc .
hashicorp-support.tar.gz.enc                                                      100%  111MB  20.9MB/s   00:05
```

Then, attach the bundle to your support ticket. If possible, use the SendSafely integration (as it allows for large file uploads).

### Scrubbing Secrets

If you have extremely sensitive data in your Terraform build logs you
may opt to omit these logs from your bundle. However, this may impede our
efforts to diagnose any problems you are encountering. To create a custom
support bundle, run the following commands:

    sudo -s
    hashicorp-support
    cd /var/lib/hashicorp-support
    tar -xzf hashicorp-support.tar.gz
    rm hashicorp-support.tar.gz*
    rm nomad/*build-worker*
    tar -czf hashicorp-support.tar.gz *
    gpg2 -e -r "Terraform Enterprise Support" \
        --cipher-algo AES256 \
        --compress-algo ZLIB \
        -o hashicorp-support.tar.gz.enc \
        hashicorp-support.tar.gz

You will note that we first create a support bundle using the normal procedure,
extract it, remove the files we want to omit, and then create a new one.


### Windows

On Microsoft Windows, tools such as [PSCP](https://www.ssh.com/ssh/putty/putty-manuals/0.68/Chapter5.html) and [WinSCP](https://winscp.net/eng/index.php) can be used to transfer the file.

## About the Bundle

The support bundle contains logging and telemetry data from various components
in Private Terraform Enterprise. It may also include log data from Terraform builds you have executed on your Private Terraform Enterprise installation.


## Pre-Sales uploads

Customers in the pre-sales phase can upload support bundle files directly at https://hashicorp.sendsafely.com/u/ptfe-support-bundles.
