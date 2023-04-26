// 贊助相關
import { Schema, model } from 'mongoose'
import { ISponsor } from '../interfaces/Sponsor.interface'

const SponsorSchema = new Schema<ISponsor>(
  {
    projectTitle: {
      type: String,
      required: [ true, '' ]
    },
    orderPlanId: {
      type: String,
      required: [ true, '方案 id 必填' ]
    },
    orderSpecification: {
      type: [ Object ],
      required: [ true, '方案規格必填' ],
      default: []
    },
    freight: {
      type: Number,
      required: [ true, '運費必填' ]
    },
    totalMoney: {
      type: Number,
      required: [ true, '總金額必填' ]
    },
    orderStatus: {
      type: Number,
      required: [ true, '訂單狀態必填' ]
    },
    shippingStatus: {
      type: Number,
      required: [ true, '出貨狀態必填' ]
    },
    messageIdList: [{
      type: Schema.Types.ObjectId,
      ref: 'message'
    }],
    payWay: {
      type: String,
      required: [ true, '付款方式必填' ]
    },
    logistics: {
      type: String,
      required: [ true, '物流方式必填' ]
    },
    note: {
      type: String,
      default: ''
    },
    recipientName: {
      type: String,
      required: [ true, '收件人姓名必填' ]
    },
    recipientPhone: {
      type: String,
      required: [ true, '收件人電話必填' ]
    },
    recipientWay: {
      type: String,
      required: [ true, '收件方式必填' ]
    },
    recipientShop: {
      type: String,
      required: [ true, '收件店家必填' ]
    },
    recipientShopId: {
      type: String,
      required: [ true, '收件店家 id 必填' ]
    },
    recipientTrackingId: {
      type: String,
      required: [ true, '收件追蹤編號必填' ]
    },
    recipientAddress: {
      type: String,
      required: [ true, '收件地址必填' ]
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const Sponsor = model<ISponsor>('Sponsor', SponsorSchema)

export {
  Sponsor,
  SponsorSchema
}