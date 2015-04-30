var WebSocketServer = require("ws").Server,
	server = new WebSocketServer({port: 3000}),
	sqlite3 = require('sqlite3').verbose(),
	mongoose = require('mongoose'),

// starts connectiont to mongoDB
// -- going to be used to store drawing history
	mdb = require('./db'),
	Projects = mdb.models.Projects;


// connects to same database that sinatra server
// --- connects to
var db = new sqlite3.Database("../jot.db");



// the user object, will use roomId heavily
var User = function(conn){
	this.roomId = false;
	this.conn = conn;
};


// this will be a db hash used to control 
// ---whos in what room and therefore where to send messages to
var local_db = {};


// What happens when connection 
server.on("connection", function(connection){
	var user = new User(connection);
	// what happens when a message comes in
	connection.on('message',function(message){
		// checks to see if its the first message
		if(!user.roomId){
			// gets the project id from the keycode
			db.get("SELECT * FROM projects where keycode = ?", message, function(err, row){
				console.log('row is: ' + row);
				if(row === undefined){
					console.log('error: wrong initial message');
				}else{
					Projects.findOneAndUpdate(
						{project_id: row.id}, 
						{project_id: row.id}, 
						{upsert: true}, 
						function(err, doc){
							if(err){
								console.log(err);
							} else {
								user.roomId = row.id;
								checkRoom(user, row.id);
							}
						}
					)	
				}
			});
		}else{
			sendMessages(user, message);
		}
	});

	// removes person from room when connection
	// --- ends
	connection.on('close', function(){
		if(user.roomId){
			var index = local_db[user.roomId].users.indexOf(user);
			local_db[user.roomId].users.splice(index,1);
		}
	});
});


// checks to see if room exists and makes
// one if it doesnt
//------also sends down history of the room
// -----added in unique id per room to each user
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
		getHistory(id, function(history){
			user.conn.send(JSON.stringify({
				type: 'history',
				history: history
				})
			);
		});
	}else{
		user.unique = 1;
		local_db[id] = {
			users: [user],
			drawing: false
		};
		getHistory(id, function(history){
			user.conn.send(JSON.stringify({
				type: 'history',
				history: history
				})
			);
		});
		
	}
}

// looks up which room your in and sends
// -- messages to all the users in it
function sendMessages(user, msg){
	var room = local_db[user.roomId];
	var buffer = JSON.parse(msg);
	// checks to see if someone is drawing
	if (!room.drawing){
		// checks to see if this is the start
		if (buffer[0].type === 'start'){
			room.drawing = user.unique;
		}
	}
	if(room.drawing === user.unique){
		if(buffer[buffer.length-1].type === 'end'){
			room.drawing = false;
		}
		
		buffer.unique = user.unique;	
		var new_msg = JSON.stringify(buffer);
		room.users.forEach(function(elem){
			elem.conn.send(new_msg);
		});
		// pushed new message to a given rooms history
		Projects.findOneAndUpdate(
			{project_id: user.roomId}, 
			{$push: {"messages": new_msg}},
			{safe: true, upsert: true},
			function(err, doc){
				if(err){ console.log(err) }
			}
		)
	}
}

// queries mongo database for the history of a room
function getHistory(id, callback){
	Projects.findOne({project_id: id}, function(err, doc){
		callback(doc.messages);
	})
}