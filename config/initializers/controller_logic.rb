module ControllerLogic
  def list_logic(prefix, sort)
    if params[:next_page]
      @page = params[:next_page].keys.first.to_i
    elsif params[:previous_page]
      @page = (params[:previous_page].keys.first.to_i)
    else
      @page = (params[:page].to_i > 0 ? params[:page].to_i : 1)
    end
    @sort = (params[:sort] ? params[:sort] : sort)
  end
  
  def document_formats
    request.format = :csv if params[:csv]
    request.format = :pdf if (params[:pdf] || (params[:transmit] && params[:transmit][:pdf]))
  end

  def mailer_set_url_options
    ActionMailer::Base.default_url_options[:host] = request.host_with_port
  end

  def render_csv(filename, entities)
    if entities.length > 0
      headers["Content-Disposition"] = "attachment; filename=\"#{filename}.csv\""
      csv = CSV.generate_line(entities.first.class::CSV_HEADER)
      entities.each{|e| csv << CSV.generate_line(e.csv_row)}
      send_data csv, :filename => "#{filename}.csv", :type => "text/csv"
    end
  end

  def render_pdf(filename, template, orientation = "Landscape")
    headers["Content-Type"] = "application/octet-stream"
    headers["Content-Disposition"] = "attachment; filename=\"#{filename}.pdf\""
    render :pdf => filename, :template => template, :orientation => orientation
  end

  def set_time_zone
    if current_user
      Time.zone = current_user.try(:organization).try(:time_zone)
    end
  end

  def load(entity_route = nil)
    entity_route = controller_name if entity_route.nil?
    entity_name = entity_route.singularize
    if entity_name == "organization"
      @organization = current_user.organization
    else
      if !instance_variable_set("@#{entity_name}", current_user.organization.send(entity_name.pluralize).find_by_id((params["#{entity_name}_id"] || params["id"]).to_i))
        flash[:error] = "The requested #{entity_name} could not be located."
        return(redirect_to(eval("#{entity_route}_path")))
      end
      if recently_vieweds && controller_name == entity_route && ["overview", "show"].include?(action_name)
        current_user.add_recently_viewed(instance_variable_get("@#{entity_name}"))
      end
    end
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

  def base_path
    request.path_info.split('/')[1]
  end

  def tab
    if ["show", "edit", "create", "update"].include?(action_name)
      "info"
    else
      action_name
    end
  end
end
