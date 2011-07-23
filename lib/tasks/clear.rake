namespace :app do
  task :clear do
    Rake::Task['tmp:clear'].invoke
    Rake::Task['log:clear'].invoke
	end
end
