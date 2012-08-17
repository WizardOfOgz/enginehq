namespace :run do 
  task :ahq => ["agencieshq", "delayed_job", "sphinx"]

  task :singlesignonhq do
    system "rails s -u --port 3300"
  end

  task :agencieshq do
    system "rails s -u --port 3000"
  end
  
  task :delayed_job do
    Rake::Task['jobs:work'].invoke
  end

  task :marketinghq do
    system "rails s -u --port 3001"
  end

  task :administratorshq do
    system "rails s -u --port 3002"
  end

  task :reportinghq do
    system "rails s -u --port 3003"
  end

  task :sphinx do
    Rake::Task['ts:conf'].invoke
    Rake::Task['ts:in'].invoke
    Rake::Task['ts:run'].invoke
    Rake::Task['ts:dd'].invoke
  end

  task :sass do
    system "sass --watch app/assets/stylesheets:public/stylesheets"
    puts "sass --watch #{Gem.loaded_specs['enginehq'].full_gem_path}/app/assets/stylesheets:public/stylesheets"
    system "sass --watch #{Gem.loaded_specs['enginehq'].full_gem_path}/app/assets/stylesheets:public/stylesheets"
  end

  task :images do
    system "rm -rf public/images/sprite"
    system "mkdir public/images/sprite"
    system "cp -rf #{Gem.loaded_specs['enginehq'].full_gem_path}/public/images/sprite/* public/images/sprite"
  end

  task :clear do
    Rake::Task['tmp:clear'].invoke
    Rake::Task['log:clear'].invoke
  end
end