
import { Request, Response, NextFunction } from 'express'
import { appError } from '../services/appError';
import { errorHandler } from '../services/errorHandler'
import { Register } from '../models/Register.model';
import { IRegister } from '../interfaces/Register.interface'
import { successHandler } from '../services/successHandler'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { generateSendJWT } from '../middlewares/auth'


export const RegisterController = {

    async create(req: Request, res: Response, next: NextFunction): Promise<void>{
        try{
            //檢查使用者body
            console.log(req.body)
            let { email, password, account, } =  new Register(req.body);
            // let confirmPassword = req.body.confirmPassword
            // 內容不可為空
            console.log(email, password,  account)
            if(!email||!password||!account){
                return next(appError(400,"請填寫必填欄位！",next));
            }
            // 密碼正確
            // if(password!==confirmPassword){
            //     return next(appError(400,"密碼不一致！",next));
            // }
            // 密碼 8 碼以上
            if(!validator.isLength(password,{min:8})){
                return next(appError(400,"密碼字數低於 8 碼",next));
            }
            // 是否為 Email
            if(!validator.isEmail(email)){
                return next(appError(400,"Email 格式不正確",next));
            }

            // bcrypt.hash加密密碼後，存進資料庫
            password = await bcrypt.hash(req.body.password,12);
            const newUser = await Register.create({ //建入資料庫
                email,
                password,
                account
            });
            console.log("newUser",newUser)
        
            //jwt加密TOKEN 給前端
            generateSendJWT(newUser,201,res);
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
