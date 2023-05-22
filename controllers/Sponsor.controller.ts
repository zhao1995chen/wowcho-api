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
      const { _id, currentPage, pageSize } = req.body

      const sponsorIdListLength = (await User.findById(_id))['_doc'].sponsorIdList.length
      const totalPage = Math.ceil(sponsorIdListLength / pageSize)

      const sponsorData = await User.findById(_id).populate({
        path: 'sponsorIdList',
        options: { 
          sort: { createdAt: -1 },
          skip: (currentPage - 1) * pageSize,
          limit: pageSize
        }
      })
        .catch((e) =>  {
          errorHandler(res, e)
        })

      const data = {
        list: sponsorData.sponsorIdList,
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