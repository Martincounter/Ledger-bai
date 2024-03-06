const { body } = require("express-validator");

const validatorSave = [
  body('result').notEmpty()
    .withMessage('记账数不能为空'),
  body('IAEStatus').notEmpty()
    .withMessage('记账情况不能为空'),
  body('label').notEmpty()
    .withMessage('label不能为空'),
  body('emojiId').notEmpty()
    .withMessage('emojiId不能为空'),
  body('type').notEmpty()
    .withMessage('记账类型不能为空')
]
const validatorDelById = [
  body('id').notEmpty()
    .withMessage('id不能为空')
]
const validatorFindById = [
  body('id').notEmpty()
    .withMessage('id不能为空')
]
const validatorGetTimeRange = [
  body('startTime').notEmpty()
    .withMessage('开始时间不能为空'),
  body('endTime').notEmpty()
    .withMessage('结束时间不能为空'),
]
const validatorUserCategory = [
  body('type').notEmpty()
    .withMessage('类型不能为空'),
]
const validatorSaveUserCategory = [
  body('type').notEmpty()
    .withMessage('类型不能为空'),
  body('emojiId').notEmpty()
    .withMessage('emojiId不能为空'),
  body('emoji').notEmpty()
    .withMessage('emoji不能为空'),
  body('label').notEmpty()
    .withMessage('label不能为空'),
  body('categoryType').notEmpty()
    .withMessage('categoryType不能为空'),
]
const validatorDeleteUserCategory = [
  body('type').notEmpty()
    .withMessage('类型不能为空'),
  body('id').notEmpty()
    .withMessage('id不能为空'),
]
module.exports = {
  validatorSave,
  validatorDelById,
  validatorFindById,
  validatorGetTimeRange,
  validatorUserCategory,
  validatorSaveUserCategory,
  validatorDeleteUserCategory
}