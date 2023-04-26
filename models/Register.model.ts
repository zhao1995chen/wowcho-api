// 會員相關
import { Schema, model } from 'mongoose'
import { IRegister } from '../interfaces/Register.interface'
import { User } from '../models/User.model';

const RegisterSchema = new Schema<IRegister>(
  {
    // username: {
    //   type: String,
    //   required: [true, '請輸入您的名字']
    // },
    account: {
      type: String,
      required: [true, '帳號必填'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true, 
      lowercase: true,
      select: false
    },
    password:{
      type: String,
      required: [true,'請輸入密碼'],
      minlength: 8,
      select: false
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    //   select: false
    // }
  },
  {
    versionKey: false
  }
)

// const Register = model<IRegister>('Register', RegisterSchema)
const Register = User.discriminator<IRegister>('Register', RegisterSchema)


export {
  Register,
  RegisterSchema
}