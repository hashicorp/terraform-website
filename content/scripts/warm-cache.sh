#!/usr/bin/env bash
set -e

PROJECT_URL="www.terraform.io"

# Warm the cache with recursive wget.
if [ -z "$NO_WARM" ]; then
  echo "Warming Fastly cache..."
  echo ""
  echo "If this step fails, there are likely missing or broken assets or links"
  echo "on the website. Run the following command manually on your laptop, and"
  echo "search for \"ERROR\" in the output:"
  echo ""
  echo "wget --recursive --delete-after https://$PROJECT_URL/"
  echo ""
  wget \
    --delete-after \
    --level inf \
    --no-directories \
    --no-host-directories \
    --no-verbose \
    --page-requisites \
    --recursive \
    --spider \
    "https://$PROJECT_URL/"
fi
