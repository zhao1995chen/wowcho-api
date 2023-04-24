import { Response } from 'express'
import { HEADERS } from '../const'

export const errorHandler = (res: Response, e?: any) => {
  console.log('errorHandler', e)

  let message = e?.message || e;
  if (e.code === 11000) {
    console.log(Object.keys(e.keyPattern))
    message = `${Object.keys(e.keyPattern)}已被使用`;
  } else {
    message = "欄位未填寫正確或無此 id";
  }
  
  res.writeHead(404, HEADERS)
  res.write(JSON.stringify({
    status: 'Failed',
    message: message
  }))
  res.end()
}
