import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { IProposal,IProposalQuery } from '../interfaces/Proposal.interface'
import { Proposal } from '../models/Proposal.model'
import { Plan } from '../models/Plan.model'
import { User } from '../models/User.model'

export const ProposalController = {

  // 獲得列表
  async getList(req: Request, res: Response) {
    try {
      const order = Number(req.query.order)
      let sortCondition = {}
      // 排序方式
      switch (order) {
      case 0:
        sortCondition = { } // 根據 endTime timeStamp 進行升序排序
        break
      case 1:
        sortCondition = { endTime: -1 } // 根據 endTime timeStamp 進行升序排序
        break
      case 2:
        sortCondition = { endTime: 1 } // 根據 createdAt  進行倒序
        break
      case 3:
        sortCondition = { nowPrice: -1 } // 根據 nowPrice 進行升序排序
        break
      case 4:
        sortCondition = { nowPrice: 1 } // 根據 nowPrice 進行升序排序
        break
      default:
        sortCondition = {}
        break
      }
      const currentTime: number = Date.now() // 當前時間
      const queryObject: IProposalQuery = { 
        endTime: { $gte: currentTime }, // 僅查詢 endTime > 當前時間，就是未過期的資料
        startTime: { $lte: currentTime}
      }
      const category: string | null = req.query.category as string || null // 分類無值時使用 null ，有值則使用
      // 分類有值時，queryObject.category 帶上分類，否則 queryObject.category = null
      // category 非 0 時代上 queryObject.category 
      if(Number(category) !== 0) queryObject.category = Number(category)
      const pageSize = Number(req.query.pageSize) || 10 // 每頁顯示幾筆資料
      const page = Number(req.query.page) || 1 // 目前頁數
      const proposalList = await Proposal.find(queryObject)
        .select('_id image name customizedUrl category summary nowPrice targetPrice starTime endTime nowBuyers updatedAt createdAt')
        .sort(sortCondition) 
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
      const totalCount = await Proposal.countDocuments(queryObject)
      const data = {
        list: proposalList,
        totalCount:totalCount
      }
      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 獲得詳細資訊
  async get(req: Request, res: Response) {
    // 註冊 plan 資源
    console.assert(Plan)
    console.assert(User)
    try {
      let query = null

      const id = req.query.id // 指定 proposal id
      const proposalUrl = req.query.proposalUrl
      if (id !== undefined) {
        query = {_id: id}
      } else {
        query = {customizedUrl: proposalUrl }
      }
      
      const proposal = await Proposal.findOne<IProposal>(query)
        .populate('planIdList')
        .populate({ path: 'ownerId', select: 'name username email account' })
        .catch(()=> {
          throw '募資活動 ID 錯誤'
        })
      if (!proposal) throw '募資活動 ID 錯誤'
      successHandler(res, proposal)
    }
    catch(e) {
      errorHandler(res, e)
    }
  },
  // 獲得購物時資訊
  async getCart(req: Request, res: Response) {
    // 註冊 plan 資源
    try {
      // 
      const id = req.query.id // 指定 plan id
      const plan = await Plan.findById({ _id:id })
        .catch(()=> {
          throw '募資方案 ID 錯誤'
        })
      // if (!plan) throw '募資活動 ID 錯誤'
      const proposal = await Proposal.findOne({ customizedUrl: plan.proposalUrl })
        // .select('_id image name description targetPrice')
        .catch(()=> {
          throw '募資活動 ID 錯誤'
        })
      const data = {
        proposal:proposal,
        plan:plan
      }
      successHandler(res,data )
    }
    catch(e) {
      errorHandler(res, e)
    }
  },
  // 搜尋功能
  async getSearch(req: Request, res: Response) {
    try {
      const pageSize = Number(req.query.pageSize) || 10 // 每頁顯示幾筆資料
      const page = Number(req.query.page) || 1 // 目前頁數
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchKeyword:any = req.query.search
      const regex = new RegExp(searchKeyword, 'i')
      const currentTime: number = Date.now() // 當前時間
      const queryObject = {
        $or: [
          { title: regex }, 
          { summary: regex }, 
          { description: regex },
        ],
        endTime: { $gte: currentTime }, // 僅查詢 endTime > 當前時間，就是未過期的資料
        startTime: { $lte: currentTime}
      }
      const proposalList = await Proposal.find(queryObject)
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
      const totalCount = await Proposal.countDocuments(queryObject)
      const data = {
        list: proposalList,
        totalCount:totalCount
      }
      successHandler(res, data)
    } catch(e){
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  },
}