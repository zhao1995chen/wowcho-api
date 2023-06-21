import express from 'express'
import cors from 'cors' 

import { updatePasswordRouter } from './routes/UpdatePassword.route'
import { loginRouter } from './routes/Login.route'
import { registerRouter } from './routes/Register.route'
import { uploadRouter } from './routes/Upload.route'
import { proposalRouter } from './routes/Proposal.route'
import { promisesRouter } from './routes/Promises.route'
import { userRouter } from './routes/User.route'
import { profileRouter } from './routes/Profile.route'
import { faqRouter } from './routes/Faq.route'
import { sponsorRouter } from './routes/Sponsor.route'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// TODO 先放根目錄提供會員功能還沒好前串接測試，有會員後需要移到各自 API 內
app.use('/upload', uploadRouter)


app.use('/login', loginRouter)       //登入
app.use('/sign-up', registerRouter)    //註冊
app.use('/profile', profileRouter)

app.use('/sponsors', sponsorRouter)  //送出金流
app.use('/profile', userRouter)
app.use('/proposal', proposalRouter)
app.use('/proposal/faq', faqRouter)
app.use('/proposal/promises', promisesRouter)
app.use('/reset-password', updatePasswordRouter)  //更新密碼

export default app
