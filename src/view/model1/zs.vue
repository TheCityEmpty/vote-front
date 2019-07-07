<template>
	<div class="zs" style="padding-top: 30px;">
		<p class="title">充值投票</p>
		<div class="zs" style="padding-top: 30px;">
			<van-button plain type="danger" class="btn" @click="handleWeChatPay(1)">
			<span class="text">1</span>
			<img src="@_img/zs.svg" />
		</van-button>

		<van-button plain type="danger" class="btn">
			<span class="text">10</span>
			<img src="@_img/zs.svg" />
		</van-button>

		<van-button plain type="danger" class="btn">
			<span class="text">50</span>
			<img src="@_img/zs.svg" />
		</van-button>

		<van-button plain type="danger" class="btn">
			<span class="text">100</span>
			<img src="@_img/zs.svg" />
		</van-button>

		<van-button plain type="danger" class="btn">
			<span class="text">300</span>
			<img src="@_img/zs.svg" />
		</van-button>

		<van-button plain type="danger" class="btn">
			<span class="text">500</span>
			<img src="@_img/zs.svg" />
		</van-button>
		</div>
	</div>
</template>

<script>
import { weiXinPay } from '@/api'
export default {
  methods: {
    getWXPayParams (m) {
      let currentOpenId = this.getCookie('openId')
      let currentMemberId = this.getCookie('memberId')
      if (!currentOpenId || !currentMemberId) {
        return
      }
      let params = {
        openId: currentOpenId,
        memberId: currentMemberId,
        toPay: '0.01'
      }
      return params
    },

    handleWeChatPay (m) {
      let params = this.getWXPayParams(m)
      if (!params) {
        return
      }
      if (params.toPay <= 0) {
        alert('支付异常')
      }
      weiXinPay(params).then(res => {
        let payObj = {
          appId: res.data.appId,
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.sign
        }
        this.begain_wxpay(payObj, m)
      }).catch(error => {
        alert(error)
      })
    },

    begain_wxpay (data, m) {
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.jsApiCall)
          document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall)
        }
      } else {
        this.jsApiCall(data, m)
      }
    },

    jsApiCall (params, m) {
      // let that = this
      // eslint-disable-next-line no-undef
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', params,
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            // let currentOpenId = that.getCookie('openId')
            // let currentMemberId = that.getCookie('memberId')
            // vote({
            //   activityId: that.$route.query.id,
            //   signUpUserId: that.$route.query.uid,
            //   memberId: currentMemberId,
            //   openId: currentOpenId,
            //   diamondSum: m
            // }).then(r => {
            //   if (r.code !== '2') {
            //     that.$dialog.alert({
            //       message: '投票成功, 已为他投了' + m + '票'
            //     })
            //   } else {
            //     that.$toast.fail('投票失败')
            //   }
            // })
          } else {
            alert('您取消了支付, 请重新点击支付')
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
.title {
	width: 100%;
	font-weight: 600;
	font-size: 18px;
	text-align: center;
	position: relative;
	&::before {
		content: '';
    position: absolute;
    width: 50px;
    height: 1px;
    background-color: #333;
    bottom: -5px;
    left: 50%;
    margin-left: -25px;
	}
}
.zs {
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	.btn {
		width: 100px;
    height: 50px;
		display: inline-block;
		padding: 0 5px;
		border-color: #59a0de;
		margin: 10px;
	}
	.text {
		font-size: 18px;
		font-weight: 600;
		color: #59a0de;
	}
	img {
		width: 30px;
    height: 30px;
    margin-left: 10px;
	}
}
</style>
