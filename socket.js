var WebSocketServer = require("ws").Server;
var server = new WebSocketServer({port: 3000});
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database("final_project.db");


server.on("connection", function(connection){
	console.log('connected')
	connection.on('message',function(message){
		console.log(message);
		db.get("SELECT * FROM projects where keycode = ?", message, function(err, row){
			if(err){throw err}
			console.log(row);
		})
	})
});