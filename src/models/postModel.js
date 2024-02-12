import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    versions:[{
        v:{
            type:Number,
            required:false
        },
        code:{
            type:String,
            required:true
        }
    }],
    description:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true,

    },
    developerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "developers",
        required: true, 
        },
})

const Post = mongoose.model('post',postSchema)

export default Post