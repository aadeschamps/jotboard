
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

// initializing variables needed
var users = [],
	drawing = false;


//starts when the page loads
window.onload = function(){

	// sends ajax request to server on enter key
	$( '#inviteInput' ).keypress(function(e) {
		var key = e.which;
		if(key === 13){
			var invitee = $('#inviteInput').val();
			var project_id = $('#project_id').val();
			// console.log(project_id);
			var inv = {
				username: invitee,
			};
			var route = '/project/' + project_id + '/invite';
			$.post(route, JSON.stringify(inv), function(data,status){
				var status = JSON.parse(data).status;
				$('#inviteInput').val('');
				$('#inviteInput').attr('placeholder', status);
				// if (data.status === 'success'){
				// 	$('#inviteInput').val('success');
				// }
			});
		}
	});

	// creates the canvas element for the page and sets
	// the height and width
	var canvas_div = document.getElementById('canvas-div');
	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', '1800px');
	canvas.setAttribute('height', '1800px');
	canvas.setAttribute('id', 'canvas');
	canvas_div.appendChild(canvas);
	var context = canvas.getContext('2d');
	// allows you to start drawing on canvas
	startDrawing(context, canvas);
};


function startDrawing(ctx, canvas){
	var color = 'black';
	var stroke_size = 7;

	var packet = [];


	var colors_clicked = false;
	$('#colors').click(function(){
		if( colors_clicked ){
			$('#all-colors').css('display', 'none')
			colors_clicked = false;
		}else{
			$('#all-colors').css('display', 'block')
			colors_clicked = true;
		}
	})

	$('.change-color').click(function(){
		var id = $(this).attr('id')
		color = $(this).attr('id');
		$('#current-color').removeClass();
		$('#current-color').addClass('abs-center color ' + id);
	})

	var size_clicked = false;
	$('#sizes').click(function(){
		if( size_clicked ){
			$('#all-sizes').css('display', 'none')
			size_clicked = false;
		}else{
			$('#all-sizes').css('display', 'block')
			size_clicked = true;
		}
	})


	// on click, forces the color of the 
	// drawing to white and sets strokesize
	$('#eraser').click(function(evt){
		color = 'white';
		stroke_size = 25;
	})

	// on click, sets the size of the stroke
	// according to the id of the button clicked
	$('.size').click(function(evt){
		var size = $(this).attr('id');
		if(size === 'thick'){
			stroke_size = 20;
		}else if(size === 'medium'){
			stroke_size = 14;
		}else if(size === 'thin'){
			stroke_size = 7;
		}
	});

	// on click, sets the color of the brush
	// according to the id of the button clicked
	$('.color').click(function(evt){
		color = $(this).attr('id');
		if(stroke_size === 25){
			stroke_size = 7;
		}
	})

	// when mousedown event occurs on the canvas
	// the drawing variable is set to true and the
	// point is recorded
	$('#canvas').mousedown(function(e){
		drawing = true;
		var x = e.offsetX,
			y = e.offsetY;
		down(x,y);
	});

	// same thing as above except for touch screen
	canvas.addEventListener('touchstart',function(e){
		var parentOffset = $(this).parent().offset(); 
		var x = e.changedTouches[0].pageX - parentOffset.left;
		var y = e.changedTouches[0].pageY - parentOffset.top;
		down(x,y);
	})

	// stores the coordinates and color of the first click
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

	// on mouse move, record the point to which it moved
	$('#canvas').mousemove(function(e){
		if(drawing){
			var x = e.offsetX,
				y = e.offsetY;
			move(x,y);
		}
	});

	// same as above but for touch screen
	canvas.addEventListener('touchmove',function(e){
		var parentOffset = $(this).parent().offset(); 
		var x = e.changedTouches[0].pageX - parentOffset.left;
		var y = e.changedTouches[0].pageY - parentOffset.top;
		move(x,y);
	});

	// stores message when mouse if moved
	function move(x,y){
		var msg = {
			type: 'draw',
			stoke_size: stroke_size,
			color: color,
			x: x,
			y: y
		};

		// sends the packet if the packet exceded
		// 10 items
		packet.push(msg);
		if(packet.length >= 10){
			ws.send(JSON.stringify(packet));	
			packet = [];
		}
	}

	// sends the packet when the mouse is up or the finger
	// is lifted off of the touch screen
	canvas.addEventListener('touchend', stop);
	$(document).mouseup(stop);
	
	function stop(){
		drawing = false;
		var end = {type: 'end'}
		packet.push(end);
		if(packet.length != 0){
			ws.send(JSON.stringify(packet));
			packet = [];
		}
	}


	// starts websocket connections
	// ws = new WebSocket("ws://localhost:3000");
	ws = new WebSocket("ws://alex.princesspeach.nyc:3000");

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
			msg.history.forEach(function(j_msg){
				var pathing = JSON.parse(j_msg);;
				var current_user = checkUsers(pathing[0]);
				pathing.forEach(function(message){
					current_user.draw(message,ctx);
				})
			})
			// console.log(JSON.parse(msg.history));
		}else{
			var current_user = checkUsers(msg[0]);
			msg.forEach(function(message){
				console.log(message);
				current_user.draw(message,ctx);
			})
		}
	});
}


// makes a user if a new user draws
// or find the user that send the message
// returns the user found--
function checkUsers(msg){
	var exists = false;
	var current_user;
	users.forEach(function(user){
		if(user.unique === msg.unique){
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