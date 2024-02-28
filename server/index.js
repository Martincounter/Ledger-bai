const express = require('express');
const cors = require('cors');
const app = express();
const db = require('../db/db')
const routes = require('../router/index')
// const extractUserId = require('../utils/apicommon')

app.use(express.json()); // 使用express.json()中间件解析JSON请求正文
app.use(cors()); // 启用CORS中间件 跨域问题
// app.use(extractUserId)
app.all('*', (req, res, next) => {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  // 允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type');
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  // 在请求的回调函数汇中遇见next()，就会继续执行后面的代码
  next()
})
app.use('/', routes)
const PORT = process.env.PORT || 3100;

app.listen(PORT, async () => {
  console.log("Example app listening on port 3100!")
  try {
    const dbConnect = await db();
    console.log(dbConnect);
    if (process.env.NODE_ENV === 'development') {
      console.log('开发环境');
    } else {
      console.log('生产环境');
    }
  } catch (error) {
    console.log(error);
  }

});