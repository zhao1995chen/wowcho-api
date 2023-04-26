import express from 'express'

import { userRouter } from './routes/User.route'
import { sponsorRouter } from './routes/Sponsor.route'


const app = express()

app.use('/profile', userRouter)
app.use('/sponsor', sponsorRouter)

export default app