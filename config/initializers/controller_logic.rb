module ControllerLogic
  def list_logic(prefix, sort)
    if params[:next_page]
      instance_variable_set("@#{prefix}_page", params[:next_page].keys.first.to_i)
    elsif params[:previous_page]
      instance_variable_set("@#{prefix}_page", params[:previous_page].keys.first.to_i)
    else
      instance_variable_set("@#{prefix}_page", params[:page].to_i > 0 ? params[:page].to_i : 1)
    end

    instance_variable_set("@#{prefix}_sort", params[:sort] ? params[:sort] : sort)
  end
  
  def document_formats
    request.format = :csv if params[:csv]
    request.format = :pdf if params[:pdf]
  end

  def mailer_set_url_options
    ActionMailer::Base.default_url_options[:host] = request.host_with_port
  end

  def csv_response(entity_type)
    entities = instance_variable_get("@#{entity_type.tableize}")
    headers.merge!("Content-Type" => "text/csv", "Content-Disposition" => "attachment; filename=\"#{entity_type.tableize.dasherize}.csv\"")
    self.response_body = proc {|response, output| output.write(CSV.generate_line(entity_type.constantize::CSV_HEADER))
      entities.each{|e| output.write CSV.generate_line(e.csv_row)}}
  end

  def pdf_response(entity_type, template)
    entities = instance_variable_get("@#{entity_type.tableize}")
    headers.merge!("Content-Type" => "application/octet-stream", "Content-Disposition" => "attachment; filename=\"#{entity_type.tableize.dasherize}.pdf\"")
      render :pdf => "#{entity_type.tableize.dasherize}", :template => template
  end

  def set_time_zone
    if current_user
      Time.zone = current_user.organization.time_zone
    end
  end

  def get_entity_route
    request.fullpath.split('/')[1]
  end

  def load(entity_route = nil)
    entity_route = controller_name if entity_route.nil?
    entity_name = entity_route.singularize
    if !instance_variable_set("@#{entity_name}", current_user.organization.send(entity_name.pluralize).find_by_id((params["#{entity_name}_id"] || params["id"]).to_i))
      flash[:error] = "The requested #{entity_name} could not be located."
      return(redirect_to(eval("#{entity_route}_path")))
    end
    current_user.add_recently_viewed(instance_variable_get("@#{entity_name}")) if recently_vieweds
  end

  def recently_vieweds
    nil
  end

  def resource
    instance_variable_get("@#{controller_name.singularize}")
  end

  def add_partial
    nil
  end

  def add_path
    resource ? resource.class.table_name : controller_name
  end

  def tab
    if ["show", "edit", "create", "update"].include?(action_name)
      "info"
    else
      action_name
    end
  end
end