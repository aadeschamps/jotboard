var app = app || {}

app.events = function(canvas){
	var drawing = false;

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

	// on click, sets the color of the brush
	// according to the id of the button clicked

	$('.change-color').click(function(){
		var id = $(this).attr('id')
		var color = $(this).attr('id');
		app.brush.set_color(color);
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
		app.brush.set_stroke('eraser');
		app.brush.set_color('white');
	})

	// on click, sets the size of the stroke
	// according to the id of the button clicked
	$('.size').click(function(evt){
		var size = $(this).attr('id');
		app.brush.set_stroke(size);
	});



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
		var msg = app.brush.get_msg();
		msg.x = x;
		msg.y = y;
		msg.type = 'start';
		app.packet.push(msg);
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
		var msg = app.brush.get_msg();
		msg.type = 'draw';
		msg.x = x;
		msg.y = y;

		// sends the packet if the packet exceded
		// 10 items
		app.packet.push(msg);
	}

	// sends the packet when the mouse is up or the finger
	// is lifted off of the touch screen
	canvas.addEventListener('touchend', stop);
	$(document).mouseup(stop);
	
	function stop(){
		drawing = false;
		var end = {type: 'end'}
		app.packet.end(end);
	}
}