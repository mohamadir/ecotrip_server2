var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email:  String,
  password: String,
  role:   String,
  firstName: String,
  lastName: String,
  searchnum: {type: Number, default: 0},
  recomended: [
    {type: {type: String,default: "אטרקציה"},
  count: { type: Number, default: 0 }}]
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User",userSchema);
