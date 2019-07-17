<template>
  <div class="model-home">
    <van-notice-bar :text="$store.state.activeInfo.notice" class="customBar" left-icon="volume-o" />
    <swiperBox :imgList="$store.state.activeInfo.adImg"></swiperBox>
    <router-view class="model-box" />

    <van-tabbar v-model="active">
      <van-tabbar-item
				v-for="(item, index) in footerList"
				:key="index"
				:icon="item.icon"
				replace
				:to="{ path: item.to ,query: { id: $route.query.id }}">{{ item.title }}</van-tabbar-item>
    </van-tabbar>
  </div>

</template>

<script>
import swiperBox from '@_com/swiperBox/swiperBox.vue'
import { getWeiXinUserInfo } from '@/api'
export default {
  name: 'model1',
  components: {
    swiperBox
  },

  data () {
    return {
      footerList: [
        {
          to: '/m1Index1',
          icon: 'wap-home',
          title: '首页'
        },
        {
          to: '/gift1',
          icon: 'point-gift-o',
          title: '奖品'
        },
        {
          to: '/records1',
          icon: 'records',
          title: '报名'
        },
        {
          to: '/chart1',
          icon: 'chart-trending-o',
          title: '榜单'
        }
        // {
        //   to: '/my1',
        //   icon: 'manager-o',
        //   title: '我的'
        // }
      ],
      active: 0,
      code: '',
      redirectUrl: ''
    }
  },

  created () {
    this.getCode()
  },

  methods: {
    getCode () {
      this.code = this.getUrlCode().code
      this.redirectUrl = window.location.href
      if (!this.code) {
        let href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5034eac230f45c1b&redirect_uri=${this.redirectUrl || window.location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
        window.location.href = href
      } else {
        getWeiXinUserInfo({ code: this.code }).then(res => {
          // eslint-disable-next-line camelcase
          let { openid, memberId, access_token } = res.data
          // eslint-disable-next-line camelcase
          // if (!this.getCookie('openId')) {
          this.setCookie('openId', openid, 365)
          // }
          // if (!this.getCookie('access_token')) {
          this.setCookie('access_token', access_token, 365)
          // }
          // if (!this.getCookie('memberId')) {
          this.setCookie('memberId', memberId, 365)
          // }
        })
      }
    },
    // 截取url中的code方法
    getUrlCode () {
      var url = location.search
      this.winUrl = url
      var theRequest = {}
      if (url.indexOf('?') !== -1) {
        var str = url.substr(1)
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = (strs[i].split('=')[1])
        }
      }
      return theRequest
    }
  },
  setCookie (name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = name + '=' + escape(value) +
((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
  },

  getCookie (name) {
    if (document.cookie.length > 0) {
      let start = document.cookie.indexOf(name + '=')
      if (start !== -1) {
        start = start + name.length + 1
        let end = document.cookie.indexOf(';', start)
        if (end === -1) end = document.cookie.length
        return unescape(document.cookie.substring(start, end))
      }
    }
    return ''
  }

}
</script>
