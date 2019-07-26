---
layout: "cloud"
page_title: "API-driven Runs - Runs - Terraform Enterprise"
---

# The API-driven Run Workflow

Terraform Enterprise (TFE) has three workflows for managing Terraform runs.

- The [UI/VCS-driven run workflow](./ui.html), which is TFE's primary mode of operation.
- The API-driven run workflow described below, which is more flexible but requires you to create some tooling.
- The [CLI-driven run workflow](./cli.html), which uses Terraform's standard CLI tools to execute runs in TFE.

## Summary

In the API-driven workflow, workspaces are not directly associated with a VCS repo, and runs are not driven by webhooks on your VCS provider.

Instead, one of your organization's other tools is in charge of deciding when configuration has changed and a run should occur. Usually this is something like a CI system, or something else capable of monitoring changes to your Terraform code and performing actions in response.

Once your other tooling has decided a run should occur, it must make a series of calls to TFE's `runs` and `configuration-versions` APIs to upload configuration files and perform a run with them. For the exact series of API calls, see the [pushing a new configuration version](#pushing-a-new-configuration-version) section.

The most significant difference in this workflow is that TFE _does not_ fetch configuration files from version control. Instead, your own tooling must upload the configurations as a `.tar.gz` file. This allows you to work with configurations from unsupported version control systems, automatically generate Terraform configurations from some other source of data, or build a variety of other integrations.

~> **Important:** The script below is provided to illustrate the run process, and is not intended for production use. If you want to drive TFE runs from the command line, please see the [CLI-driven run workflow](./cli.html).

## Pushing a New Configuration Version

Pushing a new configuration to an existing workspace is a multi-step process. This section walks through each step in detail, using an example bash script to illustrate.

### 1. Define Variables

To perform an upload, a few user parameters must be set:

- **path_to_content_directory** is the folder with the terraform configuration. There must be at least one `.tf` file in the root of this path.
- **organization** is the organization name (not ID) for your Terraform Enterprise organization.
- **workspace** is the workspace name (not ID) in the Terraform Enterprise organization.
- **$TOKEN** is the API Token used for [authenticating with the TFE API](../api/index.html#authentication).

This script extracts the `path_to_content_directory`, `organization`, and `workspace` from command line arguments, and expects the `$TOKEN` as an environment variable.

```bash
#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <path_to_content_directory> <organization>/<workspace>"
  exit 0
fi

CONTENT_DIRECTORY="$1"
ORG_NAME="$(cut -d'/' -f1 <<<"$2")"
WORKSPACE_NAME="$(cut -d'/' -f2 <<<"$2")"
```

### 2. Create the File for Upload

The [configuration version API](../api/configuration-versions.html) requires a `tar.gz` file to be uploaded in order for the configration version to be used for a run, so the content directory (the directory containing the Terraform configuration) must be packaged into a `tar.gz` file.

~> **Important:** The configuration directory must be the root of the tar file, with no intermediate directories. In other words, when the tar file is extracted the result must be paths like `./main.tf` rather than `./terraform-appserver/main.tf`.

```bash
UPLOAD_FILE_NAME="./content-$(date +%s).tar.gz"
tar -zcvf "$UPLOAD_FILE_NAME" "$CONTENT_DIRECTORY" .
```

### 3. Look Up the Workspace ID

The first step identified the organization name and the workspace name; however, the [configuration version API](../api/configuration-versions.html) expects the workspace ID. As such, the ID has to be looked up. If the workspace ID is already known, this step can be skipped. This step uses the [`jq` tool](https://stedolan.github.io/jq/) to parse the JSON output and extract the ID value into the `WORKSPACE_ID` variable.

```bash
WORKSPACE_ID=($(curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/$ORG_NAME/workspaces/$WORKSPACE_NAME \
  | jq -r '.data.id'))
```

### 4. Create a New Configuration Version

Before uploading the configuration files, you must create a `configuration-version` to associate uploaded content with the workspace. This API call performs two tasks: it creates the new configuration version and it extracts the upload URL to be used in the next step.

```bash
echo '{"data":{"type":"configuration-version"}}' > ./create_config_version.json

UPLOAD_URL=($(curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @create_config_version.json \
  https://app.terraform.io/api/v2/workspaces/$WORKSPACE_ID/configuration-versions \
  | jq -r '.data.attributes."upload-url"'))
```

### 5. Upload the Configuration Content File

Next, upload the configuration version `tar.gz` file to the upload URL extracted from the previous step. If a file is not uploaded, the configuration version will not be usable, since it will have no Terraform configuration files.

Terraform Enterprise automatically creates a new run with a plan once the new file is uploaded. If the workspace is configured to auto-apply, it will also apply if the plan succeeds; otherwise, an apply can be triggered via the [Run Apply API](../api/run.html#apply). (If the API token used for the upload only has plan permissions, the run can't be auto-applied.)

```bash
curl \
  --header "Content-Type: application/octet-stream" \
  --request PUT \
  --data-binary @"$UPLOAD_FILE_NAME" \
  $UPLOAD_URL
```

### 6. Delete Temporary Files

In the previous steps a few files were created; they are no longer needed, so they should be deleted.

```bash
rm "$UPLOAD_FILE_NAME"
rm ./create_config_version.json
```

### Complete Script

Combine all of the code blocks into a single file, `./terraform-enterprise-push.sh` and give execution permission to create a combined bash script to perform all of the operations.

```shell
chmod +x ./terraform-enterprise-push.sh
./terraform-enterprise-push.sh ./content my-organization/my-workspace
```

**Note**: This script does not have error handling, so for a more robust script consider adding error checking.

**`./terraform-enterprise-push.sh`:**

```bash
#!/bin/bash

# Complete script for API-driven runs.
# Documentation can be found at:
# https://www.terraform.io/docs/cloud/run/api.html

# 1. Define Variables

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <path_to_content_directory> <organization>/<workspace>"
  exit 0
fi

CONTENT_DIRECTORY="$1"
ORG_NAME="$(cut -d'/' -f1 <<<"$2")"
WORKSPACE_NAME="$(cut -d'/' -f2 <<<"$2")"

# 2. Create the File for Upload

UPLOAD_FILE_NAME="./content-$(date +%s).tar.gz"
tar -zcvf "$UPLOAD_FILE_NAME" "$CONTENT_DIRECTORY"

# 3. Look Up the Workspace ID

WORKSPACE_ID=($(curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/organizations/$ORG_NAME/workspaces/$WORKSPACE_NAME \
  | jq -r '.data.id'))

# 4. Create a New Configuration Version

echo '{"data":{"type":"configuration-version"}}' > ./create_config_version.json

UPLOAD_URL=($(curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @create_config_version.json \
  https://app.terraform.io/api/v2/workspaces/$WORKSPACE_ID/configuration-versions \
  | jq -r '.data.attributes."upload-url"'))

# 5. Upload the Configuration Content File

curl \
  --header "Content-Type: application/octet-stream" \
  --request PUT \
  --data-binary @"$UPLOAD_FILE_NAME" \
  $UPLOAD_URL

# 6. Delete Temporary Files

rm "$UPLOAD_FILE_NAME"
rm ./create_config_version.json
```

## Advanced Use Cases

For advanced use cases see the [TFE Automation Script](https://github.com/hashicorp/terraform-guides/tree/master/operations/automation-script) repository for automating interactions with Terraform Enterprise, including the creation of a workspace, uploading TFE code, setting of variables, and triggering a plan/apply.

In addition to uploading configurations and starting runs, you can use TFE's APIs to create and modify workspaces, edit variable values, and more. See the [API documentation](../api/index.html) for more details.
