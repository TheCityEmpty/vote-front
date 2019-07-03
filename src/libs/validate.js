import context from '../main.js'
/* 自定义人数校验 */
export const validatePeopleNum = (rule, value, callback) => {
  let numReg = /^[1-9][0-9]{0,4}$/
  if (String(value) === '0') {
    callback(new Error('人数不能为空！')) // 人数不能为空！
  } else if (value === '') {
    callback(new Error('人数不能为空！'))
  } else if (!numReg.test(value)) {
    callback(new Error('人数输入格式不正确！'))
  } else {
    callback()
  }
}
/* 自定义联系方式校验 */
export const validateTel = (rule, value, callback) => {
  let telReg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (value === '') {
    callback(new Error(context.$t('code.OPMS_TRANSLATE_CODE_265'))) // 联系方式不能为空！
  } else if (!telReg.test(value)) {
    callback(new Error(context.$t('code.OPMS_TRANSLATE_CODE_263'))) // 联系方式格式不正确！
  } else {
    callback()
  }
}
/* 自定义姓名校验 */
export const validateName = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(context.$t('code.OPMS_TRANSLATE_CODE_102'))) // 姓名不能为空！
  } else if (value.length > 100) {
    callback(new Error('姓名长度不能超过100位！')) // 姓名长度不能超过100位！
  } else {
    callback()
  }
}
// 校验邮箱
export const validateEmail = (rule, value, callback) => {
  if (String(value).trim() === '') {
    callback(new Error('邮箱不能为空！'))
  } else {
    callback()
  }
}
// 校验证件号
export const validateCard = (rule, value, callback) => {
  let cardReg = /^([a-zA-Z]|[0-9])*$/
  if (!value) {
    callback()
  } else if (!cardReg.test(value)) {
    callback(new Error('证件号只能输入英文和数字！'))
  } else if (value.length > 30) {
    callback(new Error('证件号长度不能超过30位！'))
  } else {
    callback()
  }
}
// 校验人员价格
export const validateUPrice = (rule, value, callback) => {
  let UPrice = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  if (String(value).trim() === '') {
    callback(new Error('请完善信息！'))
  } else if (value === '0') {
    callback()
  } else if (!UPrice.test(value)) {
    callback(new Error('格式错误，例如：0.00！'))
  } else if (String(value).split('.')[0].length > 8) {
    callback(new Error('人员单价整数长度不能超过8位！'))
  } else {
    callback()
  }
}
// 校验审核意见字数
export const validateContent = (rule, value, callback) => {
  if (value.length > 100) {
    callback(new Error('审核意见字数超过100字！'))
  } else {
    callback()
  }
}
// 对接人姓名校验
export const validateJointName = (rule, value, callback) => {
  let nameReg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]|[0-9])*$/
  if (String(value).trim() === '') {
    callback(new Error(context.$t('code.OPMS_TRANSLATE_CODE_245'))) // 面试对接人不能为空！
  } else if (!nameReg.test(value)) {
    callback(new Error('面试对接人只能输入中英文和数字！'))
  } else if (value.length > 10) {
    callback(new Error('面试对接人长度不能超过10位！'))
  } else {
    callback()
  }
}
// 校验日期
export const validateWorkDate = (rule, value, callback) => {
  value = this.changeTime(value, '/')
  if (value === '') {
    callback(new Error('参加工作时间不能为空！'))
  } else {
    callback()
  }
}
// 校验字数
export const validateLength = (rule, value, callback) => {
  if (value.length > 100) {
    callback(new Error('字数超过100'))
  } else {
    callback()
  }
}
