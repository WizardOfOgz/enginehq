module EnginehqHelper
  def param_to_time(hash, param)
    if hash && (!hash["#{param}(1i)"].blank? || !hash["#{param}(3i)"].blank? || !hash["#{param}(3i)"].blank?)
      begin
        return Time.parse("#{hash["#{param}(1i)"]}/#{hash["#{param}(2i)"]}/#{hash["#{param}(3i)"]}"), ""
      rescue
        return nil, " error"
      end
    else
      return nil, ""
    end
  end

  def sort_control(sort, column)
    if request.format != "pdf"
      direction = sort.split("_").last
      if column == sort.split("_").reject{|s| s == direction}.join("_")
        raw "<input class=\"sort-control #{direction}\" value=\"#{column}_#{direction == "descending" ? "ascending" : "descending"}\" type=\"submit\" name=\"sort\" />"
      else 
        raw "<input class=\"sort-control\" value=\"#{column}_ascending\" type=\"submit\" name=\"sort\" />"
      end
    end
  end

  def format_map_url(address)
    address.latitude ? "http://maps.google.com?daddr=#{address.display_address}" : nil
  end

  def format_date(datetime)
    datetime.nil? ? "--" : h(datetime.strftime("%m/%d/%Y"))
  end

  def format_time(time)
    h(time.strftime("%l:%M %p")) if time != nil
  end

  def format_datetime(datetime)
    h(datetime.strftime("%m/%d/%Y %l:%M %p")) if !datetime.nil?
  end

  def format_dollar(dollar)
    number_to_currency(dollar).sub(/^\$-/, '-$') if dollar
  end

  def format_percent(percent)
    percent ? number_to_percentage(percent, :strip_insignificant_zeros => true) : "--"
  end

  def ce?(b)
    " class=\"error\"" if b
  end

  def e?(b)
    b ? " error" : ""
  end

  def common_error_messages(*params)
    options = params.extract_options!.symbolize_keys
    if object = options.delete(:object)
      objects = [object].flatten
    else
      objects = params.collect {|object_name| instance_variable_get("@#{object_name}") }.compact
    end
  
    count = objects.inject(0){|sum, object| sum + object.errors.count }
    if !count.zero?
      error_messages = []
      objects.each{|object| object.errors.each{ |attr,msg| error_messages << msg if msg != "is invalid"}}
      error_message_string = ""
      error_messages.uniq.each{|em| error_message_string += content_tag(:li,"#{em}", :class => "alert error")}
      contents = content_tag(:ul, raw(error_message_string), :class => "alerts errors")
      contents = content_tag(:div, raw("<h4 class=\"title\">#{flash[:error]}  Please Fix the errors below...</h4>") + contents, :class => "content-alerts content-errors")
    elsif flash[:error]
      contents = content_tag(:div, raw("<h4 class=\"title\">#{flash[:error]}</h4>") + contents, :class => "content-alerts content-errors")
    elsif flash[:success]
      contents = content_tag(:div, raw("<h4 class=\"title\">#{flash[:success]}</h4>") + contents, :class => "content-alerts content-successes")
    elsif flash[:warning]
      contents = content_tag(:div, raw("<h4 class=\"title\">#{flash[:warning]}.</h4>") + contents, :class => "content-alerts content-warnings")
    else
      ""
    end
  end

  def common_list_error_messages(item_list)
    error_message = "<ul class=\"info-list error\">"
    item_list.each do |i|
      i.errors.each do |attr, msg|
        error_message += "<li>#{msg}</li>"
      end
    end
    error_message += "</ul>"
  end
end
