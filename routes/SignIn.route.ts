import express from 'express'
import { SignInController } from '../controllers/SignIn.controller'
export const signInRouter = express.Router()

const handleErrorAsync = require('../services/handleErrorAsync')

signInRouter.post('/', handleErrorAsync(SignInController.signIn))