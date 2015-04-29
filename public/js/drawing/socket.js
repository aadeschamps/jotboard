var socket = (function(){
	var ws = new WebSocket("ws://localhost:3000");

	ws.addEventListener('open', function(){
		ws.send(key);
	});

	ws.addEventListener('message', function(evt){
		var msg = JSON.parse(evt.data)
		// console.log(msg);
		if( msg.type === 'history'){
			// console.log(msg);
			msg.history.forEach(function(j_msg){
				var pathing = JSON.parse(j_msg);;
				//var current_user = checkUsers(pathing[0]);
				pathing.forEach(function(message){
					//current_user.draw(message,ctx);
				})
			})
			// console.log(JSON.parse(msg.history));
		}else{
			//var current_user = checkUsers(msg[0]);
			msg.forEach(function(message){
				console.log(message);
				//current_user.draw(message,ctx);
			})
		}
	});

	return {
		send: function(packet){
			ws.send(JSON.stringify(packet));
		}
	}
})();