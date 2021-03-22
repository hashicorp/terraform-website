---
layout: "enterprise"
page_title: "Active/Active - Infrastructure Administration - Terraform Enterprise"
---

# Terraform Enterprise Active/Active

When your organization requires increased reliability or performance from Terraform Enterprise that your current single application instance cannot provide, it is time to scale to the Active/Active architecture. Please refer to  [Terraform Enterprise Active/Active](/docs/enterprise/install/active-active.html) for more information on moving to Active/Active.

## Active/Active Admin Commands

The Active/Active operational mode disables use of the Replicated Admin Console.  To accommodate this, there are now admin commands to facilitate configuration changes, safe application stops, and producing support bundles. There is a new container in the TFE architecture to support this called "tfe-admin". You must login to a node in the Active/Active cluster using SSH to run these commands from the command line.

### Commands

Note that `tfe-admin` is an alias for `replicated admin`, and can be used interchangeably.

#### support-bundle

```bash
tfe-admin support-bundle
```

This command will generate a support bundle for all nodes. The support bundles will be uploaded to the same object store bucket that is used to store Terraform statefiles. The support bundles for a specific run of the admin command will all be uploaded to a directory with the same JobID (a timestamp in [RFC3339](https://tools.ietf.org/html/rfc3339) format). If you are sending a support bundle to HashiCorp Support, package up the associated bundles and send all in order to ensure all needed information is made available.

Example upload structure

```bash
support-bundles
└── 2020-11-10T02:03:05Z
    ├── 10.0.0.5
    │   └── replicated-support702524260.tar.gz
    └── 10.0.0.6
        └── replicated-support577188727.tar.gz
```


#### node-drain

```bash
tfe-admin node-drain 
```

This command will quiesce the current node and remove it from service. It will allow current work to complete and safely stop the node from picking up any new jobs from the Redis queue, allowing the application to be safely stopped. Currently, it only affects `localhost` (it does not support running on one node to drain other nodes). Currently, there is no reverse drain command - a restart is needed to restore the node.


####  app-config

```bash
tfe-admin app-config -k <KEY> -v <VALUE>
```

This command allows users to make ad hoc/realtime application changes, such as `capacity_concurrency` via the CLI. Both an allowable `<KEY>` (setting name) and `<VALUE>` (new setting value) must be provided. A complete list of the current `app-config` settings can be found by running `replicatedctl app-config export`. You will be warned to restart the TFE application after running this command and must do so with a `replicatedctl app restart` command **on each node instance** for the configuration changes to be in effect.

-> **Note:** You should ensure that any ad hoc changes made in this fashion are captured in the standard node build configuration, as the next time you build/rebuild a node only the configuration stored for that purpose will be in effect and ad hoc changes could be lost.

-> **Hint:** Adding a function to your Linux start-up like an alias can give you a short cut to the admin `app-config` command only requiring a single command and parameters, such as:

```bash
# shortcut: tfe-app-config <KEY> <VALUE>
tfe-app-config ()
{
        tfe-admin app-config -k "$1" -v "$2"
}
```

## Other Supporting Commands

There are additional commands available for checking status and troubleshooting directly on nodes. You can use them to confirm successful installation or to check on the status of a running node as part of troubleshooting activities.  Also, there are additional command aliases available that allow you to run more abbreviated versions of commands like just `support-bundle`. Run an `alias` command with no parameters to see the list of available command aliases.

### Commands

#### health-check

```bash
ptfe-admin health-check
(alias health-check)

```

This command tests and reports on the status of the major TFE services. Each will be listed as PASS or FAIL. If any are marked as FAIL, your TFE implementation is NOT healthy and additional action must be taken.


#### replicated status

```bash
replicatedctl system status

```

Displays status info on the Replicated sub-system. Key values to note are that status values return as "ready". This reports on the status of the system on the node instance that it is run on.


#### tfe application status

```bash
replicatedctl app status

```

Displays status info on the TFE application. Key values to note are that `State` and `DesiredState` are both "started" and `IsTransitioning` is false. This reports on the status of the application on the node instance that it is run on.


## Upgrading TFE or Patching TFE Node Instances

The mechanism used to upgrade the TFE node instances is to fully repave the instances (destroy and rebuild entirely).
This is another reason why using automation to build the instances is important. Currently, the safest way to perform and upgrade is to shut down all node instances, rebuild one node to validate a successful upgrade, and then scale to additional nodes (currently max 2).

These are the steps required to repave the node instances:

*   Run the `node-drain` command as described previously on each node to complete active work and stop new work from being processed.
*   Update the instance build configuration such as setting a new `ReleaseSequence` to upgrade versions and/or make any other alterations such as patching the base image used for building the instances.
*   Follow the instructions in [Terraform Enterprise Active/Active](/docs/enterprise/install/active-active.html) to scale down to zero nodes and proceed through scaling up to one node, validating success, and then scaling additional nodes.

If planned and orchestrated efficiently, the total downtime for the repaving will be the amount of time it has taken to build one node as processing will resume as soon as the first node is functional.
