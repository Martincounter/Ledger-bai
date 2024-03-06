const mongoose = require('mongoose');
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const db = () => {
  return new Promise(async (resolve) => {
    try {
      const url = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
      const options = {
        connectTimeoutMS: 5000, // 设置连接超时时间为5秒
      };
      await mongoose.connect(url, options);
      console.log("数据库连接成功");
      resolve(true);
    } catch (err) {
      console.log("数据库连接失败", err);
      resolve(false);
    }
  });
};

module.exports = db;
