namespace :app do
  desc "Make all objects in S3 public_read"
  task :s3 => :environment do
    aws_account = YAML::load_file("#{Rails.root}/config/s3.yml")[Rails.env]
    AWS::S3::Base.establish_connection!(:access_key_id => aws_account["access_key_id"], :secret_access_key => aws_account["secret_access_key"])
    bucket = AWS::S3::Bucket.find("#{Applications.get_application_option("name").downcase}-#{Rails.env}")
    bucket.acl.grants << AWS::S3::ACL::Grant.grant(:authenticated_read)

    marker = ""
    loop do
      objects = AWS::S3::Bucket.objects("#{Applications.get_application_option("name").downcase}-#{Rails.env}", :marker => marker, :max_keys => 100)
      puts "found #{objects.size} objects"

      break if objects.size == 0

      marker = objects.last.key
      puts "new marker is \"#{marker}\""
      authenticated_read = AWS::S3::ACL::Grant.grant(:authenticated_read)
      objects.each do |o|
        o.acl.grants << authenticated_read if !o.acl.grants.include?(authenticated_read)
      end
    end
  end
end