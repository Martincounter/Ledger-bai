const mongoose = require('mongoose');
const userSchema = mongoose.Schema;
const userRule = new userSchema({
  name: String,
  password: String,
  email: String,
  phone: String,
  createTime: {
    type: Date,
    default: Date.now(),
  },
})
// userRule.pre('sava', async)
const UserModel = mongoose.model('user', userRule);
module.exports = UserModel;