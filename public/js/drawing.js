
// allows for multiple users to draw at the 
// --- same time
var User = function(unique){
	this.x = 0;
	this.y = 0;
	this.unique = unique;

	// sorts out what kind of message if sent
	// -- and draws accordingly
	this.draw = function(msg, context){

		// if type is start, draw a small point
		// at that area and set this x and y
		if(msg.type === 'start'){
			console.log('here');
			context.strokeStyle = "#df4b26";
  			context.lineJoin = "round";
  			context.lineWidth = 5;
			this.x = msg.x;
			this.y = msg.y;
			context.beginPath();
			context.moveTo(this.x,this.y);
			context.lineTo(this.x + 1, this.y);
			context.closePath();
			context.stroke();

		// if type is draw, draw a line from 
		// previous point to new point and update
		// current point to new point
		}else if(msg.type === 'draw'){
			context.strokeStyle = "#df4b26";
  			context.lineJoin = "round";
  			context.lineWidth = 5;
  			context.moveTo(this.x,this.y);
  			context.lineTo(msg.x, msg.y);
  			this.x = msg.x;
			this.y = msg.y;
			context.closePath();
			context.stroke();
		}
	};
};

var users = [],
	drawing = false;



window.onload = function(){
	$( '#inviteInput' ).keypress(function(e) {
		var key = e.which;
		if(key === 13){
			var invitee = $('#inviteInput').val();
			var project_id = $('#project_id').val();
			var inv = {
				username: invitee,
			};
			var route = '/project/' + project_id + '/invite';
			$.post(route, JSON.stringify(inv), function(data,status){
				console.log(data);
			});
		}
	});

	var canvas_div = document.getElementById('canvas-div');
	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', '800px');
	canvas.setAttribute('height', '800px');
	canvas.setAttribute('id', 'canvas');
	canvas_div.appendChild(canvas);
	var context = canvas.getContext('2d');
	startDrawing(context);
};


function startDrawing(ctx){

	// var alex = new User('alex');

	$('#canvas').mousedown(function(e){
		drawing = true;
		var x = e.offsetX,
			y = e.offsetY;

		var msg = {
			type: 'start',
			x: x,
			y: y
		};
		ws.send(JSON.stringify(msg));
	})

	$('#canvas').mousemove(function(e){
		if(drawing){
			var x = e.offsetX,
				y = e.offsetY;
			var msg = {
				type: 'draw',
				x: x,
				y: y
			};
			ws.send(JSON.stringify(msg));
		}
	})

	$(document).mouseup(function(e){
		drawing = false;
	})


	// starts websocket connections
	ws = new WebSocket("ws://localhost:3000");

	// immediately sends key
	ws.addEventListener('open', function(){
		ws.send(key);
	});

	// receiving messages
	ws.addEventListener('message', function(evt){
		msg = JSON.parse(evt.data)
		// console.log(msg);
		if( msg.type === 'history'){
			// console.log(msg);
			msg.history.forEach(function(j_msg){
				var pathing = JSON.parse(j_msg);;
				var current_user = checkUsers(pathing);
				current_user.draw(pathing, ctx)
			})
			// console.log(JSON.parse(msg.history));
		}else{
			var current_user = checkUsers(msg);
			current_user.draw(msg,ctx);
		}
	});
}



function checkUsers(msg){
	console.log(msg);
	var exists = false;
	var current_user;
	users.forEach(function(user){
		if(user.unique === msg.unique){
			console.log('exists');
			exists = true;
			current_user = user;
		}
	});
	// console.log(current_user);
	if(!exists){
		current_user = new User(msg.unique);
		users.push(current_user);
	}
	return current_user;
};