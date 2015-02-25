
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

$('.change-color').click(function(){
	var id = $(this).attr('id')
	console.log(id);
	$('#current-color').removeClass();
	$('#current-color').addClass('color ' + id);
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