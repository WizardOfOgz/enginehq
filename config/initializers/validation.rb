module Validation
  mattr_accessor :login, :login_msg, :name, :name_msg, :email_name, :domain_head, :domain_tld, :email, :email_msg,
  :zipcode, :zipcode_msg, :phone_msg, :taxid_msg, :age_msg, :dollar, :dollar_msg, :percent, :percent_msg,
  :positive_percent, :positive_percent_msg, :middle_initial, :middle_initial_msg, :url, :url_msg,
  :rails_name, :rails_name_msg, :ssn_msg, :positive_dollar, :positive_dollar_msg, :number_msg, :domain, :domain_msg
  
  self.login                    = /\A\w[\w\.\-_@]+\z/
  self.login_msg                = "use only letters, numbers, and .-_@ please.".freeze
  
  self.name                     = /\A[^[:cntrl:]\\<>]*\z/
  self.name_msg                 = "avoid non-printing characters and \\&gt;&lt;/ please.".freeze
  
  self.rails_name               = /^[a-zA-Z\_]*?$/u
  self.rails_name_msg           = "should only include underscores and letters.".freeze
  
  self.email_name               = '[\w\.%\+\-]+'.freeze
  self.domain_head              = '(?:[A-Z0-9\-]+\.)+'.freeze
  self.domain_tld               = '(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|pro|mobi|name|aero|jobs|museum)'.freeze
  self.email                    = /\A#{email_name}@#{domain_head}#{domain_tld}\z/i
  self.email_msg                = "should look like an email address.".freeze
  
  self.domain                   = /\A#{domain_head}#{domain_tld}\z/i
  self.domain_msg               = "should look like a domain name.".freeze
  
  self.phone_msg                = 'Accepts only 10 numbers and (),.- characters'.freeze
  
  self.age_msg                  = 'must contain only 3 numbers and less than 110'.freeze
  
  self.ssn_msg                  = 'must be in the format 111-11-1111'.freeze
  
  self.taxid_msg                = 'must be in the format 11-1111111'.freeze
  
  self.zipcode                  = /^\d{5}(\d{4})?$/
  self.zipcode_msg              = 'must contain 5 or 9 numbers'.freeze
  
  self.middle_initial           = /^[a-zA-Z]{0,1}$/u
  self.middle_initial_msg       = 'Middle Initial accepts only one letter'.freeze
  
  self.dollar                   = /^-?[0-9]{0,12}(\.[0-9]{0,2})?$/
  self.dollar_msg               = 'accepts only numeric characters, period, and negative sign'.freeze
  
  self.positive_dollar          = /^[0-9]{0,12}(\.[0-9]{0,2})?$/
  self.positive_dollar_msg      = 'accepts only numeric characters, period'.freeze
  
  self.percent                  = /^-?[0-9]{0,3}(\.[0-9]{0,3})?$/
  self.percent_msg              = 'accepts only numeric characters, period, negative sign, and must be equal/less/greater than +/- 100'.freeze
  
  self.positive_percent         = /^[0-9]{0,3}(\.[0-9]{0,3})?$/
  self.positive_percent_msg     = 'accepts only numeric characters, period, and must be less than 100'.freeze
  
  self.number_msg               = 'accepts only numbers (0-9)'.freeze
  
#take out
  self.url                      = /^(http|https|ftp):\/\/[A-Z0-9]+([\.]{1}[a-z0-9-]{1,63})*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$/ix
  self.url_msg                  = 'web address isnt valid'.freeze
end
      #       @@is_not_from_options_msg         = 'has a value other than the valid options below'
      #       @@is_required_msg                 = 'cannot be empty'
      #       @@is_required                     = /.+/
      #       @@is_alpha_msg                    = 'accepts only letters'
      #       @@is_alpha                        = /^[a-zA-Z]*?$/u
      #       @@is_alpha_space_msg              = 'accepts only letters and spaces'
      #       @@is_alpha_space                  = /^[a-zA-Z\ ]*?$/u
      #       @@is_alpha_hyphen_msg             = 'accepts only letters and hyphens'
      #       @@is_alpha_hyphen                 = /^[a-zA-Z\-]*?$/u
      #       @@is_alpha_underscore_msg         = 'accepts only letters and underscores'
      #       @@is_alpha_underscore             = /^[a-zA-Z\_]*?$/u
      #       @@is_alpha_symbol_msg             = 'accepts only letters and !@#$%^&*'
      #       @@is_alpha_symbol                 = /^[a-zA-Z\!\@\#\$\%\^\&\*]*?$/u
      #       @@is_alpha_separator_msg          = 'accepts only letters, underscores, hyphens, and spaces'
      #       @@is_alpha_separator              = /^[a-zA-Z\_\-\ ]*?$/u
      #       @@is_alpha_numeric_msg            = 'accepts only letters and 0-9'
      #       @@is_alpha_numeric                = /^[a-zA-Z0-9]*?$/u
      #       @@is_alpha_numeric_space_msg      = 'accepts only letters, 0-9, and spaces'
      #       @@is_alpha_numeric_space          = /^[a-zA-Z0-9\ ]$/
      #       @@is_alpha_numeric_underscore_msg = 'accepts only letters, 0-9, and underscores'
      #       @@is_alpha_numeric_underscore     = /^[a-zA-Z0-9\_]*?$/u
      #       @@is_alpha_numeric_hyphen_msg     = 'accepts only letters, 0-9, and hyphens'
      #       @@is_alpha_numeric_hyphen         = /^[a-zA-Z0-9\-]*?$/u
      #       @@is_alpha_numeric_symbol_msg     = 'accepts only letters, 0-9, and !@#$%^&*'
      #       @@is_alpha_numeric_symbol         = /^[a-zA-Z0-9\!\@\#\$\%\^\&\*]*?$/u
      #       @@is_alpha_numeric_separator_msg  = 'accepts only letters, 0-9, underscore, hyphen, and space'
      #       @@is_alpha_numeric_separator      = /^[a-zA-Z0-9\_\-\ ]*?$/u
      #       @@is_numeric_msg                  = 'accepts only numeric characters (0-9)'
      #       @@is_numeric                      = /^[0-9]*?$/
      #       @@is_decimal_msg                  = 'accepts only numeric characters, period, and negative sign (no commas, requires at least .0)'
      #       @@is_decimal                      = /^-{0,1}\d*\.{0,1}\d+$/
      #       @@is_positive_decimal_msg         = 'accepts only numeric characters and period (no commas, requires at least .0)'
      #       @@is_positive_decimal             = /^\d*\.{0,1}\d+$/
      #       @@is_integer_msg                  = 'accepts only numeric characters, and negative sign (no commas)'
      #       @@is_integer                      = /^-{0,1}\d+$/
      #       @@is_positive_integer_msg         = 'accepts positive integer only (no commas)'
      #       @@is_positive_integer             = /^\d+$/

