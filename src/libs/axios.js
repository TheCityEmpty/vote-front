import axios from 'axios'
// import router from '@/router'
// import Cookies from 'js-cookie'

const envConfig = {
  production: '/app',
  development: '/app'
}

export const baseURL = envConfig[process.env.NODE_ENV || 'development']

export const http = axios.create({
  baseURL,
  timeout: 100000,
  headers: {
    common: {
      // 'X-Requested-With': 'XMLHttpRequest',
      // 'token': Cookies.get('token')
    },
    post: {
      // 'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
})

// 请求前的钩子函数
http.interceptors.request.use(function (config) {
  // config.headers.token = Cookies.get('token')
  return config
}, function (error) {
  return Promise.reject(error)
})

// 请求后的钩子函数
http.interceptors.response.use(function (res) {
  // if (res.data.code === 'E0001' || res.data.code === 'E0002') {
  //   window.location.href = '/opms/api/v1/sso/login'
  //   return null
  // }
  // if (res.data.code === 'E1001') {
  //   router.push({
  //     path: '/login'
  //   })
  //   Message.destroy()
  // }
  // if (res.data.code === 'E0003') {
  //   router.push({
  //     path: '/403'
  //   })
  // }
  // if (res.data.alertFlag === true && res.data.success === false) {
  //   Message.error('服务器繁忙,请稍候再试验')
  // }
  // if (res.data.success === false) {
  //   res.data.errorMessages.length && res.data.errorMessages.forEach((el) => {
  //     if (el.code === 'E0003') {
  //       Message.error({
  //         content: el,
  //         duration: 5
  //       })
  //     } else {
  //       Message.error(el)
  //     }
  //   })
  //   return Promise.reject(res)
  // } else {
  //   return Promise.resolve(res)
  // }
  return Promise.resolve(res.data)
}, function (error) {
  // Message.destroy()
  // Message.error('服务内部错误!')
  return Promise.reject(error)
})
export default http
