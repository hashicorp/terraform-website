---
layout: "enterprise2"
page_title: "Updating License Key"
sidebar_current: "docs-enterprise2-private-installer-license"
---

# Updating License Key

After renewing your commercial license for Private Terraform Enterprise (PTFE), follow the instructions below to update the license file for your installation.

If you are missing the new license Key, please talk to your **Solutions Engineer** (pre-sales, POC or trial) or **Technical Account Manager** (existing customers).

## Requirements

* Shell access to the VM running Private Terraform Enterprise
* The license file (with the extension `.rli`)

## Steps

### Online Installation

For the online installation mode, it's not necessary for a customer to manually load a new license file to the PTFE servers. The "Sync License" process will update the license:

1. In the PTFE Admin Console, select the "View License" menu under the gear icon (or navigate directly to <ptfe-hostname>:8800/license.
1. Click the "Sync License" button.
1. Go to the dashboard using the Dashboard menu.
1. Restart the PTFE application in the dashboard.

### Airgap installation

For an Airgap installation, a new license file will be provided by the customer's Technical Account Manager or Solutions Engineer.

1. Copy the new license file to the PTFE instance (for example with `scp`)
2. `ssh` to the PTFE instance
3. Load the license, by running `cat <license_file> | replicatedctl license-load`
4. In the PTFE Admin Console, select the "View License" menu under the gear icon (or navigate directly to <host>:8800/license.
5. Click the "Sync License" button.
6. Go to the dashboard using the Dashboard menu.
7. Restart the PTFE application in the dashboard.
