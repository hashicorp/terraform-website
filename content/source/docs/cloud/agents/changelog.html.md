---
layout: "cloud"
page_title: "Changelog - Terraform Cloud Agents - Terraform Cloud and Terraform Enterprise"
---

# Terraform Cloud Agent Changelog

These are the release notes from the Terraform Cloud Agent application. Changes
within each release are categorized into one or more of the following labels:

* `FEATURES` - Used for net-new features being added to the agent.
* `BUG FIXES` - Backward-compatible fixes for buggy functionality.
* `IMPROVEMENTS` - Functional improvements to performance, effeciency, etc.
* `SECURITY FIXES` - Fixes for security-related issues.
* `BREAKING CHANGES` - Reserved for changes which break previous functionality.

Each version below corresponds to a release artifact available for download on
the official [releases website](https://releases.hashicorp.com/tfc-agent/).

## 1.0.0 (10/29/2021)

BREAKING CHANGES:

* Changed logging to only include Terraform output at trace level (#88)
* Removed deprecated `-disable-update` and `TFC_AGENT_DISABLE_UPDATE` (#95)

SECURITY FIXES:

* Removed all SUID/SGID binaries from the Docker container (#91)

BUG FIXES:

* Fixed agent behavior when core HTTP requests block for a long time (#90)

IMPROVEMENTS:

* Added additional metadata to logs when using JSON logging mode (#84)
* Added more descriptive log when new major versions become available (#89)
* Increased HTTP retries when receiving server errors from TFC (#92)
* Added utilities to Docker image to support modules, provisioners, etc. (#93)
* Added support for Terraform versions 1.1+ via the "cloud" integration (#94)
* Added detection of unrecognized TFC_AGENT_* environment variables (#97)

## 0.4.2 (10/06/2021)

BUG FIXES:

* Fixed errors resulting from using "disabled" auto-update mode (#81)
* Fixed trace flushing to ensure all spans are recorded properly (#82)

IMPROVEMENTS:

* Added verification of core plugin major version (#80)

## 0.4.1 (09/13/2021)

IMPROVEMENTS:

* Increased timeout for generating JSON artifacts from one to five minutes (#78)
* Improved timeout logging when generating JSON artifacts (#78)

## 0.4.0 (08/20/2021)

FEATURES:

* Added configurable automatic update strategy to make upgrades safer (#59)

BUG FIXES:

* Fixed segfault when no valid Terraform files were found (#67)

## 0.3.2 (07/22/2021)

BUG FIXES:

* Fixed Docker image OS permissions for automatic updates (#64)

## 0.3.1 (07/22/2021)

BUG FIXES:

* Fixed Terraform output buffer corruption (#63)

## 0.3.0 (07/07/2021)

BREAKING CHANGES:

* Changed the user in the Docker container to be non-root (#56)

SECURITY FIXES:

* Changed the user in the Docker container to be non-root (#56)

## 0.2.1 (06/03/2021)

IMPROVEMENTS:

* Added HTTP retries during registration and status updates. (#53)

FEATURES:

* Added support for JSON-formatted log output (#54)

BUG FIXES:

* Fixed release builds to always compile binaries statically (#55)

## 0.2.0 (06/18/2021)

FEATURES:

* Added support for using custom Terraform bundles (#52)
* Added support for Terraform's -replace flag (#51)
* Added support for Terraform's -refresh-only flag (#49)
* Added support for structured run output (#34)

BUG FIXES:

* Fixed Terraform resource targeting (#50)

## 0.1.14 (05/06/2021)

BREAKING CHANGES:

* Updated the HashiCorp GPG public key for release verification (#41)

## 0.1.13 (05/06/2021)

FEATURES:

* Added support for Terraform's -refresh=false flag (#43)
* Added support for flash messages (#47)

## 0.1.12 (04/27/2021)

FEATURES:

* Added support for exporting tracing and metrics via OpenTelemetry (#38)

## 0.1.11 (04/14/2021)

IMPROVEMENTS:

* Expanded signal handling to include SIGTERM, SIGINT, and SIGQUIT (#39)

## 0.1.10 (04/05/2021)

IMPROVEMENTS:

* Added support for Terraform versions back to v0.9.1 (#35)

## 0.1.9 (03/09/2021)

BUG FIXES:

* Fixed upgrades from Terraform v0.12 to v0.13 (#33)

IMPROVEMENTS:

* Added base OS update during Docker image builds (#30)

## 0.1.8 (01/11/2021)

BUG FIXES:

* Added a work-around for Docker sending multiple INT signals on ctrl+c (#29)

## 0.1.7 (01/07/2021)

SECURITY FIXES:

* Removed access to tfc-agent configuration env vars after agent boot up (#28)

## 0.1.6 (01/05/2021)

FEATURES:

* Added variable sensitivity propagation for Terraform 0.14+ (#27)

## 0.1.5 (12/03/2020)

SECURITY:

* Mitigated zipslip vulnerability (#24)

## 0.1.4 (10/21/2020)

BUG FIXES:

* Fixed handling of user-defined SSH keys during Terraform runs (#21)

## 0.1.3 (09/08/2020)

BUG FIXES:

* Removed dynamic linker cache in Docker image (#20)

## 0.1.2 (08/14/2020)

BUG FIXES:

* Fixed handling of custom env vars when running "terraform version" (#19)

## 0.1.1 (08/12/2020)

BUG FIXES:

* Added required packages used by Terraform for cloning modules

## 0.1.0 (08/12/2020)

Initial release
