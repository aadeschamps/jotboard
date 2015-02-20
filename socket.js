var WebSocketServer = require("ws").Server;
var server = new WebSocketServer({port: 3000});
var sqlite3 = require('sqlite3').verbose();

// connects to same database that sinatra server
// --- connects to
var db = new sqlite3.Database("jot.db");



// the user object, will use roomId heavily
var User = function(conn){
	this.roomId = false;
	this.conn = conn;
};


// this will be a db hash used to control 
// ---whos in what room
// ------- I want to replace with mongoDb
local_db = {};


// What happens when connection 
server.on("connection", function(connection){
	console.log('connected');
	var user = new User(connection);
	// what happens when a message comes in
	connection.on('message',function(message){
		// checks to see if its the first message
		// ---the keycode is always the first thing that gets sent
		if(!user.roomId){
			user.roomId = true;
			// gets the project id from the keycode
			db.get("SELECT * FROM projects where keycode = ?", message, function(err, row){
				if(err){throw err};
				user.roomId = row.id;
				checkRoom(user, row.id);
			});
		}else{
			sendMessages(user, message);
		}
	});

	// removes person from room when connection
	// --- ends
	connection.on('close', function(){
		var index = local_db[user.roomId].users.indexOf(user);
		local_db[user.roomId].users.splice(index,1);
	});
});


// checks to see if room exists and makes
// one if it doesnt
//------also sends down history of the room
function checkRoom(user, id){
	if (!!local_db[id]){
		var unique = 1;
		var found = false;
		for (var i = 0; i < local_db[id].users.length; i++) {
			if( local_db[id].users[i].unique != unique){
				user.unique = unique;
				local_db[id].users.splice(i, 0, user);
				found = true;
				break;
			}
			unique++;
		};
		if(!found){
			user.unique = unique
			local_db[id].users.push(user);
		}
		user.conn.send(JSON.stringify({
			type: 'history',
			history: local_db[id].history
		}));
	}else{
		user.unique = 1;
		local_db[id] = {
			users: [user],
			history: []
		};
		console.log(local_db[id].history)
		user.conn.send(JSON.stringify({
			type: 'history',
			history: local_db[id].history
			})
		)
	}
}

// looks up which room your in and sends
// -- messages to all the users in it
function sendMessages(user, msg){
	room = local_db[user.roomId];
	var buffer = JSON.parse(msg);
	buffer.unique = user.unique;
	console.log(buffer);
	var new_msg = JSON.stringify(buffer);
	room.users.forEach(function(elem){
		elem.conn.send(new_msg);
	});
	room.history.push(new_msg);
}