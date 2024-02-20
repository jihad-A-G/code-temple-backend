import express from "express";
import * as messageController from '../controllers/messageController.js'

const router = express.Router()


router.post('/:roomId',messageController.addMessage)
router.put('/:messageId',messageController.updateMessage)
router.delete('/:messageId',messageController.deleteMessage)

export default router