
import { Request, Response } from 'express'
import { Sponsor } from '../models/Sponsor.model'
import { create_mpg_aes_encrypt, create_mpg_sha_encrypt, create_mpg_aes_decrypt } from '../middlewares/Pay.middleware'
import { errorHandler } from '../services/errorHandler'
import { successHandler } from '../services/successHandler'
import { ERROR } from '../const'
import { Plan } from '../models/Plan.model'
import { Proposal } from '../models/Proposal.model'

export const { MerchantID, Host, ReturnURL, NotifyURL, FrontendHost } = process.env
export const SponsorController = {
  // 點擊購買時觸發
  async createEncode(req: Request, res: Response){
    try{
      const { planId } = req.body
      // 1. 驗證資料
      // 用方案 id 獲得資料
      const plan = await Plan.findById({ _id: planId }).catch(()=>{
        throw { message: '方案 ID 錯誤'}
      })
      //  驗證 planId 是否還有數量
      if (plan.quantity !== null && plan.quantity <= 0 ){
        throw { message: '此方案數量為 0'}
      }
      const userId = req.body._id
      delete req.body._id
      const newSponsor =  new Sponsor(req.body)
      // 驗證使用者資料是否符合規則
      const validateError = newSponsor.validateSync()
      if (validateError) throw { validateMessage: validateError, type: 'validate' }
      const sponsorData = newSponsor.toObject() // 或者 newSponsor.toJSON();
      // // 刪除 User id
      // delete sponsorData._id
      // 2. 轉換資料
      const createData = {
        // 會員等其他資料
        buyerId: userId,
        ...sponsorData, // 商品品名 、 金額、 購買方式、 使用者 email 、備註等等皆在此
        // 藍新必要資料
        MerchantID: MerchantID,
        TimeStamp: Math.round(Date.now()),
        Version: '2.0',
        RespondType: 'JSON',
        CREDIT: 1,
        MerchantOrderNo: sponsorData._id
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
      successHandler(res, { aesEncrypt, shaEncrypt })
    } catch(e) {
      errorHandler(res, e)
    }
  },
  //從藍新取得交易結果
  async mpgReturn(req: Request, res: Response){
    try {
      // 解密交易內容

      if (!Object.prototype.hasOwnProperty.call(req.body, 'TradeInfo')) throw {  message: '付款失敗，請聯絡渦潮客服人員' }
      const request = req.body
      const thisShaEncrypt = await create_mpg_sha_encrypt(request.TradeInfo)
      const data = await create_mpg_aes_decrypt(request.TradeInfo)
      // 解碼後資料不相同、藍新狀態碼錯誤， 回傳錯誤
      if( thisShaEncrypt !== request.TradeSha || !request.Status ){
        throw { message: '付款失敗，請聯絡渦潮客服人員' }
      }

      const params = new URLSearchParams({
        title: data.Status === 'SUCCESS' ? '交易成功' : '交易失敗' , 
        Message: data.Message,
        Status: data.Status,
        MerchantOrderNo: data.Result.MerchantOrderNo,
        TradeNo: data.Result.TradeNo,
        ItemDesc: data.Result.ItemDesc,
        PaymentType: data.Result.PaymentType,
        Auth: data.Result.Auth,
        Card6No: data.Result.Card6No,
        Card4No: data.Result.Card4No,
        PayTime: data.Result.PayTime,
        Amt: data.Result.Amt,
        TradeType: data.Result.TradeType,
        StoreType: data.Result.StoreType,
        StoreName: data.Result.StoreName,
        StoreAddr: data.Result.StoreAddr,
        CVSCOMName: data.Result.CVSCOMName,
        CVSCOMPhone: data.Result.CVSCOMPhone
      })

      // 轉址 query 戴上，方案名稱、付款方式、付款時間
      res.redirect(`${FrontendHost}/cart/success?${params.toString()}`) //轉址前端路由頁面

    } catch(e) {
      errorHandler(res, e)
    }
  },
  //從藍新幕後取得交易結果並存資料庫
  async mpgNotify(req: Request, res: Response){
    try{
      const request = req.body
      if (!Object.prototype.hasOwnProperty.call(req.body, 'TradeInfo')) throw {  message: '付款失敗，請聯絡渦潮客服人員' }
      const thisShaEncrypt = await create_mpg_sha_encrypt(request.TradeInfo)
      // 1.檢查回傳資料
      // 使用 HASH 再次 SHA 加密字串，確保比對一致、藍新狀態碼錯誤， 回傳錯誤
      if (thisShaEncrypt !== request.TradeSha || !request.Status ) {
        throw {  message: '付款失敗，請聯絡渦潮客服人員' }
      }

      // 解密交易內容
      const data = await create_mpg_aes_decrypt(request.TradeInfo)
      const result = data.Result
      // 2. 透過回傳資料 MerchantOrderNo，查詢資料庫 (id)
      const findSponsor = await (await Sponsor.findOne({ _id: result.MerchantOrderNo })).toObject()
      // 3. 調整資料庫資料
      findSponsor.payStatus = true
      let newSponsor = null
      // 宅配
      if (findSponsor.CVSCOM === 0) {
        newSponsor = {
          // 原本有的資料 
          ...findSponsor,
          // 添加藍新回傳後資料
          IP: result.IP,
          TradeNo: result.TradeNo,
          EscrowBank: result.EscrowBank,
          PaymentType: result.PaymentType,
          RespondCode: result.RespondCode,
          // 信用卡
          Auth: result.Auth ? result.Auth : '',
          Card6No: result.Card6No ? result.Card6No : '',
          Card4No: result.Card4No ? result.Card4No : '',
          AuthBank: result.AuthBank ? result.AuthBank : '',
          PayTime: result.PayTime ?  result.PayTime : '',
          PaymentMethod: result.PaymentMethod ? result.PaymentMethod : '',
        }
      } else if (findSponsor.CVSCOM === 3){ // 超商店到店
        newSponsor = {
          // 原本有的資料 
          ...findSponsor,
          // 添加藍新回傳後資料
          IP: result.IP,
          TradeNo: result.TradeNo,
          EscrowBank: result.EscrowBank,
          PaymentType: result.PaymentType,
          RespondCode: result.RespondCode,
          // 信用卡
          Auth: result.Auth ? result.Auth : '',
          Card6No: result.Card6No ? result.Card6No : '',
          Card4No: result.Card4No ? result.Card4No : '',
          AuthBank: result.AuthBank ? result.AuthBank : '',
          PayTime: result.PayTime ?  result.PayTime : '',
          PaymentMethod: result.PaymentMethod ? result.PaymentMethod : '',
          // 取貨付款
          StoreCode: result.StoreCode ? result.StoreCode : '',
          StoreType: result.StoreType ? result.StoreType : '',
          StoreName: result.StoreName ? result.StoreName : '',
          TradeType: result.TradeType ? result.TradeType : '',
          StoreAddr: result.StoreAddr ? result.StoreAddr : '',
          CVSCOMName: result.CVSCOMName ? result.CVSCOMName : '',
          CVSCOMPhone: result.CVSCOMPhone ? result.CVSCOMPhone : '',
          LgsType: result.LgsType ? result.LgsType : '',
          LgsNo: result.LgsNo ? result.LgsNo : '',
        }
      }

      // 4.將修改後資料存至資料庫、同時減少 plan 數量資料
      const sponsor = await Sponsor.findByIdAndUpdate(findSponsor._id, newSponsor,{
        new: true, // 返回更新後的文檔
        upsert: false, // 如果沒找到匹配的文檔，不要創建新文檔
        runValidators: true, // 觸發 Schema 驗證
      })
      const plan = await Plan.findById({ _id: sponsor.planId })
      const proposal = await Proposal.findOne({ customizedUrl: plan.proposalUrl })
      await plan.sponsorToPlan()
      await proposal.sponsorToPlan(plan.actualPrice)
      successHandler(res, { plan , proposal })
    }catch(e){
      errorHandler(res, e)
    }
  },
  // 贊助列表
  async getList (req: Request, res: Response) {
    try {
      const pageSize = Number(req.query.pageSize) || 10 // 每頁顯示幾筆資料
      const page = Number(req.query.page) || 1 // 目前頁數
      const { _id } = req.body
      // 購買人
      const sponsorList = await Sponsor.find({ buyerId :_id , payStatus:true })
        .populate('buyerId')
        .populate('ownerId')
        .populate('planId')
        .populate('proposalId')

        .sort({ createTime: -1 })
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
        .catch(() => {
          throw { message: ERROR.GENERAL }
        })
      const totalCount = await Sponsor.countDocuments({ buyerId :_id  })


      const data = {
        list: sponsorList,
        totalCount,
      }
      successHandler(res,data )
    } catch (e) {
      throw {  message: `${e}`}
    }
  },
  // 贊助詳細
  async get (req: Request, res: Response) {
    try {
      const id = req.query.id
      // 從 sponsor 表中撈出該使用者的贊助資料，並取得對應頁數的內容
      const data = await Sponsor.findById(id)
        .populate('buyerId')
        .populate('ownerId')
        .populate('planId')
        .populate('proposalId')
        .catch(() => {
          throw { message: ERROR.GENERAL }
        })
      successHandler(res,data )
    } catch (e) {
      errorHandler(res, e)
    }
  },
}
