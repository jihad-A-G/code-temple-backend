import mongoose from 'mongoose'

const updateRequestSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    approve:{
        type:Boolean,
        default:false
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

const Request = mongoose.model('updateRequest', updateRequestSchema)

export default Request