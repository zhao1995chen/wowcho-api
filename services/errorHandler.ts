import { Response } from 'express'
import { HEADERS } from '../const'
import { Error as MongooseError } from 'mongoose';

export const errorHandler = (res: Response, e?: any) => {
  console.log('errorHandler', e)
  console.log('errorHandler name', e.name)

  let messages = e?.message || e;
  if (e.code === 11000) {
    console.log(Object.keys(e.keyPattern))
    messages = `${Object.keys(e.keyPattern)}已被使用`;
  } else if (e.name === "ValidationError"){
    messages = Object.values(e.errors).map(
      (err: MongooseError.ValidatorError) => err.message //陣列
    );
  }
  
  res.writeHead(404, HEADERS)
  res.write(JSON.stringify({
    status: 'Failed',
    message: messages
  }))
  res.end()
}
