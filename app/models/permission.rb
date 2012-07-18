class Permission < ActiveRecord::Base
  belongs_to :role  
  
  TYPES = [:manage, :create, :read, :update, :destroy]
  
  scope :by_resource, lambda {|resource_name| {:conditions => {:resource => resource_name}}}
  scope :by_permission_type, lambda {|permission_type| {:conditions => {:permission_type => permission_type}}}
  validates :permission_type, :inclusion => TYPES.map(&:to_s)
end