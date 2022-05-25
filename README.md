# Terraform Documentation Website

This repository contains the entire source for the [Terraform Website](https://www.terraform.io/). This is a [Next.js](https://nextjs.org/) project, which builds a static site from these source files.

<!--
  This readme file contains several blocks of generated text, to make it easier to share common information
  across documentation website readmes. To generate these blocks from their source, run `npm run generate:readme`

  Any edits to the readme are welcome outside the clearly noted boundaries of the blocks. Alternately, a
  block itself can be safely "forked" from the central implementation simply by removing the "BEGIN" and
  "END" comments from around it.
-->

## Table of Contents

- [Contributions](#contributions-welcome)
- [Where the Docs Live](#where-the-docs-live)
- [Deploying Changes to terraform.io](#deploying-changes-to-terraformio)
- [Running the Site Locally](#running-the-site-locally)
- [More about `stable-website`](#more-about-stable-website)
- [Editing Markdown Content](#editing-markdown-content)
- [Editing Navigation Sidebars](#editing-navigation-sidebars)
- [Changing the Release Version](#changing-the-release-version)
- [Redirects](#redirects)
- [Browser Support](#browser-support)
- [Deployment](#deployment)

<!-- BEGIN: contributions -->
<!-- Generated text, do not edit directly -->

## Contributions Welcome!

If you find a typo or you feel like you can improve the HTML, CSS, or JavaScript, we welcome contributions. Feel free to open issues or pull requests like any normal GitHub project, and we'll merge it in 🚀

<!-- END: contributions -->

## Where the Docs Live

This repository contains docs for Terraform Enterprise, located in [`/content/enterprise`](https://github.com/hashicorp/terraform-website/tree/master/content/enterprise).

The rest of the docs are located in various external repositories:

| Subpath | Repository |
| :--- | :--- |
| [`/cdktf`][cdktf]                         | [terraform-cdk] |
| [`/cli`][cli]                             | [terraform] |
| [`/cloud-docs`][cloud-docs]               | [terraform-docs-common] |
| [`/cloud-docs/agents`][cloud-docs/agents] | [terraform-docs-agents] |
| [`/configuration`][configuration]         | [terraform] |
| [`/docs`][docs]                           | [terraform] |
| [`/enterprise`][enterprise]               | [terraform-website] |
| [`/guides`][guides]                       | [terraform] |
| [`/internals`][internals]                 | [terraform] |
| [`/intro`][intro]                         | [terraform] |
| [`/language`][language]                   | [terraform] |
| [`/plugin`][plugin]                       | [terraform-docs-common] |
| [`/plugin/framework`][plugin/framework]   | [terraform-plugin-framework] |
| [`/plugin/log`][plugin/log]               | [terraform-plugin-log] |
| [`/plugin/mux`][plugin/mux]               | [terraform-plugin-mux] |
| [`/plugin/sdkv2`][plugin/sdkv2]           | [terraform-plugin-sdk] |
| [`/registry`][registry]                   | [terraform-docs-common] |


[cdktf]: https://www.terraform.io/cdktf
[cli]: https://www.terraform.io/cli
[cloud-docs]: https://www.terraform.io/cloud-docs
[cloud-docs/agents]: https://www.terraform.io/cloud-docs/agents
[configuration]: https://www.terraform.io/configuration
[docs]: https://www.terraform.io/docs
[enterprise]: https://www.terraform.io/enterprise
[guides]: https://www.terraform.io/guides
[internals]: https://www.terraform.io/internals
[intro]: https://www.terraform.io/intro
[language]: https://www.terraform.io/language
[plugin]: https://www.terraform.io/plugin
[plugin/framework]: https://www.terraform.io/plugin/framework
[plugin/log]: https://www.terraform.io/plugin/log
[plugin/mux]: https://www.terraform.io/plugin/mux
[plugin/sdkv2]: https://www.terraform.io/plugin/sdkv2
[registry]: https://www.terraform.io/registry

[terraform-cdk]: https://github.com/hashicorp/terraform-cdk
[terraform]: https://github.com/hashicorp/terraform
[terraform-website]: https://github.com/hashicorp/terraform-cdk
[terraform-docs-common]: https://github.com/hashicorp/terraform-docs-common
[terraform-docs-agents]: https://github.com/hashicorp/terraform-docs-agents
[terraform-plugin-sdk]: https://github.com/hashicorp/terraform-plugin-sdk
[terraform-plugin-log]: https://github.com/hashicorp/terraform-plugin-log
[terraform-plugin-mux]: https://github.com/hashicorp/terraform-plugin-mux
[terraform-plugin-framework]: https://github.com/hashicorp/terraform-plugin-framework


  **Notable branches:** `master` is the "live" content that gets deployed to [terraform.io](https://terraform.io). The site gets redeployed for new commits to master.


## Deploying Changes to [terraform.io](https://terraform.io)

### For changes in this repo

Merge the PR to master, and the site will automatically deploy in about 5m. 🙌

### For changes in any other listed repo

There are various GitHub refs that will cause docs content to be deployed to terraform.io,
and these may vary on a repo-to-repo basis but generally speaking, these are limited to `stable-website`, `main`, and a few others.

Changes will be deployed to terraform.io roughly every hour

> For more info, see Vercel's docs on [ISR](https://vercel.com/docs/concepts/next.js/incremental-static-regeneration).

If you need your docs deployed sooner, this can be done by redeploying all of terraform.io,
via the [Vercel project](https://vercel.com/hashicorp/terraform-website/).


<!-- BEGIN: local-development -->
<!-- Generated text, do not edit directly -->

## Running the Site Locally

The website can be run locally through node.js or [Docker](https://www.docker.com/get-started). If you choose to run through Docker, everything will be a little bit slower due to the additional overhead, so for frequent contributors it may be worth it to use node.

> **Note:** If you are using a text editor that uses a "safe write" save style such as **vim** or **goland**, this can cause issues with the live reload in development. If you turn off safe write, this should solve the problem. In vim, this can be done by running `:set backupcopy=yes`. In goland, search the settings for "safe write" and turn that setting off.

### With Docker

Running the site locally is simple. Provided you have Docker installed, clone this repo, run `make`, and then visit `http://localhost:3000`.

The docker image is pre-built with all the website dependencies installed, which is what makes it so quick and simple, but also means if you need to change dependencies and test the changes within Docker, you'll need a new image. If this is something you need to do, you can run `make build-image` to generate a local Docker image with updated dependencies, then `make website-local` to use that image and preview.

### With Node

If your local development environment has a supported version (v10.0.0+) of [node installed](https://nodejs.org/en/) you can run:

- `npm install`
- `npm start`

...and then visit `http://localhost:3000`.

If you pull down new code from github, you should run `npm install` again. Otherwise, there's no need to re-run `npm install` each time the site is run, you can just run `npm start` to get it going.

<!-- END: local-development -->

## Editing Markdown Content

Documentation content is written in [Markdown](https://www.markdownguide.org/cheat-sheet/) and you'll find all files listed under the `/content` directory.

To create a new page with Markdown, create a file ending in `.mdx` in a `content/<subdirectory>`. The path in the content directory will be the URL route. For example, `content/docs/hello.mdx` will be served from the `/docs/hello` URL.

> **Important**: Files and directories will only be rendered and published to the website if they are [included in sidebar data](#editing-navigation-sidebars). Any file not included in sidebar data will not be rendered or published.

This file can be standard Markdown and also supports [YAML frontmatter](https://middlemanapp.com/basics/frontmatter/). YAML frontmatter is optional, there are defaults for all keys.

```yaml
---
title: 'My Title'
description: "A thorough, yet succinct description of the page's contents"
---
```

The significant keys in the YAML frontmatter are:

- `title` `(string)` - This is the title of the page that will be set in the HTML title.
- `description` `(string)` - This is a description of the page that will be set in the HTML description.

> ⚠️ If there is a need for a `/api/*` url on this website, the url will be changed to `/api-docs/*`, as the `api` folder is reserved by next.js.

### Creating New Pages

There is currently a small bug with new page creation - if you create a new page and link it up via subnav data while the server is running, it will report an error saying the page was not found. This can be resolved by restarting the server.

#### Adding New Pages Under `content/docs`

Due to the way we handle old `/docs` redirects, you need to explicitly add your new page to the `DEFINED_DOCS_PAGES` array in `pages/docs/_middleware.ts` in addition to creating the MDX file and updating `data/docs-nav-data.json`. For example, if you created an MDX file at the path `content/docs/why-terraform-is-awesome.mdx`, you would add the string `'/docs/why-terraform-is-awesome'` to the `DEFINED_DOCS_PAGES` array.

```diff
 const DEFINED_DOCS_PAGES = [
    '/docs/glossary',
    '/docs/partnerships',
-   '/docs/terraform-tools'
+   '/docs/terraform-tools',
+   '/docs/why-terraform-is-awesome'
  ]
```

The only directory you need to do this for is `content/docs`; all other directories will work without making any modifications outside adding the MDX file and updating the navigation data file.

### Markdown Enhancements

There are several custom markdown plugins that are available by default that enhance [standard markdown](https://commonmark.org/) to fit our use cases. This set of plugins introduces a couple instances of custom syntax, and a couple specific pitfalls that are not present by default with markdown, detailed below:

- If you see the symbols `~>`, `->`, `=>`, or `!>`, these represent [custom alerts](https://github.com/hashicorp/remark-plugins/tree/master/plugins/paragraph-custom-alerts#paragraph-custom-alerts). These render as colored boxes to draw the user's attention to some type of aside.
- If you see `@include '/some/path.mdx'`, this is a [markdown include](https://github.com/hashicorp/remark-plugins/tree/master/plugins/include-markdown#include-markdown-plugin). It's worth noting as well that all includes resolve from `website/content/partials` by default, and that changes to partials will not live-reload the website.
- If you see `# Headline ((#slug))`, this is an example of an [anchor link alias](https://github.com/hashicorp/remark-plugins/tree/je.anchor-link-adjustments/plugins/anchor-links#anchor-link-aliases). It adds an extra permalink to a headline for compatibility and is removed from the output.
- Due to [automatically generated permalinks](https://github.com/hashicorp/remark-plugins/tree/je.anchor-link-adjustments/plugins/anchor-links#anchor-links), any text changes to _headlines_ or _list items that begin with inline code_ can and will break existing permalinks. Be very cautious when changing either of these two text items.

  Headlines are fairly self-explanatory, but here's an example of how to list items that begin with inline code look.

  ```markdown
  - this is a normal list item
  - `this` is a list item that begins with inline code
  ```

  Its worth noting that _only the inline code at the beginning of the list item_ will cause problems if changed. So if you changed the above markup to...

  ```markdown
  - lsdhfhksdjf
  - `this` jsdhfkdsjhkdsfjh
  ```

  ...while it perhaps would not be an improved user experience, no links would break because of it. The best approach is to **avoid changing headlines and inline code at the start of a list item**. If you must change one of these items, make sure to tag someone from the digital marketing development team on your pull request, they will help to ensure as much compatibility as possible.

### Custom Components

A number of custom [mdx components](https://mdxjs.com/) are available for use within any `.mdx` file. If you have questions about custom components, or have a request for a new custom component, please reach out to @hashicorp/digital-marketing.

### Syntax Highlighting

When using fenced code blocks, the recommendation is to tag the code block with a language so that it can be syntax highlighted. For example:

````
```
// BAD: Code block with no language tag
```

```javascript
// GOOD: Code block with a language tag
```
````

Check out the [supported languages list](https://prismjs.com/#supported-languages) for the syntax highlighter we use if you want to double check the language name.

It is also worth noting specifically that if you are using a code block that is an example of a terminal command, the correct language tag is `shell-session`. For example:

🚫**BAD**: Using `shell`, `sh`, `bash`, or `plaintext` to represent a terminal command

````
```shell
$ terraform apply
```
````

✅**GOOD**: Using `shell-session` to represent a terminal command

````
```shell-session
$ terraform apply
```
````

<!-- BEGIN: editing-docs-sidebars -->
<!-- Generated text, do not edit directly -->

## Editing Navigation Sidebars

The structure of the sidebars are controlled by files in the [`/data` directory](data). For example, [data/docs-nav-data.json](data/docs-nav-data.json) controls the **docs** sidebar. Within the `data` folder, any file with `-nav-data` after it controls the navigation for the given section. Several files within the `/data` directory are symlinked to their respective navigation file within a submodule. These files are indicated in some text editors by a small arrow to the right of the filename. You can also see which files are symlinked by running `ls -l` in the `data` directory on Linux/macOS, or `dir` on Windows. Edits to these files should be make directly to the file within the submodule, although on most systems editing the symlink file should achieve the same result. Any updates to these files will need to be pushed to their respective `stable-website` branch before they appear on [terraform.io](https://terraform.io).

The sidebar uses a simple recursive data structure to represent _files_ and _directories_. The sidebar is meant to reflect the structure of the docs within the filesystem while also allowing custom ordering. Let's look at an example. First, here's our example folder structure:

```text
.
├── docs
│   └── directory
│       ├── index.mdx
│       ├── file.mdx
│       ├── another-file.mdx
│       └── nested-directory
│           ├── index.mdx
│           └── nested-file.mdx
```

Here's how this folder structure could be represented as a sidebar navigation, in this example it would be the file `website/data/docs-nav-data.json`:

```json
[
  {
    "title": "Directory",
    "routes": [
      {
        "title": "Overview",
        "path": "directory"
      },
      {
        "title": "File",
        "path": "directory/file"
      },
      {
        "title": "Another File",
        "path": "directory/another-file"
      },
      {
        "title": "Nested Directory",
        "routes": [
          {
            "title": "Overview",
            "path": "directory/nested-directory"
          },
          {
            "title": "Nested File",
            "path": "directory/nested-directory/nested-file"
          }
        ]
      }
    ]
  }
]
```

A couple more important notes:

- Within this data structure, ordering is flexible, but hierarchy is not. The structure of the sidebar must correspond to the structure of the content directory. So while you could put `file` and `another-file` in any order in the sidebar, or even leave one or both of them out, you could not decide to un-nest the `nested-directory` object without also un-nesting it in the filesystem.
- The `title` property on each node in the `nav-data` tree is the human-readable name in the navigation.
- The `path` property on each leaf node in the `nav-data` tree is the URL path where the `.mdx` document will be rendered, and the
- Note that "index" files must be explicitly added. These will be automatically resolved, so the `path` value should be, as above, `directory` rather than `directory/index`. A common convention is to set the `title` of an "index" node to be `"Overview"`.

Below we will discuss a couple of more unusual but still helpful patterns.

### Index-less Categories

Sometimes you may want to include a category but not have a need for an index page for the category. This can be accomplished, but as with other branch and leaf nodes, a human-readable `title` needs to be set manually. Here's an example of how an index-less category might look:

```text
.
├── docs
│   └── indexless-category
│       └── file.mdx
```

```json
// website/data/docs-nav-data.json
[
  {
    "title": "Indexless Category",
    "routes": [
      {
        "title": "File",
        "path": "indexless-category/file"
      }
    ]
  }
]
```

### Custom or External Links

Sometimes you may have a need to include a link that is not directly to a file within the docs hierarchy. This can also be supported using a different pattern. For example:

```json
[
  {
    "name": "Directory",
    "routes": [
      {
        "title": "File",
        "path": "directory/file"
      },
      {
        "title": "Another File",
        "path": "directory/another-file"
      },
      {
        "title": "Tao of HashiCorp",
        "href": "https://www.hashicorp.com/tao-of-hashicorp"
      }
    ]
  }
]
```

If the link provided in the `href` property is external, it will display a small icon indicating this. If it's internal, it will appear the same way as any other direct file link.

<!-- END: editing-docs-sidebars -->

<!-- BEGIN: releases -->
<!-- Generated text, do not edit directly -->

## Changing the Release Version

To change the version displayed for download on the website, head over to `data/version.js` and change the number there. It's important to note that the version number must match a version that has been released and is live on `releases.hashicorp.com` -- if it does not, the website will be unable to fetch links to the binaries and will not compile. So this version number should be changed _only after a release_.

### Displaying a Prerelease

If there is a prerelease of any type that should be displayed on the downloads page, this can be done by editing `pages/downloads/index.jsx`. By default, the download component might look something like this:

```jsx
<ProductDownloader
  product="<Product>"
  version={VERSION}
  downloads={downloadData}
  community="/resources"
/>
```

To add a prerelease, an extra `prerelease` property can be added to the component as such:

```jsx
<ProductDownloader
  product="<Product>"
  version={VERSION}
  downloads={downloadData}
  community="/resources"
  prerelease={{
    type: 'release candidate', // the type of prerelease: beta, release candidate, etc.
    name: 'v1.0.0', // the name displayed in text on the website
    version: '1.0.0-rc1', // the actual version tag that was pushed to releases.hashicorp.com
  }}
/>
```

This configuration would display something like the following text on the website, emphasis added to the configurable parameters:

```
A {{ release candidate }} for <Product> {{ v1.0.0 }} is available! The release can be <a href='https://releases.hashicorp.com/<product>/{{ 1.0.0-rc1 }}'>downloaded here</a>.
```

You may customize the parameters in any way you'd like. To remove a prerelease from the website, simply delete the `prerelease` parameter from the above component.

<!-- END: releases -->

## Redirects

This website structures URLs based on the filesystem layout. This means that if a file is moved, removed, or a folder is re-organized, links will break. If a path change is necessary, it can be mitigated using redirects. It's important to note that redirects should only be used to cover for external links -- if you are moving a path which internal links point to, the internal links should also be adjusted to point to the correct page, rather than relying on a redirect.

To add a redirect, head over to the `redirects.next.js` file. It has a `miscRedirectsMap` containing source keys and destination values. Enter both the source key and the destination value for every redirect you want to add and save the file. Let's look at an example:

```js
const miscRedirectsMap = {
  '/cloud': 'https://cloud.hashicorp.com/products/terraform',
```

This redirect rule will send all incoming links to `/cloud` to `https://cloud.hashicorp.com/products/terraform`. For more details on the redirects file format, [check out the docs on vercel](https://vercel.com/docs/configuration#project/redirects). All redirects will work both locally and in production exactly the same way, so feel free to test and verify your redirects locally. In the past testing redirects has required a preview deployment -- this is no longer the case. Please note however that if you add a redirect while the local server is running, you will need to restart it in order to see the effects of the redirect.

There is still one caveat though: redirects do not apply to client-side navigation. By default, all links in the navigation and docs sidebar will navigate purely on the client side, which makes navigation through the docs significantly faster, especially for those with low-end devices and/or weak internet connections. In the future, we plan to convert all internal links within docs pages to behave this way as well. This means that if there is a link on this website to a given piece of content that has changed locations in some way, we need to also _directly change existing links to the content_. This way, if a user clicks a link that navigates on the client side, or if they hit the url directly and the page renders from the server side, either one will work perfectly.

Let's look at an example. Say you have a page called `/language/foo` which needs to be moved to `/language/nested/foo`. Additionally, this is a page that has been around for a while and we know there are links into `/language/foo.html` left over from our previous website structure. First, you would move the page to the correct directory and then adjust the docs sidenav in `data/language-navigation.js` to reflect the new structure.  Next, you would add to `miscRedirectsMap` (example below).

```js
const miscRedirectsMap = {
  '/language/foo': '/language/nested/foo',
  '/language/foo.html': '/language/nested/foo'
```

Next, you would run a global search for internal links to `/language/foo`, and make sure to adjust them to be `/language/nested/foo`. This is to ensure that client-side navigation still works correctly. _Adding a redirect alone is not enough_.

One more example - let's say that content is being moved to an external website. A common example is guides moving to `learn.hashicorp.com`. In this case, you would take all the same steps, but make a different type of change to the `language-navigation` file. Previously the structure looked like:

```json
{
  "title": "Language",
  "routes": [
    { "title": "Foo", "path": "foo" }
  ]
}
```

If you no longer want the link to be in the side nav, you can simply remove it. If you do still want the link in the side nav, but pointing to an external destination, you need to slightly change the structure as such:

```json
{
  "title": "Language",
  "routes": [
    { "title": "Foo", "href": "https://learn.hashicorp.com/<product>/foo" }
  ]
}
```

As the majority of items in the side nav are internal links, the structure makes it as easy as possible to represent these links. This alternate syntax is the most concise manner than an external link can be represented. External links can be used anywhere within the docs sidenav.

It's also worth noting that it is possible to do glob-based redirects (e.g., matching `/nested/*`), and you may see this pattern in the redirects file. This type of redirect is much higher risk and the behavior is a bit more nuanced. If you need to add a glob redirect, please contact the website maintainers and ask about it first.

<!-- BEGIN: browser-support -->
<!-- Generated text, do not edit directly -->

## Browser Support

We support the following browsers targeting roughly the versions specified.

| ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_24x24.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_24x24.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_24x24.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_24x24.png) | ![Internet Explorer](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_24x24.png) |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Latest**                                                                                          | **Latest**                                                                                             | **Latest**                                                                                       | **Latest**                                                                                          | **11+**                                                                                                    |

<!-- END: browser-support -->

## Deployment

This website is hosted on Vercel and configured to automatically deploy anytime you push code to the `master` branch. Any time a pull request is submitted that changes files, a deployment preview will appear in the GitHub checks which can be used to validate the way docs changes will look live. Deployments from `master` will look and behave the same way as deployment previews.

## More About `stable-website`

Terraform has a special `stable-website` branch with docs for the most recent release. When the website is deployed, it uses the current content of `stable-website`. This is also the case for Terraform CDK. However, this repo _does not_ have a `stable-website` branch; instead, it uses the `master` branch.

When we release a new version of Terraform, we automatically force-push the corresponding commit to `stable-website`. (We also automatically update the ext/terraform submodule in this repo, but that's only for convenience when doing local previews; normal deployment to [terraform.io](https://terraform.io) ignores the current state of the submodules.)

Between releases, we update docs on the `master` branch and on the current release's maintenance branch (like `v0.14`). By default, we assume these updates are relevant to a future release, so we don't display them on the website yet. **If a docs update should be shown immediately,** cherry-pick it onto `stable-website` _after_ it has been merged to `master` and/or the maintenance branch.

This happens routinely, so anyone who can merge to `master` should also be able to merge to (or directly push) `stable-website`. Whoever clicks the merge button should make sure they know whether this commit needs a cherry-pick.

**Be aware:** Since `stable-website` gets forcibly reset during releases, make sure to never commit new changes to `stable-website`. You should only commit cherry-picks from a long-lived branch.
