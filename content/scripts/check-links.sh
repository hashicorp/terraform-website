#!/usr/bin/env bash
set -e

URL=$1
ACCEPT_PATH=$2

wget \
	--tries=120 \
	--accept-regex "${URL}${ACCEPT_PATH}*" \
	--delete-after \
	--level inf \
	--no-directories \
	--no-host-directories \
	--no-verbose \
	--page-requisites \
	--recursive \
	--spider \
	$URL
