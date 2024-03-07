const model = require("../models/emojiModel")
const { validationResult } = require("express-validator")
const { CODE, MSG } = require('../utils/constant')
/**
 * 获取全部类别emoji
 * @param 无
 *  */
const getEmojiMap = async (req, res, next) => {
  try {
    const data = await model.emojiMapModel.find({
      isDeleted: { $eq: 0 }
    }).select({ '-isDeleted': 0 })
    return res.status(CODE.CODE_SUCCESS)
      .json({
        code: CODE.CODE_SUCCESS,
        message: MSG.FIND_SUCCESS,
        data
      });
  } catch (err) {
    next(err)
  }
}
/**
 * 用户添加新的类别
 * @param { Number } categoryType 区分添加的类别 0支出 1收入
 * @param { String } label 类别名称
 * @param { String } emoji 类别Emoji
 * @param { String } emojiId 类别EmojiID
 * @param { Number } type 类别
 */
const saveUserCategory = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  }
  try {
    const { categoryType, userId } = req.body
    const params = req.body
    const collectionModel = categoryType ? model.userIncomeEmojiMapModel : model.userExpendEmojiMapModel;
    await collectionModel.findOneAndUpdate(
      { userId },
      { $push: { emojis: params } }
    );
    return res.status(CODE.CODE_SUCCESS)
      .json({
        code: CODE.CODE_SUCCESS,
        message: MSG.ADD_SUCCESS
      });
  } catch (err) {
    next(err)
  }
}
/**
 * 用户删除类别
 * @param { String } id 类别的id
 * @param { Number } type 区分获取的emoji 0支出 1收入
 *
 */
const deleteUserCategory = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  }
  try {
    const { type, userId, id } = req.body
    const collectionModel = type ? model.userIncomeEmojiMapModel : model.userExpendEmojiMapModel;
    const data = await collectionModel.findOneAndUpdate(
      { userId: userId, "emojis._id": id },
      { $set: { "emojis.$.isDeleted": 1 } },
      { returnOriginal: false })
    if (!data) {
      return res.status(CODE.CODE_ERROR)
        .json({
          code: CODE.CODE_ERROR,
          message: `未找到id为${id}的数据`,
        });
    }
    return res.status(CODE.CODE_SUCCESS)
      .json({
        code: CODE.CODE_SUCCESS,
        message: MSG.DEL_SUCCESS,
      });
  } catch (err) {
    next(err)
  }
}

/**
 * 用户更新类别
 * @param { Number } categoryType 区分添加的类别 0支出 1收入
 * @param { String } label 类别名称
 * @param { String } emoji 类别Emoji
 * @param { String } emojiId 类别EmojiID
 * @param { Number } type 类别
 */
const updateUserCategory = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  }
  try {
    const { categoryType, userId, _id, emoji, emojiId, type, label } = req.body
    const collectionModel = categoryType ? model.userIncomeEmojiMapModel : model.userExpendEmojiMapModel;
    const params = {
      "emojis.$.emoji": emoji,
      "emojis.$.emojiId": emojiId,
      "emojis.$.type": type,
      "emojis.$.label": label
    }
    const data = await collectionModel.findOneAndUpdate(
      { userId: userId, "emojis._id": _id },
      { $set: params },
      { returnOriginal: false })
    if (!data) {
      return res.status(CODE.CODE_ERROR)
        .json({
          code: CODE.CODE_ERROR,
          message: `未找到id为${id}的数据`,
        });
    }
    return res.status(CODE.CODE_SUCCESS)
      .json({
        code: CODE.CODE_SUCCESS,
        message: MSG.EDIT_SUCCESS,
      });
  } catch (err) {
    next(err)
  }
}

/**
 * 获取用户的支出或收入类别emoji
 * @param { Number } type 区分获取的emoji 0支出 1收入
 * */
const getUserCategory = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  }
  try {
    const { type, userId } = req.body
    const collectionModel = type ? model.userIncomeEmojiMapModel : model.userExpendEmojiMapModel;
    const data = await collectionModel.aggregate([
      { $match: { userId: userId } }, // 匹配用户ID
      {
        $project: { // 投影操作，用于选择和过滤字段
          emojis: { // 选择emojis数组
            $map: { // 使用$map数组映射器
              input: {
                $filter: { // 内部使用$filter数组过滤器
                  input: "$emojis", // 输入数组是emojis
                  as: "emoji", // 别名每个元素为emoji
                  cond: { $eq: ["$$emoji.isDeleted", 0] } // 条件是isDeleted等于0
                }
              },
              as: "emoji", // 别名映射后的元素为emoji
              in: { // 对于每个元素，创建一个新对象，排除isDeleted字段
                emoji: "$$emoji.emoji",
                emojiId: "$$emoji.emojiId",
                type: "$$emoji.type",
                label: "$$emoji.label",
                _id: "$$emoji._id"
              }
            }
          }
        }
      }
    ])
    console.log(data);
    return res.status(CODE.CODE_SUCCESS)
      .json({
        code: CODE.CODE_SUCCESS,
        message: MSG.FIND_SUCCESS,
        data: data[0].emojis
      });
  } catch (err) {
    next(err)
  }
}
module.exports = {
  getEmojiMap,
  getUserCategory,
  saveUserCategory,
  deleteUserCategory,
  updateUserCategory
}