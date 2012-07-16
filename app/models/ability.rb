class Ability
  include CanCan::Ability

  def initialize(user)
    # Step through the users roles, get the permissions associated with the role, and grant the user those permissions.
    if user.has_role? :admin
      can :manage, :all
    end
    user.roles.map do |role|
      role.permissions.map do |permission|
        class_name = permission.resource.classify
        if Object.const_defined?(class_name)
          if permission.permission_type == "all"
            can :manage, class_name.constantize do |r|
              r.is_related_to_organization_with_user(user)
            end
          elsif permission.permission_type == "create"
            can :create, class_name.constantize
          else
            can permission.permission_type, permission.resource.classify do |r|
              r.is_related_to_organization_with_user(user)
            end
          end
        end
      end
    end
  end

end