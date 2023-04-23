// 會員相關
import { Schema, model } from 'mongoose'
import { IRegister } from '../interfaces/Register.interface'

const RegisterSchema = new Schema<IRegister>(
  {
    name: {
        type: String,
        required: [true, '請輸入您的名字']
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
      createdAt: {
        type: Date,
        default: Date.now,
        select: false
      }
    
  },
  {
    versionKey: false
  }
)

const Register = model<IRegister>('Register', RegisterSchema)

export {
  Register,
  RegisterSchema
}