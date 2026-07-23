.PHONY: list pack publish publish-all clean whoami

# Publishes this repo's Pi-coding-agent packages to npm (see docs/pi-marketplace.md).
# Each plugin that's publishable to npm is a top-level directory with its own
# package.json declaring a "pi" key, e.g. grilling/package.json.

PI_PACKAGES := $(shell for d in */; do p=$${d%/}; [ -f "$$p/package.json" ] && grep -q '"pi"' "$$p/package.json" && echo "$$p"; done)

list: ## List npm packages publishable via the Pi coding agent
	@for p in $(PI_PACKAGES); do echo "$$p  ($$(node -p "require('./$$p/package.json').name")@$$(node -p "require('./$$p/package.json').version"))"; done

whoami: ## Show which npm account you're logged in as
	npm whoami

pack: ## Build a local tarball for inspection: make pack PKG=grilling
	$(if $(PKG),,$(error Usage: make pack PKG=<plugin-name>))
	cd $(PKG) && npm pack

publish: ## Publish one package: make publish PKG=grilling
	$(if $(PKG),,$(error Usage: make publish PKG=<plugin-name>))
	cd $(PKG) && npm publish --access public

# make publish PKG=grilling

publish-all: ## Publish every Pi-publishable package in the repo
	@for p in $(PI_PACKAGES); do \
		echo "==> Publishing $$p"; \
		(cd $$p && npm publish --access public) || exit 1; \
	done

clean: ## Remove local pack tarballs
	@for p in $(PI_PACKAGES); do rm -f $$p/*.tgz; done
