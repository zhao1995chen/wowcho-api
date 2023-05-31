import { Document, Types } from 'mongoose'

import { Schema } from 'mongoose'

interface ILogin {
  account: string // 信箱
  password: string // 密碼
}

interface IRegister {
  account: string // 信箱
  password: string // 密碼
}

interface IUser extends Document {
  account: string // 帳號
  password: string // 密碼
  name: string // 真實姓名
  username: string // 用戶名稱
  email: string // 信箱
  image?: string // 用戶圖片網址
  isAllowedNotifications: boolean // 允許通知
  isSubscribed: boolean // 訂閱電子報
  customizedUrl: string // 客製化網址
  gender: number // 性別
  birthday?: number // 生日
  address?: string // 地址
  website?: string // 個人網站
  facebook?: string // FB 網址
  instagram?: string // IG 網址
  youtube?: string // YT 網址
  tokenList?: Array<string> // 驗證
  sponsorIdList: Schema.Types.ObjectId[] // 贊助 id
}

interface IAccount {
  account: string
  password: string
  memberRole?: string, //是否是第三方資料
  oauthId: Types.ObjectId//第三方驗證資料關聯
  __t: string
}

export {
  IUser,
}