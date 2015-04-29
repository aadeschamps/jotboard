$(function(){
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
});



function startDrawing(ctx, canvas){
	var packet = [],
		drawing = false;

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
		brush.set_stroke('eraser');
		brush.set_color('white');
	})

	// on click, sets the size of the stroke
	// according to the id of the button clicked
	$('.size').click(function(evt){
		var size = $(this).attr('id');
		brush.set_stroke(size);
	});

	// on click, sets the color of the brush
	// according to the id of the button clicked
	$('.color').click(function(evt){
		var color = $(this).attr('id');
		console.log(color);
		brush.set_color(color);
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
		var msg = brush.get_msg();
		msg.x = x;
		msg.y = y;
		msg.type = 'start';
		packet.push(msg);
	}

	// on mouse move, record the point to which it moved
	$('#canvas').mousemove(function(e){
		if(drawing){
			var x = e.offsetX || e.clientX - $(e.target).offset().left,
				y = e.offsetY || e.clientY - $(e.target).offset().top;
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
		var msg = brush.get_msg();
		msg.type = 'draw';
		msg.x = x;
		msg.y = y;

		// sends the packet if the packet exceded
		// 10 items
		packet.push(msg);
		if(packet.length >= 10){
			socket.send(packet);	
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
			socket.send(packet);
			packet = [];
		}
	}
}