import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
        content:{
            type:String,
            required:true
        },
        upVote:{
            type:Number,
            default:0
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
            required: true, 
        },
        developerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "developer",
            required: true, 
        },
},{timestamps:true})

const Comment = mongoose.model('comment',commentSchema)

export default Comment