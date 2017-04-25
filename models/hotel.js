var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hotelSchema = new Schema({
 	name: String,
 	details: String,
 	address: {
 		city: String, 	
 		lat: Number,
 		lon: Number
 	},
 	rating: Number,
 	reviews: [{
 		name: String,
 		comment: String
 	}]
 	price: Number,
 	images: [{
 		src: String
 	}]
});


module.exports = mongoose.model("Hotel",hotelSchema);
