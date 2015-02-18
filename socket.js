var WebSocketServer = require("ws").Server;
var server = new WebSocketServer({port: 3000});
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database("final_project.db");


// var room = function(id){
// 	this.id = id;
// 	this.users = [];
// 	this.history = [];

// 	this.sendMessages = function(msg){
// 		this.users.forEach(function(user){
// 			user
// 		})
// 	};
// 	this.enter = function(user){

// 	};
// 	this.leave = function(user){
// 		index = this.users.indexOf(user);
// 		this.users.splice(index,1);
// 	}
// }

var User = function(conn){
	this.roomId = false;
	this.conn = conn;
}


// good concept, might look into it further
local_db = {
	0: {
		users: ['in here'],
		history: []
	}
};

var rooms = [];

server.on("connection", function(connection){
	console.log('connected')
	var user = new User(connection);
	connection.on('message',function(message){
		if(!user.roomId){
			db.get("SELECT * FROM projects where keycode = ?", message, function(err, row){
				if(err){throw err}
				console.log(row);
				user.roomId = row.id;
				checkRoom(user, row.id)
			})
		}else{
			sendMessages(user, message);
		}
	})



	connection.on('close', function(){
		var index = local_db[user.roomId].users.indexOf(user);
		local_db[user.roomId].users.splice(index,1)
	})
});

function checkRoom(user, id){
	if (!!local_db[id]){
		local_db[id].users.push(user);
	}else{
		local_db[id] = {
			users: [user],
			history: []
		}
	}
	console.log(local_db[user.roomId].users.indexOf(user))
}

function sendMessage(user, msg){

}