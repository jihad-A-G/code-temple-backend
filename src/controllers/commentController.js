import Comment from "../models/commentModel.js"

export const AddComment = async(req,res,next) =>{
    const {content} = req.body
    const {postId} = req.params

    try {

        if(!postId){
            return res.status(404).json({status:404, message:'Post not found'})
        }
        
        if(!content){
            return res.status(404).json({status:404, message:'Comment is empty'})
        }

        const comment = await Comment.create({content:content, developerId:req.developer._id, postId:postId})//ALERTTTTTTTTT

        res.status(200).json({status:200, message:'Comment was created successfully', comment})



    } catch (err) {
        next(err)
    }
}

export const updateComment = async(req,res,next) =>{
    const {commentId} = req.params
    const {content} = req.body

    try {

        if(!commentId){
            return res.status(404).json({status:404, message:'Comment not found'})
        }

        if(!content){
            return res.status(400).json({status:400, message:"Can't edit comment"})
        }

        const comment = await Comment.findByIdAndUpdate(commentId,{content:content})

        res.status(200).json({status:200, message:'Comment was updated successfully', comment})


        
    } catch (err) {
        next(err)
    }
}

export const deleteComment = async(req,res,next) =>{
    const {commentId} = req.params

    try {
        
        if(!commentId){
            return res.status(404).json({status:404, message:'Comment not found'})
        }

        const comment = await Comment.findByIdAndDelete(commentId)

        res.status(200).json({status:200, message:'Comment was deleted successfully'})

    } catch (err) {
        next(err)
    }
}

export const upVoteComment = async(req,res,next) =>{
    const {commentId} = req.params
    
    try {
        
        const comment = await Comment.findById(commentId)

        if(!comment){
            return res.status(404).json({status:404, message:'Comment not found'})
        }

        comment.upVote++

        await comment.save()

        res.status(200).json({status:200, message:'Comment is up voted'})

    } catch (err) {
        next(err)
    }
}