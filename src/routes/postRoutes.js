import express from "express";
import * as postController from '../controllers/postController.js'

const router = express.Router()

router.get('/',postController.getPosts)
router.get('/:postId',postController.getPostById)
router.post('/',postController.addPost)
router.put('/:postId',postController.updatePost)
router.delete('/:postId',postController.deletePost)

export default router