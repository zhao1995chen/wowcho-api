import express from 'express'
import { FaqController } from '../controllers/Faq.controller'

export const faqRouter = express.Router()

faqRouter.get('/', FaqController.get)
faqRouter.post('/', FaqController.create)
