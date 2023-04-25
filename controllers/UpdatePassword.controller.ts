
import { Request, Response, NextFunction } from 'express'
import { appError } from '../services/appError';
import { errorHandler } from '../services/errorHandler'
import { Register } from '../models/Register.model';
import { IRegister } from '../interfaces/Register.interface'
import { successHandler } from '../services/successHandler'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { generateSendJWT } from '../middlewares/auth'

export const UpdatePasswordController = {

    async patch(req: any, res: Response, next: NextFunction){
        try{
            let oldPassword  = req.body.oldPassword;
            let newPassword = req.body.newPassword;

            if (!oldPassword || !newPassword) {
                return next(appError( 400,'請填寫必填欄位',next));
              }

            // 密碼 8 碼以上
            if(!validator.isLength(newPassword,{min:8})){
                return next(appError(400,"密碼字數低於 8 碼",next));
            }

            const account = req.user.account
            console.log('req.user',account)
            const user = await Register.findOne({ account }).select('+password');
            console.log(user)
            const auth = await bcrypt.compare(oldPassword, user.password);
            if(!auth){
              return next(appError(400,'您的舊密碼不正確',next));
            }

            if(oldPassword === newPassword){
                return next(appError(400,"新密碼不能與前次密碼相同",next));            
            }

            let hashNewPassword = await bcrypt.hash(newPassword,12);
            
            const setUser = await Register.findByIdAndUpdate(req.user,{
              password: hashNewPassword
            });
            console.log("setUser",setUser)
            generateSendJWT(setUser,200,res)

        } catch(e) {
            console.log(res)
            errorHandler(res, e)
        }
    },
    // options(req: Request, res: Response) {
    //     successHandler(res)
    // },
    // async duplicate(value: IRegister) {
    //     console.log(value)
    //     const { email } = value
    //     if (await Register.exists({ email })) return '信箱已使用'
    //     return
    // }
}
