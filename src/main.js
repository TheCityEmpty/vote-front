import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import Vant from 'vant'
import 'vant/lib/index.css'

/**
 * @description 字体图标
 */
// import 'font-awesome/css/font-awesome.css'

/**
 * @description 引入自定义组件
 */
import Loading from '@_com/Loading'

/**
 * @description 引入 全局css  混入，config 等
 */
import '@/theme/index.scss'
import '@/assets/css/base.css'
import '@/mixins'
import config from '@/config'
import { http } from './libs/axios'

Vue.use(Vant)

Vue.use(Loading)
Vue.config.productionTip = false
Vue.prototype.$config = config
Vue.prototype.$http = http // 全局注册，使用方法为:this.$http

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

export default vm
