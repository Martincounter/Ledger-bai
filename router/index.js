const express = require('express');
const router = express.Router();
const { jwtAuth } = require('../utils/userjwt') // 引入jwt认证函数
const recordRouter = require('./recordRouter')
const userRouter = require('./userRouter')
const emojiRouter = require('./emojiRouter')
const apiUtils = require('../utils/apiUtils')
const { CODE_TOKEN_EXPIRED, CODE, MSG } = require('../utils/constant')
router.use(apiUtils.limiter) // 注入节流模块
router.use(jwtAuth) // 注入认证模块
router.use(apiUtils.extractUserId)
router.use(process.env.BASE_API, recordRouter) // 注入记录路由模块
router.use(process.env.BASE_API, userRouter) // 注入用户路由模块
router.use(process.env.BASE_API, emojiRouter) // 注入emoji路由模块
// 自定义统一异常处理中间件，需要放在代码最后
router.use((err, req, res, next) => {
  console.log("err=>>", err);
  if (err && err.name === 'UnauthorizedError') {
    const { status = CODE_TOKEN_EXPIRED } = err;
    // 抛出401异常
    return res.status(status).json({
      code: status,
      message: 'token失效，请重新登录',
    })
  }
  const { code, message } = err || {};
  //统一处理错误状态码状态信息
  res.status(code || CODE.CODE_ERROR).json({
    code: code || CODE.CODE_ERROR,
    message: message || MSG.UNKNOWN_ERROR
  })
})

module.exports = router