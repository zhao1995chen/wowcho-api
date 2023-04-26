// 贊助相關

import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { Sponsor } from '../models/Sponsor.model'
import { User } from '../models/User.model'
import { errorHandler } from '../services/errorHandler'

export const SponsorController = {
  async get(req: Request, res: Response) {
    // 取得贊助列表
    try {
      const { _id, page: currentPage, pageSize } = req.body

      // 找尋對應使用者的贊助 id 紀錄
      const sponsorIdList = await User.findById(_id).select('sponsorIdList')

      // 從 sponsor 表中撈出該使用者的贊助資料，並取得對應頁數的內容
      const data = await Sponsor.find({ _id: { $in: sponsorIdList } }).sort({ createTime: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
     
      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  }
}