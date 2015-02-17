require 'active_record'
require_relative './models/connection'
require_relative './models/users'

User.create({
	username: 'alex',
	password: 'blah',
	email: 'blah@blah.com'
	})