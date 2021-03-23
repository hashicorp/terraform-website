#!/usr/bin/env bash
set -e

# Deploys the site with a single command, for the rare manual push. When using
# CI to build the site, you should instead configure uploading and cache-warming
# as separate jobs, so that broken links don't mask a broken build.

"${BASH_SOURCE%/*}/upload.sh"
"${BASH_SOURCE%/*}/warm-cache.sh"
