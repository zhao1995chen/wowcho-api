
import { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../services/errorHandler'
// import { IRegister } from '../interfaces/Register.interface'
import { ERROR } from '../const'
import { successHandler } from '../services/successHandler'
import validator from 'validator'
import bcrypt from 'bcryptjs'
// import { generateSendJWT } from '../middlewares/Auth.middleware'

import { User } from '../models/User.model'
export const UpdatePasswordController = {

  async edit(req: Request, res: Response) {
    try {
      const oldPassword  = req.body.oldPassword
      const newPassword = req.body.newPassword
      if (!oldPassword || !newPassword) {
        throw { message: ERROR.GENERAL }
      }
      // 密碼 8 碼以上
      if(!validator.isLength(newPassword, {min:8})){
        throw { message: '密碼字數低於 8 碼' }
      }
      if(oldPassword === newPassword){
        throw { message: '新密碼不能與前次密碼相同' }
      }
      const account = req.body._id
      const user = await User.findById(account )
      const auth = await bcrypt.compare(oldPassword, user.password)
      if(!auth){
        throw { message: '您的舊密碼不正確' }
      }
      const hashNewPassword = await bcrypt.hash(newPassword,12)
      user.password = hashNewPassword
      await user.save()
      successHandler(res)
    } catch (e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  },
}
