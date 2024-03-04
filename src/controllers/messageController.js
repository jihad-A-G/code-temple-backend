import io from '../config/socket-io.js'
import Message from '../models/messageModel.js'

export const addMessage = async(req,res,next) =>{
    const {content} = req.body
    const {roomId} = req.params

    try {
        
        if(!content){
            return res.status(400).json({status:400, message:'Message is empty'})
        }

        if(!roomId){
            return res.status(404).json({status:404, message:'Room not found!'})
        }

        const message = await Message.create({
            content:content,
            roomId:roomId,
            developerId:req.developer._id
        })

        io.to(roomId).emit('newMessage', message)

        res.status(200).json({status:200, message:'Message was created successfully', message:message})

    } catch (err) {
        next(err)
    }
}

export const updateMessage = async(req,res,next) =>{
    const{messageId} = req.params
    const {content} = req.body

    try {
        
        if(!messageId){
            return res.status(404).json({status:404, message:'Id was not found'})
        }

        if(!content){
            return res.status(400).json({status:400, message:'Message is empty'})
        }

        const message = await Message.findByIdAndUpdate(messageId,{content:content})

        if(!message){
            return res.status(404).json({status:404, message:'message was not found'})
        }

        res.status(200).json({status:200, message:'message was updated successfully!', message})

    } catch (err) {
        next(err)
    }
}

 export const deleteMessage = async(req,res,next) =>{
    const {messageId} = req.params

    try {
        
        if(!messageId){
            return res.status(404).json({status:404, message:'Id was not found'})
        }

        const message = await Message.findByIdAndDelete(messageId)

        if(!message){
            return res.status(404).json({status:404, message:'message was not found'})
        }

        res.status(200).json({status:200, message:'Message was deleted successfully', message})
    
    } catch (err) {
        next(err)
    }
 }