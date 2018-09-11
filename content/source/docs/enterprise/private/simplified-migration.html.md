---
layout: "enterprise2"
page_title: "Private Terraform Enterprise Installer Migration"
sidebar_current: "docs-enterprise2-private-installer-migration"
---

# Private Terraform Enterprise Installer Migration

This document outlines the procedure for migrating from the AMI-based Private Terraform Enterprise (PTFE)
to the Installer-based PTFE.

## Terraform State

To run this procedure, you'll need the terraform state file used to create the AMI-based installation. Additionally, we strongly suggest you back up this state file before proceeding with this process, in the event that you need to revert back to the AMI.

## Backup

Before beginning, it's best to create an additional backup of your RDS database. This will allow you to rollback the data and continue to use the AMI if necessary.

To create an RDS backup, go to the [Amazon RDS Instances](https://console.aws.amazon.com/rds/home?region=us-east-1#dbinstances:). You may need to change the region that you are viewing in order to see your PTFE instance. Once you find it, click on the instance name. On the next page, select **Instance Actions** and then **Take snapshot**. On the **Take DB Snapshot** page, enter a name for the snapshot such as `Pre-Installer Migration`, and then click **Take Snapshot**.

The snapshot will take a little while to create. After it has finished, you can continue with the rest of the migration steps.

### Reverting back to the AMI

To revert to the AMI after running the migration script:

* If you've already manipulated the state file to move the resources, you'll need to restore the original state file.
* With your original terraform state file in place, return to the [Amazon RDS Snapshots](https://console.aws.amazon.com/rds/home?region=us-east-1#db-snapshots:) and find the snapshot you created before migrating. Click on the snapshot and note its **ARN** value. Open your **.tfvars** file and add `db_snapshot = "arn-value-of-snapshot"`.
* Run `terraform apply` to make sure everything is set up. This will result in a new RDS instance being built against the snapshot.
* If the EC2 instance is still running from the migration process, run `shutdown` on it to get a new instance created.
* Return to the original hostname used for the cluster.

## Preflight

### Terraform Variables and State

To use this simplified procedure, you'll neeed the tfvars file and tfstate file used to deploy
the AMI-based PTFE.

These files will be used against a new terraform module set to change just the PTFE software
and leave the state storage such as RDS and S3 in place.

### Perparing Modules

Download the [new terraform modules](https://github.com/hashicorp/ptfe-migration-terraform). We'll presume
the repository is available as `ptfe-migration-terraform`, change to that directory and we'll remain there for
rest of the steps.

Place your tfvars and tfstate file in the current directory.

### Data Migration

The AMI instance must be prepared before any of the new terraform is used. Use SSH to access
the instance and download the migration tool by running:

```
$ curl -O https://s3.amazonaws.com/hashicorp-ptfe-data/migrator
$ chmod a+x migrator
```

Next, run the migrator tool to move some data off the AMI and into your PostgreSQL installation.

```
$ sudo ./migrator

```

It will ask you to run again to confirm that you wish to run this step as it shutdows operations
on the instance to ensure the consistency of the data:

```
$ sudo ./migrator -confirm
```

Next the migration will run and move the data into PostgreSQL and output the Encryption Password
value that you need to specify to use this terraform module. The output will end with output
similar to:

```
Provide this value as the encryption password in the migration tfvars file:
   jIQzYXtNZNKfkyHbj2WHqTkrSQPkeX8gCrfPAkJHZ5s

```


The value `jIQzYXtNZNKfkyHbj2WHqTkrSQPkeX8gCrfPAkJHZ5s` here will be different for your run of the
migrator tool. Copy that value and add it to your tfvars files like:

```
encryption_password = "jIQzYXtNZNKfkyHbj2WHqTkrSQPkeX8gCrfPAkJHZ5s<Paste>
```

### License File

Place your Terraform Enterprise license file on your local disk and specify the path to it
in the tfvars file like:

```
license_file = "/path/to/license.rli"
```

Where the value is the path on your disk. If you put it in the current directory, you can
specify just the name rather than the full path.

## Initialize

You're now ready to initialize the new terraform modules:

```
terraform init ./terraform/aws-standard
```

## Application

Now we're ready to terraform! 

Run `terraform plan ./terraform/aws-standard` to see the changes that will be made. Double check that they are
correct before continuning. You should not see any changes to your `aws_db_instance` or `aws_s3_bucket`.
If you do, please contact support before continiuing.

When you're satified with the plan, apply it: `terraform apply ./terraform/aws-standard`. This will remove the AMI
instance and boot one running the installer in it's place, configured with all the values provided
by the existing terraform state, plus the license and encryption password you added.

When the terraform completes, you now having a migrated instance!

## Availability

This module runs with the same availability as the AMI did. It is protected against instance loss by
the Auto Scaling Group and boots the new instance automatically without the need for further configuration.

## Software Upgrades

This module installs the latest version of the software automatically upon boot. So an easy way to upgrade
the software is simply to shutdown the instance. When the Auto Scaling Group boots a new one, it will
install the new software and resume operation.

Alternatively, you can upgrade the software from the management console, available on port 8800.

## Management Console

The ELB is modified to provide access to the management console for the installer on port 8800. It is
configured with an autogenerated password that is available in the terraform state (you will see it
as one of the outputs when applying the new terraform modules).

