---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installer - Simplified Migration"
sidebar_current: "docs-enterprise2-private-installer-simplified-migration"
---

# Private Terraform Enterprise Installer - Simplified Migration

This document outlines a simplified procedure for migrating from the AMI-based Private Terraform Enterprise (PTFE)
to the Installer-based PTFE that is suitable if the original Terraform modules were not modified, or the modifications were minimal.

## Terraform State

To run this procedure, you'll need the Terraform state file used to create the AMI-based installation. Additionally, we strongly suggest you back up this state file before proceeding with this process, in the event that you need to revert back to the AMI.

## Backup

Before beginning, it's best to create an additional backup of your RDS database. This will allow you to roll back the data and continue to use the AMI if necessary.

To create an RDS backup, go to the [Amazon RDS Instances](https://console.aws.amazon.com/rds/home?region=us-east-1#dbinstances:). You may need to change the region that you are viewing in order to see your PTFE instance. Once you find it, click on the instance name. On the next page, select **Instance Actions** and then **Take snapshot**. On the **Take DB Snapshot** page, enter a name for the snapshot such as `Pre-Installer Migration`, and then click **Take Snapshot**.

The snapshot will take a little while to create. After it has finished, you can continue with the rest of the migration steps.

### Reverting back to the AMI

To revert to the AMI after running the migration script:

* If you've already manipulated the state file to move the resources, you'll need to restore the original state file.
* With your original Terraform state file in place, return to the [Amazon RDS Snapshots](https://console.aws.amazon.com/rds/home?region=us-east-1#db-snapshots:) and find the snapshot you created before migrating. Click on the snapshot and note its **ARN** value. Open your **.tfvars** file and add `db_snapshot = "arn-value-of-snapshot"`.
* Run `terraform apply` to make sure everything is set up. This will result in a new RDS instance being built against the snapshot.
* If the EC2 instance is still running from the migration process, run `shutdown` on it to get a new instance created.
* Return to the original hostname used for the cluster.

## Preflight

### Terraform Variables and State

To use this simplified procedure, you'll neeed the `.tfvars` file and `.tfstate` file used to deploy
the AMI-based PTFE instance.

These files will be used against a new Terraform module set to change just the PTFE software
and leave the state storage, such as RDS and S3, in place.

### Preparing Modules

Download the [new Terraform modules](https://github.com/hashicorp/ptfe-migration-terraform) into a local directory.
Change to that directory, and place the `.tfvars` and `.tfstate` files for the AMI-based instance in the directory.

The rest of the steps will be executed from this directory.

### Data Migration

The AMI instance must be prepared before any of the new Terraform configuration is used. Use SSH to access
the instance and download the migration tool by running:

```
$ curl -O https://s3.amazonaws.com/hashicorp-ptfe-data/migrator
$ chmod a+x migrator
```

Next, run the migrator tool to move some data off the AMI and into your PostgreSQL installation.

```
$ sudo ./migrator

```

The migrator will prompt you to run again with the `-confirm` flag to confirm that you wish to run this step, because it
shuts down operations on the current instance. The shutdown is required to ensure consistency of the data.
To confirm the shutdown and proceed, run:

```
$ sudo ./migrator -confirm
```

Next, the migration will move the Vault data into PostgreSQL and output the encryption password
value that you need to specify to use this Terraform module. The password output will be
similar to:

```
Provide this value as the encryption password in the migration tfvars file:
   jIQzYXtNZNKfkyHbj2WHqTkrSQPkeX8gCrfPAkJHZ5s

```


The value of the encryption password (`jIQzYXtNZNKfkyHbj2WHqTkrSQPkeX8gCrfPAkJHZ5s` here) will be different for your run of the
migrator tool. Copy the provided value and add it to your `.tfvars` file like this:

```
encryption_password = "jIQzYXtNZNKfkyHbj2WHqTkrSQPkeX8gCrfPAkJHZ5s"
```

### License File

Place your Terraform Enterprise license file (ending in `.rli`) on your local disk, and specify the path to it
in the `.tfvars` file like this:

```
license_file = "/path/to/license.rli"
```

where the provided path is the path on the local disk. If you put it in the current directory, you can
specify just the name and omit the path.

## Initialize

You're now ready to initialize the new terraform modules:

```
terraform init ./terraform/aws-standard
```

## Apply the Changes

Once the initialization has succeeded, run

```
terraform plan ./terraform/aws-standard
```

to see the changes that will be made. Double-check that they are correct before continuing.
There should not be any changes made to your `aws_db_instance` or `aws_s3_bucket`.
If any changes to these resources are shown in the plan, pause the migration process and
[contact support](./faq.html#support-for-private-terraform-enterprise).

When you're satisfied with the plan, apply it:

```
terraform apply ./terraform/aws-standard
```

The apply will remove the Terraform Enterprise AMI instance and boot an instance running
Terraform Enterprise under the installer framework in its place, configured with all the values
provided by the existing Terraform state, along with the license information and encryption
password you added.

When the `terraform apply` completes, the instance will be fully migrated!

## Availability

This module runs with the same availability as the AMI did. It is protected against instance loss by
the Auto Scaling Group and boots the new instance automatically without the need for further configuration.

## Software Upgrades

This module installs the latest version of the Terraform Enterprise software automatically on boot,
so an easy way to upgrade the application is to shut down the instance. When the Auto Scaling Group
boots a new instance, it will install the new software and resume operation.

Alternately, you can upgrade the application from the management console, available on port 8800 of the instance,
following the [standard upgrade process for the installer](./upgrades.html).

## Installer Dashboard

As part of the migration, the ELB is modified to provide access to the installer dashboard on port 8800.
The dashboard is configured for access with an autogenerated password that is available in the Terraform
state; it is one of the outputs generated when applying the new Terraform modules.
