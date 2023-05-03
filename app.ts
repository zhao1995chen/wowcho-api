import express from 'express'
import cors from 'cors' 
import path from 'path'

import { userRouter } from './routes/User.route'
import { moneyFlowRouter } from './routes/MoneyFlow.route'
import { uploadRouter } from './routes/Upload.route'
import { promisesRouter } from './routes/Promises.route'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// TODO 先放根目錄提供會員功能還沒好前串接測試，有會員後需要移到各自 API 內
app.use('/upload', uploadRouter)

app.use('/profile', userRouter)
app.use('/proposal/promises', promisesRouter)
app.use('/money-flow', moneyFlowRouter)  //送出金流

// 確認訂單進藍新金流 測試頁面
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// 404 錯誤
app.use(function(req, res, next) {
    res.status(404).json({
      status: 'error',
      message: "無此路由資訊",
    });
  });
  
  // express 錯誤處理 (from controller)
  const resErrorProd = (err, res) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: 'error',
        message: err.message
      });
    } else {
      // log 紀錄
      console.error('程式有錯誤', err); 
      res.status(500).json({
        status: 'error',
        message: '系統錯誤，請恰系統管理員'
      });
    }
  };
  // 開發環境錯誤
  const resErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      message: err.message,
      error: err,
      stack: err.stack
    });
  };
  // 錯誤處理
  app.use(function(err, req, res, next) {
    // dev
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'dev') {
      return resErrorDev(err, res);
    } 
    // production
    if (err.name === 'ValidationError'){
      err.message = "資料欄位未填寫正確，請重新輸入！"
      err.isOperational = true;
      return resErrorProd(err, res)
    }
    resErrorProd(err, res)
  });
  
  // 未捕捉到的 catch 
  process.on('unhandledRejection', (err, promise) => {
    console.error('未捕捉到的 rejection：', promise, '原因：', err);
  });

export default app