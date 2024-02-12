import Post from "../models/postModel.js"

export const getPosts = async (req,res,next) =>{
    try {
        const posts = await Post.find()

        if(!posts){
            return res.status(404).json({status:404, message:'No posts'})
        }

        res.status(200).json({status:200, posts:posts})

    } catch (err) {
        next(err)
    }
}

export const getPostById = async(req,res,next) =>{
    const {postId} = req.params

    try {
        if(!postId){
            return res.status(404).json({status:404, message:'Incorrect Id'})
        }

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({status:404, message:'Post not found'})
        }

        res.status(200).json({status:200, post:post})


    } catch (err) {
        next(err)
    }
}

export const addPost = async(req,res,next) =>{
    const {description, code, language} = req.body
    
    try {

        if(!description || !code || !language){
            return res.status(400).json({status:400, message:'All fields are required'})
        }

        const post = await Post.create({
            versions :[{
                v:1,
                code:code
            }],
            description:description,
            language:language,
            developerId:req.developer._id
        })

        res.status(200).json({status:200, message:'Post was created successfully', post:post})
    } catch (err) {
        next(err)
    }
}

export const updatePost = async(req,res,next) =>{
    const {postId} = req.params

    try {

        if(!postId){
            return res.status(404).json({status:404, message:'Incorrect Id'})
        }
        
        if(!req.body){
            return res.status(400).json({status:400, message:'Nothing to update'})
        }

        const post = await Post.findByIdAndUpdate(postId, {...req.body})

        res.status(200).json({status:200, message:'Post was updated successfully', post:post})

    } catch (err) {
        next(err)
    }
}

export const deletePost = async(req,res,next) =>{
    const {postId} = req.body

    try {

        if(!postId){
            return res.status(404).json({status:404, message:'Incorrect Id'})
        }

        const post = await Post.findByIdAndDelete(postId)

        if(!post){
            return res.status(404).json({status:404, message:'Post not found!'})
        }

        res.status(200).json({status:200, message:'Post was deleted successfully'})
        
    } catch (err) {
        next(err)
    }
} 