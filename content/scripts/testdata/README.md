# Check Links Test Data

## Incoming Links

These are downloaded from the [Google Search Console](https://search.google.com/u/0/search-console/links/drilldown?resource_id=sc-domain%3Aterraform.io&type=EXTERNAL&target=&domain=).

The top 1000 can be opened in Google Sheets. Only links to `www.terraform.io` can be tested in this repository, make sure to filter out `registry.` or `app.` subdomain links.

Strip the host and protocol from the urls and sort alphabetically so the `incoming-links.txt` file looks like:

```
/
/docs/backends
/docs/backends/config.html
/docs/backends/init.html
...
```
