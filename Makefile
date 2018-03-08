VERSION?="0.3.35"
MKFILE_PATH=$(patsubst %/,%,$(dir $(abspath $(lastword $(MAKEFILE_LIST)))))

build:
	@echo "==> Starting build in Docker..."
	@mkdir -p content/build
	@docker run \
		--interactive \
		--rm \
		--tty \
		--volume "$(shell pwd)/ext:/ext" \
		--volume "$(shell pwd)/content:/website" \
		--volume "$(shell pwd)/content/build:/website/build" \
		-e "ENV=production" \
		hashicorp/middleman-hashicorp:${VERSION} \
		bundle exec middleman build --verbose --clean

website:
	@echo "==> Starting website in Docker..."
	@docker run \
		--interactive \
		--rm \
		--tty \
		--publish "4567:4567" \
		--publish "35729:35729" \
		--volume "$(shell pwd)/ext:/ext" \
		--volume "$(shell pwd)/content:/website" \
		hashicorp/middleman-hashicorp:${VERSION}

website-test:
	@echo "==> Testing website in Docker..."
	-@docker stop "tf-website-temp"
	@docker run \
		--detach \
		--rm \
		--name "tf-website-temp" \
		--publish "4567:4567" \
		--volume "$(shell pwd)/ext:/ext" \
		--volume "$(shell pwd)/content:/website" \
		hashicorp/middleman-hashicorp:${VERSION}
	$(MKFILE_PATH)/content/scripts/check-links.sh "http://127.0.0.1:4567" "/"
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
	@echo "==> Starting $(PROVIDER_NAME) provider website in Docker..."
	@docker run \
		--interactive \
		--rm \
		--tty \
		--publish "4567:4567" \
		--publish "35729:35729" \
		--volume "$(PROVIDER_PATH)/website:/website" \
		--volume "$(PROVIDER_PATH)/website:/ext/providers/$(PROVIDER_NAME)/website" \
		--volume "$(shell pwd)/content:/terraform-website" \
		--volume "$(shell pwd)/content/source/assets:/website/docs/assets" \
		--volume "$(shell pwd)/content/source/layouts:/website/docs/layouts" \
		hashicorp/middleman-hashicorp:${VERSION}

website-provider-test:
ifeq ($(PROVIDER_PATH),)
	@echo 'Please set PROVIDER_PATH'
	exit 1
endif
ifeq ($(PROVIDER_NAME),)
	@echo 'Please set PROVIDER_NAME'
	exit 1
endif
	@echo "==> Testing $(PROVIDER_NAME) provider website in Docker..."
	-@docker stop "tf-website-temp"
	@docker run \
		--detach \
		--rm \
		--name "tf-website-$(PROVIDER_NAME)-temp" \
		--publish "4567:4567" \
		--volume "$(PROVIDER_PATH)/website:/website" \
		--volume "$(PROVIDER_PATH)/website:/ext/providers/$(PROVIDER_NAME)/website" \
		--volume "$(shell pwd)/content:/terraform-website" \
		--volume "$(shell pwd)/content/source/assets:/website/docs/assets" \
		--volume "$(shell pwd)/content/source/layouts:/website/docs/layouts" \
		hashicorp/middleman-hashicorp:${VERSION}
	$(MKFILE_PATH)/content/scripts/check-links.sh "http://127.0.0.1:4567" "/docs/providers/$(PROVIDER_NAME)/"
	@docker stop "tf-website-$(PROVIDER_NAME)-temp"

sync:
	@echo "==> Syncing submodules for upstream changes"
	@git submodule update --init --remote

deinit:
	@echo "==> Deinitializing submodules"
	@git submodule deinit --all -f

.PHONY: build website sync
