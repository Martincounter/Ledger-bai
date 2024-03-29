const jwt = require('jsonwebtoken')
const { expressjwt } = require('express-jwt');
const utils = require('./index')

// 验证token是否过期
const jwtAuth = expressjwt({
  // 设置密钥
  secret: process.env.PRIVATE_KEY,
  // 设置为true表示校验，false表示不校验
  credentialsRequired: true,
  // 自定义获取token的函数
  getToken: utils.getTokenFromHeader,
  algorithms: ['HS256'] //指定要使用的算法
  // 设置jwt认证白名单，比如/api/login登录接口不需要拦截
}).unless({
  path: [
    '/',
    '/api/login',
    '/api/register',
    '/api/register1',
    '/api/resetPwd',
  ]
})

const decode = (req) => {
  const token = req.get('Authorization')
  console.log("token>", token);
  if (token) {
    return jwt.verify(token, PRIVATE_KEY, (err, payload) => {
      if (err) {
        // JWT 无效或已过期
        console.error('Token verification failed:', err);
      } else {
        // JWT 有效
        console.log('Payload:', payload);
      }
    });
  }
  return false
}
module.exports = {
  jwtAuth,
  decode
}