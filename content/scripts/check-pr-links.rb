#!/usr/bin/env ruby

require 'nokogiri'
require 'open-uri'

# Takes a list of source files to check, piped to STDIN.
# from content directory:
# git diff --name-only --diff-filter=AMRCT $(git merge-base HEAD origin/master)..HEAD | bundle exec ./scripts/check-pr-links.rb

# content/source/ for terraform-website, website/ for terraform
site_root_paths = %r[^(content/source/|website/)]
# middleman mostly accepts any combination of those extensions
page_extensions = /(\.(html|markdown|md))+$/

ARGF.set_encoding('utf-8')
input = ARGF.read
input_files = input.split("\n")
input_files.reject! {|f| f !~ site_root_paths || f !~ page_extensions}

puts "Checking URLs in the following pages:"
input_files.each {|input_file|
  puts "- #{input_file}"
}

errors = {}

input_files.each {|input_file|
  errors[input_file] = []
  input_url = input_file.sub(site_root_paths, 'http://localhost:4567/').sub(page_extensions, '.html')

  begin
    page_html = open(input_url)
  rescue
    errors[input_file] << "Couldn't open page at all; something's extra-wrong."
    next
  end

  page = Nokogiri::HTML(page_html)

  links = page.css('#inner a').map {|a|
    next if a.attributes['href'].nil?
    a.attributes['href'].value
  }.compact

  links.each {|link|
    link_url = URI.join(input_url, link) # Automatically handles relative vs. absolute vs. abs+protocol stuff

    begin
      link_html = open(link_url)
    rescue OpenURI::HTTPError => e
      error_code = e.io.status.join(' ')
      errors[input_file] << "  - Broken link: #{link} [#{error_code}] \n    (checked URL: #{link_url})"
      next
    end

    anchor = link_url.fragment
    if (anchor)
      link_page = Nokogiri::HTML(link_html)

      # anchor fragments can contain characters that are illegal in #id selectors (like '.'),
      # so we need to use an attribute selector with a quoted value instead.
      if ( link_page.css("[id='#{anchor}']", "a[name='#{anchor}']").length == 0 )
        errors[input_file] << "  - Missing anchor: #{link} \n    (checked URL: #{link_url})"
      end
    end
  }
}

errors.reject! {|file, problems| problems.empty?}

puts "\n\nResults:"

if (errors.empty?)
  puts "=== No broken links! ==="
else
  puts "=== Found broken links! ===\nFix before merging... or if they're not really broken, explain why.\n\n"
  errors.each {|file, problems|
    puts file
    puts problems.join("\n")
    puts ""
  }
  exit 1
end
