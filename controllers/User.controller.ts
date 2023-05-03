// 會員相關

import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { User } from '../models/User.model'
import { errorHandler } from '../services/errorHandler'

export const UserController = {
  async get(req: Request, res: Response) {
    // 取得會員資料
    try {
      const data = await User.find().catch(() => { throw '會員不存在' })
      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  async update(req: Request, res: Response) { 
    // 修改會員資料
    try {
      // 不顯示出來的欄位
      const hideFields = {
        'id': 0,
        'password': 0,
        'createTime': 0,
        'updateTime': 0,
      };

      const payload = new User(req.body);

      // 驗證資料
      const validateError = payload.validateSync()
      if (validateError) throw validateError

      // 修改會員資料
      await User.updateOne({
        id: req.body.id,
      }, {
        data: req.body.data,
        account: null,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        image: req.body.image,
        isAllowedNotifications: req.body.isAllowedNotifications,
        isSubscribed: req.body.isSubscribed,
        customedUrl: req.body.customedUrl,
        gender: req.body.gender,
        birthday: req.body.birthday,
        address: req.body.address,
        website: req.body.website,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        youtube: req.body.youtube,
        updateTime: Date.now
      }).catch(() => { throw '會員不存在' })

      const result = await User.find({
        'id': req.body.id
      }, hideFields);

      successHandler(res, {
        "code": 200,
        "message": "Success",
        "data": result[0],
      });
    } catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  }
}