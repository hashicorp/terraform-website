#!/usr/bin/env bash
set -e

URL=$1
ACCEPT_PATH=$2
REJECT_PATH=$3

if [ -n "$REJECT_PATH" ]; then
	REJECT_REGEX_ARG="--reject-regex ${URL}${REJECT_PATH}"
fi

if [[ $ACCEPT_PATH == "/" ]]; then
	redirects_file="$(mktemp)"
	cat content/redirects.txt| awk -F' ' '{print $1}' | grep -v '^#' | sort | uniq > "$redirects_file"

	echo "Checking known incoming links..."
	grep -v -x -f "$redirects_file" content/scripts/testdata/incoming-links.txt \
		| awk "{print \"${URL}\" \$0}" \
		| wget \
			--tries=120 \
			--accept-regex "${URL}${ACCEPT_PATH}*" \
			--delete-after \
			--no-directories \
			--no-host-directories \
			--no-verbose \
			--spider \
			--waitretry=120 \
			--input-file -

	rm "$redirects_file"
fi

echo "Crawling site..."
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
	--waitretry=120 \
	$URL
