
var clicked = false;
$('#colors').click(function(){
	if( clicked ){
		$('#all-colors').css('display', 'none')
		clicked = false;
	}else{
		$('#all-colors').css('display', 'block')
		clicked = true;
	}
})

$('.change-color').click(function(){

})