import express from 'express'
import { isAuth } from '../middlewares/auth';
import { UpdatePasswordController } from '../controllers/UpdatePassword.controller'
import handleErrorAsync from "../services/handleErrorAsync"
export const updatePasswordRouter = express.Router()

updatePasswordRouter.patch('/', isAuth, handleErrorAsync(async (req, res, next) => {
    await UpdatePasswordController.patch(req, res, next);
}));