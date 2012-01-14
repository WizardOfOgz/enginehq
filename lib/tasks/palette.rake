# require 'yaml'
# 
# namespace :app do
#   RE_COLOR_RGB = Regexp.new('(rgb[\s]*\([\s-]*[\d]+(\.[\d]+)?[%\s]*,[\s-]*[\d]+(\.[\d]+)?[%\s]*,[\s-]*[\d]+(\.[\d]+)?[%\s]*\))', Regexp::IGNORECASE)
#   RE_COLOR_HEX = /(#([0-9a-f]{6}|[0-9a-f]{3})([\s;]|$))/i
#   RE_COLOR_NAMED = /([\s]*^)?(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|transparent)([\s]*$)?/i
#   RE_COLOR = Regexp.union(RE_COLOR_RGB, RE_COLOR_HEX, RE_COLOR_NAMED)
# 
#   @results = []
# 
#   desc 'show all colors from css file'
#   task :palette do
#     assets = open("#{Rails.root}/config/assets.yml") {|f| YAML.load(f) }
# 
#     assets['stylesheets']['desktop'].each do |stylesheet|
#       read_file(stylesheet)
#     end
# 
#     puts @results.uniq.flatten.to_json
#   end
# 
#   def read_file(file)
#     File.open("#{Rails.root}/#{file}", "r").each_line do |line|
#       parse_css_string line
#     end
#   end
# 
#   def parse_css_string(line)
#     colors = line.scan(RE_COLOR)
#     colors.flatten.compact.each do |c|
#       @results << c.sub(';','') if c.match(RE_COLOR)
#     end
#   end
# end

