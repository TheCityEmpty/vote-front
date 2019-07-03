<template>
  <div class="vote">
    <div class="vote-info">

      <div class="user-info">
        <div class="user-left">
          <img src="@_img/user.png" />
          <p class="uname">思南县温喜正某系</p>
        </div>
        <div class="user-right">
          <div class="user-info-list">
            <div class="title">
              <img src="@_img/user.svg" />
              <span>编号</span>
            </div>
            <p class="num">43</p>
          </div>
          <div class="user-info-list">
            <div class="title">
              <img src="@_img/upvote.svg" />
              <span>票数</span>
            </div>
            <p class="num">43</p>
          </div>
          <div class="user-info-list">
            <div class="title">
              <img src="@_img/hot.svg" />
              <span>排名</span>
            </div>
            <p class="num">43</p>
          </div>
        </div>
      </div>
			<button @click="getUserInfo">获取用户信息</button>
      {{ code }}
      <button @click="handleWeChatPay">付款0.01元</button>
      <button @click="getWXPayParams">获取微信支付参数</button>
      <!-- adress -->
      <div class="adress">
        <img src="@_img/tip.svg" />
        <p>地址：贵州省铜仁市思南县瓮溪镇瓮溪社区下街组</p>
      </div>
    </div>

  </div>
  </div>
</template>

<script>
import './vote.scss'
import { getWeiXinUserInfo, weiXinPay } from '@/api'
export default {
  data () {
    return {
      appid: process.env.VUE_APP_APPID,
      code: '',
      redirectUrl: 'http://www.luoxuehui.com/vote'
      // redirectUrl: ''
    }
  },

  created () {
    this.getCode()
    // this.testGetCode()
  },
  methods: {
    getUserInfo () {
      // if (!this.code) {
      //   console.log('未获取到code')
      //   return
      // }
      getWeiXinUserInfo({ code: '0212huhl2bf8BD0LJgil2zGKhl22huhG' }).then(res => {
        console.log(res)
      })
    },
    testGetCode () {
      let href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5034eac230f45c1b&redirect_uri=${this.redirectUrl || window.location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
      window.location.href = href
    },
    getCode () {
      this.code = this.getUrlCode().code
      // this.redirectUrl = window.location.href
      if (!this.code) {
        alert('当前没有code,appID' + this.appid)
        let href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5034eac230f45c1b&redirect_uri=${this.redirectUrl || window.location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
        window.location.href = href
      } else {
        alert('回调路径， code为:' + this.code)
        getWeiXinUserInfo({ code: this.code }).then(res => {
          // eslint-disable-next-line camelcase
          let { openid, memberId, access_token } = res.data
          alert(JSON.stringify(res.data))
          // eslint-disable-next-line camelcase
          alert(openid + memberId + access_token)
          if (!this.getCookie('openId')) {
            this.setCookie('openId', openid, 365)
          }
          if (!this.getCookie('access_token')) {
            this.setCookie('access_token', access_token, 365)
          }
          if (!this.getCookie('memberId')) {
            this.setCookie('memberId', memberId, 365)
          }
          // if (!localStorage.getItem('memberId')) {
          //   localStorage.setItem('memberId', memberId)
          // }
          // if (!localStorage.getItem('access_token')) {
          //   localStorage.setItem('access_token', access_token)
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
    },

    getWXPayParams () {
      let currentOpenId = this.getCookie('openId')
      let currentMemberId = this.getCookie('memberId')
      if (!currentOpenId || !currentMemberId) {
        alert('currentOpenId 或 currentMemberId 参数未获取到')
        return
      }
      let params = {
        openId: currentOpenId,
        memberId: currentMemberId,
        toPay: '0.01'
      }
      alert(JSON.stringify(params))
      return params
    },

    handleWeChatPay () {
      let params = this.getWXPayParams()
      if (params.toPay <= 0) {
        alert('支付异常')
      }
      weiXinPay(params).then(res => {
        console.log('准备支付', res)
        let payObj = {
          appId: res.data.appId,
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.sign
        }
        alert(JSON.stringify(res.data) + JSON.stringify(payObj))
        this.begain_wxpay(payObj)
      }).catch(error => {
        alert(error)
      })
    },

    begain_wxpay (data) {
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.jsApiCall)
          document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall)
        }
      } else {
        this.jsApiCall(data)
      }
    },

    jsApiCall (params) {
      // var that = this
      // eslint-disable-next-line no-undef
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', params,
        function (res) {
          console.log(res)
          alert(JSON.stringify(res))
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // that.$message({
            //   showClose: true,
            //   message: '支付成功',
            //   type: 'success'
            // })
            alert('支付成功')
          } else {
            alert('支付失败')
            // that.$message({
            //   showClose: true,
            //   message: '支付失败',
            //   type: 'error'
            // })
          }
        }
      )
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
}
</script>

<style lang="scss" scoped>
button {
  width: 100px;
  height: 30px;
  border: 1px solid #000;
  margin: 10px;
}
</style>
