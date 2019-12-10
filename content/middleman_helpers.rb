module Helpers
  # Returns a segment tracking ID such that local development is not
  # tracked to production systems.
  def segmentId()
    if (ENV['DEPLOY_ENV'] == 'development')
      '0EXTgkNx0Ydje2PGXVbRhpKKoe5wtzcE'
    else
      'EnEETDWhfxp1rp09jVvJr66LdvwI6KVP'
    end
  end

  # Returns the FQDN of the image URL.
  #
  # @param [String] path
  #
  # @return [String]
  def image_url(path)
    File.join(base_url, image_path(path))
  end

  # Get the title for the page.
  #
  # @param [Middleman::Page] page
  #
  # @return [String]
  def title_for(page)
    if page && page.data.page_title
      return "#{page.data.page_title} - Terraform by HashiCorp"
    end

     "Terraform by HashiCorp"
   end

  # Get the description for the page
  #
  # @param [Middleman::Page] page
  #
  # @return [String]
  def description_for(page)
    description = (page.data.description || "Terraform by HashiCorp")
      .gsub('"', '')
      .gsub(/\n+/, ' ')
      .squeeze(' ')

    return escape_html(description)
  end

  # This helps by setting the "active" class for sidebar nav elements
  # if the YAML frontmatter matches the expected value.
  def sidebar_current(expected)
    return ""
  end

  # Returns the id for this page.
  # @return [String]
  def body_id_for(page)
    if !(name = page.data.sidebar_current).blank?
      return "page-#{name.strip}"
    end
    if page.url == "/" || page.url == "/index.html"
      return "page-home"
    end
    if !(title = page.data.page_title).blank?
      return title
        .downcase
        .gsub('"', '')
        .gsub(/[^\w]+/, '-')
        .gsub(/_+/, '-')
        .squeeze('-')
        .squeeze(' ')
    end
    return ""
  end

  # Returns the list of classes for this page.
  # @return [String]
  def body_classes_for(page)
    classes = []

    if !(layout = page.data.layout).blank?
      classes << "layout-#{page.data.layout}"
    end

    if !(title = page.data.page_title).blank?
      title = title
        .downcase
        .gsub('"', '')
        .gsub(/[^\w]+/, '-')
        .gsub(/_+/, '-')
        .squeeze('-')
        .squeeze(' ')
      classes << "page-#{title}"
    end

    return classes.join(" ")
  end

  # Returns a URL where the content of the given page can be edited
  # on Github, taking into account the symlinks into other repository
  # submodules.
  def github_edit_url(page)
    fn = File.realpath(page.source_file)

    # This depends on the way we mount the volumes in the Docker container:
    # /website is the main website content (the "content" directory in the repo)
    # /ext is all the submodules (the "ext" directory in the repo)
    if fn.start_with?('/website/')
      return "https://github.com/hashicorp/terraform-website/edit/master/content/#{fn['/website/'.length..-1]}"
    end

    if fn.start_with?('/ext/terraform/')
      return "https://github.com/hashicorp/terraform/edit/master/#{fn['/ext/terraform/'.length..-1]}"
    end

    if fn.start_with?('/ext/providers/')
      rel = fn['/ext/providers/'.length..-1]
      provider, rel = rel.split('/', 2)

      # digitalocean has a different provider name than its repository name,
      # for historical reasons.
      if provider == "do"
        provider = "digitalocean"
      end

      return "https://github.com/terraform-providers/terraform-provider-#{provider}/edit/master/#{rel}"
    end

    # Should never get here, but if we do we'll at least drop the user
    # somewhere that they can see how the website repo works.
    return "https://github.com/hashicorp/terraform-website"

  end
end
