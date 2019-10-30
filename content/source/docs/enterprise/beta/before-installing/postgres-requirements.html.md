---
layout: "enterprise"
page_title: "PostgreSQL Requirements - Before Installing - Terraform Enterprise - Clustering"
---

# PostgreSQL Requirements for Terraform Enterprise

-> **Note:** These requirements apply to the external services operational mode. See the [Pre-Install Checklist](./index.html) for more information.

When Terraform Enterprise uses an external PostgreSQL database, the
following must be present on it:

* PostgreSQL version `>= 9.4`
* User with the ability to create/modify/read tables and indices on all schemas created
  * If it's not feasible to have a user with "CREATE EXTENSION", then create the [extensions](#extensions) below before installation
* The following PostgreSQL schemas must be installed into the database: `rails`, `vault`, `registry`

## Creating Schemas

To create schemas in PostgreSQL, the `CREATE SCHEMA` command is used. So to
create the above required schemas, the following snippet must be run on the
database:

```sql
CREATE SCHEMA rails;
CREATE SCHEMA vault;
CREATE SCHEMA registry;
```

When providing optional extra keyword parameters for the database connection,
note an additional restriction on the `sslmode` parameter is that only the
`require`, `verify-full`, `verify-ca`, and `disable` values are allowed.

## Creating Extensions

If the configured PostgreSQL user does not have permission to create PostgreSQL extensions
(ie is not a superuser), then run the following SQL commands to create the proper extensions:

```sql
CREATE EXTENSION IF NOT EXISTS "hstore" WITH SCHEMA "rails";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "rails";
CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "registry";
```
