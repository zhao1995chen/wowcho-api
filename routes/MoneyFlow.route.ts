import express from 'express'
// import { isAuth } from '../middlewares/auth';
// import { create_mpg_aes_decrypt } from '../middlewares/MoneyFlow.middleware';
import { MoneyFlowController } from '../controllers/MoneyFlow.controller'
import handleErrorAsync from '../services/handleErrorAsync'
export const moneyFlowRouter = express.Router()

// 確認訂單載入env
moneyFlowRouter.get('/', handleErrorAsync(MoneyFlowController.get))
// 確認訂單送出金流
moneyFlowRouter.post('/createOrder', handleErrorAsync(MoneyFlowController.createEncode))
// 訂單交易成功顯示
moneyFlowRouter.post('/newebpay-return', handleErrorAsync(MoneyFlowController.mpgReturn))
// 確認交易：Notify
moneyFlowRouter.post('/newebpay-notify', handleErrorAsync(MoneyFlowController.mpgNotify))

// moneyFlowRouter.post('/newebpay-notify', isAuth, handleErrorAsync(async (req, res, next) => {
    //     console.log('moneyFlowRouter newebpay-notify',req.body)
    //     await MoneyFlowController.mpgNotify(req, res, next);
    // }));