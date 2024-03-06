const recordModel = require("../models/recordModel");
const { validationResult } = require("express-validator")
const { CODE, MSG } = require('../utils/constant')

/**
 * 添加一条记录数据
 * @param { Number } result 记账数目
 * @param { String } remark 备注
 * @param { Boolean } IAEStatus 收支情况 true为收入 false为支出
 * @param { String } label 类别名称
 * @param { String } emoji 类别Emoji
 * @param { String } emojiId 类别EmojiID
 * @param { Number } type 类别
 *    0: '零食',
      1: '饮料',
      2: '食材',
      3: '水果',
      4: '交通',
      5: '服饰',
      6: '食物',
      7: '活动和娱乐',
      8: '旅行',
      9: '办公和工具',
      10: '乐器',
      11: '数码',
      12: '动物',
      13: '自然',
      14: '收入',
      15: '医疗',
      16: '住房',
 */
const saveRecord = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  }
  try {
    const data = req.body
    console.log(data, "add:>>");
    await recordModel.create(data);
    if (!data) {
      return res.status(CODE.CODE_ERROR)
        .json({
          code: CODE.CODE_ERROR,
          message: MSG.ADD_ERROR,
        });
    }
    return res.status(CODE.CODE_SUCCESS)
      .json({
        code: CODE.CODE_SUCCESS,
        message: MSG.ADD_SUCCESS,
      });
  } catch (err) {
    next(err)
  }
};
/**
 * 通过id删除一条数据
 * @param { String } id 记录id
 */
const deleteRecordById = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  }
  try {
    const { id, userId } = req.body
    console.log(id, "delete:>>");
    const data = await recordModel.findOneAndUpdate(
      { _id: id, userId },
      { isDeleted: 1 },
      { returnOriginal: false }
    )
    console.log(data);
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
 * 通过id更新数据
 * @param { String } _id 记录ID
 * @param { Number } result 记账数目
 * @param { String } remark 备注
 * @param { Boolean } IAEStatus 收支情况 true为收入 false为支出
 * @param { String } label 类别名称
 * @param { String } emoji 类别Emoji
 * @param { String } emojiId 类别EmojiID
 * @param { Number } type 类别
 */
const updateRecord = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  }
  try {
    const { _id, userId, } = req.body
    const data = await recordModel.findOneAndUpdate(
      { _id, userId },
      { $set: { ...req.body, update_time: new Date() } }
    )
    console.log(data);
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
 * 通过id查找一条数据
 * @param { String } id 记录id
 */
const findRecordById = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  }
  try {
    const { id, userId } = req.body
    console.log(id, "find:>>");
    const data = await recordModel.findOne({
      userId,
      _id: id,
      isDeleted: { $eq: 0 }
    }).select({ '-isDeleted': 0, 'userId': 0 })
    console.log(data);
    return res.status(CODE.CODE_SUCCESS)
      .json({
        code: CODE.CODE_SUCCESS,
        message: MSG.FIND_SUCCESS,
        data: data || {}
      });
  } catch (err) {
    next(err)
  }
}
/**
 * 查询时间范围数据
 * @param { String } startTime 开始时间
 * @param { String } endTime 结束时间
 */
const getDateRangeRecord = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors
    return next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  }
  try {
    const { userId, startTime, endTime } = req.body;
    const data = await recordModel
      .aggregate([
        {
          $match: {
            created_time: {
              $gte: new Date(startTime),
              $lte: new Date(new Date(endTime).setHours(23, 59, 59))
            },
            userId,
            isDeleted: 0
          },
        },
        {
          $project: {
            yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$created_time" } },
            result: { $toDouble: "$result" }, // 将 result 字段转换为浮点数类型
            label: 1,
            emoji: 1,
            emojiId: 1,
            IAEStatus: 1,
            remark: 1,
            type: 1
          }
        },
        {
          $group: {
            _id: "$yearMonthDay",
            income: {
              $sum: {
                $cond: [
                  { $eq: ["$IAEStatus", true] },
                  "$result",
                  0
                ]
              }
            },
            expenditure: {
              $sum: {
                $cond: [
                  { $eq: ["$IAEStatus", false] },
                  "$result",
                  0
                ]
              }
            },
            details: {
              $push: {
                id: "$_id",
                label: "$label",
                emoji: "$emoji",
                emojiId: "$emojiId",
                result: "$result",
                IAEStatus: "$IAEStatus",
                remark: "$remark",
                type: "$type"
              }
            }
          }
        },
        {
          $sort: {
            "_id": -1 // 升序排序，-1 为降序排序
          }
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$income" },
            totalExpenditure: { $sum: "$expenditure" },
            dailyData: { $push: "$$ROOT" } // 将每天的收支数据作为一个文档推送到数组中
          }
        },
        {
          $project: {
            _id: 0,
            totalIncome: 1,
            totalExpenditure: 1,
            dailyData: {
              $map: { // 使用$map 来转换每天的数据结构
                input: "$dailyData",
                as: "day",
                in: {
                  id: { $toString: { $floor: { $multiply: [{ $rand: {} }, 100000] } } },
                  date: "$$day._id",
                  income: "$$day.income",
                  expenditure: "$$day.expenditure",
                  detail: "$$day.details"
                }
              }
            }
          }
        }
      ]);
    return res.status(CODE.CODE_SUCCESS)
      .json({
        code: CODE.CODE_SUCCESS,
        message: MSG.FIND_SUCCESS,
        data: data
      });
  } catch (err) {
    next(err)
  }
}

module.exports = {
  saveRecord,
  deleteRecordById,
  updateRecord,
  findRecordById,
  getDateRangeRecord,
};
