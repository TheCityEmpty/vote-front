import http from '@/libs/axios'

// 查看文章列表
export const apiArtList = (params) => { return http.request({ url: '/getArticleList', params, method: 'get' }) }

// 查看文章大标签
export const getBigTips = (params) => { return http.request({ url: '/getBigTipList', params, method: 'get' }) }

// 添加评论
export const commented = (params) => { return http.request({ url: '/addComment', data: params, method: 'post' }) }

// 置顶文章或取消置顶
export const topControl = (params) => { return http.request({ url: '/isTopArt', data: params, method: 'post' }) }

// 发布文章（或将文章状态改为草稿）
export const releaseArticle = (params) => { return http.request({ url: '/releaseArticle', data: params, method: 'post' }) }

// 微信获取用户资料
export const getWeiXinUserInfo = (params) => { return http.request({ url: '/getMemberMsg', params, method: 'get' }) }

// 微信支付
export const weiXinPay = (params) => { return http.request({ url: '/weChatPay', data: params, method: 'post' }) }
