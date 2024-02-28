const mongoose = require('mongoose');
const DB_NAME = "bookKeeping";
const DB_PORT = "27017";
const DB_HOST = "127.0.0.1";
const DB_USER = "martin";
const DB_PASSWORD = "root4163";
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
