const express = require('express');
const router = express.Router();
const API = require('../api/recordApi')
const RULE = require('../rules/recordRule')

// 保存单条记账记录
router.post('/saveRecord', RULE.validatorSave, API.saveRecord)

// 删除单条记账记录
router.delete('/deleteRecordById', RULE.validatorDelById, API.deleteRecordById)

// 修改单条记账记录
router.put('/updateRecord', RULE.validatorSave, API.updateRecord)

// 获取单条记账记录
router.get('/findRecordById', RULE.validatorFindById, API.findRecordById)

// 获取时间范围内的数据
router.get('/getTimeRange', RULE.validatorGetTimeRange, API.getDateRangeRecord)

module.exports = router;