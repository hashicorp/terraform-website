#!/usr/bin/env bash
set -e

URL=$1
ACCEPT_PATH=$2
REJECT_PATH=$3

if [ -n "$REJECT_PATH" ]; then
	REJECT_REGEX_ARG="--reject-regex ${URL}${REJECT_PATH}"
fi

wget \
	--tries=120 \
	--accept-regex "${URL}${ACCEPT_PATH}*" \
	$REJECT_REGEX_ARG \
	--delete-after \
	--level inf \
	--no-directories \
	--no-host-directories \
	--no-verbose \
	--page-requisites \
	--recursive \
	--spider \
	$URL
