import { Response } from 'express'
import { ERROR, HEADERS } from '../const'

export interface IError {
  code?: number
  message: string
  fieldName?: string
  fieldValue?: string
  keyPattern?: string
  name?: string
  errors?: string
}

export const errorHandler = (res: Response, e: IError) => {
  const { fieldName, fieldValue } = e
  let { code, message } = e

  // key replace
  if (message) {
    if (message.includes('fieldName') && fieldName) message.replace('fileName', fieldName)
    if (message.includes('fieldValue') && fieldValue) message.replace('fileValue', fieldName)
  } else {
    message.replace(null, ERROR.GENERAL)
  }

  
  if (e.code === 11000) {
    // console.log(Object.keys(e.keyPattern)[0])
    let param = Object.keys(e.keyPattern)[0]
    switch(param){
      case "account":
        param = "帳號"
        break
      case "email":
        param = "信箱"
        break
    }
    message = `${param}已被使用`;
    if (e.code < 100 || e.code > 599) {
      code = 500;
    }
  }

  res.set(HEADERS).status(code || 400).send(
    JSON.stringify({
      status: 'Failed',
      message
    })
  ).end()

}
