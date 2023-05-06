// 會員相關
import { Schema, model } from 'mongoose'
import { IMoneyFlowCreateOrder } from '../interfaces/MoneyFlow.interface'

const MoneyFlowSchema = new Schema<IMoneyFlowCreateOrder>(
  {
    ItemDesc: {
      type: String,
      required: [true, '缺少商品名稱'],
      select: true
    },
    Amt: {
      type: Number,
      required: [true, '缺少訂單金額'],
      select: true
    },
    Email: {
      type: String,
      required: [true, '請輸入付款人Email'],
      lowercase: true,
      select: true
    },
    TimeStamp: {
      type: Date,
      required: [true, '缺少時間戳記'],
      select: false
    },
    MerchantOrderNo: {
      type: String,
      required: [true, '缺少商店訂單編號'],
      select: true
    },
    ReturnURL: {
      type: String,
      required: [false, '返回商店網址'],
      select: true
    },
    NotifyURL: {
      type: String,
      required: [false, '支付通知網址'],
      select: true
    },
    EncryptType: {
      type: Boolean,     //加密模式 AES256方式加密參帶0, AES GCM方式加密帶1
      required: [false, '加密模式'],
      select: true
    },
    CVSCOM: {
      type: Number,
      enum:[0,1,2,3],   //物流啟用 店到店物流啟用 1 = 啟用超商取貨不付款 2 = 啟用超商取貨付款 3 = 啟用超商取貨不付款及超商取貨付款 0 或者未有此參數，即代表不開啟
      required: [false, '物流啟用'],
      select: true
    },
    CREDIT: {
      type: Number,
      enum:[0,1],   //物流啟用 店到店物流啟用 1 = 啟用超商取貨不付款 2 = 啟用超商取貨付款 3 = 啟用超商取貨不付款及超商取貨付款 0 或者未有此參數，即代表不開啟
      required: [false, '信用卡一次付清啟用'],
      select: true
    },
    TradeSha: {
      type: String,
      required: [true, '缺少SHA256 加密'],
      select: true
    },
    TradeInfo: {
      type: String,
      required: [true, '缺少AES加密 加密'],
      select: true
    },
    MerchantID: {
      type: String,
      required: [true, '缺少商店代號'],
      select: true
    },
    Version: {
      type: String,
      enum:["1.5", "2.0"],
      required: [true, '缺少版本號'],
      select: true
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)


const MoneyFlowCreateOrder = model<IMoneyFlowCreateOrder>('MoneyFlow', MoneyFlowSchema)

export {
  MoneyFlowCreateOrder,
  MoneyFlowSchema
}