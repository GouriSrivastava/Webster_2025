import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
    name : {type: String, required: true,trim:true},
    email : {type: String,unique:true, required: true,lowercase: true, trim:true},
    passwordHash : { 
        type:String,
        required : function () {
            return!this.googleId;
        },
        unique:false
    },

    googleId: {
        type: String,
        unique : function(){
            return !!this.googleId;
        },
        sparse:true
    }

});

export default mongoose.model("User",UserSchema);