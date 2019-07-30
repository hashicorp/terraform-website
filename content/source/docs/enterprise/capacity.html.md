---
layout: "enterprise"
page_title: "Capacity and Performance - Terraform Enterprise"
---

# Private Terraform Enterprise Capacity and Performance (Installer)

The maximum capacity and performance of Private Terraform Enterprise (PTFE) is dependent entirely on the resources
provided by the Linux instance it is installed on. There are a few settings that allow the capacity that PTFE
uses to be adjusted to suit the instance.

## Memory + Concurrency

The amount of memory to allocate to a Terraform run and the number of concurrent runs are the primary elements in
understanding capacity above the base services.

By default, PTFE allocates 256 MB of memory to each Terraform run, with a default concurrency of 10 parallel runs.
Therefore, by default PTFE requires 2.6 GB of memory reserved for runs.

After factoring in the memory needed to run the base services that make up the application, the default memory footprint of PTFE is approximately 4 GB.

### Settings

The settings for per-run memory and concurrency are available in the dashboard on port 8800, on the Settings page, under the Capacity section. They can also be set via
the [application settings JSON file when using the automated install procedure](/docs/enterprise/private/automating-the-installer.html#available-settings).

## Increasing Capacity

To increase the number of concurrent runs, adjust the **Capacity** setting. Note that this setting is not limited by
system checks; it depends on the operator to provide enough memory to the system to accommodate the requested
concurrent capacity. For instance, if **Capacity** is set to `100`, the instance would require, at a minimum,
26 GB of memory reserved for Terraform runs.

## Adjusting Memory

The default memory limit of 256 MB per Terraform run is also configurable. Note that this setting is not limited by
system checks; it depends on the operator to provide enough memory to the system to accommodate the requested limits.
If the memory limit is adjusted to 512 MB with the default capacity of 10, the instance would require, at a minimum,
5.2 GB of memory reserved for Terraform runs.

### Downward Adjustment

We do not recommend adjusting the memory limit below 256 MB. Memory is Terraform's primary resource and it
becomes easy for it to go above smaller limits and be terminated mid-run by the Linux kernel.

## CPU

The required CPU resources for an individual Terraform run vary considerably, but in general they are a much more minor
factor than memory due to Terraform mostly waiting on IO from APIs to return.

Our rule of thumb is 10 Terraform runs per CPU core, with 2 CPU cores allocated for the base PTFE services.
So an 8-core instance with 8GB of memory could comfortably run 20 Terraform runs, if the runs are allocated the default
256 MB each.

## Disk

The amount of disk storage available to a system plays a small role in the capacity of an instance.
A root volume with 200GB of storage can sustain a capacity well over 100 concurrent runs.

## Disk I/O

Because of the amount of churn caused by container creation as well as Terraform state management,
highly concurrent setups will begin pushing hard on disk I/O. In cloud environments like AWS that limit disk
I/O to IOPS that are credited per disk, it's important to provision a minimum number to prevent I/O related
stalls.

This resource is harder to predict than memory or CPU usage because it varies per Terraform module,
but in general we suggest 35 IOPS per concurrent Terraform run. So if an instance is configured for
20 concurrent runs, the disk should have 700 IOPS allocated. For reference, on AWS, an EBS volume
with an allocated size of 250 GB comes with a steady state of 750 IOPS.
