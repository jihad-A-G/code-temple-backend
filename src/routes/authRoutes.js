import express from 'express'
import * as authController from '../controllers/authController.js'
import upload from '../config/multer.js'

const router = express.Router()

router.post('/signup',authController.signup)
router.post('/verify-email', authController.verifyEmail)
router.get('/profile/:developerId', authController.getProfile)
router.post('/login',authController.login)
router.post('/resetPassword',authController.requestResetPassword)
router.post('/setNewPassword',authController.resetPassword)
router.put('/:developerId', upload.single('image') ,authController.updateDeveloper)
export default router