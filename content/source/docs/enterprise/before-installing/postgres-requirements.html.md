---
layout: "enterprise"
page_title: "PostgreSQL Requirements - Before Installing - Terraform Enterprise"
---

# PostgreSQL Requirements for Terraform Enterprise

-> **Note:** These requirements apply to the external services operational mode, not the managed disk operational mode. See the [Pre-Install Checklist](./index.html) for more information.

To use an external PostgreSQL database with Terraform Enterprise, the following
requirements must be met:

* The PostgreSQL Server version must be one of the following:
  * `9.4`, `9.5`, `9.6`, `10.x`, `11.x`.
* A PostgreSQL user must be created with the following permissions on the database:
  * The ability to create, modify, and read all tables and indices on all schemas within the database. Usually this is granted if the user is an owner of the database.
  * The ability to create extensions. If it is not feasible to have a user with the "CREATE EXTENSION" privilege, then refer to the [Creating Extensions](#creating-extensions) section below for information on creating the necessary extensions.
* The `rails`, `vault`, and `registry` PostgreSQL schemas must be created on the database. In Terraform Enterprise v201911-1 and later, these schemas will be automatically created if they do not already exist. For Terraform Enterprise v201910-1 and earlier, these schemas must be manually created as detailed in the [Creating Schemas](#creating-schemas) section below.

## Creating Schemas

-> **Note:** This section can be skipped if installing Terraform Enterprise v201911-1 or later as the required database schemas will be automatically created by the Terraform Enterprise application.

If installing Terraform Enterprise v201910-1 or earlier, the database schemas
must be manually created. To create database schemas manually, the
`CREATE SCHEMA` command can be used. Execute the following snippet on the
PostgreSQL database to create the required database schemas manually:

```sql
CREATE SCHEMA rails;
CREATE SCHEMA vault;
CREATE SCHEMA registry;
```

## Creating Extensions

If the configured PostgreSQL user does not have permission to create PostgreSQL extensions
(i.e. is not a superuser), then run the following SQL commands to create the proper extensions:

```sql
CREATE EXTENSION IF NOT EXISTS "hstore" WITH SCHEMA "rails";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "rails";
CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "registry";
```

## Connection Parameters

When providing optional extra keyword parameters for the database connection,
note an additional restriction on the `sslmode` parameter is that only the
`require`, `verify-full`, `verify-ca`, and `disable` values are allowed. The default value of `sslmode` is set to `require` with `external services` installation or `disable` with `demo` installation.

-> **Note:** See the PostgreSQL library documentation for more about [extra parameters related to sslmode](https://www.postgresql.org/docs/9.6/libpq-ssl.html). Terraform Enterprise provides a certificates file at `/tmp/cust-ca-certificates.crt`, which is required by the `verify-full` and `verify-ca` modes. Additional certificates can be added via the [CA Custom Bundle](../install/installer.html#certificate-authority-ca-bundle) setting.
