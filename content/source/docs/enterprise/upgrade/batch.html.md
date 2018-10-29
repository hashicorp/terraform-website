---
layout: enterprise2
page_title: "Batch Migration - Terraform Enterprise"
sidebar_current: "docs-enterprise2-upgrading-batch"
---

# Batch Migration

These instructions are for migrating TFE (Atlas) legacy environments to
workspaces using the API and scripts to automate large batches. Using the UI is
the easiest way to migrate a legacy environment to a workspace; however, if your
organization has many environments in need of migration this process may be
laborious to perform in the UI.

The [TFE workspace creation API](/docs/enterprise/api/workspaces.html)
can be used to perform the migration, which automaticaly locks the legacy
environment and migrates the data to the new workspace. This API can be called
using standard tools like curl, [tfe-cli tool](https://github.com/hashicorp/tfe-cli),
or community tools like the [terraform-enterprise-client](https://github.com/skierkowski/terraform-enterprise-client).
These tools can be used to iterate over a list of legacy environments to make
the API calls to perform the migration.

These instructions show how to automatically migrate a batch of legacy
environments using [tfe-cli](https://github.com/hashicorp/tfe-cli), some basic
scripting, and a file with legacy environments. You can follow the steps as
written, or use them as an example for building your own automation.


## Prerequisites

This guide requires the [tfe-cli tool](https://github.com/hashicorp/tfe-cli).

## Step 1: Identify OAuth Token ID

-> **Note:** You can skip to **Step 2** if only one VCS connection is configured or if no
VCS connection is needed. The `tfe` tool will automatically use the VCS
connection if only one exists.

To get the OAuth connection we assume you already have VCS integration set up in the new
organization. You will need the OAuth ID of the connection. You can obtain this
with the command line tool:

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  https://app.terraform.io/api/v2/organizations/my-organization/oauth-tokens
```

This will be the `id` value of the `oauth-tokens`.

## Step 2: Set Up Files and Script

-> These files assume that a VCS connection is present and multiple
`oauth-tokens` are configured. If no VCS connection is present then the
`legacy-envs.txt` nad `migrate.sh` will need to be updated to remove references
to the VCS repo. The `oauth-id` option in `migrate.sh` will also need to be
removed if no VCS connection is used or if you'd like the one default connection
to be used.

#### Data File: legacy-envs.txt

To prepare for migration, create a text file with all of the data you need.

```
skierkowski/training my-organization/training skierkowski/terraform-test-proj
skierkowski/migration-source my-organization/migration-desintation skierkowski/terraform-test-proj
```

Each line identifies a legacy environment, the new workspace to migrate to, and
the VCS repo to use, formatted as:

```
<legacy_org>/<legacy_environment> <new_organization>/<new_workspace> <vcs_org>/<vcs_repo>
```

If we were omitting VCS connections from the new workspaces, we would omit the
repo from each line.

#### Script: migrate.sh

Next, create a bash script which:

- Opens the file `legacy-envs.txt`.
- Parses out the legacy workspaces, new workspaces, and VCS repo.
- Calls `tfe` command line tool to trigger the migration.

**Note**: You'll need to specify the path to `tfe` command line tool.

```bash
#!/bin/bash

regex="([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+) ([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+) ([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)"
cat legacy-envs.txt | while read line
do
  if [[ $line =~ $regex ]]
  then
    legacy_org="${BASH_REMATCH[1]}"
    legacy_workspace="${BASH_REMATCH[2]}"
    new_org="${BASH_REMATCH[3]}"
    new_workspace="${BASH_REMATCH[4]}"
    vcs_org="${BASH_REMATCH[5]}"
    vcs_repo="${BASH_REMATCH[6]}"
    echo MIGRATING: $line
    tfe migrate \
      -legacy-name $legacy_org/$legacy_workspace \
      -name $new_org/$new_workspace \
      -vcs-id $vcs_org/$vcs_repo \
      -oauth-id $VCS_OAUTH_TOKEN_ID
  else
    echo ERROR PARSING: $line
  fi
done
```

## Step 3: Run migration

Now you can run the batch migration:

```shell
chmod +x migrate.sh
./migrate.sh
```

The `migrate.sh` script does not perform any error handling. Review the logs
to ensure all workspaces are migrated properly.
