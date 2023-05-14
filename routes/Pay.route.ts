import express from 'express'
import { PayController } from '../controllers/Pay.controller'

export const payRouter = express.Router()

// 確認訂單載入env
// payRouter.get('/', PayController.get)
// 確認訂單送出金流
payRouter.post('/createOrder', PayController.createEncode)
// 訂單交易成功資料獲得
payRouter.post('/newebpay-return', PayController.mpgReturn)
// 確認交易：Notify
payRouter.post('/newebpay-notify',PayController.mpgNotify)
// 訂單交易成功資料前端顯示
payRouter.get('/newebpay-return',PayController.getMpgReturnView)
