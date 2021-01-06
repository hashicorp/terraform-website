#!/usr/bin/env ruby
# frozen_string_literal: true

require 'nokogiri'
require 'net/http'

# Takes a list of source files to check on STDIN, and checks against a webserver
# at localhost:4567. File list can be NULL-SEPARATED or NEWLINE-SEPARATED. You
# usually want null-separated, because Git commands can do strange things to
# file names with non-ASCII characters unless you pass -z.

# Suggested use (from "content" directory):
# git diff --name-only -z --diff-filter=AMRCT $(git merge-base HEAD origin/master)..HEAD \
#   | bundle exec ./scripts/check-pr-links.rb

# Only checking files in website content.
# Main content dir is "content/source/" for terraform-website, "website/" for terraform.
site_root_paths = %r{^(content/source/|website/)}
# Only checking files that get turned into web pages, which usually have some
# combination of these extensions (like ".html.md")
page_extensions = /(\.(html|markdown|md))+$/

ARGF.set_encoding('utf-8')
input = ARGF.read
input_files = input.split(/\x00|\n/)
input_files.reject! { |f| f !~ site_root_paths || f !~ page_extensions }

puts 'Checking URLs in the following pages:'
input_files.each do |input_file|
  puts "- #{input_file}"
end

errors = {}

# takes a `URI` object, returns [ok, html-or-error]
def check_link(url)
  response = Net::HTTP.get_response(url)

  # Only 200s are "ok"; if it successfully redirects, you should still fix it anyway.
  if response.code == '200'
    return [true, response.body]
  else
    return [false, "[#{response.code} #{response.message.strip}] #{url}"]
  end
rescue StandardError => e
  # This won't be an HTTP error, it'll be a lower-level network problem: bad
  # hostname, host is down, host is timing out, or whole network is hosed.
  # Problem is, these errors can be SLOW, and I don't want the job to look
  # stuck if we hit a wave of network problems. So in addition to reporting the
  # error in its proper time, log to the console NOW so the user knows what's up.
  exception_message = "[#{e.class} - #{e.message.strip}] #{url}"
  puts "!! Got a network error: #{exception_message}"
  puts "   Probably a bad hostname or a server timeout, but might be network trouble."
  return [false, exception_message]
end

# returns boolean
def check_anchor(html, anchor)
  page = Nokogiri::HTML(html)
  # anchor fragments can contain characters that are illegal in #id selectors (like '.'),
  # so we need to use an attribute selector with a quoted value instead.
  return page.css("[id='#{anchor}']", "a[name='#{anchor}']").length > 0
rescue StandardError
  # Nokogiri throws errors on totally invalid selectors, so in the event that we
  # get some bizarro anchor that escapes the quoting or something in that
  # interpolation, just report it as a broken link instead of exploding the
  # whole run.
  return false
end

# Returns array of link destination strings, which is probably a mix of relative
# and absolute paths, URLs, and bare #anchors that resolve to the same page.
# Notably, we only check within the page content area (#inner); that's because
# for PR checks we desperately want to avoid irrelevant alerts, and the content
# area is always relevant.
def find_links(html)
  page = Nokogiri::HTML(html)
  return page.css('#inner a').reject { |a| a.attributes['href'].nil? }.map { |a| a.attributes['href'].value }
end

input_files.each do |input_file|
  errors[input_file] = []
  url_string = URI.escape(input_file).sub(site_root_paths, 'http://localhost:4567/').sub(page_extensions, '.html')
  input_url = URI(url_string)

  ok, result = check_link(input_url)

  if !ok
    errors[input_file] << "  - Couldn't open page at all; something's extra-wrong.\n    #{result}"
    next
  end

  find_links(result).each do |link|
    # The URI class can just handle path traversal math for us, yay.
    link_url = URI.join(input_url, link)

    link_ok, link_result = check_link(link_url)

    if !link_ok
      errors[input_file] << "  - Broken link: #{link}\n    #{link_result}"
      next
    end

    anchor = link_url.fragment
    next unless anchor

    if !check_anchor(link_result, anchor)
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
