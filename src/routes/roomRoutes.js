import express from "express";
import * as roomController from '../controllers/roomController.js'

const router = express.Router()

router.get('/',roomController.getRooms)
router.get('/:roomId', roomController.openRoom)
router.post('/add/', roomController.createRoom)
router.post('/join/', roomController.joinRoom)
router.put('/:memberId',roomController.removeMember)
router.delete('/:roomId', roomController.deleteRoom)

export default router