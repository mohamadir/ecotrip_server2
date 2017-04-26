var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var attSchema = new Schema({
  name: String,
  type: String,
  groups:[String],
  address: {
    lat: Number,
    lon: Number
  },
  city: String,
  phone: Number,
  area: String,
  time: String,
  details: String,
  timerating: Number,
  engoyrating: Number,
  rating: [Number],
  price: Number,
  images: [{
    src: String,
    base64: String
  }],
  userid: Schema.Types.ObjectId
}); 


module.exports = mongoose.model("Attraction",attSchema);
