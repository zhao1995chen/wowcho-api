import express from 'express'
import { SignInController } from '../controllers/SignIn.controller'
import handleErrorAsync from "../services/handleErrorAsync"
export const signInRouter = express.Router()

signInRouter.post('/', handleErrorAsync(SignInController.signIn))