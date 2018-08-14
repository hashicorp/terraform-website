---
layout: "extend"
page_title: "Extending Terraform: Versioning Best Practices"
sidebar_current: "docs-extend-best-practices-versioning"
description: |-
  Recommendations for version numbering and documentation.
---

# Versioning

Given the breadth of available Terraform providers, ensuring a consistent experience means setting a standard guideline for compatibility promises. These guidelines are enforced for providers released by HashiCorp and are recommended for all community providers.

## Table of Contents

- [Versioning Specification](#versioning-specification)
- [Changelog Specification](#changelog-specification)
  - [Version Headers](#version-headers)
  - [Catagorization](#catagorization)
  - [Entry Format](#entry-format)
  - [Entry Ordering](#entry-ordering)
  - [Example Changelog](#example-changelog)

## Versioning Specification

Observing that Terraform providers are in many ways analogous to shared libraries in a programming language, we adopted a version numbering scheme for providers that follows the guidelines of [Semantic Versioning](http://semver.org/). In summary, this means that with a version number of the form `MAJOR`.`MINOR`.`PATCH`, the following meanings apply:

- Increasing only the patch number suggests that the release includes only bug fixes, and is intended to be functionally equivalent.
- Increasing the minor number suggests that new features have been added but that existing functionality remains broadly compatible.
- Increasing the major number indicates that significant breaking changes have been made, and thus extra care or attention is required during an upgrade.

Version numbers above `1.0.0` signify stronger compatibility guarantees, based on the rules above.

## Changelog Specification

For better operator experience, we provide a standardized format so development information is available across all providers consistently. The changelog should live in a top level file in the project, named `CHANGELOG` or `CHANGELOG.md`. We generally recommend that the changelog is updated outside of pull requests unless a clear process is setup for handling merge conflicts.

### Version Headers

The upcoming release version number is always at the top of the file and is marked specifically as `(Unreleased)`, with other previously released versions below.

~> **NOTE:** For HashiCorp released providers, the release process will replace the "Unreleased" header with the current date. This line must be present with the target release version to successfully release that version.

```md
## X.Y.Z (Unreleased)

...


## A.B.C (Month Day, Year)

...
```

### Catagorization

Information in the changelog should broken down as follows:

- Backwards incompatibilities (`BACKWARDS INCOMPATIBILITIES`/`BREAKING CHANGES`): This section documents in brief any incompatible changes and how to handle them. This should only be present in major version upgrades.
- Notes (`NOTES`): Additional information for potentially unexpected upgrade behavior, upcoming deprecations, or to highlight very important crash fixes (e.g. due to upstream API changes)
- Features (`FEATURES`): These are major new improvements that deserve a special highlight, such as a new resource or data source.
- Improvements (`IMPROVEMENTS`/`ENHANCEMENTS`): Smaller features added to the project such as a new attribute for a resource.
- Bug fixes (`BUG FIXES`): Any bugs that were fixed.

These should be displayed as a top level keyword (e.g. `BUG FIXES:`) with new lines above and below:

```md

CATEGORY:

```

### Entry Format

Each entry under a category should use the following format:

```md
* subsystem: Descriptive message [GH-1234]
```

For provider development typically the "subsystem" is the resource or data source affected e.g. `resource/vpc`, or `provider` if the change affects whole provider (e.g. authentication logic). Each bullet also references the corresponding pull request number that contained the code changes, in the format of `[GH-####]` (for HashiCorp released providers, this will be automatically updated on release).

### Entry Ordering

To order entries, these basic rules should be followed:

1. If large cross-cutting changes are present, list them first (e.g. `provider`)
2. Order other entries lexicographically based on subsystem (e.g. `resource/load_balancer` then `resource/subnet`)

### Example Changelog

```md
## 1.0.0 (Unreleased)

BREAKING CHANGES:

* Resource `network_port` has been removed [GH-1]

FEATURES:

* **New Resource:** `cluster` [GH-43]

IMPROVEMENTS:

* resource/load_balancer: Add `ATTRIBUTE` argument (support X new functionality) [GH-12]
* resource/subnet: Now better [GH-22, GH-32]

## 0.2.0 (Month Day, Year)

FEATURES:

...
```
