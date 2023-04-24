import { Document } from 'mongoose'

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
  ownerId: string // 提案人 id
  category: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 提案類別
  image: string // 圖片網址
  videoUrl: string // 影片網址
  summary: string // 提案簡述
  description: string // 提案描述
  targetPrice: number // 目標金額
  startTime: number // 募資開始時間
  endTime: number | null // 募資結束時間，可為 null
  ageLimit: number | null // 年齡限制，可為 null
  customizedUrl: string // 客製化專案網址
  planIdList: string[] // 募資方案 id 列表
  contentsId: string // 詳細內容 id
  messageIdList: string[] // 留言 id 列表
  faqIdList: string[] // 常見問答 id 列表
  promiseId: string[] // 承諾與告示 id 列表
  placardIdList: string[] // 提案進度 id 列表
  liveId: string // 直播網址
}

export {
  IProposal
}
