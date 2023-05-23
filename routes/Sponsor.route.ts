import express from 'express'
import { SponsorController } from '../controllers/Sponsor.controller'

export const sponsorRouter = express.Router()

// 確認訂單送出金流
sponsorRouter.post('/createOrder', SponsorController.createEncode)
// 訂單交易成功資料獲得
sponsorRouter.post('/newebpay-return', SponsorController.mpgReturn)
// 確認交易：Notify
sponsorRouter.post('/newebpay-notify',SponsorController.mpgNotify)
