---
layout: "cloud"
page_title: "Policy Set Parameters - API Docs - Terraform Cloud"
---

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[202]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202
[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[400]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
[401]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
[403]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
[404]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
[409]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
[412]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
[422]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
[429]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
[500]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
[504]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
[JSON API document]: /docs/cloud/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects

# Policy Set Parameters API

This set of APIs covers create, update, list and delete operations on parameters.


## Create a Parameter

`POST /policy-sets/:policy_set_id/parameters`

Parameter       | Description
----------------|------------
`:policy_set_id` | The ID of the policy set to create the parameter in.

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.


Key path                                 | Type   | Default | Description
-----------------------------------------|--------|---------|------------
`data.type`                              | string |         | Must be `"vars"`.
`data.attributes.key`                    | string |         | The name of the parameter.
`data.attributes.value`                  | string | `""`    | The value of the parameter.
`data.attributes.category`               | string |         | The category of the parameters. Must be `"policy-set"`.
`data.attributes.sensitive`              | bool   | `false` | Whether the value is sensitive. If true then the parameter is written once and not visible thereafter.


### Sample Payload

```json
{
  "data": {
    "type":"vars",
    "attributes": {
      "key":"some_key",
      "value":"some_value",
      "category":"policy-set",
      "sensitive":false
    }
  }
}
```

### Sample Request

```shell
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/policy-set/pol-u3S5p2Uwk21keu1s/parameters
```

### Sample Response

```json
{
  "data": {
    "id":"var-EavQ1LztoRTQHSNT",
    "type":"vars",
    "attributes": {
      "key":"some_key",
      "value":"some_value",
      "sensitive":false,
      "category":"policy-set"
    },
    "relationships": {
      "configurable": {
        "data": {
          "id":"pol-u3S5p2Uwk21keu1s",
          "type":"policy-sets"
        },
        "links": {
          "related":"/api/v2/policy-sets/pol-u3S5p2Uwk21keu1s"
        }
      }
    },
    "links": {
      "self":"/api/v2/policy-sets/pol-u3S5p2Uwk21keu1s/parameters/var-EavQ1LztoRTQHSNT"
    }
  }
}
```

## List Parameters

`GET /policy-sets/:policy_set_id/parameters`

Parameter       | Description
----------------|------------
`:policy_set_id` | The ID of the policy set to list parameters for.

### Sample Request

```shell
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
"https://app.terraform.io/api/v2/policy-sets/pol-u3S5p2Uwk21keu1s/parameters"
```

### Sample Response

```json
{
  "data": [
    {
      "id":"var-AD4pibb9nxo1468E",
      "type":"vars",
      "attributes": {
        "key":"name",
        "value":"hello",
        "sensitive":false,
        "category":"policy-set",
      },
      "relationships": {
        "configurable": {
          "data": {
            "id":"pol-u3S5p2Uwk21keu1s",
            "type":"policy-sets"
          },
          "links": {
            "related":"/api/v2/policy-sets/pol-u3S5p2Uwk21keu1s"
          }
        }
      },
      "links": {
        "self":"/api/v2/policy-sets/pol-u3S5p2Uwk21keu1s/parameters/var-AD4pibb9nxo1468E"
      }
    }
  ]
}
```

## Update Parameters

`PATCH /policy-sets/:policy_set_id/parameters/:parameter_id`

Parameter       | Description
----------------|------------
`:policy_set_id` | The ID of the policy set that owns the parameter.
`:parameter_id`  | The ID of the parameter to be updated.

### Request Body

This POST endpoint requires a JSON object with the following properties as a request payload.

Properties without a default value are required.

Key path          | Type   | Default | Description
------------------|--------|---------|------------
`data.type`       | string |         | Must be `"vars"`.
`data.id`         | string |         | The ID of the parameter to update.
`data.attributes` | object |         | New attributes for the parameter. This object can include `key`, `value`, `category` and `sensitive` properties, which are described above under [create a parameter](#create-a-parameter). All of these properties are optional; if omitted, a property will be left unchanged.

### Sample Payload

```json
{
  "data": {
    "id":"var-yRmifb4PJj7cLkMG",
    "attributes": {
      "key":"name",
      "value":"mars",
      "category":"policy-set",
      "sensitive": false
    },
    "type":"vars"
  }
}
```

### Sample Request

```bash
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request PATCH \
  --data @payload.json \
  https://app.terraform.io/api/v2/policy-sets/pol-u3S5p2Uwk21keu1s/parameters/var-yRmifb4PJj7cLkMG
```

### Sample Response

```json
{
  "data": {
    "id":"var-yRmifb4PJj7cLkMG",
    "type":"vars",
    "attributes": {
      "key":"name",
      "value":"mars",
      "sensitive":false,
      "category":"policy-set",
    },
    "relationships": {
      "configurable": {
        "data": {
          "id":"pol-u3S5p2Uwk21keu1s",
          "type":"policy-sets"
        },
        "links": {
          "related":"/api/v2/policy-sets/pol-u3S5p2Uwk21keu1s"
        }
      }
    },
    "links": {
      "self":"/api/v2/policy-sets/pol-u3S5p2Uwk21keu1s/parameters/var-yRmifb4PJj7cLkMG"
    }
  }
}
```

## Delete Parameters

`DELETE /policy-sets/:policy_set_id/parameters/:parameter_id`

Parameter       | Description
----------------|------------
`:policy_set_id` | The ID of the policy set that owns the parameter.
`:parameter_id`  | The ID of the parameter to be deleted.

### Sample Request

```bash
$ curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request DELETE \
  https://app.terraform.io/api/v2/policy-sets/pol-u3S5p2Uwk21keu1s/parameters/var-yRmifb4PJj7cLkMG
```
