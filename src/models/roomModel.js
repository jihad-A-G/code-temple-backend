import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
        roomName:{
            type:String,
            required:true
        },
        members: [{
            memberId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "developer",
            }
        }],
        developerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "developer",
            required: true, 
        },
        secretKey:{
            type:String,
            required:true
        }
})

const Room = mongoose.model('room',roomSchema)

export default Room