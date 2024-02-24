import express from "express";
import * as commentController from '../controllers/commentController.js'

const router = express.Router()


router.post('/:postId',commentController.AddComment)
router.post('/upvote/:commentId',commentController.upVoteComment)
router.put('/:commentId',commentController.updateComment)
router.delete('/:commentId',commentController.deleteComment)

export default router