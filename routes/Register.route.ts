import express from 'express'
import { RegisterController } from '../controllers/Register.controller'
export const registerRouter = express.Router()
import handleErrorAsync from "../services/handleErrorAsync"

registerRouter.post('/', handleErrorAsync(RegisterController.create.bind(RegisterController)))