require 'active_record'

class Invite < ActiveRecord::Base
	belongs_to :user
	belongs_to :project
end