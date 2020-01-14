# Terraform Website

This repository contains the build infrastructure and some of the content for [terraform.io][]. Pull requests from the community are welcomed!

## Table of Contents
- [Where the Docs Live](#where-the-docs-live)
- [Deploying Changes to terraform.io](#deploying-changes-to-terraformio)
- [Running the Site Locally](#running-the-site-locally)
- [Previewing Changes from Providers or Terraform Core](#previewing-changes-from-providers-or-terraform-core)
- [Writing Normal Docs Content](#writing-normal-docs-content)
- [Screenshots](#screenshots)
- [Navigation Sidebars](#navigation-sidebars)
- [Living With Submodules](#living-with-submodules)
- [More about `stable-website`](#more-about-stable-website)

[terraform.io]: https://terraform.io
[middleman]: https://www.middlemanapp.com
[tf-repo]: https://github.com/hashicorp/terraform/
[terraform-providers]: https://github.com/terraform-providers/

## Where the Docs Live
↥ [back to top](#table-of-contents)

[terraform.io][] is a static site built from Markdown source files using [Middleman][]. Unlike most such sites, it draws content from a lot of different Git repositories, which can make it challenging to contribute to.

**To find a page the easy way:** view it on [terraform.io][] and click the "Edit this page" link at the bottom. (As of Spring 2019, those links get routed to the correct repo for everything except the Google Cloud Platform provider.)

If you'd rather just remember where to look:

- This repository has the Terraform Enterprise docs, the Terraform GitHub Actions docs, and the Extending Terraform section.
    - Those files can be found at `content/source/docs/`. The `master` branch is the "live" content that gets deployed to terraform.io.
- The [hashicorp/terraform][tf-repo] repo has docs for most of Terraform CLI's core features, including the configuration language, the commands, and more.
    - Those files can be found at `website/docs`. The `stable-website` branch is the "live" content that gets deployed to terraform.io.
- Each provider repo in the [terraform-providers][] GitHub organization has its own provider's docs.
    - Those files can be found at `website/docs`. The `stable-website` branch is the "live" content that gets deployed to terraform.io.

The `stable-website` branch in Terraform and the provider repos has some special behavior. **Community members should target pull requests at `master` and not worry about it;** maintainers (and the curious) can see [More About `stable-website`][inpage-stable] below for more details.

## Deploying Changes to [terraform.io][]
↥ [back to top](#table-of-contents)

- **For changes in this repo:** Merge the PR to master, and the site will automatically deploy in about 20m. 🙌
- **For changes in hashicorp/terraform or terraform-providers/anything:** Merge the PR to master. Then, either:
    - Wait for the next release of the project in question. The changes will be deployed automatically.
    - If you don't want to wait for a release, cherry-pick the commit(s) to that repo's `stable-website` branch and push. Then, either:
        - Wait for the next unrelated site deploy (probably happening in a couple hours), which will pick up your changes automatically.
        - Do a manual CircleCI build or ask someone in the #proj-terraform-docs channel to do so.

The [terraform.io][] site gets deployed by a CI job, currently managed by CircleCI. This job can be run manually by many people within HashiCorp, and also runs automatically whenever a user in the HashiCorp GitHub org merges changes to master. (Note that Terraform releases and provider releases create sync commits to terraform-website, which will trigger a deploy.) In practice, the site gets deployed a few times a day.

## Running the Site Locally
↥ [back to top](#table-of-contents)

You can preview the website from a local checkout of this repo as follows:

1. Install [Docker](https://docs.docker.com/install/) if you have not already done so.
2. Go to the top directory of this repo in your terminal, and run `make website`.
3. Open `http://localhost:4567` in your web browser.
4. When you're done with the preview, press ctrl-C in your terminal to stop the server.

The local preview will include content from this repo and from any [_currently active_ submodules][inpage-submodules]; content from inactive submodules will be 404.

While the preview is running, you can edit pages and Middleman will automatically rebuild them.

## Previewing Changes from Providers or Terraform Core
↥ [back to top](#table-of-contents)

To preview changes from your fork of Terraform or one of the providers, first make sure the necessary submodule is active. Run `git submodule init ext/terraform` or `git submodule init ext/providers/<SHORT NAME>` (where `<SHORT NAME>` is the name used in the provider's docs URLs), then run `git submodule update`. (For more information, see [Living With Submodules][inpage-submodules] below.)

Once the submodule is active, you can go into its directory and fetch and check out new commits. If you plan to routinely edit those docs, you can add an additional remote to make it easier to fetch from and push to your fork.

You can even make direct edits to the submodule's content, as long as you remember to commit them and push your branch before resetting the submodule.

For example:

```
$ cd ext/providers/rundeck
$ git status
... (should show either tracking stable-website branch, or some detached HEAD commit)
$ git fetch <YOUR-REPO-URL> <YOUR-BRANCH-NAME>
$ git checkout FETCH_HEAD
... (will indicate that you are in a "detached HEAD state" against your branch)
```

To find your fork's repo URL, use the "Clone or Download" button on the main page of your fork on GitHub.

Once you finish testing your changes, you can reset the submodule to its normal state by returning to the root of `terraform-website` and running `git submodule update`.

> ### Tip: Refreshing Symlinked Nav Sidebars
>
> If you're updating a nav sidebar `.erb` file in a provider or in Terraform core, the Middleman preview server might not automatically refresh the affected pages. You can give it a nudge by finding `terraform-website`'s symlink to that `.erb` and running `touch -h` on it (for example, `touch -h content/source/layouts/aws.erb`).
>
> Stopping and restarting the preview server also works fine, but this can be faster.

## Writing Normal Docs Content
↥ [back to top](#table-of-contents)

Our docs content uses a fairly standard Middleman-ish/Jekyll-ish format.

### Files

One file per page. Filenames should usually end in `.html.md` or `.html.markdown`, which behave identically.

A page's location in the directory structure determines its URL.

- For files in this repo, the root of the site starts at `content/source/`.
- For files in the submodules, the actual files live somewhere in `ext/` and we use symlinks to put them somewhere under `content/source/`. You can check where the symlinks point with `ls -l`, or you can just find files with the "Edit this page" links on [terraform.io][].

### YAML Frontmatter

Each file should begin with YAML frontmatter, like this:

```
---
layout: "enterprise2"
page_title: "Naming - Workspaces - Terraform Enterprise"
sidebar_current: "docs-enterprise2-workspaces-naming"
---
```

Leave a blank line before the first line of Markdown content. We use the following frontmatter keys:

- `page_title` (required) — The title that displays in the browser's title bar. Generally formatted as `<PAGE> - <SECTION> - <PRODUCT>`, like "Naming - Workspaces - Terraform Enterprise".
- `layout` (required) — Which navigation sidebar to display for this page. A layout called `<NAME>` gets loaded from `./content/source/layouts/<NAME>.erb`.
- `description` (optional) — The blurb that appears in search results, to summarize everything you'll find on this page. Auto-generated if omitted.
- `sidebar_current` (deprecated) — No longer used for anything. Omit this from new pages, and feel free to remove it from existing ones.

### Link Style

When making a link to another page on the website:

- Always omit the protocol and hostname. (For example: `/docs/configuration/index.html`, not `https://www.terraform.io/docs/configuration/index.html`.)
- When linking _within a given section_ of the docs, use relative links whenever possible. (For example: to link to `https://www.terraform.io/docs/providers/aws/r/ec2_transit_gateway.html` from another AWS resource, write `./ec2_transit_gateway.html`; from an AWS data source, write `../r/ec2_transit_gateway.html`.) This takes less space, and makes content more portable if we need to reorganize the site in the future (spoiler: we will).

### Content Formatting

Content is in Markdown, with a few local syntax additions described below. Try to keep it mostly pure Markdown; sometimes a little HTML is unavoidable, but not often.

#### Callouts

If you start a paragraph with a special arrow-like sigil, it will become a colored callout box. You can't make multi-paragraph callouts. For colorblind users (and for clarity in general), we try to start callouts with a strong-emphasized word to indicate their function.

Sigil | Start text with   | Color
------|-------------------|-------
`->`  | `**Note:**`       | blue
`~>`  | `**Important:**`  | yellow
`!>`  | `**Warning:**`    | red


#### Auto Header IDs

Like GitHub and a lot of other places, terraform.io automatically generates `id` attributes for headers to enable direct linking.

The basic transform to make IDs from header text is something like "lowercase it, delete anything other than `[a-z0-9_-]`, and replace runs of spaces with a hyphen," but since the exact behavior can be squirrelly, we recommend checking the actual ID in a preview before linking to it. The in-page quick-nav menu at the top of each page is helpful for finding the header you want.

We also auto-generate IDs for code spans that are the first child of a list item, since it's common for long lists of arguments or attributes to be formatted that way.

## Screenshots
↥ [back to top](#table-of-contents)

Some areas of documentation (mostly Terraform Cloud) make extensive use of screenshots. If you're adding or updating screenshots, please try to make them:

- 1024px wide
- As tall as necessary to show the content and any necessary context, but not taller
- 1x resolution

Both Firefox and Chrome have "responsive design" views for simulating various devices; this should let you lock the width and set the DPR to 1. (Firefox also has an integrated screenshot feature, located under the "dot dot dot" menu in the address bar.)

## Navigation Sidebars
↥ [back to top](#table-of-contents)

Every page should be reachable from a navigation sidebar, with only rare exceptions. _If you create a new page, add it to the relevant sidebar._

Sidebars are in .erb files, and can be found in `content/source/layouts/` (this repo), `website/layouts/` (terraform core), or `website/` (providers). A page uses the sidebar file that matches the `layout` key in its YAML frontmatter (plus the `.erb` extension).

Sidebars generally look like this:

```erb
<% wrap_layout :inner do %>
  <% content_for :sidebar do %>
    <h4>TITLE</h4>

    <ul class="nav docs-sidenav">
      <li>
        <a href="...">SECTION LINK</a>
        <ul class="nav">
          <li>
            <a href="...">PAGE IN SECTION</a>
          </li>
          ...
        </ul>
      </li>
    </ul>

    <%= partial("layouts/otherdocs", :locals => { :skip => "Terraform Enterprise" }) %>
  <% end %>
  <%= yield %>
<% end %>
```

### CSS Classes for Sidebars

- `nav` -- Every `<ul>` in the sidebar should have this.
- `docs-sidenav` -- The outermost `<ul>` should also have this.
- `nav-auto-expand` -- Used for inner `<ul>`s that should default to "open" whenever their parent is opened. Useful for when you want to separate things into subcategories but don't want to require an extra click to navigate into those subcategories.
- `nav-visible` -- Used for inner `<ul>`s that should always display as "open," regardless of the current page. Use this sparingly, and avoid using it for large sections; readers can use the "expand all" control if they need to see everything at once.

A lot of existing sidebars have a ton of ERB tags that call a `sidebar_current` method. Ignore these, and don't worry about including them when making updates. They were for a hack that isn't needed anymore.

You don't need to add anything special to a sidebar to get the dynamic JavaScript open/close behavior, but note that the "expand all" and filter controls are only added for sidebars with more than a certain number of links.

## Living With Submodules
↥ [back to top](#table-of-contents)

[inpage-submodules]: #living-with-submodules

Using submodules lets us keep the docs for providers and Terraform core right next to the code, which is very helpful for the engineers who do most of the docs updates. However, it imposes some extra costs when working with this repo. Here's how to get around the worst of those costs.

### Basics

In your local checkout of this repo, Git submodules can be active or sleeping. The `git submodule init <PATH>` and `git submodule deinit <PATH>` commands switch them between the two states.

Once you `init` a submodule, you usually need to run `git submodule update`, which will either do the initial checkout or update the working copy to the commit that `terraform-website` currently expects.

If a submodule shows up as "changed" in `git status` but you haven't done anything with it, it probably just means you updated your `terraform-website` branch and it now says the submodule should be at a newer commit. Run `git submodule update` to resolve it. Inactive submodules don't show up in `git status`.

In general, you should never need to commit a submodule update to `terraform-website`; updates get handled automatically during provider releases, and aren't necessary for getting new content onto the website anyway.

Avoid running `git rm` on a submodule unless you know what you're doing. You usually want `git submodule deinit` instead.

### Don't Keep Every Submodule Active

Earlier instructions for working with this repo said to use `git submodule init` (with no `<PATH>` argument) or `git submodule update --init` or `make sync` to activate everything. **Don't do that.** Git commands will take forever to run, and if your `$PS1` includes hints about the current directory's Git status, your entire terminal will slow to a **c r a w l.**

Instead, only init the specific submodules you currently need to work with (`git submodule init ext/providers/aws`), and feel free to de-init them when you're done. De-initting is non-destructive as long as you've committed your changes within the submodule (and preferably pushed your branch) -- Git keeps the repository data cached out of the way, so it dosen't even need to clone the entire repo again the next time you init it.

If you previously activated a hundred submodules and regret it, you can run `git submodule deinit --all` or `make deinit` to start fresh.

### ...Unless You Have to Search Every Page

On rare occasions, you may need to search every page on the site for something (usually a broken link). If that's the job, then you do need to init everything. Here's how to make that easier:

- `export PS1='$ '` if your prompt includes Git status, so your shell can at least run normal commands without becoming ill.
- If you're using a CLI search tool like [`ag`](https://github.com/ggreer/the_silver_searcher), `cd` into the `content/source` directory and use the `--follow` / `-f` option with your search (or whatever option makes your tool of choice follow symlinks).
- Deinit all when you're done, and close your terminal tab so you can get your normal prompt back.

### New provider repositories

When creating a completely new provider repository, a few extra steps are required to be able to render the docs.

- Start by creating a layout in `terraform-provider-your-provider/website`.
  See [Navigation Sidebars](#navigation-sidebars) for more details.

- To simplify the following steps, set an environment variable in your shell with your provider name, like
  `export PROVIDER_REPO=your-provider`

- Finally, set up symlinks allowing `terraform-website` to correctly generate and link your files.

```bash
# link the new provider repo
pushd "$GOPATH/src/github.com/hashicorp/terraform-website/ext/providers"
ln -sf "$GOPATH/src/github.com/terraform-provider-$PROVIDER_REPO" "$PROVIDER_REPO"
popd

# link the layout file
pushd "$GOPATH/src/github.com/hashicorp/terraform-website/content/source/layouts"
ln -sf "../../../ext/providers/$PROVIDER_REPO/website/$PROVIDER_REPO.erb" "$PROVIDER_REPO.erb"
popd

# link the content
pushd "$GOPATH/src/github.com/hashicorp/terraform-website/content/source/docs/providers"
ln -sf "../../../../ext/providers/$PROVIDER_REPO/website/docs" "$PROVIDER_REPO"
popd

# start middleman
cd "$GOPATH/src/github.com/terraform-provider-$PROVIDER_REPO"
make website

# Note: if you haven't already, copy a GNUmakefile from one of the other provider repos
# e.g.: https://github.com/terraform-providers/terraform-provider-google/blob/master/GNUmakefile
```

- Finally, open `http://localhost:4567/docs/providers/[your-provider]` in your web browser to visualize your provider's docs.

## More About `stable-website`
↥ [back to top](#table-of-contents)

[inpage-stable]: #more-about-stable-website

Each submodule repo (Terraform and the providers) is expected to have a special `stable-website` branch with docs for the most recent production release of that repo's software. When the website is deployed, it pulls in the current content of `stable-website` for every submodule.

The same CI system handles releases of Terraform, the providers, and [terraform.io][], and it has some special behavior around `stable-website`:

- When releasing a production build of Terraform or a provider, CI does a hard reset and a force-push to sync `stable-website` to the current release's commit.

    CI also automatically commits to `terraform-website` (this repo) to update every submodule to the current head of its `stable-website` branch, but this is only for the convenience of people working locally on the website; normal deployment to [terraform.io][] ignores the current state of the submodules.
- Between releases, engineers and others routinely update the docs on the `master` branch. By default, we assume these updates are relevant to the _next_ release, so we don't display them on the website yet.
- **If a docs update is also relevant to the current release,** it should be cherry-picked onto `stable-website` _after_ it has been merged to `master`. (Unless it's a low-priority fix that can wait until the next release.)

    This happens routinely, so anyone who can merge to `master` should also be able to merge to (or directly push) `stable-website`. Whoever clicks the merge button should make sure they know whether this commit needs a cherry-pick.
- During the next release, `stable-website` gets forcibly reset to that release's commit (which is probably from `master`), blowing away anything done on `stable-website` in the meantime.

To ensure your provider doesn't lose any docs content, make sure the only changes you merge to `stable-website` are cherry-picks from `master`. The only case for unique commits is if you specifically _want_ a change to be reverted upon the next release (for example, a warning about a bug that was just fixed on `master`).
