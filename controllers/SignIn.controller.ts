
import { Request, Response, NextFunction } from 'express'
import { appError } from '../services/appError';
import { errorHandler } from '../services/errorHandler'
import { Register } from '../models/Register.model';
import { IRegister } from '../interfaces/Register.interface'
import { successHandler } from '../services/successHandler'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { generateSendJWT } from '../middlewares/auth'

export const SignInController = {

    async signIn(req: Request, res: Response, next: NextFunction){
        try{
            //檢查使用者body
            console.log(req.body)
            const { account, password } =  new Register(req.body);

            if (!account || !password) {
              return next(appError( 400,'請填寫必填欄位',next));
            }
          
            // if (!validator.isEmail(email)) {
            //     appError(400, "email格式錯誤", next);
            // }


            // 找出資料庫Document
            const user = await Register.findOne({ account }).select('+password');
            console.log(user)
            if(!user){
                return next(appError(400,'帳號或密碼有誤，請重新輸入',next));
            }
            
            const auth = await bcrypt.compare(password, user.password);
            // bcrypt.compare比對驗證雙方密碼是否一致
            if(!auth){
              return next(appError(400,'您的密碼不正確',next));
            }


            
          
            // 產生JWT token回給前端
            generateSendJWT(user,200,res); 


        } catch(e) {
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
