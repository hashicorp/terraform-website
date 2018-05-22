---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Upgrades"
sidebar_current: "docs-enterprise2-private-installer-upgrades"
---
# Upgrading

This section explains how to upgrade Private Terraform Enterprise to a new
version. [Learn more about availability during upgrades here](./reliability-availability.html#availability-during-upgrades-1).

## Online

1. From the admin console dashboard
(`https://[hostname or ip of your instance]:8800/dashboard`) click the
"Check Now" button; the new version should be recognized, then click "View
Update".
2. Review the release notes and then click "Install Update".

## Airgapped

1. Determine the update path where the installer will look for new `.airgap`
packages; you can do this from the console settings of your instance
(`https://[hostname or ip of your instance]:8800/console/settings`) in the field
`Update Path`.
2. Download the new `.airgap` package onto the instance and put it into the
`Update Path` location.
3. From the admin console dashboard
(`https://[hostname or ip of your instance]:8800/dashboard`) click the
"Check Now" button; the new version should be recognized, then click
"View Update".
4. Review the release notes and then click "Install Update".
