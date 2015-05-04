var app = app || {}

app.socket = (function(){
	//var ws = new WebSocket("ws://jotboard.co:3000");
	var ws = new WebSocket("ws://localhost:3000");

	ws.addEventListener('open', function(){
		ws.send(key);
	});

	ws.addEventListener('message', function(evt){
		var msg = JSON.parse(evt.data)
		if( msg.type === 'history'){
			msg.history.forEach(function(j_msg){
				var pathing = JSON.parse(j_msg);;
				pathing.forEach(function(message){
					app.drawer.draw(message);
				})
			})
		}else{
			msg.forEach(function(message){
				//console.log(message);
				app.drawer.draw(message);
			})
		}
	});

	return {
		send: function(packet){
			ws.send(JSON.stringify(packet));
		}
	}
})();