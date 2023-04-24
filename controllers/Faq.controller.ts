import { Request, Response } from 'express'
import { errorHandler } from '../services/errorHandler'
import { successHandler } from '../services/successHandler'
import { Proposal } from '../models/Proposal.model'
import { IFaq } from '../interfaces/Faq.interface'
import { Faq } from '../models/Faq.model'

export const FaqController = {
  async get(req: Request, res: Response) {
    // 取得常見問答
    try {
      const proposalData = new Proposal(req.body)

      // 驗證 id
      const validateError = proposalData.validateSync()
      if (validateError) throw validateError

      // 資料表關聯
      const { _id } = proposalData
      const proposal = await Proposal.findById(_id).populate('faqIdList')
      const list = proposal.faqIdList
      // console.log('faq', list)

      successHandler(res, { list })
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // TODO 建測試資料，不是實際上對外開放的 API，功能沒問題後要拿掉
  async create(req: Request, res: Response) {
    try {
      // console.log(req.body)
      const payload = new Array<IFaq>(...req.body.list)
      // console.log('payload', payload)
      if (!payload) throw '空陣列'

      const result = await Faq.create(payload)
      // console.log('post', result)

      successHandler(res, result)
    } catch(e) {
      errorHandler(res, e)
    }
  },
}
