const express = require('express');
const router = express.Router();
const API = require('../api/userApi')
const RULE = require('../rules/userRule')
// 用户注册
router.post('/register', RULE.validatorUser, API.userRegister)
// 用户登录
router.get('/login', RULE.validatorUser, API.userLogin)
module.exports = router