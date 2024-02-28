const CODE = {
  CODE_SUCCESS: 200,// 请求响应成功code码
  CODE_ERROR: 400, // 请求响应失败code码
  CODE_UNKNOWN: 999,// 请求响应未知code码
  CODE_TOKEN_EXPIRED: 401, // 授权失败
}
const MSG = {
  ADD_SUCCESS: '新增成功',
  DEL_SUCCESS: '删除成功',
  EDIT_SUCCESS: '编辑成功',
  FIND_SUCCESS: '查询成功',
  ADD_ERROR: '新增失败',
  DEL_ERROR: '删除失败',
  EDIT_ERROR: '编辑失败',
  FIND_ERROR: '查询失败',
  UNKNOWN_ERROR: '未知错误'
}
module.exports = {
  CODE,
  MSG,
  PRIVATE_KEY: 'martin', // 自定义jwt加密的私钥
  JWT_EXPIRED: 60 * 60 * 2, // 过期时间2小时
}