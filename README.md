# Terraform Website [![CI Status](https://circleci.com/gh/hashicorp/terraform-website.svg?style=svg&circle-token=8b4edf41fc4a4a822fc5c6d10e45f0c5140beaf8)](https://circleci.com/gh/hashicorp/terraform-website/tree/master)

This repository contains the build infrastructure and some of the content for [terraform.io][]. Pull requests from the community are welcomed!

## Table of Contents

- [How the Site Works](#how-the-site-works)
- [Where the Docs Live](#where-the-docs-live)
- [Deploying Changes to terraform.io](#deploying-changes-to-terraformio)
- [Running the Site Locally](#running-the-site-locally)
- [Previewing Changes from Terraform Core](#previewing-changes-from-terraform-core)
- [Writing Normal Docs Content](#writing-normal-docs-content)
- [Screenshots](#screenshots)
- [Navigation Sidebars](#navigation-sidebars)
- [Using Submodules](#using-submodules)
- [Finding Broken Links](#finding-broken-links)
- [More about `stable-website`](#more-about-stable-website)

[terraform.io]: https://terraform.io
[middleman]: https://www.middlemanapp.com
[tf-repo]: https://github.com/hashicorp/terraform/
[terraform-providers]: https://github.com/terraform-providers/

## How the Site Works

↥ [back to top](#table-of-contents)

[terraform.io][] is in transition at the moment, and the production site is kind of hybrid:

- Fastly handles all the traffic.
- The following paths (all marketing content, at the moment) are proxied to a Next.js app running on Vercel:
    - `/` (the front page)
    - `/community`
    - `/cloud` (and all sub-paths under `/cloud`)

    For help with these pages, talk to the Web Platform team!
- The rest of the site falls through to static pages built with [Middleman][]. That's what this repository manages!

## Where the Docs Live

↥ [back to top](#table-of-contents)

Docs live in a couple different repos. (**To find a page the easy way:** view it on [terraform.io][] and click the "Edit this page" link at the bottom.)

- This repository, under `content/source/docs/`:
    - Terraform Cloud docs
    - Terraform Enterprise docs
    - Extending Terraform
    - Publishing Providers and Modules

    **Notable branches:** `master` is the "live" content that gets deployed to terraform.io. The site gets redeployed for new commits to master.
- [hashicorp/terraform][tf-repo], under `website/docs`:
    - Terraform CLI docs
    - Terraform Language docs

    **Notable branches:** `stable-website` is the "live" content that gets deployed to terraform.io, but docs changes should get merged to master (and/or one of the long-lived version branches) first. See [More About `stable-website`][inpage-stable] below for more details.
- A few remaining provider repos... but those won't be here for long! All but a few have migrated to [the Registry](https://registry.terraform.io), and the rest are leaving soon.

## Deploying Changes to [terraform.io][]

↥ [back to top](#table-of-contents)

- **For changes in this repo:** Merge the PR to master, and the site will automatically deploy in about 20m. 🙌
- **For changes in hashicorp/terraform:** Merge the PR to master. Then, either:
    - Wait for the next Terraform release. The changes will be deployed automatically.
    - If you want your changes deployed sooner, cherry-pick them to the `stable-website` branch and push. They'll be included in the next site deploy.

        New commits in hashicorp/terraform don't automatically deploy the site, but an unrelated site deploy will usually happen within a day. If you can't wait that long, you can do a manual CircleCI build or ask someone in the #proj-terraform-docs channel to do so:

        - Log in to circleci.com, and  make sure you're viewing the HashiCorp organization.
        - Go to the terraform-website project's list of workflows.
        - Find the most recent "website-deploy" workflow, and click the "Rerun workflow from start" button (which looks like a refresh button with a numeral "1" inside).

The [terraform.io][] site gets deployed by a CI job, currently managed by CircleCI. This job can be run manually by many people within HashiCorp, and also runs automatically whenever a user in the HashiCorp GitHub org merges changes to master. (Note that Terraform releases create sync commits to terraform-website, which will trigger a deploy.) In practice, the site gets deployed a few times a day.

## Running the Site Locally

↥ [back to top](#table-of-contents)

You can preview the website from a local checkout of this repo as follows:

1. Install [Docker](https://docs.docker.com/install/) if you have not already done so.
2. Go to the top directory of this repo in your terminal, and run `make website`.
3. Open `http://localhost:4567` in your web browser.
4. When you're done with the preview, press ctrl-C in your terminal to stop the server.

The local preview will include content from this repo and from any [_currently active_ submodules][inpage-submodules]; content from inactive submodules will be 404.

While the preview is running, you can edit pages and Middleman will automatically rebuild them.

## Previewing Changes from Terraform Core

↥ [back to top](#table-of-contents)

To preview changes from a fork of Terraform core, you need to make sure the necessary submodule is active, then change the contents of the submodule to include your changes.

### Activating

1. **Init:** Run `git submodule init ext/terraform`.
2. **Update:** Run `git submodule update`.

    The init command doesn't actually init things all the way, so if you forget to run update, you might have a bad afternoon. (For more information, see [Living With Submodules][inpage-submodules] below.)

### Changing

Once the submodule is active, you can go into its directory to fetch and check out new commits. If you plan to routinely edit those docs, you can add an additional remote to make it easier to fetch from and push to your fork.

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

**Note:** If you're updating a nav sidebar `.erb` file in a provider or in Terraform core, the Middleman preview server might not automatically refresh the affected pages. The easiest way to deal with it is to stop and restart the preview server.

## Writing Normal Docs Content

↥ [back to top](#table-of-contents)

Our docs content uses a fairly standard Middleman-ish/Jekyll-ish format.

### Files

One file per page. Filenames should usually end in `.html.md` or `.html.markdown`, which behave identically.

A page's location in the directory structure determines its URL.

- For files in this repo, the root of the site starts at `content/source/`.
- For files in hashicorp/terraform, the actual files live somewhere in `ext/` and we use symlinks to put them somewhere under `content/source/`. You can check where the symlinks point with `ls -l`, or you can just find files with the "Edit this page" links on [terraform.io][].

### YAML Frontmatter

Each file should begin with YAML frontmatter, like this:

```
---
layout: "enterprise2"
page_title: "Naming - Workspaces - Terraform Enterprise"
---
```

Leave a blank line before the first line of Markdown content. We use the following frontmatter keys:

- `page_title` (required) — The title that displays in the browser's title bar. Generally formatted as `<PAGE> - <SECTION> - <PRODUCT>`, like "Naming - Workspaces - Terraform Enterprise".
- `layout` (required) — Which navigation sidebar to display for this page. A layout called `<NAME>` gets loaded from `./content/source/layouts/<NAME>.erb`.
- `description` (optional) — The blurb that appears in search results, to summarize everything you'll find on this page. Auto-generated if omitted.

A long time ago we also used a `sidebar_current` key, but now it does nothing.

### Link Style

When making a link to another page on the website:

- Always omit the protocol and hostname. (For example: `/docs/configuration/index.html`, not `https://www.terraform.io/docs/configuration/index.html`.)
- When linking _within a given section_ of the docs, use relative links whenever possible. (For example: to link to `https://www.terraform.io/docs/providers/aws/r/ec2_transit_gateway.html` from another AWS resource, write `./ec2_transit_gateway.html`; from an AWS data source, write `../r/ec2_transit_gateway.html`.) This takes less space, and makes content more portable if we need to reorganize the site in the future (spoiler: we will).

### Content Formatting

Content is in Markdown, with a few local syntax additions described below. Try to keep it mostly pure Markdown; sometimes a little HTML is unavoidable, but not often.

#### Callouts

If you start a paragraph with a special arrow-like sigil, it will become a colored callout box. You can't make multi-paragraph callouts. For colorblind users (and for clarity in general), we try to start callouts with a strong-emphasized word to indicate their function.

Sigil | Start text with  | Color
------|------------------|-------
`->`  | `**Note:**`      | blue
`~>`  | `**Important:**` | yellow
`!>`  | `**Warning:**`   | red

#### Learn Tutorial Crosslink Callouts

We use a standard markdown snippet when linking to a relevant Learn tutorial near the top of a page or section:

> **Hands-on:** Try the [Manage Permissions in Terraform Cloud](https://learn.hashicorp.com/tutorials/terraform/cloud-permissions?in=terraform/cloud&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorial on HashiCorp Learn.

We're (mis)using the blockquote element (`>`) to set these links apart from the rest of the text without causing "blue box fatigue." Also note that we're adding UTM tags to the links, to help keep track of where traffic to Learn is coming from. The snippet to use is:

```markdown
> **Hands-on:** Try the [<NAME>](<URL>&utm_source=WEBSITE&utm_medium=WEB_IO&utm_offer=ARTICLE_PAGE&utm_content=DOCS) tutorial on HashiCorp Learn.
```

If a whole collection is relevant, you can say "try the NAME collection" instead.

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

If the page you're screenshotting looks unusable at 1024px wide, make it a bit wider and just get as close as you can. The main goal is to just avoid weirdly big or weirdly small text in comparison to other screenshots.

## Navigation Sidebars

↥ [back to top](#table-of-contents)

Every page should be reachable from a navigation sidebar, with only rare exceptions. _If you create a new page, add it to the relevant sidebar._

Sidebars are in .erb files, and can be found in `content/source/layouts/` (this repo) or `website/layouts/` (terraform core). A page uses the sidebar file that matches the `layout` key in its YAML frontmatter (plus the `.erb` extension).

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

A lot of existing sidebars have a ton of ERB tags that call a `sidebar_current` method. Ignore or remove these, and don't add more of them. They were part of a hack that we don't use anymore.

You don't need to add anything special to a sidebar to get the dynamic JavaScript open/close behavior, but note that the "expand all" and filter controls are only added for sidebars with more than a certain number of links.

## Using Submodules

↥ [back to top](#table-of-contents)

[inpage-submodules]: #using-submodules

Right now, the only submodule that matters much is the one for hashicorp/terraform. (We used to have a lot more, back when we hosted the documentation for most providers on terraform.io.)

In your local checkout of this repo, Git submodules can be active or sleeping. The `git submodule init <PATH>` and `git submodule deinit <PATH>` commands switch them between the two states.

Once you `init` a submodule, you usually need to run `git submodule update`, which will either do the initial checkout or update the working copy to the commit that `terraform-website` currently expects.

If a submodule shows up as "changed" in `git status` but you haven't done anything with it, it probably just means you updated your `terraform-website` branch and it now says the submodule should be at a newer commit. Run `git submodule update` to resolve it. Inactive submodules don't show up in `git status`.

In general, you should never need to commit a submodule update to `terraform-website`; they're updated automatically during releases, and deploys use fresh content from the upstream stable-website branch anyway.

Avoid running `git rm` on a submodule unless you know what you're doing. You usually want `git submodule deinit` instead.

## Finding Broken Links

↥ [back to top](#table-of-contents)

Terraform.io uses a few different link checkers, which run as CircleCI jobs. If a link checking job fails, you can go to the job in CircleCI to find out which link URL caused the problem and which page that link appeared on.

All of these jobs are configured in `./circleci/config.yml`, in this repo and in hashicorp/terraform.

### Global Link Check

We run a global link check for the whole site after every deploy.

- **Where:** The job reports its status in the `#proj-terraform-docs` channel in Hashicorp's Slack.
- **What:** This job only checks internal links within terraform.io, not external links to the rest of the web. (It runs frequently, and we don't want to be a nuisance.)
- **Who:** The Terraform Education team is ultimately responsible for dealing with any broken links this turns up, but anyone in the channel is welcome to fix something if they see it first!
- **How:** We're using [filiph/linkcheck](https://github.com/filiph/linkcheck/) for this. In addition to checking links, this also warms up the Fastly cache for the site.

### PR Link Check

We run a targeted link check for docs PRs, in this repo and in hashicorp/terraform.

- **Where:** It shows up as a GitHub PR check. It only runs for PRs from people in the HashiCorp GitHub organization (which should be fine, since we're the most likely to change a bunch of links at once.)
- **What:** This job only checks links in the _content area_ (not navs/headers) of _pages that were changed in the current PR._ It checks both internal and external links.
- **Who:** If this job is red in your PR, please fix your broken links before merging! Alternately, if it throws a false-positive and complains about a link that is actually fine, make sure to explain that before merging.
- **How:** This is a custom Ruby script, because we weren't able to find an off-the-shelf link checker that met our requirements (i.e. don't complain about problems that have nothing to do with this PR). ([content/scripts/check-pr-links.rb](./content/scripts/check-pr-links.rb))

### Known Incoming Link Check

We run a weekly check to make sure we don't delete popular pages without redirecting them somewhere useful.

- **Where:** The job reports its status mid-morning (PST) every Monday, in the `#proj-terraform-docs` channel in Hashicorp's Slack.
- **What:** This job checks a list of paths from the `content/scripts/testdata/incoming-links.txt` file.
- **Who:** The Terraform Education team is ultimately responsible for dealing with any broken links this turns up, but anyone in the channel is welcome to fix something if they see it first!
- **How:** This is a custom shell script that uses `wget`. ([content/scripts/check-incoming-links.sh](./content/scripts/check-incoming-links.sh))

## More About `stable-website`

↥ [back to top](#table-of-contents)

[inpage-stable]: #more-about-stable-website

Terraform has a special `stable-website` branch with docs for the most recent release. When the website is deployed, it uses the current content of `stable-website`.

When we release a new version of Terraform, we automatically force-push the corresponding commit to `stable-website`. (We also automatically update the ext/terraform submodule in this repo, but that's only for convenience when doing local previews; normal deployment to [terraform.io][] ignores the current state of the submodules.)

Between releases, we update docs on the `master` branch and on the current release's maintenance branch (like `v0.14`). By default, we assume these updates are relevant to a future release, so we don't display them on the website yet. **If a docs update should be shown immediately,** cherry-pick it onto `stable-website` _after_ it has been merged to `master` and/or the maintenance branch.

This happens routinely, so anyone who can merge to `master` should also be able to merge to (or directly push) `stable-website`. Whoever clicks the merge button should make sure they know whether this commit needs a cherry-pick.

**Be aware:** Since `stable-website` gets forcibly reset during releases, make sure to never commit new changes to `stable-website`. You should only commit cherry-picks from a long-lived branch.
