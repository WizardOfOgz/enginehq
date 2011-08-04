module Applications
  AGENCIESHQ = {:url => Rails.env.production? ? "https://agencieshq.com" : "localhost:3000",
    :name => "AgenciesHQ", :tabs => ["Advisors", "Policies", "Contracts", "Licenses"],
    :more => ["Agencies", "Carriers", "Products", "Policy Holders", "Transfer Co.", "Programs", "Premium Reports", "Activity Reports"]}
  
  MARKETINGHQ = {:url => Rails.env.production? ? "https://marketinghq.agencieshq.com" : "localhost:3001",
    :name => "MarketingHQ", :tabs => ["Campaigns", "Lists", "Newsletters", "Templates"],
    :more => []}

  ADMINISTRATORSHQ = {:url => Rails.env.production? ? "https://agencieshq.com" : "localhost:3002",
    :name => "AdministratorsHQ", :tabs => ["Organizations", "Users"],
    :more => []}
  
  REPORTINGHQ = {:url => Rails.env.production? ? "https://reportinghq.agencieshq.com" : "localhost:3003",
    :name => "ReportingingHQ", :tabs => [""],
    :more => []}
  
  APPLICATIONS = [AGENCIESHQ, MARKETINGHQ, ADMINISTRATORSHQ, REPORTINGHQ]
  
  def self.get_application_option(option)
    eval("Applications::#{Rails.application.class.parent_name.upcase}[:#{option}]")
  end
end
