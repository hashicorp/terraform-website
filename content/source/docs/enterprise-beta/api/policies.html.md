---
layout: enterprise2
page_title: "Policies - API Docs - Terraform Enterprise Beta"
sidebar_current: "docs-enterprise2-api-policy"
---

# Policies API

-> **Note**: These API endpoints are in beta and may be subject to change.

[Sentinel Policy as Code](/docs/enterprise-beta/sentinel/index.html) is an embedded policy as code framework integrated with Terraform Enterprise. Policies are defined in organizations and enforced on all workspace Runs between a plan and an apply. This doc covers operations to create, read, update, and delete the Sentinel Policies in an organization. The [Runs API](/docs/enterprise-beta/api/run.html) covers the steps for reading and overriding policy checks in a workspace run.


## Create a Policy

This endpoint enables you to create a policy and associate it with an organization.

| Method | Path           |
| :----- | :------------- |
| POST | /policy |

### Parameters

- `:orgnanization` (`string: <required>`) - specifies the workspace ID to create the new configuration version

### Sample Payload

```json
{ }
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/...
```

### Sample Response

```json
{ }
```


## Update a Policy

This endpoint enables you to update a Policy

| Method | Path           |
| :----- | :------------- |
| POST | /policy/:policy_id |

### Parameters

- `:orgnanization` (`string: <required>`) - specifies the workspace ID to create the new configuration version

### Sample Payload

```json
{ }
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://atlas.hashicorp.com/api/v2/...
```

### Sample Response

```json
{ }
```

## List Policies

List all the policies for a given organization

| Method | Path           |
| :----- | :------------- |
| POST | /policy |

### Parameters

- `:orgnanization` (`string: <required>`) - specifies the workspace ID to create the new configuration version

### Sample Payload

```json
{ }
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://atlas.hashicorp.com/api/v2/...
```

### Sample Response

```json
{ }
```

## Delete a Policy

...

| Method | Path           |
| :----- | :------------- |
| DELETE | /policy/:policy_id |

### Parameters

- `:orgnanization` (`string: <required>`) - specifies the workspace ID to create the new configuration version

### Sample Payload

```json
{ }
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $ATLAS_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://atlas.hashicorp.com/api/v2/policy/pl-xxx
```

### Sample Response

```json
{ }
```