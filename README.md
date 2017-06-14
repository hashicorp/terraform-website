# Terraform Website

This repository contains the build scripts, marketing content and some documentation
for [the Terraform Website][terraform], along with symlinks and submodules into both
the core Terraform repo and the provider repos to include their documentation.

This is a [Middleman][middleman] project, which builds a static site from these source files.

The current approach used in this repository is a temporary compromise to allow us to
execute [the _provider/core split_](https://www.hashicorp.com/blog/upcoming-provider-changes-in-terraform-0-10/)
without a drastic overhaul of the website build process. Unfortunately this current
state has some limitations and annoying workflow, so later in this README there is some
information on how to use this repository to test changes in the upstream repositories.

[middleman]: https://www.middlemanapp.com
[terraform]: https://www.terraform.io

## Contributions Welcome!

If you find a typo or you feel like you can improve the HTML, CSS, or
JavaScript, we welcome contributions. Feel free to open issues or pull requests
like any normal GitHub project, and we'll merge it in.

## Running the Site Locally

The site can be run locally as follows:

1. Install [Docker](https://docs.docker.com/engine/installation/) if you have not already done so
2. Clone this repo and run `make website`

Then open up `http://localhost:4567`. Note that some URLs may need ".html" appended to make them work (in the navigation).

## Previewing changes from the Provider or Core repositories

This repository has an `ext` subdirectory which contains submodules pointing into the
Terraform core repository (`ext/terraform`) and the separated provider repositories
(`ext/providers/*`). These are configured so that by default they will track the
`stable-website` branch in each repository, but this can be temporarily overridden
for local testing. For example:

```
$ cd ext/providers/rundeck
$ git status
... (should show either tracking stable-website branch, or some detached HEAD commit)
$ git fetch <your-repo-url> <your-branch-name>
$ git checkout FETCH_HEAD
... (will indicate that you are in a "detached HEAD state" against your branch)
```

If you are using the "running the site locally" setup described above, the site should
immediately reload to reflect the new content. Sometimes this behaves strangely due
to the shear number of files used with this website, so if things don't seem to be uploading
you can try interrupting the `make website` command with Ctrl+C and re-running it.

For `your-repo-url` in the above example above, use the "Clone or Download" button on the
main page of the repository where you are making your changes (e.g. your fork of a provider repo)

Once you are finished making your changes, you may wish to switch back to the `stable-website`
branch:

```
$ cd ext/providers/rundeck
$ git checkout stable-website
```
