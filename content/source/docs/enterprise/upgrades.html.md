---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Upgrades"
---
# Upgrading

This section explains how to upgrade Private Terraform Enterprise to a new
version. [Learn more about availability during upgrades here](./reliability-availability.html#availability-during-upgrades-1).

## Online

1. From the installer dashboard (`https://<TFE HOSTNAME>:8800/dashboard`),
    click the "Check Now" button; the new version should be recognized.
1. Click "View Update".
1. Review the release notes and then click "Install Update".

## Airgapped

1. Determine the update path where the installer will look for new `.airgap`
    packages. You can do this from the console settings of your instance
    (`https://<TFE HOSTNAME>:8800/console/settings`) in the field `Update Path`.
1. Download the new `.airgap` package onto the instance and put it into the
    `Update Path` location.
1. From the installer dashboard (`https://<TFE HOSTNAME>:8800/dashboard`) click the
    "Check Now" button; the new version should be recognized.
1. Click "View Update".
1. Review the release notes and then click "Install Update".
