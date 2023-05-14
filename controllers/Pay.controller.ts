
import { Request, Response } from 'express'
import { Pay } from '../models/Pay.model'
import { PayOrder } from '../models/PayOrder.model'
import validator from 'validator'
import { create_mpg_aes_encrypt, create_mpg_sha_encrypt, create_mpg_aes_decrypt } from '../middlewares/Pay.middleware'
import { errorHandler } from '../services/errorHandler'
import { ERROR } from '../const'


export const { MerchantID, Version, Host, ReturnURL, NotifyURL, FrontendHost } = process.env
console.log(NotifyURL)
export const PayController = {
  mpgReturnData: {
    Status: '',
    Message: '',
    Result: {}
  },
  // async get(req: Request, res: Response){
  //   // 取得env
  //   try {
  //     res.json({ title: '確認訂單', Host ,MerchantID, Version, PayGateWay, ReturnURL, NotifyURL});
  //     // res.render('money-flow', { title: '確認訂單', Host ,MerchantID, Version, PayGateWay, ReturnURL, NotifyURL});
  //   } catch(e) {
  //     errorHandler(res, e)
  //   }
  // },
  async createEncode(req: Request, res: Response){
    try{
      // TODO: 添加 ownerId (使用者) proposalUrl (專案網址) planId(方案 id)
      //檢查使用者 body
      const { Email, ItemDesc, CVSCOM, CREDIT, Amt } =  new Pay(req.body)
      if(!Email){
        throw { fieldName: 'email', message: ERROR.REQUIRED }
      }

      // 是否為 Email
      // 1. 認證
      if(!validator.isEmail(Email)){
        throw { fieldName: 'email', message: ERROR.ERROR_FORMAT }
      }

      // 2. 轉換資料
      const createData = {
        // 會員等其他資料
        // 藍新資料
        ItemDesc: ItemDesc,
        Amt: Amt,
        Email: Email,
        TimeStamp: Math.round(Date.now()),
        // ReturnURL: encodeURIComponent(ReturnURL),
        // NotifyURL: encodeURIComponent(NotifyURL),
        CVSCOM: CVSCOM,
        CREDIT: CREDIT,
        MerchantID: MerchantID,
        Version: Version,
        RespondType: 'JSON',
      }
      // 3. 存 DB 獲得 DB _id
      const newPayData = await Pay.create(createData).catch(() => {
        throw {  message: '新增錯誤' }
      })
      // console.log('test', encodeURIComponent(ReturnURL), encodeURIComponent(NotifyURL))
      // 將 _id 存為 MerchantOrderNo，並做金流需要加密
      newPayData.MerchantOrderNo = newPayData._id
      // delete newPayData._id

      const aesEncrypt = create_mpg_aes_encrypt(newPayData)
      // 使用 HASH 再次 SHA 加密字串，作為驗證使用
      const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt)
      newPayData.TradeInfo = aesEncrypt
      newPayData.TradeSha = shaEncrypt

      // 將訂單資訊整理加密後，回傳給前端，前端使用此資料，才能金流認證通過
      await newPayData.save().catch(() => { 
        throw { message: '第二次儲存錯誤'}
      }) 
      res.json({ aesEncrypt, shaEncrypt })

    } catch(e) {
      errorHandler(res, e)
    }
  },
  async mpgReturn(req: Request, res: Response){ //從藍新取得交易結果
    try {
      // 解密交易內容
      if (!Object.prototype.hasOwnProperty.call(req.body, 'TradeInfo')) throw {  message: 'Return 回傳資料錯誤' }
      console.log('return',req.body)
      res.redirect(`${FrontendHost}/#/cart/success`) //轉址前端路由頁面
      // res.render('success', { title: '結帳成功', PayController.mpgReturnData }); //view/success.ejs
    } catch(e) {
      errorHandler(res, e)
    }
  },
  async mpgNotify(req: Request, res: Response){ //從藍新幕後取得交易結果並存資料庫
    try{
      console.log('notify',req.body,req)
      const response = req.body
      if (!Object.prototype.hasOwnProperty.call(req.body, 'TradeInfo')) throw {  message: 'Notify 回傳資料錯誤' }

      const thisShaEncrypt = await create_mpg_sha_encrypt(response.TradeInfo)
      // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
      if (!thisShaEncrypt === response.TradeSha) {
        console.log('付款失敗：TradeSha 不一致')
        throw {  message: '付款失敗，請聯絡渦潮客服人員' }
      }

      // 解密交易內容
      const data = await create_mpg_aes_decrypt(response.TradeInfo)
      const result = data.Result
      console.log(result)
      // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
      // if (!orders[data?.Result?.MerchantOrderNo]) {
      //     console.log('找不到訂單');
      //     return res.end();
      // }
      // // 交易完成，將成功資訊儲存於資料庫
      // console.log('付款完成，訂單：', orders[data?.Result?.MerchantOrderNo]);
          
          
      // 存進schema資料庫
      // const responseSuccessOrder = await PayOrder.create({
      //   MerchantID: result.MerchantID,
      //   Amt: result.Amt,
      //   TradeNo: result.TradeNo,
      //   MerchantOrderNo: result.MerchantOrderNo,
      //   RespondType: result.RespondType,
      //   IP: result.IP,
      //   EscrowBank: result.EscrowBank,
      //   PaymentType: result.PaymentType,

      //   RespondCode: result.RespondCode,
      //   Auth: result.Auth,
      //   Card6No: result.Card6No,
      //   Card4No: result.Card4No,
      //   Exp: result.Exp,
      //   AuthBank: result.AuthBank,
      //   TokenUseStatus: result.TokenUseStatus,
      //   // InstFirst: result.InstFirst,
      //   // InstEach: result.InstEach,
      //   // Inst: result.Inst,
      //   // ECI: result.ECI,
      //   PayTime: result.PayTime,
      //   PaymentMethod: result.PaymentMethod,

      //   StoreCode: result.StoreCode,
      //   StoreType: result.StoreType,
      //   StoreName: result.StoreName,
      //   TradeType: result.TradeType,
      //   StoreAddr: result.StoreAddr,
      //   CVSCOMName: result.CVSCOMName,
      //   CVSCOMPhone: result.CVSCOMPhone,
      //   LgsType: result.LgsType,
      //   LgsNo: result.LgsNo,
      // })

      return res.end()

    }catch(e){
      errorHandler(res, e)
    }
  },
  async getMpgReturnView(req: Request, res: Response){ //資料載入前端
    try {
      const mpgReturnData = await PayController.mpgReturnData
      console.log(mpgReturnData)
      res.json({ 
        title: mpgReturnData.Status === 'SUCCESS' ? '交易成功' : '交易失敗' , 
        mpgReturnData 
      })

    } catch(e) {
      errorHandler(res, e)
    }
  }
}

