const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    logger:{
      type:String,
      required:true
    },
    username:{
      type:String,
      required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
          const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
          if (!emailRegex.test(value)) {
            throw new Error('Invalid email address');
          }
        }
      },
    password:{
        type:String,
        minlength: 8,
        required:true
    }
})

const user= new mongoose.model('User', userSchema);
module.exports = user;