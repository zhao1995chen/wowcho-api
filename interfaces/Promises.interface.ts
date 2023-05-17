import { Document } from 'mongoose'

interface IPromises extends Document {
  contact: string //	聯絡方式內容
  risk: string //	風險與挑戰內容
  refund: string //	退換貨內容
}

export {
  IPromises
}