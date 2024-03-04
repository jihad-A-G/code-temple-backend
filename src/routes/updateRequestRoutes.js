import express from "express";
import * as updateRequestController from '../controllers/updateRequestController.js'

const router = express.Router()


router.post('/add/:postId',updateRequestController.requestUpdate)
router.get('/id/:requestId', updateRequestController.getRequestById)
router.get('/:postId',updateRequestController.getPostRequests)
router.post('/approve/:requestId', updateRequestController.approveRequest)
router.put('/:requestId',updateRequestController.updateRequest)
router.delete('/:requestId',updateRequestController.deleteRequest)

export default router