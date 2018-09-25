SHELL = /bin/bash
VERSION?="0.3.35"
MKFILE_PATH=$(patsubst %/,%,$(dir $(abspath $(lastword $(MAKEFILE_LIST)))))
DEPLOY_ENV?="development"

configure_cache:
	mkdir -p tmp/cache

build: configure_cache
	@echo "==> Starting build in Docker..."
	@docker run \
		--interactive \
		--rm \
		--tty \
		--volume "$(shell pwd):/opt/buildhome/repo" \
		--volume "$(shell pwd)/tmp/cache:/opt/buildhome/cache" \
		--env "ENV=production" \
		netlify/build \
		build cd /opt/buildhome/repo && cd content && bundle exec middleman build --verbose

website: configure_cache
	@echo "==> Starting website in Docker..."
	@docker run \
		--interactive \
		--rm \
		--tty \
		--volume "$(shell pwd):/opt/buildhome/repo" \
		--volume "$(shell pwd)/tmp/cache:/opt/buildhome/cache" \
		--publish "4567:4567" \
		--publish "35729:35729" \
		--env "ENV=production" \
		netlify/build \
		build cd /opt/buildhome/repo && cd content && bundle exec middleman

website-test:
	@echo "==> Testing website in Docker..."
	@docker run \
		--detach \
		--rm \
		--name "tf-website-temp" \
		--volume "$(shell pwd):/opt/buildhome/repo" \
		--volume "$(shell pwd)/tmp/cache:/opt/buildhome/cache" \
		--volume "$(shell pwd)/ext:/ext" \
		--publish "4567:4567" \
		--env "ENV=production" \
		netlify/build \
		build /bin/bash -c 'until curl -sS http://localhost:4567/ > /dev/null; do sleep 1; done; $(MKFILE_PATH)/content/scripts/check-links.sh "http://127.0.0.1:4567" "/"'
	@docker stop "tf-website-temp"

website-provider:
ifeq ($(PROVIDER_PATH),)
	@echo 'Please set PROVIDER_PATH'
	exit 1
endif
ifeq ($(PROVIDER_NAME),)
	@echo 'Please set PROVIDER_NAME'
	exit 1
endif
ifeq ($(PROVIDER_SLUG),)
	$(eval PROVIDER_SLUG := $(PROVIDER_NAME))
endif
	@echo "==> Starting $(PROVIDER_SLUG) provider website in Docker..."
	@docker run \
		--interactive \
		--rm \
		--tty \
		--publish "4567:4567" \
		--publish "35729:35729" \
		--volume "$(shell pwd):/opt/buildhome/repo" \
		--volume "$(shell pwd)/tmp/cache:/opt/buildhome/cache" \
		--volume "$(PROVIDER_PATH)/website:/opt/buildhome/repo/website" \
		--volume "$(PROVIDER_PATH)/website:/opt/buildhome/repo//ext/providers/$(PROVIDER_NAME)/website"
		--env "ENV=production" \
		--env PROVIDER_SLUG=$(PROVIDER_SLUG) \
		netlify/build \
		build cd /opt/buildhome/repo && cd content && bundle exec middleman

website-provider-test:
ifeq ($(PROVIDER_PATH),)
	@echo 'Please set PROVIDER_PATH'
	exit 1
endif
ifeq ($(PROVIDER_NAME),)
	@echo 'Please set PROVIDER_NAME'
	exit 1
endif
ifeq ($(PROVIDER_SLUG),)
	$(eval PROVIDER_SLUG := $(PROVIDER_NAME))
endif
	@echo "==> Testing $(PROVIDER_NAME) provider website in Docker..."
	-@docker stop "tf-website-$(PROVIDER_NAME)-temp"
	@docker run \
		--detach \
		--rm \
		--name "tf-website-$(PROVIDER_NAME)-temp" \
		--publish "4567:4567" \
		--volume "$(shell pwd):/opt/buildhome/repo" \
		--volume "$(PROVIDER_PATH)/website:/opt/buildhome/repo/website" \
		--volume "$(PROVIDER_PATH)/website:/opt/buildhome/repo//ext/providers/$(PROVIDER_NAME)/website"
		--volume "$(shell pwd)/tmp/cache:/opt/buildhome/cache" \
		netlify/build \
		build /bin/bash -c 'until curl -sS http://localhost:4567/ > /dev/null; do sleep 1; done; $(MKFILE_PATH)/content/scripts/check-links.sh "http://127.0.0.1:4567/docs/providers/$(PROVIDER_SLUG)/"'
	@docker stop "tf-website-$(PROVIDER_NAME)-temp"

sync:
	@echo "==> Syncing submodules for upstream changes"
	@git submodule update --init --remote

deinit:
	@echo "==> Deinitializing submodules"
	@git submodule deinit --all -f

.PHONY: build website sync
