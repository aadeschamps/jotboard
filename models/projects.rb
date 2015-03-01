require 'active_record'

class Project < ActiveRecord::Base
	validates :title, presence: true
	validates :title, length: { minimum: 3}
	validates :title, length: { maximum: 20}
	validates :user_id, presence: true
	validates :keycode, presence: true

	belongs_to :user
end