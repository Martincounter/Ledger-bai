const mongoose = require('mongoose')
const emojiSchema = mongoose.Schema
const emojiMapRule = new emojiSchema({
  emoji: String,
  emojiId: String,
  type: Number,
  label: String,
  isDeleted: {
    type: Number,
    default: 0
  }
})
const userEmojiMapRule = new emojiSchema({
  userId: String,
  emojis: [emojiMapRule]
})
const emojiMapModel = mongoose.model('emojiMap', emojiMapRule)
const userExpendEmojiMapModel = mongoose.model('userExpendEmojiMap', userEmojiMapRule)
const userIncomeEmojiMapModel = mongoose.model('userIncomeEmojiMap', userEmojiMapRule)
module.exports = { emojiMapModel, userExpendEmojiMapModel, userIncomeEmojiMapModel }