import http from '@/libs/axios'

// 微信获取用户资料
export const getWeiXinUserInfo = (params) => { return http.request({ url: '/getMemberMsg', params, method: 'get' }) }

// 微信支付
export const weiXinPay = (params) => { return http.request({ url: '/weChatPay', data: params, method: 'post' }) }

// 查询活动
export const queryActivity = (params) => { return http.request({ url: '/queryActivity', params, method: 'get' }) }

// 查询活动2
export const selectActivityCase = (params) => {
  return http.request({ url: '/selectActivityCase', data: params, method: 'post' })
}

// 查询报名人
export const selectSignUpUserCase = (params) => {
  return http.request({ url: '/querySignUpUserList', params, method: 'get' })
}

// 报名人条件搜索
export const querySelecct = (params) => {
  return http.request({ url: '/selectSignUpUserCase', data: params, method: 'post' })
}

// 报名
export const createSignUpUser = (params) => {
  return http.request({ url: '/createSignUpUser', data: params, method: 'post' })
}

// 查询报名人
export const querySignUpUser = (params) => {
  return http.request({ url: '/querySignUpUser', params, method: 'get' })
}

// 报名
export const vote = (params) => {
  return http.request({ url: '/vote', data: params, method: 'post' })
}

// 查询用户信息
export const queryMemberMsg = (params) => {
  return http.request({ url: '/queryMemberMsg', params, method: 'get' })
}

// 按姓名和编号查询报名人
export const selectSignUpUserCaseForH5 = (params) => {
  return http.request({ url: '/selectSignUpUserCaseForH5', data: params, method: 'post' })
}

// 获取 分享 参数
export const getJsApiMsg = (params) => {
  return http.request({ url: '/getJsApiMsg', params, method: 'get' })
}
