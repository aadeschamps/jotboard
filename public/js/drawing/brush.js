var brush = (function(){
	var stroke_sizes = {		
			thin: 7,
			medium: 14,
			thick: 20,
			eraser: 25
		},
		message = {
			stroke_size: stroke_sizes.thin,
			color: 'black'
		};

	function cloneObject(source) {
	    var new_obj = {}
	    for (i in source) {
	        new_obj[i] = source[i];
	    }
	    return new_obj;
	}

	return {
		get_msg: function(){
			return cloneObject(message);
		},
		set_stroke: function(size){
			if(message.color === 'white') {
				message.color = 'black';
			}
			message.stroke_size = stroke_sizes[size];
		},
		set_color: function(color){
			message.color = color;
		}
	}


})();