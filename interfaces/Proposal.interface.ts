import { Document, Schema } from 'mongoose'

enum  Category {
  Art = 0,
  Society = 1,
  Education = 2,
  VideoGame = 3,
  Technology = 4,
  Leisure = 5,
  Fashion = 6,
}

interface IProposal extends Document {
  title: string // 提案名稱
  ownerId: Schema.Types.ObjectId // 提案人 id
  category: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 提案類別
  image: string // 圖片網址
  video: string // 影片網址
  summary: string // 提案簡述
  description: string // 提案描述
  targetPrice: number // 目標金額
  startTime: number // 募資開始時間
  endTime: number | null // 募資結束時間，可為 null
  ageLimit: number | null // 年齡限制，可為 null
  customizedUrl: string // 客製化專案網址
  planIdList: Schema.Types.ObjectId[] // 募資方案 id 列表
  contentsId: Schema.Types.ObjectId // 詳細內容 id
  messageIdList: Schema.Types.ObjectId[] // 留言 id 列表
  faqIdList: Schema.Types.ObjectId[] // 常見問答 id 列表
  promiseId: Schema.Types.ObjectId // 承諾與告示 id
  placardIdList: Schema.Types.ObjectId[] // 提案進度 id 列表
  liveId: Schema.Types.ObjectId // 直播網址
}

export {
  IProposal
}
