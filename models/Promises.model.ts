import { Schema, model } from 'mongoose'
import { IPromises } from '../interfaces/Promises.interface'

const PromisesSchema = new Schema<IPromises>(
  {
    contact: String,
    risk: String,
    refund: String
  },
  {
    versionKey: false,
    timestamps: true
  }
)


const Promises = model<IPromises>('promise', PromisesSchema)

export {
  Promises,
  PromisesSchema
}