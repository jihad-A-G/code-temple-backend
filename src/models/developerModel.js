import mongoose from "mongoose";

const developerSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    isVerified:{
        type:Boolean,
        required:false,
        default:false
    },
})

const Developer = mongoose.model('developer',developerSchema)

export default Developer