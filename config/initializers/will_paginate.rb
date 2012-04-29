require 'will_paginate/view_helpers/link_renderer'

class PaginationListLinkRenderer < WillPaginate::ViewHelpers::LinkRenderer

  def to_html
    @options[:outer_window] = 0; links = windowed_links
    links.unshift(page_control("previous", "page[#{@collection.current_page - 1}]", "control previous")) if @collection.previous_page
    links.push(page_control("next", "page[#{@collection.current_page + 1}]", "control next")) if @collection.next_page

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

