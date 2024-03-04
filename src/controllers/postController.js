import Post from "../models/postModel.js"
import Comment from "../models/commentModel.js"
import Developer from "../models/developerModel.js"
export const getPosts = async (req,res,next) =>{
    try {
        let posts = await Post.find().populate('developerId')
        
        const postsWithComments = await Promise.all(posts.map(async (post) => {
            const comments = await Comment.find({ postId: post._id });
            post = {...post, comments:comments}
            return post;
          }));
        if(!postsWithComments || postsWithComments.length ==0){
            return res.status(404).json({status:404, message:'No posts'})
        }

        res.status(200).json({status:200, posts:postsWithComments})

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

        const post = await Post.findById(postId).populate('developerId')

        if(!post){
            return res.status(404).json({status:404, message:'Post not found'})
        }

        const comments = await Comment.find({postId:postId}).populate('developerId').sort({upVote:-1})



        res.status(200).json({status:200, post:{post,comments}})


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

        const post = await Post.findById(postId)

        post.language = req.body.language,
        post.description = req.body.description
        post.versions[0].code = req.body.code

        await post.save()
        res.status(200).json({status:200, message:'Post was updated successfully', post:post})

    } catch (err) {
        next(err)
    }
}

export const updatePostCode = async(req,res,next) =>{
    const {postId} = req.params
    const {v,code} = req.body

    try {

        if(!code || !v){
            return res.status(400).json({status:400, message:'All fields are required'})
        }

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({status:404, message:'Post not found'})
        }

        post.versions.map(version =>{
            if(version.v ===v){
                version.code = code
            }
        })

        await post.save()

        res.status(200).json({status:200, message:`Code at version: ${v} was updated suucessfully`})
        
    } catch (err) {
        next
    }
}

export const deletePost = async(req,res,next) =>{
    const {postId} = req.params

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

export const savePost = async(req,res,next) =>{
    const {postId} = req.params
    try {
        
        if(!postId){
            return res.status(404).json({status:404, message:'Incorrect Id'})
        }

        const developer = await Developer.findById(req.developer._id)

        if(!developer){
            return res.status(401).json({status:401, message:'You are not authorized'})
        }

        if(developer.savedPost.includes(postId)){
           developer.savedPost= developer.savedPost.filter(p=>p.toString == postId.toString())
           await developer.save()

          return res.status(200).json({status:200, message:'Post is unsaved',savedPosts:developer.savedPost})
        }
 
         developer.savedPost.push(postId)
        

        await developer.save()

        res.status(200).json({status:200, message:'Post is saved',savedPosts:developer.savedPost})

    } catch (err) {
        next(err)
    }
}

export const getSavedPost = async(req,res,next) =>{
    
    try {
        
        const developer = await Developer.findById(req.developer._id).populate({
            path: 'savedPost',
            strictPopulate: false
          })

        if(!developer){
            return res.status(404).json({status:404, message:'No saved posts'})
        }
        const postsWithComments = await Promise.all(developer.savedPost.map(async (post) => {
            const comments = await Comment.find({ postId: post._id });
            post = {...post, comments:comments}
            return post;
          }));
       

        res.status(200).json({status:200, savedPosts:postsWithComments})

    } catch (err) {
        next(err)
    }
}

export const getDeveloperPosts = async(req,res,next) =>{

    try {

        const posts = await Post.find({developerId:req.developer._id})

        if(!posts){
            return res.status(404).json({status:404, message:'Post not found'})
        }

        res.status(200).json({status:200, posts})


    } catch (err) {
        next(err)
    }
}