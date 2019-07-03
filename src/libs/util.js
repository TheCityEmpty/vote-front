import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import { forEach, hasOneOf } from '@/libs/tools'

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: config.cookieExpires || 1 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (item.meta && !item.meta.hideInMenu) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if (hasChild(item) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched) => {
  let res = routeMetched.map(item => {
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: item.meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{
    name: 'home',
    to: '/home'
  }, ...res]
}

export const showTitle = (item, vm) => vm.$config.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name)

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children)
      if (res.name) return res
    } else {
      if (item.name === 'home') homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {Boolean} status 状态 1 => locked  0 => unlocked
 * @description 这里只是为了演示，实际应该将锁定状态的设置和获取用接口来实现
 */
export const setLockStatus = (status) => {
  localStorage.isLocked = status
}
export const getLockStatus = () => {
  return parseInt(localStorage.isLocked)
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const getHasAccessRouteNames = (list) => {
    let res = []
    list.forEach(item => {
      if (item.children && item.children.length) {
        res = [].concat(res, getHasAccessRouteNames(item.children))
      } else {
        if (item.meta && item.meta.access) {
          if (hasAccess(access, item)) res.push(item.name)
        } else {
          res.push(item.name)
        }
      }
    })
    return res
  }
  const canTurnToNames = getHasAccessRouteNames(routes)
  return canTurnToNames.indexOf(name) > -1
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextName = (list, name) => {
  let res = ''
  if (list.length === 2) {
    res = 'home'
  } else {
    if (list.findIndex(item => item.name === name) === list.length - 1) res = list[list.length - 2].name
    else res = list[list.findIndex(item => item.name === name) + 1].name
  }
  return res
}

export const formatDate = (timestamp) => {
  const time = new Date(timestamp)
  const y = time.getFullYear()
  const m = time.getMonth() + 1
  const d = time.getDate()
  // const h = time.getHours()
  // const mm = time.getMinutes()
  // const s = time.getSeconds()
  // return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s)
  return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`
}
// 判断浏览器； 是否是手机端访问
export const browser = {
  versions: (function () {
    const u = navigator.userAgent
    // const app = navigator.appVersion
    return {
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile*/), // 是否为移动终端 || !!u.match(/AppleWebKit/)
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQ HD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') === -1 // 是否web应用程序，没有头部与底部
    }
  }())
}
/**
 * @description 通过ID 获取树形结构数据中的 某个值
 * @param {Array} data 树形结构数据
 * @param {String, Number} id 关键值
 * @param {String} compareVal 比较值键名
 * @param {String} returnVal 返回值键名
 */
export const getTree = (data, id, compareVal, returnVal) => {
  if (!data) return
  let str = ''
  data.forEach(el => {
    if (String(id) === String(el[compareVal])) {
      str = el[returnVal]
    } else if (JSON.stringify(el.children) !== '[]') {
      getTree(el.children, id)
    }
  })
  return str
}

/**
 * @description 通过关键值 code 查询数组中某个对象中的某个属性
 * @param {Array} data 数组数据
 * @param {String} code code关键值
 * @param {String} compareVal 比较值键名
 * @param {String} returnVal 返回值键名
 */
export const getCodeName = (data, code, compareVal, returnVal) => {
  let arr = Array.isArray(data) ? data : []
  if (arr.length === 0) return
  let str = ''
  arr.map(el => {
    if (String(code) === String(el[compareVal])) {
      str = el[returnVal]
    }
  })
  return str
}
/**
 * @desc 实现深拷贝 平常使用...扩展符只能深拷贝第一层，如果对象有第二层，那第二层还是引用类型
 */
export const deepClone = (obj) => {
  let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key])
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

/**
 * @desc 将一个对象里面的值按照属性名对号入座到另一个对象
 * @param { Object } oneObj 有值的对象
 * @param { Object } twoObj 无值的对象(将要将值注入进去的对象)
 */
export const oTo = (oneObj, twoObj) => {
  for (let key in twoObj) {
    twoObj[key] = oneObj[key]
  }
}

/**
 * @desc 通过传来的 1 ， 2， 3 返回填报工时处于哪个区间
 */
export const getQJ = (code, year, month) => {
  let myCode = Number(code)
  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let reStr = ''
  switch (myCode) {
    case 1:
      reStr = `${year}/${month}/1-${year}/${month}/15`
      break
    case 2:
      reStr = `${year}/${month}/16-${year}/${month}/${months[month - 1]}`
      break
    case 3:
      reStr = `${year}/${month}`
      break
  }
  return reStr
}

/**
 * @desc 针对姓名 truename
 */
export const setTrueNameRender = (h, truename, style, callback) => {
  let reg = /^[\u4E00-\u9FA5]$/
  let num = 0
  let num1 = 0
  for (let i = 0, len = truename.length; i < len; i++) {
    // 中英文字符不统一 ， 英文一位，中文两位
    num += reg.test(truename.charAt(i)) ? 2 : 1
    if (num < 9) { num1++ }
  }
  let newStr = num > 10 ? truename.slice(0, num1) + '...' : truename
  let spanName = h('span', {
    style: style,
    on: {
      click: () => {
        callback && callback()
      }
    }
  }, newStr || '--')
  let toolName = h('Tooltip', {
    attrs: {
      content: truename,
      theme: 'light',
      placement: 'top-end',
      maxWidth: '270',
      transfer: true
    }
  }, [spanName])
  return {
    spanName: spanName,
    toolName: toolName,
    isHidden: num > 10
  }
}

/**
 * @desc 节流函数
 */
export const $__THROTTLE = (func, wait) => {
  let last = 0
  return () => {
    let currentTime = +new Date()
    if (currentTime - last > wait) {
      func.apply(this, arguments)
      last = +new Date()
    }
  }
}

/**
 * @desc 防抖
 */
export const $__DEBOUNCE = (fn, wait) => {
  var timeout = null
  return function () {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}
/**
 * @desc 定义千分位金钱
 * @param {金钱} m
 */
export const filterAllMoeny = (m) => {
  let val = ''
  if (m === undefined || m === null || m === '') {
    return '--'
  } else {
    val = parseFloat(m).toFixed(2)
    let firstVal = String(val).split('.')[0]
    var reg = /\d{1,3}(?=(\d{3})+$)/g
    firstVal = (firstVal + '').replace(reg, '$&,')
    val = firstVal + '.' + String(val).split('.')[1]
    return val
  }
}
