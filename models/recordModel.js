const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recordRule = new Schema({
  result: String, // 记账数量
  remark: String, // 备注
  IAEStatus: Boolean, //收支，true为收入 false为支出
  label: String, // 类别名称
  emoji: String, // 类别emoji
  type: Number, // 类别
  created_time: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Number,
    default: 0
  }
});
const recordModel = mongoose.model("record", recordRule);
// recordModel.collection.createIndex(
//   { created_time: 1 },
// );
module.exports = recordModel;
