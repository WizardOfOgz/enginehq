# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "enginehq/version"

Gem::Specification.new do |s|
  s.name        = "enginehq"
  s.version     = Enginehq::VERSION
  s.authors     = ["Kyle Ginavan"]
  s.email       = ["kyle@agencieshq.com"]
  s.homepage    = ""
  s.summary     = %q{TODO: Write a gem summary}
  s.description = %q{TODO: Write a gem description}

  s.rubyforge_project = "enginehq"

  s.add_dependency "railties", "~> 3.0"
  s.add_dependency "compass", "~> 0.12.alpha"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end
