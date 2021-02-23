---
layout: "cloud"
page_title: "Terraform Cloud Agents - Terraform Cloud and Terraform Enterprise"
---

# Terraform Cloud Agents

> **Hands-on:** Try the [Manage Private Environments with Terraform Cloud Agents](https://learn.hashicorp.com/tutorials/terraform/cloud-agents?in=terraform/modules&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorial on HashiCorp Learn.

-> **Note:** Terraform Cloud Agents are a paid feature, available as part of the **Terraform Cloud for Business** upgrade package. [Learn more about Terraform Cloud pricing here](https://www.hashicorp.com/products/terraform/pricing/). The number of agents you are eligible to deploy is determined by the number of concurrent runs your organization is entitled to.

Terraform Cloud Agents allow Terraform Cloud to communicate with isolated, private, or on-premises infrastructure. By deploying lightweight agents within a specific network segment, you can establish a simple connection between your environment and Terraform Cloud which allows for provisioning operations and management. This is useful for on-premises infrastructure types such as vSphere, Nutanix, OpenStack, enterprise networking providers, and anything you might have in a protected enclave.

The agent architecture is pull-based, so no inbound connectivity is required. Any agent you provision will poll Terraform Cloud for work and carry out execution of that work locally.

## Before Install

### Supported Operating Systems

[Agents](https://releases.hashicorp.com/tfc-agent) currently only support 64 bit Linux operating systems. You can also run the agent within Docker using our official [Terraform Agent Docker container](https://hub.docker.com/r/hashicorp/tfc-agent).

### Supported Terraform Versions

Agents support Terraform versions 0.12 and above. Workspaces configured to use Terraform versions below 0.12 will not be able to select the agent-based execution mode.

### Networking Requirements

In order for an agent to function properly, it must be able to make outbound requests over HTTPS (TCP port 443) to the Terraform Cloud application APIs. This may require perimeter networking as well as container host networking changes, depending on your environment. The IP ranges are documented in the [Terraform Cloud IP Ranges documentation](https://www.terraform.io/docs/cloud/architectural-details/ip-ranges.html).

Additionally, the agent must also be able to communicate with any services required by the Terraform code it is executing. This includes the Terraform releases distribution service, [releases.hashicorp.com](https://releases.hashicorp.com) (supported by [Fastly](https://api.fastly.com/public-ip-list)), as well as any provider APIs. The services which run on these IP ranges are described in the table below.

Hostname | Port/Protocol | Directionality | Purpose
--|--|--|--
app.terraform.io | tcp/443, HTTPS | Outbound | Polling for new workloads, providing status updates, and downloading private modules from Terraform Cloud's Private Module Registry
registry.terraform.io | tcp/443, HTTPS | Outbound | Downloading public modules from the Terraform Registry
releases.hashicorp.com | tcp/443, HTTPS | Outbound | Updating agent components and downloading Terraform binaries
archivist.terraform.io | tcp/443, HTTPS | Outbound | Blob Storage

### Operational Considerations

The agent is distributed as a standalone binary which can be run on any supported system. By default, the agent will run in the foreground as a long-running process that will continuously poll for workloads from Terraform Cloud. We strongly recommend pairing the agent with a process supervisor to ensure that it is automatically restarted in case of an error.

Agents do not guarantee a clean working environment per Terraform execution. Each execution is performed in its own temporary directory with a clean environment, but references to absolute file paths or other machine state may cause interference between Terraform executions. We strongly recommend that you write your Terraform code to be stateless and idempotent. You may also want to consider using [single-execution mode](#optional-configuration-single-execution-mode) to ensure your agent only runs a single workload.

### Updating

The agent will automatically receive application code updates for the agent only. Administrators are required to update the host operating system and all other installed software.

### Security Considerations

Agents should be considered a global resource within an organization. Once configured, any workspace owner may configure their workspace to target the organization's agents. This may allow a malicious workspace to access state files, variables, or code from other workspaces targeting the same agent, or access sensitive data on the host running the agent. For this reason, we recommend carefully considering the implications of enabling agents within an organization, and restricting access to your organization to only trusted parties.

### Limitations

Agents are designed to allow you to run Terraform operations from a Terraform Cloud workspace on your private infrastructure. The following use cases are not supported by agents:

- Connecting to private infrastructure from Sentinel policies using the [http import](https://docs.hashicorp.com/sentinel/imports/http/)
- Connecting Terraform Cloud workspaces to private VCS repositories

For these use cases, we recommend you leverage the information provided by the [IP Ranges documentation](https://www.terraform.io/docs/cloud/architectural-details/ip-ranges.html) to permit direct communication from the appropriate Terraform Cloud service to your internal infrastructure.

Organizations are limited to 20 pools each.

## Managing Agent Pools

Agents are organized into pools, which can be managed in Terraform Cloud's UI. Each workspace can specify which agent pool should run its workloads.

-> **Note:** You must be a member of the “Owners” team within your organization in order to manage an organization's agents in Terraform Cloud. ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

### Create a new Agent Pool

1. Navigate to **Organization Settings > Agents** and click "New agent pool".

    ![Screenshot: The Agents page with no pools](./images/agent-first-pool.png)

2. Give your pool a name, then click "Continue". This name will be used to distinguish your pools when changing the settings of a workspace.

    ![Screenshot: Step 1 of pool creation, naming the agent pool](./images/agent-first-pool-name.png)

3. Give your token a description and click "Create Token".

    -> **Note:** Your token information will not be displayed again. Make sure to save it appropriately before moving to the final step.

    ![Screenshot: Step 2 of pool creation, token creation](./images/agent-first-pool-tokens.png)

4. Click "Finish".

### Delete an Agent Pool

1. Navigate to **Organization Settings > Agents** and click on the name of the pool you would like to delete.

2. Click "Delete agent pool".

    ![Screenshot: Deleting an agent pool](./images/agent-delete-valid.png)

3. Confirm the deletion of the pool by clicking "Yes, delete agent pool".

    ![Screenshot: Confirmation to delete an agent pool](./images/agent-delete-valid-confirm.png)

    ~> **Important:** Agent pools which are still associated with a workspace are unable to be deleted. To delete these pools, first ensure the related workspace has completed all in progress runs, and remove the association to the agent pool in **Workspace Settings > General Settings**.

    ![Screenshot: Unable to delete an agent pool with attached workspace](./images/agent-delete-invalid.png)

### Revoke an Agent Token

You may revoke an issued token from your agents at any time.

Revoking a token will cause the agents using it to exit. For agents to continue servicing workspace jobs, they must be reinitialized with a new token. Under normal circumstances, it may be desirable to generate a new token first, initialize the agents using it, then revoke the old token once no agents are using it. Agent tokens display information about the last time they were used to help you decide whether they are safe to revoke.

1. Navigate to **Organization Settings > Agents**, then click on the agent pool you would like to manage.

2. Click **"Revoke Token"** for the token you would like to revoke.

    ![Screenshot: The Agent tokens list with the "Revoke Token" link highlighted](./images/agent-revoke-token.png)

3. Confirm the deletion of the token by clicking "Yes, delete token".

    ![Screenshot: The "Revoke agent token" confirmation modal](./images/agent-revoke-token-confirm.png)

## Managing Agents

The agent software runs on your own infrastructure. Agent pool membership is determined by which token you provide when starting the agent.

### Download and Install the Agent

1. Download the latest [agent release](https://releases.hashicorp.com/tfc-agent), the associated checksum file (.SHA256sums), and the checksum signature (.sig).
1. Verify the integrity of the downloaded archive, as well as the signature of the `SHA256SUMS` file using the instructions available on [HashiCorp's security page](https://www.hashicorp.com/security).
1. Extract the release archive. The `unzip` utility is available on most Linux distributions and may be invoked as `unzip <archive file>`. Two individual binaries will be extracted (`tfc-agent` and `tfc-agent-core`). These binaries _must_ reside in the same directory for the agent to function properly.

### Start the Agent

Using the Agent token you copied earlier, set the `TFC_AGENT_TOKEN` and `TFC_AGENT_NAME` environment variables.

```
export TFC_AGENT_TOKEN=your-token
export TFC_AGENT_NAME=your-agent-name
./tfc-agent
```

-> **Note:** The `TFC_AGENT_NAME` variable is optional. If you do not specify a name here, one will not be displayed. These names are for your reference only, and the agent ID is what will appear in logs and API requests.

Once complete, your agent will appear on the Agents page and display its current status.

![Screenshot: The Agents page with one connected agent in the idle state](./images/agent-idle.png)

#### Optional Configuration: Running an Agent using Docker

Alternatively, you can use our official agent Docker container to run the Agent.

```
docker pull hashicorp/tfc-agent:latest
docker run -e TFC_AGENT_TOKEN=your-token -e
TFC_AGENT_NAME=your-agent-name hashicorp/tfc-agent
```

#### Optional Configuration: Single-execution mode

The Agent can also be configured to run in single-execution mode, which will ensure that the Agent only runs a single workload, then terminates. This can be used in combination with Docker and a process supervisor to ensure a clean working environment for every Terraform run.

To use single-execution mode, start the agent with the `-single` command line argument.

## Configuring Workspaces to use the Agent

-> **Note:** You must have “Admin” access to the workspace you are configuring to change the [execution mode](/docs/cloud/workspaces/settings.html#execution-mode). ([More about permissions.](/docs/cloud/users-teams-organizations/permissions.html))

[permissions-citation]: #intentionally-unused---keep-for-maintainers

~> **Important:** Changing your workspace's [execution mode](/docs/cloud/workspaces/settings.html#execution-mode) after a run has already been planned will cause the run to error when it is applied.
To minimize the number runs that error, you should disable [auto-apply](/docs/cloud/workspaces/settings.html#auto-apply-and-manual-apply),
complete any runs that are no longer in the [pending stage](/docs/cloud/run/states.html#1-the-pending-stage),
and [lock](/docs/cloud/workspaces/settings.html#locking) your workspace before changing the execution mode.

To configure a workspace to execute runs using an agent:

1. Open the workspace from the main "Workspaces" view, then navigate to "Settings > General" from the dropdown menu.
1. Select Agent as the [execution mode](/docs/cloud/workspaces/settings.html#execution-mode), as well as the agent pool
   this workspace should use.
1. Click "Save Settings" at the bottom of the page.

![Screenshot: The Workspace General settings page, with agent selected for execution mode](./images/agent-execution-mode.png)

### Run Details

Runs which are processed by an agent will have additional information about that agent in the details section of the run:

![Screenshot: Run details with agent information](./images/agent-run-details.png)

-> **Note:** Different agents may be used for the plan and apply operations, depending on agent availability within the pool.

### Running Multiple Agents

You may choose to run multiple agents within your network, up to the organization's purchased agent limit. If there are multiple agents available within an organization, Terraform Cloud will select the first available agent within the target pool.

#### Resilience

If an agent terminates abnormally, any running jobs can be restarted where they left off by resubmitting them. We strongly recommend pairing the agent with a process supervisor to ensure that it is automatically restarted in case of an error.

(See **Agent Capacity Usage** below).

## Troubleshooting

### Viewing Agent Statuses

![Screenshot: Possible agent statuses](./images/agent-statuses.png)

Agent status appear on the **Organization Settings > Agents** page and will contain one of these values:

- **Idle**: The agent is running normally and waiting for jobs to be available.
- **Busy**: The agent is running normally and currently executing a job.
- **Unknown**: The agent has not reported any status for an unexpected period of time. The agent may yet recover if the agent's situation is temporary, such as a short-lived network partition.
- **Errored**: The agent encountered an unrecoverable error or has been in an Unknown state for long enough that Terraform Cloud considers it errored. This may indicate that the agent process was interrupted, has crashed, a _permanent_ network partition exists, etc. If the agent was in the process of running an operation (such as a plan or apply), that operation has been marked as errored. If the current agent process does manage to recover, it will be instructed to exit immediately.
- **Exited**: The agent exited normally, and has successfully informed Terraform of it doing so.

### Agent Capacity Usage

Agents are considered active and count towards the organization's purchased agent capacity if they are in the **Idle**, **Busy**, or **Unknown** state. Agents which are in the **Errored** or **Exited** state do not count towards the organization's total agent capacity.

The number of active agents you are eligible to deploy is determined by the number of Concurrent Runs your organization is entitled to. Agents are available as part of the [Terraform Cloud Business] (https://www.hashicorp.com/products/terraform/pricing/) tier.

Agents in the **Unknown** state continue to be counted against the organization's total agent allowance, as this status is typically an indicator of a temporary communication issue between the agent and Terraform Cloud. **Unknown** agents which do not respond after a period of 2 hours will automatically transition to an **Errored** state, at which point they will not count against the agent allowance.

### Viewing Agent Logs

Output from the Terraform execution will be visible on the run’s page within Terraform Cloud. For more in-depth debugging, you may wish to view the agent’s logs, which are sent to `stdout` and configurable via the `-log-level` command line argument. By default, these logs are not persisted in any way. It is the responsibility of the operator to collect and store these logs if they are needed.
