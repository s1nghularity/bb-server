const mongoose = require("mongoose");


const transactionHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

const UserSchema = new mongoose.Schema(

  {
    id: Number,
    
    name: String,
    
    email:    {type: String, 
              required: [true, "Please provide an email!"],
              unique: [true, "Email already exists"]},
    
    password: {type: String,
              required: [true, "Please provide a password!"],
              unique: false},

    balance: Number,
    
    transactionHistory: [transactionHistorySchema]
  
  }

);


module.exports = mongoose.model.Users || mongoose.model("UserInfo", UserSchema);