import mongoose from "mongoose"

const messageShcema = new mongoose.Schema({
        content:{
            type:String,
            required:true
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "room",
            required: true, 
        },
        developerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "developer",
            required: true, 
        },
},{timestamps:true})

const Message = mongoose.model('message',messageShcema)

export default Message