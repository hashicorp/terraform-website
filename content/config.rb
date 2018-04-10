set :base_url, "https://www.terraform.io/"

activate :hashicorp do |h|
  h.name        = "terraform"
  h.version     = "0.11.7"
  h.github_slug = "hashicorp/terraform"
end

ignore "ext/**/*"
config[:file_watcher_ignore] += [/^(\/website\/)?ext\//]

require "middleman_helpers"
helpers Helpers
