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
	user = User.find_by(username: params[:username])
	if user && user.password === params[:password]
		session[:user_id] = user.id
		redirect '/dashboard'
	else
		redirect '/'
	end
end

## signs user out
delete '/login' do
	session[:user_id] = nil
	redirect '/'
end

## Sign up form
get '/user/new' do
	erb :signup
end

## creates new user
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

# loads the main dashboard page
get '/dashboard' do
	puts keyCodeGenerator()
	if session[:user_id]
		@projects = Project.where({user_id: session[:user_id]})
		@user = User.find_by({id: session[:user_id]})
		@invites = Invite.where({user_id: session[:user_id]})
		@collabs = Collab.where({user_id: session[:user_id]})
		erb :dashboard2
	else
		redirect '/'
	end 
end

get '/dashboard2' do
	erb :dashboard2
end


####
#     CRUD routes for projects

get '/project/new' do
	if session[:user_id]
		erb :new_project
	else
		redirect '/'
	end
end

get '/project/:id' do
	@project = Project.find_by({id: params[:id]})
	collabs = Collab.where({project_id: @project.id})
	collaborator = false;
	## security if someone who is not a collab or user
	collabs.each do |collab|
		if(collab[:user_id] == session[:user_id])
			collaborator = true
		end
	end
	if session[:user_id] == @project[:user_id] || collaborator
		erb :project
	else
		redirect '/'
	end
end

post '/project' do
	## only allows someone whos signed in to create
	if session[:user_id]
		keycode = keyCodeGenerator()
		project = {
			title: params[:title],
			user_id: session[:user_id],
			keycode: keycode
		}
		newProject = Project.create(project)
		redirect '/dashboard'
	else
		redirect '/'
	end
end

delete '/project/:id' do
	# only allows the user to delete own project
	project = Project.find_by(params[:id])
	if session[:user_id] == project[:user_id]
		Project.destroy(params[:id])
		redirect '/dashboard'
	else
		redirect '/'
	end
end

####

## CRUD ROUTES FOR INVITES

post '/project/:id/invite' do
	request.body.rewind
	username = JSON.parse request.body.read
	user = User.find_by({username: username["username"]})
	invite = Invite.find_by({user_id: user.id, project_id: params[:id].to_i})
	collab = Collab.find_by({user_id: user.id, project_id: params[:id].to_i})
	# no duplicate invites or collabs
	if user && user.id != session[:user_id] && !invite && !collab
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
	if invite && invite[:user_id] == session[:user_id]
		Invite.destroy(invite)
		redirect '/dashboard'
	else
		redirect '/'
	end
	
end

## CRUD ROUTES FOR COLLAB

post '/collab' do
	invite = Invite.find_by({id: params[:invite_id]})
	if invite && invite[:user_id] == session[:user_id]
		collab = Collab.create({
			project_id: invite[:project_id],
			user_id: invite[:user_id]
			})
		Invite.destroy(invite)
		redirect '/dashboard'
	else
		redirect '/'
	end
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
