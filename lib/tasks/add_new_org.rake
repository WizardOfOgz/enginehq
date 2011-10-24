namespace :data do
  desc 'add a new org'
  task :new_org_agencies => :environment do
    #make organization
    organization           = Organization.create(:name => "Crown Advisory LLC")
    organization.time_zone = "Pacific Time (US & Canada)"
    organization.domain    = "crownadvisoryllc.com"

    #phones
    organization.phones << Phone.new(:location => "Office", :favorite => true, :number => "623-536-8142")
    organization.phones << Phone.new(:location => "Fax", :number => "623-536-7958")

    #address
    organization.addresses << Address.new(:location => "Office", :line_one => "P. O. Box 520", :city => "Litchfield Park", :state => "AZ", :zipcode => "85340")

    #webs
    organization.webs << Web.new(:location => "Office", :url => "www.#{organization.domain}")

    organization.save!

    #channels
    annuity_channel = Channel.new(:channel_type => Channel::ANNUITY_CHANNEL_TYPE)
    annuity_channel.organization = organization
    annuity_channel.save!
    life_channel = Channel.new(:channel_type => Channel::LIFE_CHANNEL_TYPE)
    life_channel.organization = organization
    life_channel.save!
  end
end

namespace :data do
  desc 'add a new org'
  task :new_org_singlesignon => :environment do
    #make organization
    organization           = Organization.create(:name => "Crown Advisory LLC")
    organization.time_zone = "Pacific Time (US & Canada)"
    organization.domain    = "crownadvisoryllc.com"

    organization.save!

    #load users data
    users = [{:first_name => "Penny"}, {:first_name => "Susan"}, {:first_name => "Priscilla"}, {:first_name => "Tina"}]

    users.each_with_index do |user_data,i|
      user = User.new(:username => "#{user_data[:first_name].downcase}@#{organization.domain}", :password => "123456", :password_confirmation => "123456")
      user.organization = organization; user.is_approved = true; user.is_marketer = true
      #person
      user.person = user.build_person(:first_name => user_data[:first_name])
      user.person.organization = organization
      #emails
      user.emails << Email.new(:location => "Office", :address => "#{user_data[:first_name].downcase}@#{organization.domain}", :is_favorite => true)
      user.save!
    end
  end
end
