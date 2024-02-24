import Post from "../models/postModel.js"
import Comment from "../models/commentModel.js"
export const getPosts = async (req,res,next) =>{
    try {
        let posts = await Post.find()
        
        const postsWithComments = await Promise.all(posts.map(async (post) => {
            const comments = await Comment.find({ postId: post._id });
            post = {...post, comments:comments}
            console.log(post);
            return post;
          }));
        //   console.log(postsWithComments);
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
    console.log(description,code,language);
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
            developerId:'65d665e7a89d692e30b92084'
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