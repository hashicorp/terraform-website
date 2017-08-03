VERSION?="0.3.28"

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

sync:
	@echo "==> Syncing submodules for upstream changes"
	@git submodule update --init --remote

deinit:
	@echo "==> Deinitializing submodules"
	@git submodule deinit --all -f

.PHONY: build website sync
