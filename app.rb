# Requires everytying we need
require 'sinatra'
require 'pry'
require 'sqlite3'
require 'json'
require_relative './models/connection'
require_relative './models/users'
require_relative './models/invites'
require_relative './models/collabs'
require_relative './models/projects'

# will need to enable sessions to log people in
enable :sessions


get '/' do
	if session[:user_id]
		redirect '/dashboard'
	else
		erb :index
	end
end

## CRUD routes for login/sessions
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

## Sign up form
get '/user/new' do
	erb :signup
end

post '/user' do
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
		@user = User.find_by({id: session[:user_id]})
		@invites = Invite.where({user_id: session[:user_id]})
		@collabs = Collab.where({user_id: session[:user_id]})
		erb :dashboard
	else
		redirect '/'
	end 
end


####
#     CRUD routes for projects

get '/project/new' do
	erb :new_project
end

get '/project/:id' do
	@project = Project.find_by({id: params[:id]})
	erb :project
end

post '/project' do
	keycode = keyCodeGenerator()
	project = {
		title: params[:title],
		user_id: session[:user_id],
		keycode: keycode
	}
	newProject = Project.create(project)
	redirect '/dashboard'
end

delete '/project/:id' do
	Project.destroy(params[:id])
	redirect '/dashboard'
end

####

## CRUD ROUTES FOR INVITES

post '/project/:id/invite' do
	request.body.rewind
	username = JSON.parse request.body.read
	user = User.find_by({username: username["username"]})
	if user && user.id != session[:user_id]
		invite = {
			user_id: user.id,
			project_id: params[:id].to_i
		}
		Invite.create(invite)
		response = {
			status: 'success'
		}
	else
		response = {
			status: 'invalid'
		}
	end
	response.to_json
end

delete '/invite/:id' do
	invite = Invite.find_by({id: params[:id]})
	if invite
		Invite.destroy(invite)
	end
	redirect '/'
end

## CRUD ROUTES FOR COLLAB

post '/collab' do
	invite = Invite.find_by({id: params[:invite_id]})
	if invite
		collab = Collab.create({
			project_id: invite[:project_id],
			user_id: invite[:user_id]
			})
		Invite.destroy(invite)
	end
	redirect '/'
end

######




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