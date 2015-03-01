require 'active_record'

class Invite < ActiveRecord::Base
	validates :user_id, presence: true
	validates :project_id, presence: true
	
	belongs_to :user
	belongs_to :project
end