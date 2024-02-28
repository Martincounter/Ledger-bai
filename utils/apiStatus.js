const { CODE, MSG } = require('./constant')
const API_STATUS = (data, type) => {
  const res = {
    code: '',
    message: '',
    data: data?.data || null
  }
  switch (type) {
    case 'ADD_SUCCESS' || 'DEL_SUCCESS' || 'EDIT_SUCCESS' || 'FIND_SUCCESS':
      res.code = data.code || CODE.CODE_SUCCESS,
        res.message = data.message || MSG.ADD_SUCCESS
      break;
    case 'ADD_ERROR' || 'DEL_ERROR' || 'EDIT_ERROR' || 'FIND_ERROR':
      res.code = data.code || CODE.CODE_ERROR,
        res.message = data.message || MSG[type]
      break;
    default:
      res.code = data.code || CODE.CODE_UNKNOWN,
        res.message = data.message || MSG.UNKNOWN_ERROR
  }
  return res
}
module.exports = {
  API_STATUS
}