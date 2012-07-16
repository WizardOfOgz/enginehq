module EngineHQ
  # = EngineHQ extensions to the ActiveRecord module

  module ActiveRecord
    
    # Checks if the instance is related to the specified user,
    # either it is the user, is the users organization, or is associated with the users organization.
    def is_related_to_organization_with_user(user)
      (self.class.name == "Organization" && self.id == user.organization_id) ||
      (self.respond_to?(:user_id) && self.user_id == user.id) || 
      (self.respond_to?(:organization_id) && self.organization_id == user.organization_id)
    end
    
  end
  
end

ActiveRecord::Base.send(:include,EngineHQ::ActiveRecord)