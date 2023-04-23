
import { Request, Response, NextFunction } from 'express'
import { appError } from '../services/appError';
import { errorHandler } from '../services/errorHandler'
import { successHandler } from '../services/successHandler'
import { Register } from '../models/Register.model';
import { IRegister } from '../interfaces/Register.interface'
const validator = require('validator')
const bcrypt = require('bcryptjs')
const {generateSendJWT} = require('../services/auth')

export const UpdatePasswordController = {

    async patch(req: any, res: Response, next: NextFunction){
        try{
            let password  = req.body.password;
            let confirmPassword = req.body.confirmPassword

            if(password!==confirmPassword){
              return next(appError(400,"密碼不一致！",next));
            }
            
            let newPassword = await bcrypt.hash(password,12);
            
            const user = await Register.findByIdAndUpdate(req.user,{
              password:newPassword
            });
            console.log("user",user)
            generateSendJWT(user,200,res)

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
