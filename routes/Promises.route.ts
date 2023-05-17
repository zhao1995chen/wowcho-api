import express from 'express'
import { PromisesController } from '../controllers/Promises.controller'

export const promisesRouter = express.Router()

promisesRouter.get('/', PromisesController.get)
promisesRouter.post('/', PromisesController.create)