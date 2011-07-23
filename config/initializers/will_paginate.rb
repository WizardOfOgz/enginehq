class PaginationListLinkRenderer < WillPaginate::ViewHelpers::LinkRenderer
  def to_html
    @options[:outer_window] = 0; links = windowed_links

    links.unshift(page_control("previous", "previous_page", "control previous")) if @collection.previous_page
    links.push(page_control("next", "next_page", "control next")) if @collection.next_page

    html = "<ul class=\"page-control\">#{links.join("")}</ul>"
  end

  protected
  def windowed_links
    windowed_page_numbers.map{|n| page_control(n, "page", (n == current_page ? "control page current" : "control page"))}
  end

  def page_control(text, name, class_name)
    if text.to_s == "gap"
      "<li class=\"hidden-pages\"><abbr title=\"Hidden page(s)\">...</abbr></li>"
    else
      "<li class=\"#{class_name}\"><input type=\"submit\" value=\"#{text}\" name=\"#{name}\" /></li>"
    end
  end
end

module ControllerLogic
  def list_logic(prefix, sort)
    instance_variable_set("@#{prefix}_page", params[:page].to_i > 0 ? params[:page].to_i : 1)

    if params[:next_page]
      instance_variable_set("@#{prefix}_page", instance_variable_get("@#{prefix}_page") + 1)
    elsif params[:previous_page]
      instance_variable_set("@#{prefix}_page", instance_variable_get("@#{prefix}_page") - 1)
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
end