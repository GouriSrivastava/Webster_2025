import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
    name : {type: String, required: True},
    email : {type: String,unique:True, required: True,lowercase: True},
    password : { 
        type:String,
        required : function () {
            return!this.googleID;
        },
        unique:false
    },

    googleID: {
        type: String,
        unique : function(){
            return !!this.googleID;
        },
        sparse:true
    }

});

export default mongoose.model("User",UserSchema);