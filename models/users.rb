require 'active_record'

class User < ActiveRecord::Base
	validates :username, presence: true
	validates :username, uniqueness: true
	validates :password, presence: true
	validates :email, presence: true
	validates :email, uniqueness: true


	has_many :projects
end