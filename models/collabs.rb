require 'active_record'

class Collab < ActiveRecord::Base
	belongs_to :user
	belongs_to :project
end