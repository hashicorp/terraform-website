---
layout: "enterprise"
page_title: "Architecture Summary - System Overview - Terraform Enterprise"
---

# Terraform Enterprise Architecture

Terraform Enterprise (TFE) is powered by the same set of services behind HashiCorp’s public SaaS application Terraform Cloud.  The sections below present the functional layers of the architecture how they interact and details pertaining to the corresponding docker containers involved.

~> **Advanced:** The content in this document is not required to operate TFE but is provided to help advanced users understand the product in more depth.

## Application Layer

Understanding the services in the Application Layer and how they interact is crucial to understanding TFE.  The application layer is divided conceptually into two areas, each with specific responsibilities:

- Web Services - Answer requests forwarded by nginx and enqueue jobs for later
- Background Services - Asynchronously process jobs enqueued by web services

Most requests in PTFE follow a similar lifecycle as shown in this diagram

[diag]

A web service receives a request and enqueues a background job to perform the task via the Coordination Layer (see below).  The web service then responds immediately to the original request instead of waiting for the job to be finished.

A background service later claims the job from the Coordination Layer and performs the resource- or time-intensive task in the background without blocking the web service.

Finally, the original web service is notified when then task is complete via an internal webhook.

### Web Services

These services answer requests from the UI and API as well as incoming webhooks from a connected VCS.
++

### Background Services

This is the largest part of the Application Layer and includes multi-purpose Sidekiq workers, Go services that provide key functionality of TFE, and a dynamic fleet of isolated execution environments that perform Terraform runs.
++

## Coordination Layer

The Coordination Layer is responsible for queuing asynchronous jobs and distributing them to background services running in the Application Layer.

[diag]

~> **Note:** While these components are critical to the overall operation of TFE, operators rarely (if ever) need to look at them directly.

## Storage Layer

All application data is stored using PostgreSQL and blob storage. Unless you have configured TFE to use External Services, local instances of these services will be started for you.

~> **Note:** The configuration information provided and/or generated during installation (e.g. database credentials, hostname, etc.) is stored outside of the application.

## Component Interactions

This section details how the individual containers work together to accomplish common tasks.

### Startup - Mounted Disk Mode

This section covers the order in which services start in Mounted Disk mode Terraform Enterprise instances (and also applies to Demo mode). For details on the start up of External Services mode deployments, please refer to the next section.

[diag]

1. The first batch of services starts in parallel
2. Once `nginx` has started, `rabbitmq` starts
3. Once `rabbitmq` has started, `postgres` starts

**Wait for Dependencies**

[diag]

At this point, the application waits for `postgres`, redis, and rabbitmq to start. Once these key services respond successfully to requests, the startup process continues.

1. The remaining services that do not rely on PostgreSQL are launched in parallel. Included in this batch are or two short lived containers, `ptfe_migrations` and `ptfe_registry_migrations`, which exist only to apply any necessary updates to the database schema.
2. The main **web** and **background** services start up:
  5a. Once `ptfe_migrations` has finished, `atlas` and `ptfe_sidekiq` are started in parallel
  5b. Once `ptfe_registry_migrations` has finished, `ptfe_registry_api` and `ptfe_registry_worker` are started in parallel

Finally, startup is complete and the application is ready to go at your configured hostname.

### Startup - External Services Mode

[diag]

1. The first batch of services starts in parallel.
2. Once nginx has started, rabbitmq begins to start

**Wait for Dependencies**

At this point, the application waits for redis, and rabbitmq to start. Once these services and your external PostgreSQL server respond successfully to requests, the startup process continues

[diag]

3. The remaining services that do not rely on PostgreSQL are launched in parallel. Included in this batch are two short lived containers, `ptfe_migrations` and `ptfe_registry_migrations`, which exist only to apply any necessary updates to the database schema.
4. The main web and background services are startup:
  4a. Once `ptfe_migrations` has finished, `atlas` and `ptfe_sidekiq` are started in parallel.
  4b. Once `ptfe_registry_migrations` has finished, `ptfe_registry_api` and `ptfe_registry_worker` are started in parallel.

Finally, startup is complete and the application is ready to use at your configured hostname.

### Module Ingress

The process of importing Terraform modules into the private module registry starts with either a click in the UI or a `POST` to the API. The request is handled the same way in both cases:

[diag]

1. `ptfe_atlas` receives request from `nginx`, pushes a job to Redis for `ptfe_sidekiq`, and then responds to the original request immediately
1. `ptfe_sidekiq` asynchronously pulls the job and passes the details to `ptfe_ingress`
1. `ptfe_ingress` downloads your Git repository and `POST`s it to `archivist`
1. `archivist` persists the repository in blob storage and `POST`s the Object ID to `ptfe_atlas`


At this point, each tagged version of your repository has been persisted in the application. The process to make the modules available in your private module registry begins next:

[diag]

1. `ptfe_atlas` sends the Object ID from `archivist` to the `ptfe_registry_api`
1. `ptfe_registry_api` pulls the module from `archivist`, saves the metadata in PostgreSQL, and passes the details to the `ptfe_registry_worker`
1. `ptfe_registry_worker` extracts the individual modules from your repository, updates the Private Registry tables in PostgreSQL, and `POST`s the results to `ptfe_atlas`

Finally, `ptfe_atlas` receives the callback and sets the module’s state to ingressed in PostgreSQL. The update is now live in the UI.

### Webhook Receipt

Communications between PTFE and a connected VCS Server happen via HTTP Webhooks.  The latest state of the connected Git repository is downloaded using the process below, and then followup Terraform commands are applied by the state machine.

[diag]

1. `ptfe_atlas` receives request from `nginx`, pushes a job to Redis for `ptfe_sidekiq`, and then responds to the original request immediately
1. `ptfe_sidekiq` asynchronously pulls the job and passes the details to `ptfe_ingress`
1. `ptfe_ingress` spawns a separate `git clone` of your Git repository and `POST`s it to `archivist`
1. `archivist` persists the repository in blob storage and `POST`s the Object ID to `ptfe_atlas`

### Terraform Plan

A state machine inside `ptfe_atlas` watches your workspaces at all times. The process is started when a plan begins.

[diag]

1. `ptfe_atlas` detects a state change and enques a background job for `sidekiq` in Redis
2. `sidekiq` asynchronously pulls the job and passes the details to `terraform_build_manager`
3. `terraform_build_manager` (TBM) enqueues a `terraform_build_worker` job in RabbitMQ
4. `terraform_build_worker` (TBW) spins up a temporary environment, runs Terraform plan, and passes the results to `archivist`
5. `archivist` persists the Terraform Plan results and returns a URL to TBW
6. `terraform_build_worker` passes the Terraform Plan results back to TBM
7. `terraform_build_manager` `POST`s the results to an internal webhook
8. `nginx` receives the request and forwards the callback to `ptfe_atlas`

Finally, `ptfe_atlas` receives results of the Terraform plan and begins next actions if any apply.

### Sentinel Run

A state machine inside `ptfe_atlas` is responsible for scheduling Sentinel runs when necessary.

[diag]

1. `ptfe_atlas` detects a state change and queues a background job for `ptfe_sidekiq` in Redis
1. `ptfe_sidekiq` asynchronously pulls the job and schedules a Sentinel run in `nomad`
1. `nomad` runs the Sentinel job and `POST`s the result back to `ptfe_atlas`

Now the result of the Sentinel run is known, but it isn’t persisted until the callback is processed.

[diag]

1. `ptfe_atlas` receives the callback request from `nginx` and streams the response to `archivist`
1. `archivist` saves the Sentinel results to blob storage and returns an Object ID to `ptfe_atlas`

Finally, `ptfe_atlas` updates the metadata in PostgreSQL after it receives confirmation that the details of the run have been persisted.

### Terraform Apply

A state machine inside `ptfe_atlas` watches your workspaces at all times. The process is started when an apply begins.

[diag]

1. `ptfe_atlas` detects a state change and queues a background job for `sidekiq` in Redis
2. `sidekiq` asynchronously pulls the job and passes the details to Terraform Build Manager
3. `terraform_build_manager` (TBM) enqueues a `terraform_build_worker` job in RabbitMQ
4. `terraform_build_worker` (TBW) spins up a temporary environment, runs Terraform plan, and passes the results to `archivist`
5. `archivist` persists the Terraform Apply results and returns a URL to TBW
6. `terraform_build_worker` passes the Terraform apply results back to TBM
7. `terraform_build_manager` `POST`s the results to an internal webhook
8. `nginx` receives the request and forwards the callback to `ptfe_atlas`

## Full Container List

The following table lists every container Terraform Enterprise runs via the Replicated Native Scheduler.  The list is presented by layer as per the above document sections.

| Layer | Container Name | Process Name | Container Function |
| --- | --- | --- | --- |
| Web Services | `ptfe_atlas` | Atlas | Ruby on Rails application that powers the UI and API |
|  | `ptfe_registry_api` | Private Registry API | Go service that powers the private module registry |
| Background Services | `ptfe_sidekiq` | Sidekiq | Ruby workers that run asynchronous jobs enqueued by ptfe_atlas |
|  | `ptfe_state_parser` | Terraform State Parser | Go service that parses Terraform State Files |
|  | `ptfe_build_manager` | Terraform Build Manager | Go service that coordinates Terraform runs, plan & applies |
|  | `ptfe_registry_worker` | Private Module Registry Worker | Go service that parses Git repositories for Private Registry |
|  | `ptfe_build_worker` | Terraform Build Worker | Go service that manages the lifecycle of isolated worker containers |
|  | `ptfe_slug_ingress` | Slug Ingress | Go service that imports Git repositories |
| Coordination Layer | `ptfe_redis` | Redis Cache | In-memory database used for caching and Sidekiq queue. Only used in Mounted Disk mode and Standalone External Services mode deployments (not Active/Active) |
|  | `rabbitmq` | RabbitMQ | Message broker used between Go services |
|  | `ptfe_nomad` | Nomad | Scheduler used to run Sentinel policies |
| Storage | `postgres` | PostgreSQL | Only used in Mounted Disk mode deployments |
|  | `ptfe_archivist` | Archivist | Go service that provides a universal interface to blob storage |
|  | `ptfe_vault` | Vault | Service used to manage secrets and protect sensitive data |
| Replicated | `replicated` | Replicated | PENDING |
|  | `replicated-operator` | Replicated Operator | PENDING |
|  | `replicated-premkit` | Replicated Premkit | PENDING |
|  | `replicated-statsd` | Replicated StatsD | PENDING |
|  | `retraced-api` | RetraceD API | PENDING |
|  | `retraced-cron` | RetraceD Cron | PENDING |
|  | `retraced-nsqd` | RetraceD NSQD | PENDING |
|  | `retraced-postgres` | RetraceD PostgreSQL | PENDING |
|  | `retraced-processor` | RetraceD Processor | PENDING |
| Auxiliary | `influxdb` | InfluxDB |  PENDING |
|  | `telegraf` | Telegraf | PENDING |
|  | `ptfe_backup_restore` | TFE Backup API | PENDING |
|  | `ptfe_health_check` | TFE Health Check API | PENDING |
|  | `ptfe_nginx` | TFE Nginx | PENDING |
|  | `ptfe_outbound_http_proxy` | TFE Outbound HTTP Proxy | PENDING |
|  | `tfe-admin` | TFE Admin | Additional Active/Active node management facilities only |

## Services

These are the services used to run Terraform Enterprise. Each service contains a description of what actions it performs, a policy for restarts, impact of failing or degraded performance, and the service's dependencies.

- [`atlas-frontend` and `atlas-worker`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/atlas.md)
- [`archivist`, `binstore`, `storagelocker`, and `logstream`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/archivist.md)
- [`terraform-build-manager`, and `terraform-build-worker`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/build-pipeline.md)
- [`slug-extract`, `slug-ingress`, `slug-merge`](https://github.com/hashicorp/terraform-enterprise-modules/blob/master/docs/services/slugs.md)

## Data Flow Diagram

The following diagram shows the way data flows through the various services and data stores in Terraform Enterprise.

![tfe-data-flow-arch](assets/tfe-data-flow-arch.png)

(Note: The services in double square brackets are soon to be replaced by the service that precedes them.)

