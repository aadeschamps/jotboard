require 'active_record'
require_relative './models/connection'
require_relative './models/users'
require_relative './models/invites'
require_relative './models/collabs'
require_relative './models/projects'

alex = User.create({
	username: 'alex',
	password: 'blah',
	email: 'blah@blah.com'
	})

Project.create({
	user_id: alex.id,
	title: 'This Project'
	})