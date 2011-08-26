namespace :start do 
  task :all => ["singlesignonhq", "agencieshq", "marketinghq", "administratorshq", "reportinghq", "sphinx", "sass"]

  task :singlesignonhq do
    system "rails s -u --port 33000"
  end

  task :agencieshq do
    system "rails s -u --port 3000"
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
    system "rm -rf public/images/common"
    system "mkdir public/images/common"
    system "cp -rf #{Gem.loaded_specs['enginehq'].full_gem_path}/public/images/* public/images/common"
  end
  
end