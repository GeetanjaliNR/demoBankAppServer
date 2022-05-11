//importing mongoose
const mongoose = require('mongoose');

//connection string to connect db with server
mongoose.connect('mongodb://localhost:27017/bankServer', {
  useNewUrlParser: true,
});

//create a model of database to let mongoose know
const User = mongoose.model('User', {
  acno: Number,
  uname: String,
  password: String,
  balance: Number,
  transaction: [],
});

//export model
module.exports = {
  User,
};
