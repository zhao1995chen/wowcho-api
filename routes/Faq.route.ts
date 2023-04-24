import express from 'express'
import { FaqController } from '../controllers/Faq.controller'

export const faqRouter = express.Router()

faqRouter.post('/', FaqController.get)
faqRouter.post('/', FaqController.create)
