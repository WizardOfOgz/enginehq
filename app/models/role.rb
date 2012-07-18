class Role < ActiveRecord::Base
  belongs_to :organization
  has_and_belongs_to_many :users, :join_table => :users_roles
  has_many :permissions, :dependent => :destroy
  attr_accessible :name, :description, :permissions_attributes
  accepts_nested_attributes_for :permissions, :reject_if => lambda { |p| p[:resource].blank? || p[:permission_type].blank?}, :allow_destroy => true
  
  validates_format_of :name, :with => /^[\w]*$/, :message => "must only contain letters, underscores, and numbers (no spaces)"
  validates_uniqueness_of :name, :scope => :organization_id
  before_save :underscore_name
  
  def default_permissions
    dp = {}
    Authorization::RESOURCES.each do |resource|
      dp[resource] = []
    end
    dp
  end
  
  private
  
  def underscore_name
    name = name.downcase.gsub(" ","_") unless !name
  end
  
end