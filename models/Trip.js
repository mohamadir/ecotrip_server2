var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tripSchema = new Schema({
 	attractions:[{
 		attractionId:  Schema.Types.ObjectId
 	}],
 	area: String,
 	price: Number
 	
});

module.exports = mongoose.model("Trip",tripSchema);
