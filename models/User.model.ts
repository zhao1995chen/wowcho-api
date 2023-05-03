// 會員相關
import { Schema, model } from 'mongoose'
import { IUser } from '../interfaces/User.interface'

const UserSchema = new Schema<IUser>(
  {
    account: {
      type: String,
      required: [ true, '帳號必填' ]
    },
    name: {
      type: String,
      required: [ true, '真實姓名必填' ]
    },
    username: {
      type: String,
      required: [ true, '用戶名稱必填' ]
    },
    email: {
      type: String,
      required: [ true, '信箱必填' ]
    },
    image: {
      type: String,
      default: null,
    },
    isAllowedNotifications: {
      type: Boolean,
      default: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    customedUrl: {
      type: String,
      default: null,
    },
    gender: {
      type: Number,
      default: -1,
    },
    birthday: {
      type: Number,
    },
    address: {
      type: String,
    },
    website: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  {
    versionKey: false
  }
)

const User = model<IUser>('User', UserSchema)

export {
  User,
  UserSchema
}