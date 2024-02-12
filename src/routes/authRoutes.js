import express from 'express'
import * as authController from '../controllers/authController.js'

const router = express.Router()

router.post('/signup',authController.signup)
router.get('/verify-email', authController.verifyEmail)
router.post('/login',authController.login)
router.post('/resetPassword',authController.requestResetPassword)
router.post('/setNewPassword',authController.resetPassword)
export default router