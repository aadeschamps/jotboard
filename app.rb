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
	puts keyCodeGenerator()
	if session[:user_id]
		@projects = Project.where({user_id: session[:user_id]})
		erb :dashboard
	else
		redirect '/'
	end 
end


####
#     CRUD routes for projects
get '/project/:id' do
	@project = Project.find_by({id: params[:id]})
	erb :project
end

get '/project/new' do
	erb :new_project
end

post '/project' do
	project = {
		user_id: session[:user_id],
		keycode: keyCodeGenerator()
	}
end

delete '/project/:id' do
	Project.destroy(params[:id])
	redirect '/dashboard'
end

####



## Generates random key for each project
def keyCodeGenerator()
	alphabet = %w[a b c d e f g h i j k l m o p q r s t u v x y z]
	keyCode = "" 
	for i in (1..20)
		num = rand(1..alphabet.length-1)
		keyCode += alphabet[num]
	end
	return keyCode
end

keyCodeGenerator()




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