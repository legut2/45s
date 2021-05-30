# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) { |repo_name| "https://github.com/#{repo_name}" }

gem "pry"
gem "sinatra"
gem "shotgun"
gem "wdm", '>= 0.1.0' if Gem.win_platform?
gem "rerun", '>= 0.1.0' if Gem.win_platform?
gem "thin", '>= 0.1.0' if Gem.win_platform?
# I want to force eventmachine to be installed targeting ruby as the platform because otherwise you can't use eventmachine -> thin -> rerun on windows
# related issue: https://github.com/oneclick/rubyinstaller2/issues/96
# Haven't tested next line from a clean install on windows just yet
gem "eventmachine", :force_ruby_platform => true if Gem.win_platform?