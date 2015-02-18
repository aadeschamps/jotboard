
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

	var ws = new WebSocket("ws://localhost:3000");
	
	ws.addEventListener('open', function(){
		ws.send(key);
	});

});

