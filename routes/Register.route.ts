import express from 'express'
import { RegisterController } from '../controllers/Register.controller'
export const registerRouter = express.Router()

const handleErrorAsync = require('../services/handleErrorAsync')

registerRouter.post('/', handleErrorAsync(RegisterController.create.bind(RegisterController)))