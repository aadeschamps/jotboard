
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
			context.strokeStyle = msg.color;
  			context.lineJoin = "round";
  			context.lineWidth = msg.stoke_size;
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
			context.strokeStyle = msg.color;
  			context.lineJoin = "round";
  			context.lineWidth = msg.stroke_size;
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
	startDrawing(context, canvas);
};


function startDrawing(ctx, canvas){
	var color = 'blue';
	var stroke_size = 7;

	var packet = [];

	$('#eraser').click(function(evt){
		color = 'white';
		stroke_size = 25;
	})

	$('.size').click(function(evt){
		var size = $(this).attr('id');
		console.log(size);
		if(size === 'large'){
			stroke_size = 20;
		}else if(size === 'medium'){
			stroke_size = 14;
		}else if(size === 'small'){
			stroke_size === 7;
		}
	});

	$('.color').click(function(evt){
		console.log($(this).attr('id'));
		color = $(this).attr('id');
		if(stroke_size === 25){
			stroke_size = 7;
		}
	})

	$('#canvas').mousedown(function(e){
		drawing = true;
		var x = e.offsetX,
			y = e.offsetY;
		down(x,y);
	});

	canvas.addEventListener('touchstart',function(e){
		var parentOffset = $(this).parent().offset(); 
		var x = e.changedTouches[0].pageX - parentOffset.left;
		var y = e.changedTouches[0].pageY - parentOffset.top;
		down(x,y);
	})

	function down(x,y){
		var msg = {
			type: 'start',
			stoke_size: stroke_size,
			color: color,
			x: x,
			y: y
		};
		packet.push(msg);
	}

	$('#canvas').mousemove(function(e){
		if(drawing){
			var x = e.offsetX,
				y = e.offsetY;
			move(x,y);
		}
	});

	canvas.addEventListener('touchmove',function(e){
		var parentOffset = $(this).parent().offset(); 
		var x = e.changedTouches[0].pageX - parentOffset.left;
		var y = e.changedTouches[0].pageY - parentOffset.top;
		console.log( x + " " + y);
		move(x,y);
	});

	function move(x,y){
		var msg = {
			type: 'draw',
			stoke_size: stroke_size,
			color: color,
			x: x,
			y: y
		};
		packet.push(msg);
		if(packet.length >= 10){
			ws.send(JSON.stringify(packet));	
			packet = [];
		}
	}

	canvas.addEventListener('touchend', stop);
	$(document).mouseup(stop);
	
	function stop(){
		drawing = false;
		if(packet.length != 0){
			ws.send(JSON.stringify(packet));
			packet = [];
		}
	}


	// starts websocket connections
	ws = new WebSocket("ws://localhost:3000");

	// immediately sends key
	ws.addEventListener('open', function(){
		ws.send(key);
	});

	// receiving messages
	ws.addEventListener('message', function(evt){
		var msg = JSON.parse(evt.data)
		// console.log(msg);
		if( msg.type === 'history'){
			// console.log(msg);
			console.log(msg);
			msg.history.forEach(function(j_msg){
				var pathing = JSON.parse(j_msg);;
				console.log(pathing);
				var current_user = checkUsers(pathing[0]);
				pathing.forEach(function(message){
					current_user.draw(message,ctx);
				})
			})
			// console.log(JSON.parse(msg.history));
		}else{
			var current_user = checkUsers(msg[0]);
			msg.forEach(function(message){
				current_user.draw(message,ctx);
			})
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