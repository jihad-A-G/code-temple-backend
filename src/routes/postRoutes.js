import express from "express";
import * as postController from '../controllers/postController.js'

const router = express.Router()

router.get('/',postController.getPosts)
router.get('/saved',postController.getSavedPost)
router.get('/myPosts', postController.getDeveloperPosts)
router.get('/:postId',postController.getPostById)
router.post('/',postController.addPost)
router.post('/save/:postId',postController.savePost)
router.put('/:postId',postController.updatePost)
router.put('/code/:postId',postController.updatePostCode)
router.delete('/:postId',postController.deletePost)

export default router