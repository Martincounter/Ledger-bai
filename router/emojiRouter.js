const express = require('express');
const router = express.Router();
const API = require('../api/emojiApi')
const RULE = require('../rules/recordRule')

// 获取全部类别emoji
router.get('/getEmojiMap', API.getEmojiMap)
// 获取用户的支出或收入类别emoji
router.get('/getUserCategory', RULE.validatorUserCategory, API.getUserCategory)
// 保存新增的类别
router.post('/saveUserCategory', RULE.validatorSaveUserCategory, API.saveUserCategory)
// 删除用户类别
router.delete('/deleteUserCategory', RULE.validatorDeleteUserCategory, API.deleteUserCategory)
// 更新用户类别
router.put('/updateUserCategory', RULE.validatorSaveUserCategory, API.updateUserCategory)
module.exports = router