import Request from '../models/updateRequestModel.js'
import Post from '../models/postModel.js'
import mongoose from 'mongoose'
export const requestUpdate = async(req,res,next) =>{
    const {code} = req.body
    const {postId} = req.params

    try {

        if(!postId){
            return res.status(404).json({status:404, message:'Post not found'})
        }
        
        if(!code){
            return res.status(404).json({status:404, message:'request is empty'})
        }

        const request = await Request.create({code:code, developerId:req.developer._id, postId:postId})

        res.status(200).json({status:200, message:'request was created successfully', request})

    } catch (err) {
        next(err)
    }
}

export const updateRequest = async(req,res,next) =>{
    const {requestId} = req.params
    const {code} = req.body

    try {

        if(!requestId){
            return res.status(404).json({status:404, message:'Request not found'})
        }


        if(!code){
            return res.status(400).json({status:400, message:"Can't edit request"})
        }

        const request = await Request.findById(requestId)

        if(request.approve == true){
            return res.status(400).json({status:400, message:'This request is approved, you can`t cahnge it, try to request another one.'})
        }

        request.code = code

        await request.save()

        res.status(200).json({status:200, message:'Request was updated successfully', request})


        
    } catch (err) {
        next(err)
    }
}

export const deleteRequest = async(req,res,next) =>{
    const {requestId} = req.params

    try {
        
        if(!requestId){
            return res.status(404).json({status:404, message:'Request not found'})
        }

        const request = await Request.findByIdAndDelete(requestId)

        res.status(200).json({status:200, message:'Request was deleted successfully'})

    } catch (err) {
        next(err)
    }
}

export const approveRequest = async(req,res,next) =>{
    const {requestId} = req.params

    try {
        
        if(!requestId){
            return res.status(404).json({status:404, message:'Request not found'})
        }

        const request = await Request.findById(requestId).populate('postId')

        let versionsArray = request.postId.versions
        let version = request.postId.versions.length+1

        if(versionsArray.some(e=>e.code == request.code)){
            return res.status(400).json({status:400, message:'Request already approved'})
        }
        
                    request.postId.versions = [...versionsArray,{v:version, code:request.code}]
                    
                    request.approve = true
        
                    await request.postId.save()
        
                    await request.save()


        res.status(200).json({status:200, message:'Approved'})
    } catch (err) {
        next(err)
    }
}

export const getPostRequests = async(req,res,next) =>{
    const {postId} = req.params

    try {
        
        if(!postId){
            return res.statua(404).json({status:404, message:'Incorrect id'})
        }

        const requests = await Request.find({postId:postId,approve:false})
        console.log(requests);

        if(!requests){
            return res.statua(404).json({status:404, message:'No requests'})
        }

        res.status(200).json({status:200, requests})


    } catch (err) {
        next(err)
    }
}