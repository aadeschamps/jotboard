var ws;
$( 'document' ).ready( function() {

	// sends invites to other users by username
	$( '#inviteInput' ).keypress(function(e) {
		var key = e.which;
		if(key === 13){
			var invitee = $('#inviteInput').val();
			var project_id = $('#project_id').val();
			var inv = {
				username: invitee,
			};
			var route = '/project/' + project_id + '/invite'
			$.post(route, JSON.stringify(inv), function(data,status){
				console.log(data);
			});
		}
	});

	
	ws = new WebSocket("ws://localhost:3000");
	
	ws.addEventListener('open', function(){
		ws.send(key);
	});

	// receiving messages
	ws.addEventListener('message', function(evt){
		msg = JSON.parse(evt.data)
		if( msg.type === 'history'){
			// console.log(msg);
			msg.history.forEach(function(j_msg){
				var pathing = JSON.parse(j_msg);
				console.log(pathing);
				drawLine(pathing);
			})
			// console.log(JSON.parse(msg.history));
		}else if (msg.type  === 'packet'){
			drawLine(msg);
		}
	});

	function drawLine(msg){
		var pathing = msg.msg;
		pathing.forEach(function(msg){
			console.log(msg.msg);
			if( msg.msg === 'start'){
				myPath = new Path()	
				myPath.strokeColor = 'black';
				myPath.strokeWidth = 10;
				view.draw();
			}else if (msg.msg === 'end'){
				myPath.end = true;
				myPath.smooth();
				view.draw()
			}else{
				myPath.add(new Point(msg.msg[1],msg.msg[2]));
				view.draw();
			}
		})
	}
});


//sending messages
// cant seem to nest these paper.js functions in anything without breaking them
var myPath;
var packet = [];
function onMouseDown(event) {
	packet.push({msg: 'start'});
	packet.push({msg: event.point})
}
var count = 0;
function onMouseDrag(event) {
	packet.push({msg: event.point})
	if (packet.length >= 10){
		ws.send(JSON.stringify({
			type: 'packet',
			msg: packet
		}));
		packet = [];
	}
}
function onMouseUp(event) {
	packet.push({msg: 'end'});
	ws.send(JSON.stringify({
			type: 'packet',
			msg: packet
		}));
	packet = [];
}

