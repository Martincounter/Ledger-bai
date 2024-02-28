const express = require('express');
const router = express.Router();
const API = require('../api/recordApi')
const RULE = require('../rules/recordRule')

// 保存单条记账记录
router.post('/saveBookKingInfo', RULE.validatorSave, API.saveRecord)

// 删除单条记账记录
router.delete('/deleteRecordById', RULE.validatorDelById, API.deleteRecordById)

// 获取单条记账记录
router.get('/findRecordById', RULE.validatorFindById, API.findRecordById)

// 获取时间范围内的数据
router.get('/getTimeRange', RULE.validatorGetTimeRange, API.getDateRangeRecord)

// 获取时间范围内的收入支持总数
// TODO 未来要将这个接口要跟上面的接口整合
router.get('/getTimeRangeTotal', RULE.validatorGetTimeRange, API.getRangeTotal)

module.exports = router;