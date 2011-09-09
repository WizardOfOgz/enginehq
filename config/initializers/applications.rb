module Applications
  SINGLESIGNONHQ = {:url => Rails.env.production? ? "http://singlesignonhq.agencieshq.com" : "http://singlesignonhq.dev",
#  SINGLESIGNONHQ = {:url => "http://singlesignonhq.agencieshq.com",
    :name => "SingleSignOnHQ", 
    :tabs => nil,
    :mores => nil,
    :screens => nil}

  AGENCIESHQ = {:url => Rails.env.production? ? "https://agencieshq.com" : "http://agencieshq.dev",
    :name => "AgenciesHQ", 
    :tabs => ["Advisors", "Policies", "Contracts", "Licenses"],
    :mores => ["Agencies", "Carriers", "Products", "Policy Holders", "Transfer Companies", "Programs", "Premium Reports", "Activity Reports"],
    :screens => ["Advisors", "Agencies", "Carriers", "Contracts", "Licenses", "Policy Holders", "Policies", "Programs", "Products", 
      "Transfer Companies"]}

  MARKETINGHQ = {:url => Rails.env.production? ? "http://marketinghq.agencieshq.com" : "http://marketinghq.dev",
    :name => "MarketingHQ", 
    :tabs => ["Campaigns", "Lists", "Newsletters", "Templates"],
    :mores => nil,
    :screens => nil}

  ADMINISTRATORSHQ = {:url => Rails.env.production? ? "http://administratorshq.agencieshq.com" : "http://administratorshq.dev",
    :name => "AdministratorsHQ", 
    :tabs => ["Organizations", "Users"],
    :mores => nil,
    :screens => nil}
  
  REPORTINGHQ = {:url => Rails.env.production? ? "http://reportinghq.agencieshq.com" : "http://reportinghq.dev",
    :name => "ReportingHQ", 
    :tabs => nil,
    :mores => nil,
    :screens => nil}

  APPLICATIONS = [AGENCIESHQ, MARKETINGHQ, ADMINISTRATORSHQ, REPORTINGHQ]

  def self.get_application_option(option)
    eval("Applications::#{Rails.application.class.parent_name.upcase}[:#{option}]")
  end
end
