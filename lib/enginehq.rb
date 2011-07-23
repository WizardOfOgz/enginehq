require "enginehq/version"
module Enginehq
  class Engine < Rails::Engine
    #engine_name :enginehq
    # Config defaults
    config.widget_factory_name = "default factory name"
    config.mount_at = '/'
    # Check the gem config
    initializer "check config" do |app|
      # make sure mount_at ends with trailing slash
      config.mount_at += '/'  unless config.mount_at.last == '/'
    end

    #TODO: load all and not define individually
    rake_tasks do
      load "#{root}/lib/tasks/clear.rake"
      load "#{root}/lib/tasks/palette.rake"
      load "#{root}/lib/tasks/start.rake"
    end

    # include in application controller
    # initializer 'enginehq.app_controller' do |app|
    #   ActiveSupport.on_load(:action_controller) do
    #     include MyModule::InstanceMethods
    #   end
    # end

    initializer "static assets" do |app|
      app.middleware.use ::ActionDispatch::Static, "#{root}/public"
    end

    config.to_prepare do
      ApplicationController.helper(EnginehqHelper)
    end
  end
end
