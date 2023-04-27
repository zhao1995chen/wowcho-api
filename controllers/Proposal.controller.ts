import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { Proposal } from '../models/Proposal.model'
import { IProposal,IProposalQuery } from '../interfaces/Proposal.interface'

export const ProposalController = {

  // 獲得列表
  async getList(req: Request, res: Response) {
    try {
      const order = req.query.order
      let sortCondition = {}
      switch (order) {
      case '0':
        sortCondition = { endTime: 1 } // 根據 endTime timeStamp 進行升序排序
        break
      case '1':
        sortCondition = { createdAt:-1 } // 根據 createdAt  進行倒序
        break
      case '2':
        sortCondition = { nowPrice: 1 } // 根據 nowPrice 進行升序排序
        break
      case '3':
        sortCondition = { nowPrice: 1 } // 根據 nowPrice 進行升序排序
        break
      default:
        sortCondition = {}
        break
      }
      const category: string | null = req.query.category as string || null
      const currentTime: number = Date.now()
      const queryObject: IProposalQuery = { 
        endTime: { $gte: currentTime } // 僅查詢未過期的事件
      }
      if (category) {
        queryObject.category = category
      }

      const pageSize = Number(req.query.pageSize) || 10 // 每頁顯示幾筆資料
      const page = Number(req.query.page) || 1 // 目前頁數
      // const currentTime = new Date()
      const proposalList = await Proposal.find(queryObject) 
        .select('_id imageUrl name customizedUrl category summary targetPrice starTime endTime updatedAt createdAt')
        .sort(sortCondition) 
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
      console.log(proposalList)
      successHandler(res, proposalList)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 獲得詳細資訊
  async get(req: Request, res: Response) {
    try {
      const id = req.query.id // 指定 proposal id
      const proposal = await Proposal.findOne<IProposal>({ _id:id })
      if (!proposal) throw '募資活動 ID 錯誤'
      successHandler(res, proposal)
    }
    catch(e) {
      errorHandler(res, e)
    }
  },

  options(req: Request, res: Response) {
    successHandler(res)
  },
}