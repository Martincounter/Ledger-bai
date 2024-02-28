const express = require('express');
const router = express.Router();
const API = require('../api/userApi')
const RULE = require('../rules/userRule')
// 登录/注册校验


router.post('/register', RULE.validatorUser, API.userRegister)
router.get('/login', RULE.validatorUser, API.userLogin)
module.exports = router