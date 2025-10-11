import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
    email : {type: String,unique:true, required: true,lowercase: true, trim:true},
    passwordHash : { 
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