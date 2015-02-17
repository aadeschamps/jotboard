$( 'document' ).ready(function(){
	
	$( '.acceptBut' ).click(function(e){
		var listItem = e.target
		var id = e.target.id.substring(6);
		console.log(id);
		var info = {
			id: id
		}
		$.post('/collab', JSON.stringify(info) , function(data, status){
			resp = JSON.parse(data);
			console.log(resp)
			if(resp.status === 'success'){
				console.log('in here');
				$(listItem).parent().remove();
			}
		})
	})

	$( '.declineBut' ).click(function(e){
		var id = e.target.id.substring(7);
		console.log(id);
	})

})