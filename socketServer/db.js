var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/messages', function(err){
	if(err){
		console.log('connection error', err);
	} else {
		console.log('connection successful');
	}
});

var ProjectSchema = new mongoose.Schema({
	project_id: Number,
	messages: []
})

mongoose.model('Projects', ProjectSchema);


module.exports = mongoose
