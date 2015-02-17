require 'active_record'

class Project < ActiveRecord::Base
	belongs_to :user
end