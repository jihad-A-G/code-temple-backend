import Message from '../models/messageModel.js'
import Room from '../models/roomModel.js'
import mongoose from 'mongoose'
export const createRoom = async(req,res,next) =>{
        const {roomName, secretKey} = req.body

        try {
            
            if(!roomName || !secretKey){
                return res.status(400).json({status:400, message:'All fields are required'})
            }

            const room = await Room.create({
                roomName:roomName,
                members:[],
                developerId:req.developer._id,
                secretKey:secretKey
            })

            res.status(200).json({status:200, message:'Room was created successfully!', room:room})

        } catch (err) {
            next(err)
        }
}

export const deleteRoom = async(req,res,next) =>{
    const {roomId} = req.params

    try {
        
        if(!roomId){
            return res.status(404).json({status:404, message:'Incorrect id'})
        }

        const room = await Room.findByIdAndDelete(roomId)

        res.status(200).json({status:200, message:'Room was deleted successfully'})

    } catch (err) {
        next(err)
    }
}

export const getRooms = async(req,res,next) =>{
    try {
        const ObjectId = mongoose.Types.ObjectId
        const id = new ObjectId(req.developer._id);
        const rooms = await Room.find({$or: [
            { developerId: id },
            { 'members._id': { $in: [id] } } 
         ]
    })

        if(!rooms){
            return res.status(404).json({status:404, message:'No rooms!'})
        }

        res.status(200).json({status:200, rooms:rooms})

    } catch (err) {
        next(err)
    }
}

export const joinRoom = async(req,res,next) =>{
    const {secretKey} = req.body
    try {
        
        if(!secretKey){
            return res.status(400).json({status:400, message:'Secret key is required'})
        }

        const room = await Room.findOne({secretKey:secretKey})
        // console.log(room);

        if(!room){
            return res.status(404).json({status:404, message:'Room not found!'})
        }

        if(room.members.some(d=>d._id.toString() === req.developer._id.toString()) || room.developerId.toString() === req.developer._id.toString()){
            return res.status(400).json({status:400, message:'You are already a member'})
        }

        room.members.push(req.developer._id)

        await room.save()

        res.status(200).json({status:200, message:'You joined the room successfully',room})

    } catch (err) {
        next(err)
    }
}

export const openRoom = async(req,res,next) =>{
    const {roomId} = req.params

    try {
        
        if(!roomId){
            return res.status(404).json({status:404, message:'Id was not found'})
        }

        const room = await Room.findById(roomId)
        const messages = await Message.find({roomId:roomId}).populate({
            path:'developerId',
            select:'username'
        })

        if(!room ){
            return res.status(404).json({status:404, message:'Room was not found'})
        }

        if(!messages){
            return res.status(404).json({status:404, message:'No Messages'})
        }

        res.status(200).json({status:200, room,messages})

    } catch (err) {
        next(err)
    }
}

export const removeMember = async(req,res,next) =>{
    const {memberId} = req.params
    const {roomId} = req.body
    console.log(memberId);
    try {
        
        if(!memberId || !roomId){
            return res.status(404).json({status:404, message:'Id not found'})
        }

    

        const room = await Room.findById(roomId)

        if(!room){
            return res.status(404).json({status:404, message:'Room not found'})
        }

        if(room.developerId.toString() !== req.developer._id.toString()){
            return res.status(401).json({status:401, message:'You are not authorize to delete a member'})
        }

        room.members = room.members.filter(m =>m._id.toString() !== memberId.toString())

        await room.save()

        console.log(room);

        res.status(200).json({status:200, message:'Memeber was removed from the room'})



    } catch (err) {
        next(err)
    }
}

