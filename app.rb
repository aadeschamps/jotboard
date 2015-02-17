# Requires everytying we need
require 'sinatra'
require 'pry'
require 'sqlite3'
require 'firebase_token_generator'
require 'json'
require_relative './models/connection'
require_relative './models/users'
require_relative './models/invites'
require_relative './models/collabs'
require_relative './models/projects'

# will need to enable sessions to log people in
enable :sessions

# gets the index page with sign in
get '/' do
	erb :index
end

# logs people in who have the right crudentials
post '/login' do
	# finds user with the username given
	user = User.find_by(username: params[:username])
	# sets the session[:user_id] if the user exists and
	# the password matches the database
	if user && user.password === params[:password]
		session[:user_id] = user.id
		redirect '/dashboard'
	else
		redirect '/'
	end
end

delete '/login' do
	session[:user_id] = nil
	redirect '/'
end

get '/signup' do
	erb :signup
end

post '/user' do
	binding.pry
	if params[:password] === params[:confirm_password]
		user = {
			username: params[:username],
			password: params[:password],
			email: params[:email]
		}
		User.create(user)
		id = User.find_by(username: params[:username])
		session[:user_id] = id.id
		redirect '/dashboard'
	else
		redirect '/signup'
	end
end

get '/dashboard' do
	if session[:user_id]
		@projects = Project.where({user_id: session[:user_id]})
		erb :dashboard
	else
		redirect '/'
	end 
end



#### old project idea
# get '/token' do
# 	if session[:user_id]
# 		user = User.find_by({id: session[:user_id]})
# 		payload = {uid: user.id.to_s, username: user.username, debug: true, admin: true}
# 		generator = Firebase::FirebaseTokenGenerator.new("2M5yxqWATqXQBqIlDqgwVQnJd0r3zyxA1sQELr1d")
# 		token = generator.create_token(payload)
# 		token.to_json
# 	end
# end