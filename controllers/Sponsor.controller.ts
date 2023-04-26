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
      const list = []
      const originList = await Sponsor.find({ _id: { $in: sponsorIdList } }).sort({ createTime: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
      originList.forEach((item) => {
        list.push({
          "id": item._id,
          "date": item.createTime,
          // 後續要使用 item.orderPlanId 改成從 project 表中撈出對應的 projectTitle, orderPlan
          "projectTitle": "超早鳥 - 潮到出水短T",
          "orderPlan": "潮到出水短T套裝組",
          "orderSpecification": item.orderSpecification,
          "totalMoney": item.totalMoney,
          "orderStatus": item.orderStatus,
          "shippingStatus": item.shippingStatus,
        })
      })
        
      
      // 計算總頁數, 有可能 user 的 sponsorIdList 取得的 sponsor 資料不一
      const totalNun = await Sponsor.countDocuments({ _id: { $in: sponsorIdList } })
      const totalPage = Math.ceil(totalNun / pageSize)

      const data = {
        list,
        currentPage,
        pageSize,
        totalPage
      }
     
      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  }
}