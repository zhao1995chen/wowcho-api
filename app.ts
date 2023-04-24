import express from 'express'

import { userRouter } from './routes/User.route'
import { faqRouter } from './routes/Faq.route'

const app = express()

app.use(express.json())

app.use('/profile', userRouter)
app.use('/proposal/faq', faqRouter)

export default app