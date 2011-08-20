RailsDevelopmentBoost.debug!
module Applications
  #SINGLESIGNONHQ = {:url => Rails.env.production? ? "http://singlesignonhq.agencieshq.com" : "http://localhost:33000",
  SINGLESIGNONHQ = {:url => "http://singlesignonhq.agencieshq.com",
    :name => "SingleSignOnHQ", :tabs => [""],
    :more => []}

  AGENCIESHQ = {:url => Rails.env.production? ? "https://agencieshq.com" : "http://localhost:3000",
    :name => "AgenciesHQ", :tabs => ["Advisors", "Policies", "Contracts", "Licenses"],
    :more => ["Agencies", "Carriers", "Products", "Policy Holders", "Transfer Co.", "Programs", "Premium Reports", "Activity Reports"]}

  MARKETINGHQ = {:url => Rails.env.production? ? "http://marketinghq.agencieshq.com" : "http://localhost:3001",
    :name => "MarketingHQ", :tabs => ["Campaigns", "Lists", "Newsletters", "Templates"],
    :more => []}

  ADMINISTRATORSHQ = {:url => Rails.env.production? ? "http://administratorshq.agencieshq.com" : "http://localhost:3002",
    :name => "AdministratorsHQ", :tabs => ["Organizations", "Users"],
    :more => []}
  
  REPORTINGHQ = {:url => Rails.env.production? ? "http://reportinghq.agencieshq.com" : "http://localhost:3003",
    :name => "ReportingHQ", :tabs => [""],
    :more => []}

  APPLICATIONS = [AGENCIESHQ, MARKETINGHQ, ADMINISTRATORSHQ, REPORTINGHQ]

  def self.get_application_option(option)
    eval("Applications::#{Rails.application.class.parent_name.upcase}[:#{option}]")
  end
end
