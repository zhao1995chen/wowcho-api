import express from 'express'
import { isAuth } from '../middlewares/Auth.middleware'
import { UpdatePasswordController } from '../controllers/UpdatePassword.controller'
export const updatePasswordRouter = express.Router()

updatePasswordRouter.patch('/',isAuth, UpdatePasswordController.edit)