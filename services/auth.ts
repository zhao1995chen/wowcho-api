import { runInNewContext } from "vm";

const jwt = require('jsonwebtoken');
const appError = require('../services/appError'); 
const handleErrorAsync = require('../services/handleErrorAsync');
const express = require('express');
const Register = require('../models/Register.model');

// 驗證是否登入狀態 , jwt驗證 token 正確性
const isAuth = handleErrorAsync(async (req, res, next) => {
    // 確認 token 是否存在
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      //取資料庫物件由JWT‘加密’建的 token
      token = req.headers.authorization.split(' ')[1]; 
    }
  
    if (!token) {
      return next(appError(401,'你尚未登入！',next));
    }
  
    // 解密：jwt驗證 token 正確性
    const decoded = await new Promise((resolve,reject)=>{ //非同步
      jwt.verify(token, process.env.JWT_SECRET, (err,payload)=>{
        if(err){
          reject(err)
        }else{
          resolve(payload)
        }
      })
    })
    console.log('decoded',decoded) //解密的payload
    
    const currentUser = await Register.findById((decoded as { id: string }).id);
    console.log(currentUser)

    req.user = currentUser;
    next();
  });

// 存入資料庫的物件 產JWT通行證TOKEN
const generateSendJWT= (user,statusCode,res)=>{
  // 產生 JWT token
  const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_DAY
  });

  console.log("generateSendJWT", token) //產生JWT臨時通行證

  // 組給前端的response訊息
  user.password = undefined;
  res.status(statusCode).json({ //statusCode:201成功
    status: 'success',
    user:{
      token,
      name: user.name
    }
  });
}

module.exports = {
    isAuth,
    generateSendJWT
}