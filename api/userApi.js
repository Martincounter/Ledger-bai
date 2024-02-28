const UserModel = require("../models/userModel")
const { CODE, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')
const { validationResult } = require("express-validator")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
// const { decode } = require('../utils/userjwt'); // 引入jwt认证函数


const userRegister = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const { msg } = err.errors
    next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  } else {
    try {
      const { phone } = req.body
      const existingUser = await UserModel.findOne({ phone });
      if (existingUser) {
        return res.status(CODE.CODE_ERROR)
          .json({
            code: CODE.CODE_ERROR,
            message: '该手机号已被注册'
          })
      }
      await UserModel.create(req.body)
      return res.status(CODE.CODE_SUCCESS)
        .json({
          code: CODE.CODE_SUCCESS,
          message: '注册成功'
        });
    } catch (err) {
      console.log(err);
      next(err)
    }
  }
}
const userLogin = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const { msg } = err.errors
    next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg,
    })
  } else {
    try {
      const { phone, password } = req.body
      console.log(req.body);
      const user = await UserModel.findOne({ phone })
      if (!user) return res.json({
        code: CODE.CODE_ERROR,
        message: '用户不存在'
      })
      const isMatch = bcrypt.compare(password, user.password)
      if (!isMatch) return res.json({
        code: CODE.CODE_ERROR,
        message: '密码错误'
      })
      // 生成JWT令牌
      const token = jwt.sign({ _id: user.id },
        PRIVATE_KEY,//私钥
        { expiresIn: JWT_EXPIRED } //过期时间
      )
      const data = {
        token,
        userID: user.id
      }
      res.json({
        code: CODE.CODE_SUCCESS,
        message: '登录成功',
        data
      })
    } catch (err) {
      console.log(err);
      next(err)
    }
  }
}
module.exports = {
  userRegister,
  userLogin
}

