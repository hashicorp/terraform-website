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

The [TFE workspace creation API](https://www.terraform.io/docs/enterprise/api/workspaces.html)
can be used to perform the migration, which automaticaly locks the legacy
environment and migrates the data to the new workspace. This API can be called
using standard tools like curl, [tfe-cli tool](https://github.com/hashicorp/tfe-cli),
or community tools like the [terraform-enterprise-client](https://github.com/skierkowski/terraform-enterprise-client).
These tools can be used to iterate over a list of legacy environments to make
the API calls to perform the migration.

These instructions will use the [terraform-enterprise-client](https://github.com/skierkowski/terraform-enterprise-client#command-line-tool)
tool with the `import-legacy-environment` option to set the value of the legacy
environment to import when creating the environment. This will walk through
using the CLI tool, a little bash script, and a file with legacy environments,
to automatically migrate a batch of legacy environments.


## Prerequisites

This guide requires the [Terraform Enterprise Client CLI](https://github.com/skierkowski/terraform-enterprise-client#command-line-tool) included in this repo.

## Step 1: Identify OAuth Token ID

When creating a new workspace you may want to associate it with a VCS repo. This
is completely optional, as you may [push configurations via the API](https://www.terraform.io/docs/enterprise/workspaces/run-api.html)
instead of using the VCS connection. If you do not plan on using the VCS
connection skip ahead to step #3.

To get the OAuth connection we assume you already have the VCS setup in the new
organization. You will need the OAuth ID of the connection. You can obtain this
with the command line tool:

```shell
tfe oauth_tokens list --organization my-organization --value --only id
```
Assuming you only have one connection, this command will output the value you
need.

## Step 2: Set the OAuth Token ID

In this step we just set the env var `VCS_OAUTH_TOKEN_ID` which will be used in
subsequent steps.

```shell
export VCS_OAUTH_TOKEN_ID=XXX
```

## Step 3: Set up files and script

First, we'll create this bash script which:

- opens the file `legacy-envs.txt`
- parses out the legacy workspaces, new workspaces, and VCS repo
- calls `tfe` command line tool to trigger the migration

#### migrate.sh
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
    tfe workspaces create $new_workspace \
      --organization $new_org \
      --import-legacy-environment=$legacy_org/$legacy_workspace \
      --oauth-token $VCS_OAUTH_TOKEN_ID \
      --repo $vcs_org/$vcs_repo
  else
    echo ERROR PARSING: $line
  fi
done
```

**Note**: In the above script, `oauth-token` and `repo` are only required if you
are setting up a VCS connection on the new workspace. You may also want to set
other VCS related parameters (e.g. branch), in which case you can see the full
list of options using `tfe workspaces help create`. You'll also want to update
the regex to ignore the VCS repo from the `legacy-envs.txt` file.

This file is our "manifest" for the migration. It identifies the legacy
environment, new workspace and the VCS repo. It should be formatted `<legacy_org>/<legacy_environment> <new_organization>/<new_workspace> <vcs_org>/<vcs_repo>`.
The `<vcs_org>/<vcs_repo>` only applies if you are creating VCS connections. It
can be ignored from this file and the `migrate.sh` script.

#### legacy-envs.txt
```
skierkowski/training my-organization/training skierkowski/terraform-test-proj
skierkowski/migration-source my-organization/migration-desintation skierkowski/terraform-test-proj
```

## Step 4: Run migration

Now you can run the batch migration:

```shell
chmod +x migrate.sh
./migrate.sh
```

The `migrate.sh` does not perform any error handling. The logs should be
reviewed to ensure all workspaces are migrated properly.
