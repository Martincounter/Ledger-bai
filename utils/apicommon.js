const { CODE } = require('./constant')
const UserModel = require("../models/userModel")

const extractUserId = async (req, res, next) => {
  const userID = req.headers.userid
  if (!userID) {
    return res.status(CODE.CODE_ERROR)
      .json({
        code: CODE.CODE_ERROR,
        message: 'Missing userId in request header'
      });
  }
  try {
    const user = await UserModel.findById(userID)
    if (!user) {
      return res.status(CODE.CODE_ERROR)
        .json({
          code: CODE.CODE_ERROR,
          message: 'User not found'
        });
    }
  } catch (err) {
    const { message } = err
    return res.status(CODE.CODE_ERROR)
      .json({
        code: CODE.CODE_ERROR,
        message: message
      });
  }
  req.userID = userID
  next()
}

module.exports = extractUserId