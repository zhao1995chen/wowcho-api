import express from 'express'

import { uploadRouter } from './routes/Upload.route'
import { promisesRouter } from './routes/Promises.route'

import { userRouter } from './routes/User.route'
import { faqRouter } from './routes/Faq.route'
import { payRouter } from './routes/Pay.route'
import cors from 'cors' 

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


// TODO 先放根目錄提供會員功能還沒好前串接測試，有會員後需要移到各自 API 內
app.use('/upload', uploadRouter)

app.use('/pay', payRouter)  //送出金流

app.use('/profile', userRouter)
app.use('/proposal/faq', faqRouter)
app.use('/proposal/promises', promisesRouter)

export default app