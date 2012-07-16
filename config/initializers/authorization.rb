module Authorization

  # We use cancan for authorization, this initializer defines which resources can have permissions granted on the page:
  # administratorshq.com/roles/new
  # For example:
  # RESOURCES => [:advisors]
  # Will allow someone with the admin role to create roles and add create/read/update/delete permissions to the role,
  # that apply to all advisors associated with their organization.
  # Each organization should have 1 or more admins, who can access administratorshq to CRUD users and whatever roles 
  # they want to create with permissions to the resources.

  # Maybe these should be split by app? eg. RESOURCES => {:advisorshq => [:advisors,contracts,..]}
  RESOURCES = [:advisors, :agencies, :attachments, :campaigns, :carriers, :contacts, :contracts, :goals, 
                :hierarchies, :licenses, :messages, :paid_premiums, :photos, :policies, :policy_holders,
                :products, :profiles, :programs, :protected_territories, :reports, :requirements, :tools, :transfer_companies]

end