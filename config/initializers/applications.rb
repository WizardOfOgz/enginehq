module Applications
  AGENCIESHQ_URL = "https://agencieshq.com"
  AGENCIESHQ_NAME = "AgenciesHQ"
  AGENCIESHQ_TABS = ["Advisors", "Policies", "Contracts", "Licenses"]
  AGENCIESHQ_MORE = ["Agencies", "Carriers", "Products", "Policy Holders", "Transfer Co.", "Programs", "Premium Reports", "Activity Reports"]
  
  ADMINISTRATORSHQ_URL = "https://administratorshq.com"
  ADMINISTRATORSHQ_NAME = "AdministratorsHQ"
  ADMINISTRATORSHQ_TABS = ["Organizations", "Users"]
  ADMINISTRATORSHQ_MORE = []
  
  MARKETINGHQ_URL = "https://marketinghq.com"
  MARKETINGHQ_NAME = "MarketingHQ"
  MARKETINGHQ_TABS = ["Campaigns", "Lists", "Newsletters", "Templates"]
  MARKETINGHQ_MORE = []
  
  REPORTINGHQ_URL = "https://reportinghq.com"
  REPORTINGHQ_NAME = "ReportingingHQ"
  REPORTINGHQ_TABS = [""]
  REPORTINGHQ_MORE = []
  
  def self.get_application_option(option)
    eval("Applications::#{Rails.application.class.parent_name.upcase}_#{option}")
  end

  def self.hello
    puts "hello"
  end
end
