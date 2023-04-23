import express from 'express'
import { isAuth } from '../services/auth';
import { UpdatePasswordController } from '../controllers/UpdatePassword.controller'
export const updatePasswordRouter = express.Router()

const handleErrorAsync = require('../services/handleErrorAsync')

updatePasswordRouter.patch('/', isAuth, handleErrorAsync(async (req, res, next) => {
    await UpdatePasswordController.patch(req, res, next);
}));