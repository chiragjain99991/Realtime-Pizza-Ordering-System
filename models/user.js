let mongoose=require('mongoose');
let passportLocalMongoose=require('passport-local-mongoose');
let Pizza = require('./pizza')

let userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Pizza'
        }
    ],
});

userSchema.plugin(passportLocalMongoose)

let User = mongoose.model('User',userSchema);

module.exports = User ; 