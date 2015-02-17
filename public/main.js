


$( 'document' ).ready(function(){
	// gets inital reference to firebase-boards hash
	ref = new Firebase('https://brilliant-torch-3428.firebaseio.com/boards')
	
	// gets the token needed to authorize
	$.get( '/token' , function(data) {
		console.log(data)
		firebase_init(JSON.parse(data))
	} )

	// if successful: loads boards
	function authHandler(error, authData){
		if (error){
			console.log("failed");
		}else {
			console.log('success');
			loadBoards();
		}
	};

	// sends the auth token to authorize user
	function authorize(key){
		ref.unauth();
		ref.authWithCustomToken(key, authHandler);
	};

	// gets all of the boards for this user
	function loadBoards(){
		
	}

	ref.on('child_added', function(snapshot){
		console.log(snapshot);
	})


})