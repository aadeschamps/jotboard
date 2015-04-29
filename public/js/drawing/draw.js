var app = app || {}

app.drawer = (function(){
	var x, y;
	return {
		draw: function(msg){
			var context = app.context;
			// if type is start, draw a small point
			// at that area and set this x and y
			if(msg.type === 'start'){
				context.strokeStyle = msg.color;
	  			context.lineJoin = "round";
	  			context.lineWidth = msg.stroke_size;
				this.x = msg.x;
				this.y = msg.y;
				context.beginPath();
				context.moveTo(this.x,this.y);
				context.lineTo(this.x + 1, this.y);
				context.closePath();
				context.stroke();

			// if type is draw, draw a line from 
			// previous point to new point and update
			// current point to new point
			}else if(msg.type === 'draw'){
				context.strokeStyle = msg.color;
	  			context.lineJoin = "round";
	  			context.lineWidth = msg.stroke_size;
	  			context.moveTo(this.x,this.y);
	  			context.lineTo(msg.x, msg.y);
	  			this.x = msg.x;
				this.y = msg.y;
				context.closePath();
				context.stroke();
			}
		}
	}

}())