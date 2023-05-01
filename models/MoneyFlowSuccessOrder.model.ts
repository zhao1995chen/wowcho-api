// 會員相關
import { Schema, model } from 'mongoose'
import { IMoneyFlowSuccessOrder } from '../interfaces/MoneyFlow.interface'
import { MoneyFlowCreateOrder } from './MoneyFlow.model';

const MoneyFlowSuccessOrderSchema = new Schema<IMoneyFlowSuccessOrder>(
    //============交易成功基本參數============
    {
    MerchantID: {
        type: String,
        required: [true, '商店代號'],
        select: true
    },
    Amt: {
      type: Number,
      required: [true, '訂單金額'],
      select: true
    },
    TradeNo: {
        type: Number,
        required: [true, '藍新金流交易序號'],
        select: true
      },
    MerchantOrderNo: {
      type: String,
      required: [true, '商店訂單編號'],
      select: true
    },
    RespondType: {
      type: String,
      required: [true, '回傳格式'],
      enum:['JSON','String'],
      select: true
    },
    IP: {
      type: String,
      required: [false, '付款人交易IP'],
      select: false
    },
    EscrowBank: {
        type: String,
        required: [false, '款項保管銀行'],
        select: true
    },
    PaymentType: {
        type: String,
        required: [true, '支付方式'],
        select: true
    },
    //============信用卡一次付清============
    RespondCode: {
        type: String,
        required: [false, '金融機構回應碼'],
        select: true
    },
    Auth: {
        type: String,
        required: [false, '收單機構授權碼'],
        select: true
    },
    Card6No: {
        type: String,
        required: [false, '卡號前六碼'],
        select: true
    },
    Card4No: {
        type: String,
        required: [false, '卡號末四碼'],
        select: true
    },
    Exp: {
        type: String,
        required: [false, '？'],
        select: true
    },
    AuthBank: {
        type: String,
        required: [false, '收單金融機構'],
        select: true
    },
    TokenUseStatus: {
        type: Number,
        required: [false, '信用卡快速結帳使用狀態'],
        select: true
    },
    InstFirst: {
        type: Number,
        required: [false, '分期-首期金額'],
        select: true
    },
    InstEach: {
        type: Number,
        required: [false, '分期-每期金額'],
        select: true
    },
    Inst: {
        type: Number,
        required: [false, '分期-期別'],
        select: true
    },
    ECI: { //eci=1,2,5,6，代表為 3D 交易,空值為失敗
        type: String,
        required: [false, 'ECI 值'],
        select: true
    },
    PayTime: { //回傳格式為:2014-06-25 16:43:49, 超商取貨以空值回傳
        type: String,
        required: [false, '支付完成時間'],
        select: true
    },
    PaymentMethod: {
        type: String,
        required: [false, '交易類別'],
        select: true
    },
    //============物流店到店============
    StoreCode: {
        type: String,
        required: [false, '超商取貨門市編號'],
        select: true
    },
    StoreType: {
        type: String,
        required: [false, '超商類別名稱'],
        select: true
    },
    StoreName: {
        type: String,
        required: [false, '超商取貨門市名稱'],
        select: true
    },
    TradeType: {
        type: String,
        required: [false, '取件交易方式'],
        enum:['1','3'], //1 = 取貨付款 3 = 取貨不付款
        select: true
    },
    StoreAddr: {
        type: String,
        required: [false, '超商取貨門市地址'],
        select: true
    },
    CVSCOMName: {
        type: String,
        required: [false, '取貨人姓名'],
        select: true
    },
    CVSCOMPhone: {
        type: String,
        required: [false, '取貨人手機號碼'],
        select: true
    },
    LgsType: {
        type: String,
        required: [false, '物流型態'],
        enum:['B2C','C2C'],
        select: true
    },
    LgsNo: {
        type: String,
        required: [false, '物流寄件單號(寄件代碼)'],
        select: true
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const MoneyFlowSuccessOrder = model<IMoneyFlowSuccessOrder>('MoneyFlowSuccessOrder', MoneyFlowSuccessOrderSchema)
// const MoneyFlowSuccessOrder = MoneyFlowCreateOrder.discriminator<IMoneyFlowSuccessOrder>('MoneyFlowSuccessOrder', MoneyFlowSuccessOrderSchema)

export {
  MoneyFlowSuccessOrder,
  MoneyFlowSuccessOrderSchema
}