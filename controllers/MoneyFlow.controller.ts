
import { Request, Response, NextFunction } from 'express'
import { appError } from '../services/appError'
import { MoneyFlowCreateOrder } from '../models/MoneyFlow.model'
import { MoneyFlowSuccessOrder } from '../models/MoneyFlowSuccessOrder.model'
// import { IMoneyFlow } from '../interfaces/MoneyFlow.interface'
// import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import validator from 'validator'
import { create_mpg_aes_encrypt, create_mpg_sha_encrypt, create_mpg_aes_decrypt } from '../middlewares/MoneyFlow.middleware'


export const { MerchantID, HASHKEY, HASHIV, Version, Host, ReturnUrl, NotifyURL, PayGateWay } = process.env;

export const MoneyFlowController = {
    // enOrder:{
    //   order:{
    //     ItemDesc: '',
    //     Amt: null,
    //     Email: '',
    //     TimeStamp: Date.now(),
    //     MerchantOrderNo: null,
    //     ReturnURL: '',
    //     NotifyURL: '',
    //     EncryptType: null,
    //     CVSCOM: null
    //   },
    //   aesEncrypt:'',
    //   shaEncrypt:''
    // },
    async get(req: Request, res: Response){
      // 取得env
      try {
        res.render('money-flow', { title: '確認訂單', Host ,MerchantID, Version, PayGateWay});
      } catch(e) {
        errorHandler(res, e)
      }
    },
    async createEncode(req: Request, res: Response, next: NextFunction){
      try{
          //檢查使用者body
          console.log(req.body)
          let { Email, ItemDesc, Amt, TimeStamp, MerchantOrderNo, ReturnURL, NotifyURL, EncryptType, CVSCOM } =  new MoneyFlowCreateOrder(req.body);

          if(!Email){
              return next(appError(400,"請填寫必填欄位！",next));
          }

          // 是否為 Email
          if(!validator.isEmail(Email)){
              return next(appError(400,"Email 格式不正確",next));
          }

          console.log(Email,ItemDesc,Amt,TimeStamp,MerchantOrderNo,ReturnURL,NotifyURL,EncryptType,CVSCOM)

          // ItemDesc //商品品名
          // Amt //訂單金額
          // Email //付款人信箱 （非收件人
          // TimeStamp   //時間戳記
          // MerchantOrderNo //商店訂單編號
          // ReturnURL   //支付完成 返回商店網址
          // NotifyURL   //支付通知網址
          // EncryptType  //加密模式 AES256方式加密參帶0, AES GCM方式加密帶1
          // CVSCOM  //物流啟用 店到店物流啟用 1 = 啟用超商取貨不付款 2 = 啟用超商取貨付款 3 = 啟用超商取貨不付款及超商取貨付款 0 或者未有此參數，即代表不開啟
          // TradeSha //加密DATA 給藍新必填欄位 參數名不可變動
          // TradeInfo //加密DATA 給藍新必填欄位 參數名不可變動
          // merchantID //商店代號 給藍新必填欄位 參數名不可變動
          // version //版本號 給藍新必填欄位 參數名不可變動

          const order = req.body;
          console.log('createOrder req.body',order);
        
          const aesEncrypt = create_mpg_aes_encrypt(order);
          console.log('aesEncrypt:', aesEncrypt);
        
          // 使用 HASH 再次 SHA 加密字串，作為驗證使用
          const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt);
          console.log('shaEncrypt:', shaEncrypt);
      
          let enOrder = {
            order,
            aesEncrypt,
            shaEncrypt,
          }
          console.log('enOrder',enOrder)
          const createOrderDB = await MoneyFlowCreateOrder.create({
            ItemDesc: enOrder.order.ItemDesc,
            Amt: enOrder.order.Amt,
            Email: enOrder.order.Email,
            TimeStamp: enOrder.order.TimeStamp,
            MerchantOrderNo: enOrder.order.MerchantOrderNo,
            TradeSha: shaEncrypt,
            TradeInfo: aesEncrypt,
            MerchantID: MerchantID,
            Version: Version,
          })
          console.log('createOrderDB',createOrderDB)

          res.json(enOrder);
          
      } catch(e) {
          errorHandler(res, e)
      }
    },
    async mpgReturn(req: Request, res: Response){
      try {
          // 交易成功：Return （可直接解密，將資料呈現在畫面上）
          console.log('req.body return data', req.body);
        // 解密交易內容
        const response = req.body
        const mpgReturnData = await create_mpg_aes_decrypt(response.TradeInfo);
        // const result = data.Result;
        console.log('mpgReturn :', mpgReturnData);


        res.render('success', { title: '結帳成功', mpgReturnData });
      } catch(e) {
        errorHandler(res, e)
      }
    },
    async mpgNotify(req: Request, res: Response, next: NextFunction){
      try{
        console.log('req.body notify data', req.body);
        const response = req.body;
        
        const thisShaEncrypt = await create_mpg_sha_encrypt(response.TradeInfo);
        // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
        if (!thisShaEncrypt === response.TradeSha) {
            console.log('付款失敗：TradeSha 不一致');
            return res.end();
        }
        
        // 解密交易內容
        const data = await create_mpg_aes_decrypt(response.TradeInfo);
        const result = data.Result;
        console.log('data.Result:', data.Result);

        // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
        // if (!orders[data?.Result?.MerchantOrderNo]) {
          //     console.log('找不到訂單');
          //     return res.end();
          // }
          // // 交易完成，將成功資訊儲存於資料庫
          // console.log('付款完成，訂單：', orders[data?.Result?.MerchantOrderNo]);
          
          
          // 存進schema資料庫
          const responseSuccessOrder = await MoneyFlowSuccessOrder.create({     
            MerchantID: result.MerchantID,
            Amt: result.Amt,
            TradeNo: result.TradeNo,
            MerchantOrderNo: result.MerchantOrderNo,
            RespondType: result.RespondType,
            IP: result.IP,
            EscrowBank: result.EscrowBank,
            PaymentType: result.PaymentType,

            RespondCode: result.RespondCode,
            Auth: result.Auth,
            Card6No: result.Card6No,
            Card4No: result.Card4No,
            Exp: result.Exp,
            AuthBank: result.AuthBank,
            TokenUseStatus: result.TokenUseStatus,
            // InstFirst: result.InstFirst,
            // InstEach: result.InstEach,
            // Inst: result.Inst,
            // ECI: result.ECI,
            PayTime: result.PayTime,
            PaymentMethod: result.PaymentMethod,

            StoreCode: result.StoreCode,
            StoreType: result.StoreType,
            StoreName: result.StoreName,
            TradeType: result.TradeType,
            StoreAddr: result.StoreAddr,
            CVSCOMName: result.CVSCOMName,
            CVSCOMPhone: result.CVSCOMPhone,
            LgsType: result.LgsType,
            LgsNo: result.LgsNo,
          });
        console.log("responseSuccessOrder",responseSuccessOrder)

        return res.end();

      }catch(e){
        errorHandler(res, e)
      }
 
      
    }
}

