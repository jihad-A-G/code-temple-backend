import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
        content:{
            type:String,
            required:true
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
})

const Comment = mongoose.model('comment',commentSchema)

export default Comment