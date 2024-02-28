const { body } = require("express-validator");
const phoneRegex = /^1[3-9]\d{9}$/;
const validatorUser = [
  body('phone').matches(phoneRegex)
    .withMessage("手机号码格式错误"),
  body('password').notEmpty()
    .withMessage('密码不能为空')
]

module.exports = {
  validatorUser
}