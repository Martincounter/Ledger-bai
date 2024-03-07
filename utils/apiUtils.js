const { CODE } = require('./constant')
const UserModel = require("../models/userModel")
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit')
const whitelist = [
  `${process.env.BASE_API}/register`,
  `${process.env.BASE_API}/login`
]
const utils = require('./index')

const extractUserId = async (req, res, next) => {
  const token = utils.getTokenFromHeader(req)
  // 获取当前请求的路由路径
  const path = req.originalUrl;
  if (!whitelist.includes(path)) {
    let userId = ''
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err.message);
        return res.status(CODE.CODE_ERROR)
          .json({
            code: CODE.CODE_ERROR,
            message: 'token解析错误'
          });
      }
      userId = decoded._id; // 假设用户 ID 存在于 token 中
      console.log('User ID:', userId);
    });
    try {
      const user = await UserModel.findOne({
        _id: userId,
        isDeactivate: { $eq: 0 }
      })
      if (!user) return res.status(CODE.CODE_ERROR)
        .json({
          code: CODE.CODE_ERROR,
          message: '用户不存在'
        })
    } catch (error) {
      next(error)
      return
    }
    req.body.userId = userId
  }
  next()
}
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 1000, // 限制每个IP 15分钟内最多1000次请求
  handler: (req, res) => {
    res.status(429).json({
      code: 429,
      message: 'Custom error message: Too many requests, please try again later.'
    });
  }
});

module.exports = { extractUserId, limiter }