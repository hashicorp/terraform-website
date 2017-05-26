# Terraform Website

This repository contains the build process and top-level marketing content
for [the Terraform website][terraform].

It also includes references to the main Terraform repository and provider
repositories via submodules in the `ext` directory, and symlinks into those
from elsewhere under `source`.

This is a [Middleman][middleman] project, which builds a static site from
the various source files.

[middleman]: https://www.middlemanapp.com
[terraform]: https://www.terraform.io

## Running the Site Locally

Running the site locally is simple:

1. Install [Docker](https://docs.docker.com/engine/installation/) if you have not already done so
2. Clone this repo
3. Run `make website`

Open up `http://localhost:4567`. Note that some URLs you may need to append
".html" to make them work (in the navigation).

## Updating for new core or provider releases

The submodules in `ext` track the `stable-website` branch of their
corresponding repositories. Either cherry-picking individual commits to those
branches (for ad-hoc updates between releases) or resetting those branches
to correspond with release tags will cause changes to appear after running
`git submodule update --remote`.

For local development/testing, it's possible to manually run `git checkout`
from within the submodule directories in `ext` to see content from other
branches, such as those submitted as PRs.
