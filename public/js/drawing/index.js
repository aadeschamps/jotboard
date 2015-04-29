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
	user(context, canvas);
});