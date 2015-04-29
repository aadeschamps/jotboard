var app = app || {}

app.packet = (function(){

	var packet = [],
		packet_size = 10;

	function overload(){
		if(packet.length >= packet_size){
			app.socket.send(packet);
			packet = [];
		}
	}


	return {
		push: function(msg){
			packet.push(msg);
			overload();
		},
		end: function(msg){
			packet.push(msg)
			app.socket.send(packet);
			packet = [];
		}
	}


}());