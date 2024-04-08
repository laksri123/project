const mongoose = require("mongoose");
const passportLocalMongoose= require("passport-local-mongoose");

const userSchema= new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    profilephoto: {
        filename: {
            type: String,
            default: "profilePhoto",
        },
        url: {
            type: String,
            default: "https://cdn-icons-png.freepik.com/512/64/64572.png?ga=GA1.1.343122819.1710065287&",
        }
    }
})

userSchema.plugin(passportLocalMongoose);  // Now passport will work fine with mongoose and itself creates username and password field in the schema
// It will also do hashing and salting by itself

const User= mongoose.model("User",userSchema);
module.exports= User;