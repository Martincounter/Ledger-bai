const UserModel = require("../models/userModel")
const model = require("../models/emojiModel")
const { CODE, JWT_EXPIRED } = require('../utils/constant')
const { validationResult } = require("express-validator")
const defaultEmoji = require('../default/userDefaultEmojiMap')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

/**
 * 用户注册
 * @param { String } phone 用户电话
 * @param { String } password 用户密码
 */
const userRegister = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  }
  try {
    // TODO 密码加密解密问题
    const { phone } = req.body
    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      return res.status(CODE.CODE_ERROR)
        .json({
          code: CODE.CODE_ERROR,
          message: '该手机号已被注册'
        })
    }
    const user = await UserModel.create(req.body)
    // 初始化用户的初始emoji
    const { _id } = user
    const { defaultExpenditureEmojiMap, defaultIncomeEmojiMap } = defaultEmoji
    const paramsExpend = { userId: _id, emojis: defaultExpenditureEmojiMap } //支出
    const paramsIncome = { userId: _id, emojis: defaultIncomeEmojiMap } // 收入
    await model.userExpendEmojiMapModel.create(paramsExpend)
    await model.userIncomeEmojiMapModel.create(paramsIncome)
    // console.log(user);
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
/**
 * 用户登录
 * @param { String } phone 用户电话
 * @param { String } password 用户密码
 */
const userLogin = async (req, res, next) => {
  console.log(process.env.PRIVATE_KEY);
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg,
    })
  }
  try {
    const { phone, password } = req.body
    console.log(req.body);
    const user = await UserModel.findOne({ phone })
    if (!user) return res.status(CODE.CODE_ERROR)
      .json({
        code: CODE.CODE_ERROR,
        message: '用户不存在'
      })
    //TODO 密码比对有问题
    const isMatch = bcrypt.compare(password, user.password)
    bcrypt.compare(password, user.password).then(res => {
      console.log(res);
    })
    if (!isMatch) return res.status(CODE.CODE_ERROR)
      .json({
        code: CODE.CODE_ERROR,
        message: '密码错误'
      })
    // 生成JWT令牌
    const token = jwt.sign({ _id: user.id },
      process.env.PRIVATE_KEY,//私钥
      { expiresIn: JWT_EXPIRED } //过期时间
    )
    const data = {
      token,
      userID: user.id
    }
    res.status(CODE.CODE_ERROR)
      .json({
        code: CODE.CODE_SUCCESS,
        message: '登录成功',
        data
      })
  } catch (err) {
    console.log(err);
    next(err)
  }
}
module.exports = {
  userRegister,
  userLogin
}

