require('dotenv').config();
const express = require('express');
const router = express.Router();
const { jwtAuth } = require('../utils/userjwt'); // 引入jwt认证函数
const recordRouter = require('./recordRouter')
const userRouter = require('./userRouter')
const { CODE_TOKEN_EXPIRED, CODE, MSG } = require('../utils/constant')
router.use(jwtAuth) // 注入认证模块
router.use('/api', recordRouter) // 注入记录路由模块
router.use('/api', userRouter) // 注入用户路由模块
// 自定义统一异常处理中间件，需要放在代码最后
const whitelist = [
  `${process.env.BASE_API}/register`,
  '/login'
]
router.use((err, req, res, next) => {
  console.log("err=>>", err);
  const userID = req.headers.userid
  // 获取当前请求的路由路径
  const path = req.originalUrl;
  if (!whitelist.includes(path)) {
    if (!userID) {
      return res.status(CODE.CODE_ERROR)
        .json({
          code: CODE.CODE_ERROR,
          message: 'Missing userId in request header'
        });
    }
  }
  if (err && err.name === 'UnauthorizedError') {
    const { status = CODE_TOKEN_EXPIRED } = err;
    // 抛出401异常
    return res.status(status).json({
      code: status,
      message: 'token失效，请重新登录',
    })
  }
  const { code, message } = err || {};
  // 错误码和错误信息
  res.status(code || CODE.CODE_ERROR).json({
    code: code || CODE.CODE_ERROR,
    message: message || MSG.UNKNOWN_ERROR
  })

})
module.exports = router