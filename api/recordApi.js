const recordModel = require("../models/recordModel");
const { validationResult } = require("express-validator")
const { CODE, MSG } = require('../utils/constant')

/* 添加一条记录数据 */
const saveRecord = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const { msg } = err.errors
    next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  } else {
    try {
      const data = req.body
      const userID = req.userID
      console.log('userid>>>', userID);
      console.log(data, "add:>>");
      await recordModel.create(data);
      return res.status(CODE.CODE_SUCCESS)
        .json({
          code: CODE.CODE_SUCCESS,
          message: MSG.ADD_SUCCESS,
        });
    } catch (err) {
      next(err)

    }
  }
};
/* 通过id删除一条数据 */
const deleteRecordById = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const { msg } = err.errors
    next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  } else {
    try {
      const { id } = req.body
      console.log(id, "find:>>");
      const data = await recordModel.findByIdAndUpdate(
        id,
        { isDeleted: 1 }
      )
      console.log(data);
      return res.status(CODE.CODE_SUCCESS)
        .json({
          code: CODE.CODE_SUCCESS,
          message: MSG.DEL_SUCCESS,
        });
    } catch (err) {
      next(err)

    }
  }
}
/* 通过id查找一条数据 */
const findRecordById = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const { msg } = err.errors
    next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  } else {
    try {
      const { id } = req.body
      console.log(id, "find:>>");
      const data = await recordModel.findOne({
        _id: id,
        isDeleted: { $eq: 0 }
      }).select('-isDeleted')
      console.log(data);
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
}
/* 查询时间范围数据 */
const getDateRangeRecord = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const { msg } = err.errors
    next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  } else {
    try {
      const { startTime, endTime } = req.body;
      const data = await recordModel
        .aggregate([
          {
            $match: {
              created_time: {
                $gte: new Date(startTime),
                $lte: new Date(new Date(endTime).setHours(23, 59, 59))
              },
              isDeleted: 0
            },
          },
          {
            $sort: {
              created_time: -1 // TODO排序失效 升序排序，-1 为降序排序
            }
          },
          {
            $project: {
              yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$created_time" } },
              result: { $toDouble: "$result" }, // 将 result 字段转换为浮点数类型
              label: 1,
              emoji: 1,
              IAEStatus: 1,
              remark: 1,
              type: 1
            }
          },
          {
            $group: {
              _id: "$yearMonthDay",
              id: { $first: "$_id" }, // 添加自定义的 id 字段
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
                  result: "$result",
                  IAEStatus: "$IAEStatus",
                  remark: "$remark",
                  type: "$type"
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              id: { $toDate: "$_id" },
              date: "$_id",
              income: { $toString: "$income" },
              expenditure: { $toString: "$expenditure" },
              detail: "$details",
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
}
// 获取时间范围内的收入支出总数
const getRangeTotal = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const { msg } = err.errors
    next({ // 错误统一传递到中间件处理
      code: CODE.CODE_ERROR,
      message: msg
    })
  } else {
    try {
      const { startTime, endTime } = req.body;
      const data = await recordModel
        .aggregate([
          {
            $match: {
              created_time: {
                $gte: new Date(startTime),
                $lte: new Date(new Date(endTime).setHours(23, 59, 59))
              },
              isDeleted: 0

            }
          },
          {
            $project: {
              result: { $toDouble: "$result" }, // 将 result 字段转换为浮点数类型
              IAEStatus: 1
            }
          },
          {
            $group: {
              _id: null,
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
              }
            }
          },
          {
            $project: {
              _id: 0,
              income: { $toString: "$income" },
              expenditure: { $toString: "$expenditure" }
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

}
module.exports = {
  saveRecord,
  deleteRecordById,
  findRecordById,
  getDateRangeRecord,
  getRangeTotal
};
