
import { Request, Response } from 'express'
import { Sponsor } from '../models/Sponsor.model'
// import { PayOrder } from '../models/PayOrder.model'
import { create_mpg_aes_encrypt, create_mpg_sha_encrypt, create_mpg_aes_decrypt } from '../middlewares/Pay.middleware'
import { errorHandler } from '../services/errorHandler'
import { ERROR } from '../const'


export const { MerchantID, Host, ReturnURL, NotifyURL, FrontendHost } = process.env
export const SponsorController = {
  mpgReturnData: {
    Status: '',
    Message: '',
    Result: {}
  },
  async createEncode(req: Request, res: Response){
    try{
      // TODO: 添加 ownerId (使用者) proposalUrl (專案網址) planId(方案 id)
      // 1. 檢查使用者 body 、 驗證 planId 是否還有數量
      const newSponsor =  new Sponsor(req.body)
      const validateError = newSponsor.validateSync()
      if (validateError) throw validateError
      const sponsorData = newSponsor.toObject() // 或者 newSponsor.toJSON();

      // 2. 轉換資料
      const createData = {
        // 會員等其他資料
        // 藍新必要資料
        ...sponsorData,
        MerchantID: MerchantID,
        TimeStamp: Math.round(Date.now()),
        Version: '2.0',
        RespondType: 'JSON',
        MerchantOrderNo: sponsorData._id
        // ReturnURL: encodeURIComponent(ReturnURL),
        // NotifyURL: encodeURIComponent(NotifyURL),
      }

      const aesEncrypt = create_mpg_aes_encrypt(createData)
      // 使用 HASH 再次 SHA 加密字串，作為驗證使用
      const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt)
      createData.TradeInfo = aesEncrypt
      createData.TradeSha = shaEncrypt

      // 3. 將資料存 DB
      await Sponsor.create(createData).catch((e) => {
        throw {  message: `新增錯誤:${e}` }
      })

      // 將訂單資訊整理加密後，回傳給前端，前端使用此資料，才能金流認證通過
      res.json({ aesEncrypt, shaEncrypt })

    } catch(e) {
      errorHandler(res, e)
    }
  },
  async mpgReturn(req: Request, res: Response){ //從藍新取得交易結果
    try {
      // 解密交易內容
      if (!Object.prototype.hasOwnProperty.call(req.body, 'TradeInfo')) throw {  message: 'Return 回傳資料錯誤' }
      res.redirect(`${FrontendHost}/#/cart/success`) //轉址前端路由頁面
      // res.render('success', { title: '結帳成功', PayController.mpgReturnData }); //view/success.ejs
    } catch(e) {
      errorHandler(res, e)
    }
  },
  async mpgNotify(req: Request, res: Response){ //從藍新幕後取得交易結果並存資料庫
    try{
      const response = req.body
      console.log(response)
      if (!Object.prototype.hasOwnProperty.call(req.body, 'TradeInfo')) throw {  message: 'Notify 回傳資料錯誤' }
      const thisShaEncrypt = await create_mpg_sha_encrypt(response.TradeInfo)
      console.log('thisShaEncrypt',thisShaEncrypt)
      // 1.檢查回傳資料
      // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
      if (!thisShaEncrypt === response.TradeSha) {
        throw {  message: '付款失敗，請聯絡渦潮客服人員' }
      }

      // 解密交易內容
      const data = await create_mpg_aes_decrypt(response.TradeInfo)
      const result = data.Result
      console.log(result)
      // 2. 透過回傳資料 MerchantOrderNo，查詢資料庫 (id)
      const sponsor = await Sponsor.findOne({ _id: result.MerchantOrderNo })
      // 3. 調整資料庫資料
      let newSponsor = null
      newSponsor = {
        // 原本有的資料 
        ...sponsor,
        // 添加藍新回傳後資料
        IP: result.IP,
        TradeNo: result.TradeNo,
        EscrowBank: result.EscrowBank,
        PaymentType: result.PaymentType,
        RespondCode: result.RespondCode
      }
      switch (result.PaymentType) {
      case 'CREDIT':
        newSponsor.Auth = result.Auth
        newSponsor.Card6No = result.Card6No
        newSponsor.Card4No = result.Card4No
        newSponsor.AuthBank = result.AuthBank
        newSponsor.PayTime = result.PayTime
        newSponsor.PaymentMethod = result.PaymentMethod
        break
      case 'CVSCOM':
        newSponsor.StoreCode = result.StoreCode
        newSponsor.StoreType = result.StoreType
        newSponsor.StoreName = result.StoreName
        newSponsor.TradeType = result.TradeType
        newSponsor.StoreAddr = result.StoreAddr
        newSponsor.CVSCOMName = result.CVSCOMName
        newSponsor.CVSCOMPhone = result.CVSCOMPhone
        newSponsor.LgsType = result.LgsType
        newSponsor.LgsNo = result.LgsNo
        break
      }
      // 4.將修改後資料存至資料庫
      await Sponsor.findByIdAndUpdate(sponsor._id,newSponsor,{
        new: true, // 返回更新後的文檔
        upsert: false, // 如果沒找到匹配的文檔，不要創建新文檔
        runValidators: true, // 觸發 Schema 驗證
      })
      return res.end()
    }catch(e){
      errorHandler(res, e)
    }
  },
  async getMpgReturnView(req: Request, res: Response){ //資料載入前端
    try {
      const mpgReturnData = await SponsorController.mpgReturnData
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

