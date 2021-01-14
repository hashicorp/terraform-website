#!/usr/bin/env bash
# Check the most popular inbound links from the web at large, and make sure they
# either work as expected or got redirected to somewhere else. Takes the site
# URL (i.e. https://www.terraform.io) as an argument, so that it can also be run
# against a local server... but we don't generally do that, since this is only
# really useful when used against the production site.

set -e

URL=$1

redirects_file="$(mktemp)"
# This line parses redirects.txt to get a plain list of paths that got
# redirected, which we later use to filter the incoming links list.
    # the awk: Only grab the first field (the "old" path).
    # the grep: Throw out any comments or empty lines.
# By the way, all this work to ignore redirected links isn't really necessary,
# because wget should treat redirected URLs as successes. But it does maybe save
# us a few HTTP requests.
cat content/redirects.txt \
    | awk -F' ' '{print $1}' \
    | grep -v -E -e '^#' -e '^\s*$' \
    | sort | uniq \
    > "$redirects_file"

echo "Checking known incoming links..."
# the grep: print all the lines in incoming-links.txt that DON'T match ANY of
# the lines in $redirects_file.
# the awk: prepend the site URL to the paths.
grep -v -x -f "$redirects_file" content/scripts/testdata/incoming-links.txt \
    | awk "{print \"${URL}\" \$0}" \
    | wget \
        --tries=120 \
        --delete-after \
        --no-directories \
        --no-host-directories \
        --no-verbose \
        --spider \
        --waitretry=120 \
        --input-file -

rm "$redirects_file"
