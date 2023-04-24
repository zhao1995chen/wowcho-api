import { Schema, model } from 'mongoose'
import { IFaq } from '../interfaces/Faq.interface'

const FaqSchema = new Schema<IFaq>(
  {
    title: {
      type: String,
      required: [ true, '標題必填' ]
    },
    content: {
      type: String,
      required: [ true, '內容必填' ]
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const Faq = model<IFaq>('faq', FaqSchema)

export {
  Faq,
  FaqSchema
}
