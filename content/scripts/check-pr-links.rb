#!/usr/bin/env ruby
# frozen_string_literal: true

require 'nokogiri'
require 'open-uri'

# Takes a list of source files to check, piped to STDIN.
# from content directory:
# git diff --name-only --diff-filter=AMRCT $(git merge-base HEAD origin/master)..HEAD | bundle exec ./scripts/check-pr-links.rb

# content/source/ for terraform-website, website/ for terraform
site_root_paths = %r{^(content/source/|website/)}
# middleman mostly accepts any combination of those extensions
page_extensions = /(\.(html|markdown|md))+$/

ARGF.set_encoding('utf-8')
input = ARGF.read
input_files = input.split("\n")
input_files.reject! { |f| f !~ site_root_paths || f !~ page_extensions }

puts 'Checking URLs in the following pages:'
input_files.each do |input_file|
  puts "- #{input_file}"
end

errors = {}

input_files.each do |input_file|
  errors[input_file] = []
  input_url = input_file.sub(site_root_paths, 'http://localhost:4567/').sub(page_extensions, '.html')

  begin
    page_html = open(input_url)
  rescue StandardError
    errors[input_file] << "Couldn't open page at all; something's extra-wrong."
    next
  end

  page = Nokogiri::HTML(page_html)

  links = page.css('#inner a').reject { |a| a.attributes['href'].nil? }.map { |a| a.attributes['href'].value }

  links.each do |link|
    link_url = URI.join(input_url, link) # Automatically handles relative vs. absolute vs. abs+protocol stuff

    begin
      link_html = open(link_url)
    rescue OpenURI::HTTPError => e
      error_code = e.io.status.join(' ')
      errors[input_file] << "  - Broken link: #{link} [#{error_code}] \n    (checked URL: #{link_url})"
      next
    end

    anchor = link_url.fragment
    next unless anchor && link_html

    link_page = Nokogiri::HTML(link_html)

    # anchor fragments can contain characters that are illegal in #id selectors (like '.'),
    # so we need to use an attribute selector with a quoted value instead.
    if link_page.css("[id='#{anchor}']", "a[name='#{anchor}']").length.zero?
      errors[input_file] << "  - Missing anchor: #{link} \n    (checked URL: #{link_url})"
    end
  end
end

errors.reject! { |_file, problems| problems.empty? }

puts "\n\nResults:"

if errors.empty?
  puts '=== No broken links! ==='
else
  puts "=== Found broken links! ===\nFix before merging... or if they're not really broken, explain why.\n\n"
  errors.each do |file, problems|
    puts file
    puts problems.join("\n")
    puts ''
  end
  exit 1
end
