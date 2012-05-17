module Applications
  SINGLESIGNONHQ = {:url => Rails.env.production? ? "http://singlesignonhq.agencieshq.com" : "http://localhost:3300",
#  SINGLESIGNONHQ = {:url => "http://singlesignonhq.agencieshq.com",
    :name => "SingleSignOnHQ", 
    :tabs => nil,
    :mores => nil,
    :screens => nil}

  AGENCIESHQ = {:url => Rails.env.production? ? "https://agencieshq.com" : "http://localhost:3000",
    :name => "AgenciesHQ", 
    :tabs => ["Advisors", "Policies", "Contracts", "Licenses"],
    :mores => ["Contacts", "Agencies", "Carriers", "Products", "Policy Holders", "Programs", "Transfer Companies", "Premium Reports", "Activity Reports", "Tools"],
    :screens => ["Advisors", "Agencies", "Carriers", "Contacts", "Contracts", "Licenses", "Policy Holders", "Policies", "Programs", "Products", 
      "Transfer Companies"]}

  MARKETINGHQ = {:url => Rails.env.production? ? "http://marketinghq.agencieshq.com" : "http://localhost:3001",
    :name => "MarketingHQ", 
    :tabs => ["Campaigns", "Lists", "Newsletters", "Templates"],
    :mores => nil,
    :screens => nil}

  ADMINISTRATORSHQ = {:url => Rails.env.production? ? "http://administratorshq.agencieshq.com" : "http://localhost:3002",
    :name => "AdministratorsHQ", 
    :tabs => ["Organizations", "Users"],
    :mores => nil,
    :screens => nil}

  APPLICATIONS = [AGENCIESHQ, MARKETINGHQ, ADMINISTRATORSHQ]

  def self.get_application_option(option)
    eval("Applications::#{Rails.application.class.parent_name.upcase}[:#{option}]")
  end
end
