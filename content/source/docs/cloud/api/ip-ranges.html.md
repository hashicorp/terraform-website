---
layout: "cloud"
page_title: "IP Ranges - API Docs - Terraform Cloud"
---

[200]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
[201]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
[202]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202
[204]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
[304]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304
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
[If-Modified-Since]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since
[JSON API document]: /docs/cloud/api/index.html#json-api-documents
[JSON API error object]: http://jsonapi.org/format/#error-objects
[CIDR Notation]: https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation

# IP Ranges API
IP Ranges provides a list of Terraform Cloud and Enterprise's egress IP ranges. For more information about Terraform Cloud's IP ranges, view our documentation about [Terraform Cloud IP Ranges](../architectural-details/ip-ranges.html).

## IP Ranges Payload

Name                             | Type   | Description
---------------------------------|--------|-------------
`sentinel`                       | array  | List of IP ranges in [CIDR notation] used for outbound requests from Sentinel policies
`notifications`                  | array  | List of IP ranges in [CIDR notation] used for notifications
`vcs`                            | array  | List of IP ranges in [CIDR notation] used for connecting to VCS providers

-> **Note:** The IP ranges for each feature returned by the IP Ranges API may overlap. Additionally, these published ranges do not currently allow for execution of Terraform runs against local resources.

## Get IP Ranges

-> **Note:** The IP Ranges API does not require authentication

-> **Note:** This endpoint supports [If-Modified-Since][] HTTP request header

`GET /meta/ip-ranges`

Status  | Response                                        | Reason
--------|-------------------------------------------------|----------
[200][] | `application/json`                              | The request was successful
[304][] | empty body                                      | The request was successful, IP ranges were not modified since the specified date in `If-Modified-Since` header


### Sample Request

```shell
curl \
  --request GET \
  -H "If-Modified-Since: Tue, 26 May 2020 15:10:05 GMT" \
  https://app.terraform.io/api/meta/ip-ranges
```

### Sample Response

```json
{
  "notifications": [
    "10.0.0.1/32",
    "192.168.0.1/32",
    "172.16.0.1/32"
  ],
  "sentinel": [
    "10.0.0.1/32",
    "192.168.0.1/32",
    "172.16.0.1/32"
  ],
  "vcs": [
    "10.0.0.1/32",
    "192.168.0.1/32",
    "172.16.0.1/32"
  ]
}
```
