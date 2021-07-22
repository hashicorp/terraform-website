---
layout: "enterprise"
page_title: "Automated Installation - Active/Active - Terraform Enterprise"
---

# Terraform Enterprise Active/Active

When your organization requires increased reliability or performance from Terraform Enterprise that your current single application instance cannot provide, it is time to scale to the Active/Active architecture. 

However, the benefits that come with the Active/Active architecture need to be weighed against increasing operation complexity:



*   Hard requirement of a completely automated installation
*   Observability concerns when monitoring multiple instances
*   Custom automation required to manage the lifecycle of application nodes
*   [New CLI-based commands](/docs/enterprise/admin/active-active.html) vs Replicated Admin Console for administration 

-> **Note**: Please contact your Customer Success Manager before attempting to follow this guide. They will be able to walk you through the process to make it as seamless as possible.


### Prerequisite

As mentioned above, the Active/Active architecture requires an existing [automated installation](https://www.terraform.io/docs/enterprise/install/automating-the-installer.html) of Terraform Enterprise that follows our [best practices for deployment](https://www.terraform.io/docs/enterprise/before-installing/reference-architecture/index.html). 

The primary requirement is an auto scaling group (or equivalent) with a single instance running Terraform Enterprise. This ASG should be behind a load balancer and can be exposed to the public Internet or not depending on your requirements. As mentioned earlier, the installation of the Terraform Enterprise application should be automated completely so that the auto scaling group can be scaled to zero and back to one without human intervention. 

The application itself must be using [External Services](https://www.terraform.io/docs/enterprise/before-installing/index.html#operational-mode-decision) mode to connect to an external PostgreSQL database and object storage. 

All admin and application configuration must be automated via your settings files and current with running configuration, i.e. it cannot have been altered via the Replicated Admin Console and not synced to the file. Specifically, you should be using the following configuration files:


*   `/etc/replicated.conf`    - contains the configuration for the Replicated installer
*   `/etc/ptfe-settings.json` - contains the configuration for the TFE application 

-> **Note**: The location for the latter is controlled by the "ImportSettingsFrom" setting in `/etc/replicated.conf` and is sometimes named `settings.json` or `replicated-tfe.conf`

The requirement for automation is two-fold. First, the nodes need to be able to spin up and down without human intervention. More importantly though, you will need to ensure configuration is managed in this way going forward as the Replicated Admin Console will be disabled. **The Replicated Admin Console does not function correctly when running multiple nodes and must not be used**.


### Step 1: Prepare to Externalize Redis


#### Prepare Network

There are new access requirements involving ingress and egress:


*   **Port 6379** (or the port the external Redis will be configured to use) must be open between the nodes and the Redis service
*   **Port 8201** must be open between the nodes to allow Vault to run in [High Availability](https://www.vaultproject.io/docs/internals/high-availability) mode
*   **Port 8800** should now be closed, as the Replicated Admin Console is no longer available when running multiple nodes


#### Provision Redis 

Externalizing Redis allows multiple active application nodes. Terraform Enterprise is validated to work with the managed Redis services from AWS, Azure, and GCP.

-> **Note**: Please see the cloud-specific configuration guides at the end of this document for details [here](#appendix-1-aws-elasticcache). 


### Step 2: Update your Configuration File Templates

Before installing, you need to make changes to the templates for the configuration files mentioned earlier in the prerequisites. 


#### Update Installer Settings

The existing settings for the installer and infrastructure (`replicated.conf`) are still needed and require to be expanded. Please see documentation for the existing options [here](https://www.terraform.io/docs/enterprise/install/automating-the-installer.html#installer-settings). 


##### Pin Your Version

To upgrade to the  Active/Active functionality and for ongoing upgrades, you need to pin your installation to the appropriate  release by setting the following:


<table>
  <tr>
   <td><strong>Key</strong>
   </td>
   <td><strong>Description</strong>
   </td>
   <td><strong>Specific Format Required</strong>
   </td>
  </tr>
  <tr>
   <td>ReleaseSequence
   </td>
   <td>Refers to a version of TFE ([v202101-1](https://github.com/hashicorp/terraform-enterprise-release-notes/blob/master/v202101-1.md)) on a specific release channel (Active/Active)
   </td>
   <td><strong>Yes</strong>, integer.
   </td>
  </tr>
</table>


The following example pins the deployment to the the ([v202101-1](https://github.com/hashicorp/terraform-enterprise-release-notes/blob/master/v202101-1.md)) release of TFE (which is the first to support multiple nodes):


```json
{
  "ReleaseSequence" : 504
}

```



#### Update Application Settings

The existing settings for the Terraform Enterprise application (`ptfe-settings.json`) are still needed and require to be expanded. Please see documentation for the existing options [here](/docs/enterprise/install/automating-the-installer.html#application-settings).


##### Enable Active/Active


<table>
  <tr>
   <td><strong>Key</strong>
   </td>
   <td><strong>Required Value</strong>
   </td>
   <td><strong>Specific Format Required</strong>
   </td>
  </tr>
  <tr>
   <td>enable_active_active
   </td>
   <td>“1”
   </td>
   <td><strong>Yes, </strong>string.
   </td>
  </tr>
</table>



```json
{
  "enable_active_active" : {
    "value": "1"
  }
}

```



##### Configure External Redis

The settings for the Terraform Enterprise application must also be expanded to support an external Redis instance:


<table>
  <tr>
   <td><strong>Key</strong>
   </td>
   <td><strong>Required Value</strong>
   </td>
   <td><strong>Specific Format Required</strong>
   </td>
  </tr>
  <tr>
   <td>redis_host
   </td>
   <td>Hostname of an external Redis instance which is resolvable from the TFE instance
   </td>
   <td><strong>Yes, </strong>string.
   </td>
  </tr>
  <tr>
   <td>redis_port
   </td>
   <td>Port number of your external Redis instance
   </td>
   <td><strong>Yes</strong>, string.
   </td>
  </tr>
  <tr>
   <td>redis_use_password_auth*
   </td>
   <td>Set to ”1”, if you are using a Redis service that requires a password.
   </td>
   <td><strong>Yes</strong>, string.
   </td>
  </tr>
  <tr>
   <td>redis_pass*
   </td>
   <td><em>Must be set to the password of an external Redis instance if the instance requires password authentication</em>
   </td>
   <td><strong>Yes</strong>, string.
   </td>
  </tr>
  <tr>
   <td>redis_use_tls*
   </td>
   <td>Set to “1” if you are using a Redis service that requires TLS
   </td>
   <td><strong>Yes</strong>, string.
   </td>
  </tr>
</table>


_* Fields marked with an asterisk are only necessary if your particular external Redis instance requires them._

For example:


```json
{
  "redis_host" : {
    "value": "someredis.host.com"
  },
  "redis_port" : {
    "value": "6379"
  },
  "redis_use_password_auth" : {
    "value": "1"
  },
  "redis_pass" : {
    "value": "somepassword"
  },
  "redis_use_tls" : {
    "value": "1"
  }
}

```



##### Add Encryption Password

!> The Encryption Password value must be added to the config and is **required to be identical between node instances** for the Active/Active architecture to function:

<table>
  <tr>
   <td><strong>Key</strong>
   </td>
   <td><strong>Description</strong>
   </td>
   <td><strong>Value can change between deployments?</strong>
   </td>
   <td><strong>Specific Format Required</strong>
   </td>
  </tr>
  <tr>
   <td>enc_password
   </td>
   <td>Used to encrypt sensitive data (<a href="https://www.terraform.io/docs/enterprise/install/encryption-password.html">docs</a>)
   </td>
   <td><strong>No. </strong>Changing will make decrypting existing data impossible. 
   </td>
   <td>No
   </td>
  </tr>
</table>



```json
{
   "enc_password":{
      "value":"767fee4e6046de48943df2decc55f3cd"
   },
}

```

-> **Note**: In versions prior to `v202104-1` the following values were also required to be set: `install_id`, `root_secret`, `user_token`, `cookie_hash`, `archivist_token`, `internal_api_token`, `registry_session_encryption_key` (HEX), and `registry_session_encryption_key` (HEX). These values are no longer required but will still work if they are still set by your configuration.  


### Step 3: Connect to External Redis

Once you are prepared to include the modified configuration options in your configuration files, you must connect a single node to your newly provisioned Redis service by rebuilding your node instance with the new settings.

#### Re-provision Terraform Enterprise Instance

Terminate the existing instance by scaling down to zero. Once terminated, you can scale back up to one instance using your revised configuration. 

#### Wait for Terraform Enterprise to Install

It can take up to 15 minutes for the node to provision and the TFE application to be installed and respond as healthy. You can monitor the status of the node provisioning by watching your auto scaling group in your cloud’s web console. To confirm the successful implementation of the TFE application you can SSH onto the node and run the following command to monitor the installation directly:


```bash
replicatedctl app status
```


Which will output something similar to the following:


```json
[
    {
        "AppID": "218b78fa2bd6f0044c6a1010a51d5852",
        "Sequence": 504,
        "PatchSequence": 0,
        "State": "starting",
        "DesiredState": "started",
        "IsCancellable": false,
        "IsTransitioning": true,
        "LastModifiedAt": "2021-01-07T21:15:11.650385151Z"
    }
]

```


Installation is complete once `isTransitioning` is `false` and `State` is `started`.

See [Active/Active Administration](/docs/enterprise/admin/active-active.html) for more status and troubleshooting commands.


#### Validate Application

With installation complete, it is time to validate the new Redis connection. Terraform Enterprise uses Redis both as a cache for API requests and a queue for long running jobs, e.g. Terraform Runs. Test the latter behavior by running real Terraform plans and applies through the system. 

Once you are satisfied the application is running as expected, you can move on to step 4 to scale up to two nodes.


### Step 4: Scale to Two Nodes

You can now safely change the number of instances in your Auto Scaling Group ( or equivalent) to two.

#### Disable the Replicated Admin Console

Before scaling beyond the first node, you must disable the Replicated Admin Console as mentioned earlier in this guide. This is done by adding the `disable-replicated-ui` flag as a parameter when you call the install script, as such:


```
sudo bash ./install.sh disable-replicated-ui
```

Locate where the `install.sh` script is run as part of your provisioning/installation process and add the parameter. If there are other parameters on the same line, they should be left in place.


#### Scale Down to Zero Nodes

Scale down to zero nodes to fully disable the admin dashboard. Once the existing instance has terminated...


#### Scale Up to Two Nodes

Now that you have tested your external Redis connection change the min and max instance count of your Auto Scaling Group to two nodes. 

-> **Note**: Running more than two instances is not _currently_ supported. Please contact your Customer Success Manager if there are any questions/concerns.


#### Wait for Terraform Enterprise to Install

You need to wait up to 15 minutes for the application to respond as healthy on both nodes. Monitor the status of the install with the same methods used previously for one node in Step 3. 

-> **Note**: Each node needs to be checked independently.


#### Validate Application

Finally, confirm the application is functioning as expected when running multiple nodes. Run Terraform plan and applies through the system (and any other tests specific to your environment) like you did to validate the application in Step 3. 

Confirm the general functionality of the Terraform Enterprise UI to validate the tokens you added in Step 2 are set correctly. Browse the `Run` interface and your organization's private registry to confirm your application functions as expected.


## 


## Appendix 1: AWS ElasticCache

The following example Terraform configuration shows how to configure a replication group for use with TFE:

In this example, the required variables are:



*   **vpc_id** is the ID of VPC where TFE application will be deployed
*   **subnet_ids** are the IDs of Subnets within the VPC to use for the ElastiCache Subnet Group
*   **security_group_ids** are the IDs of Security Groups within the VPC that will be attached to TFE instances for Redis ingress
*   **availability_zones** are the zones within the VPC to deploy the ElastiCache setup to

```terraform
resource "aws_elasticache_subnet_group" "tfe" {
  name       = "tfe-test-elasticache"
  subnet_ids = var.subnet_ids
}

resource "aws_security_group" "redis_ingress" {
  name        = "external-redis-ingress"
  description = "Allow traffic to redis from instances in the associated SGs"
  vpc_id      = var.vpc_id
  
  ingress {
    description     = "TFE ingress to redis"
    from_port       = 7480
    to_port         = 7480
    protocol        = "tcp"
    security_groups = var.security_group_ids
  }
}

resource "aws_elasticache_replication_group" "tfe" {
  node_type                     = "cache.m4.large"
  replication_group_id          = "tfe-test-redis"
  replication_group_description = "External Redis for TFE."

  apply_immediately          = true
  at_rest_encryption_enabled = true
  auth_token                 = random_pet.redis_password.id
  automatic_failover_enabled = true
  availability_zones         = var.availability_zones
  engine                     = "redis"
  engine_version             = "5.0.6"
  number_cache_clusters      = length(var.availability_zones)
  parameter_group_name       = "default.redis5.0"
  port                       = 7480
  security_group_ids         = [aws_security_group.redis_ingress.id]
  subnet_group_name          = aws_elasticache_subnet_group.tfe.name
  transit_encryption_enabled = true
}
```




## 


## Appendix 2: GCP Memorystore for Redis

-> **Note**: Memorystore on Google Cloud does not support persistence, so encryption at rest is not an option.

Requirements/Options:



*   **authorized_network** - The network you wish to deploy the instance into. Internal testing was done using the same network TFE is deployed into. If a different network is used, the customer needs to ensure the two networks are open on port **6379**. 
*   **memory_size_gb** - How much memory to allocate to Redis. Initial testing was done with just 1gb configured. Larger deployments may require additional memory. (TFC uses an m4.large, which is just 6gb of memory, for reference.)
*   **location_id** - What region to deploy into - should be the same one TFE is deployed into. If Standard_HA tier is selected, an alternative_location_id will also need to be provided as a failover location.
*   **redis_version** - Both 4.0 and 5.0 work without issue but 5.0 is recommended

The default example provided on the provider page can be used to deploy memorystore [here](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/redis_instance). The host output of the resource can then be provided to the terraform module in order to configure connectivity.

You may consider using other options in the configuration depending on your requirements, such as including the **auth_enabled** flag set to true, which must then be accompanied by including an additional TFE configuration item called **redis_password** set to the value returned in the **auth_string** attribute from the memorystore resource.  


## 


## Appendix 3: Azure Cache for Redis

-> **Note**: Azure Cache on Azure only supports persistence and encryption with their Premium tier. All other tiers, Basic and Standard, do not support data persistence.

The minimum instance size for Redis to be used with TFE is 6 GiB. For Azure, this allows for some minimum configurations across the three tiers using Cache Names for their different Tiers. Our recommendations on cache sizing for Azure Cache for Redis is in the table below:


<table>
  <tr>
   <td> 
   </td>
   <td><strong>Basic</strong>
   </td>
   <td><strong>Standard</strong>
   </td>
   <td><strong>Premium</strong>
   </td>
  </tr>
  <tr>
   <td><strong>Cache</strong> <strong>Name</strong>
   </td>
   <td>C3
   </td>
   <td>C0
   </td>
   <td>P2
   </td>
  </tr>
</table>


Make sure you configure the minimum TLS version to the TFE supported version of 1.2 as the Azure resource defaults to 1.0. The default port for Azure Cache for Redis is 6380 and will need to be modified in the Application Settings `ptfe-replicated.conf` in order for TFE to connect to Azure Cache for Redis.

The default example provided on the provider page can be used to deploy Azure Cache for Redis [here](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/redis_cache). The outputs of the resource can then be provided to the Terraform module in order to configure connectivity
