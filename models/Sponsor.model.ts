// 贊助相關
import { Schema, model } from 'mongoose'
import { ISponsor } from '../interfaces/Sponsor.interface'

const SponsorSchema = new Schema<ISponsor>(
  {
    projectTitle: String,
    orderPlanId: String,
    orderSpecification: [Object],
    freight: Number,
    totalMoney: Number,
    orderStatus: {
      type: Number,
      enum: [-1, 0, 1]
    },
    shippingStatus: {
      type: Number,
      enum: [-1, 0, 1]
    },
    messageIdList: [{
      type: Schema.Types.ObjectId,
      ref: 'message'
    }],
    payWay: String,
    logistics: String,
    note: String,
    recipientName: String,
    recipientPhone: String,
    recipientWay: String,
    recipientShop: String,
    recipientShopId: String,
    recipientTrackingId: String,
    recipientAddress: String,
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    },
    updatedAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000)
    }
  }
)

const Sponsor = model<ISponsor>('Sponsor', SponsorSchema)

export {
  Sponsor,
  SponsorSchema
}