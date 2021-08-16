var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizSchema = new Schema({
	school: String,
	ans0: String,
	ans1: String,
	ans2: String,
	ans3: String,
	ans4: String,
	ans5: String,
	ans6: String,
	ans7: String,
	ans8: String,
	ans9: String,
	ans10: String,
	ans11: String,
	ans12: String,
	ans13: String,
	ans14: String,
	ans15: String,

});



var Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;
