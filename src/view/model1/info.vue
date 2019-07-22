<template>
  <div class="info" style="padding-bottom: 70px;">
    <ul class="chart-info">
      <li>
        <div class="chart-top">
          <van-icon name="friends-o" class="icon" />
          <span>编号</span>
        </div>
        <p class="chart-num">{{ info.num }}</p>
      </li>
      <li>
        <div class="chart-top">
          <van-icon name="thumb-circle-o" class="icon" />
          <span>票数</span>
        </div>
        <p class="chart-num">{{ info.virtualTicket }}</p>
      </li>
      <li>
        <div class="chart-top">
          <van-icon name="fire-o" class="icon" />
          <span>排名</span>
        </div>
        <p class="chart-num">{{ info.top }}</p>
      </li>
    </ul>
    <div class="username" v-if="info.img">
      <img :src="JSON.parse(info.img)[0]" />
      <p>{{ info.userName }}</p>
    </div>
    <p class="adress" style="padding: 0 10px 10px 10px;">
      <van-icon name="home-o" style="vertical-align: sub;font-size: 18px;" />
      地址：{{ info.address }}
    </p>
    <div v-if="info.img" >
      <img v-for="(item, index) in JSON.parse(info.img)" :key="index" :src="item" style="padding: 10px 10px 0 10px;" />
    </div>
    <editing title="我的宣言" v-if="info.content" style="margin-top: 20px;" :content="info.content"></editing>
    <div style="padding: 10px;">
      <van-button type="danger" :block="true" size="normal" @click="goto">我要报名</van-button>
    </div>

    <div class="action">
      <div class="song" @click="gotoZS">
        <span>
          <img src="@_img/zs.svg" />
        </span>

        <p>送礼物</p>
      </div>
      <div class="btn" @click="vote">
        <van-icon name="like-o" class="icon" />
        <span>给ta投票</span>
      </div>
      <div class="btn" @click="fx">
        <van-icon name="friends-o" class="icon" />
        <span>分享活动</span>
      </div>
    </div>
    <div class="fxa" v-if="fxaSHOW" @click="fxaSHOW = false">
      <img src="@_img/to.png" style="margin-bottom: 100px;" />
      <p style="margin-top: 215px;">请点击右上角</p>
      <p>将它发送给指定朋友</p>
      <p>或分享到朋友圈</p>
    </div>

    <van-dialog v-model="show" title="礼物投票" :close-on-click-overlay="true" :show-cancel-button="true" :show-confirm-button="false">

      <p style="padding: 5px">给他投票：{{ info.userName }}</p>
      <div class="zs" style="padding-top: 0px;">
        <van-button plain type="danger" class="btn" @click="handleWeChatPay(1)">
          <span class="text">{{ 1* 3}}票</span>
        </van-button>

        <van-button plain type="danger" class="btn" @click="handleWeChatPay(10)">
          <span class="text">{{ 10* 3}}票</span>
        </van-button>

        <van-button plain type="danger" class="btn" @click="handleWeChatPay(50)">
          <span class="text">{{ 50* 3}}票</span>
        </van-button>

        <van-button plain type="danger" class="btn" @click="handleWeChatPay(100)">
          <span class="text">{{ 100* 3}}票</span>
        </van-button>

        <van-button plain type="danger" class="btn" @click="handleWeChatPay(300)">
          <span class="text">{{ 300* 3}}票</span>
        </van-button>

        <van-button plain type="danger" class="btn" @click="handleWeChatPay(500)">
          <span class="text">{{ 500* 3}}票</span>
        </van-button>
        <van-cell-group>
          <van-field type="number" v-model="payMoeny" label="自定义:" placeholder="请输入您要送的票数" />
        </van-cell-group>
        <div style="padding: 10px 10px 20px;;width: 100%;" v-if="payMoeny">
          <van-button type="danger" @click="payMoenyTo" :block="true" size="normal">送票数</van-button>
        </div>
      </div>

    </van-dialog>

    <div :class="vaoteSuccessStatus ? 'voteSuccess vsShow': 'voteSuccess'">
      <p class="text">亲，投票成功啦！</p>
      <img src="@_img/zs.svg" />
      <p class="text">亲，再送我个礼物呗！</p>
      <div style="text-align: center;margin-bottom: 20px;">
        <van-button @click="gotoZS(true)" type="primary" style="width: 130px;" class="bbtn">送礼物</van-button>
      </div>
      <div style="text-align: center;">
        <van-button type="default" style="width: 130px;" class="bbtn" @click="vaoteSuccessStatus = false">返回活动</van-button>
      </div>
    </div>

  </div>
</template>

<script>
import { querySignUpUser, vote, weiXinPay } from '@/api'
import { wxShowMenu } from '@/libs/wxShowMenu.js'
import editing from './com/editing.vue'
export default {
  components: {
    editing
  },
  data () {
    return {
      vaoteSuccessStatus: false,
      payMoeny: null,
      diamondSum: null,
      userInfo: {},
      show: false,
      fxaSHOW: false,
      info: {},
      code: '',
      redirectUrl: '',
      flag: false
    }
  },

  methods: {
    gotoZS (f) {
      if (Number(this.$store.state.activeInfo.activityStatus) === 2) {
        this.$dialog.alert({
          message: '该活动已结束，无法投票！'
        })
        return
      }
      if (f) {
        this.vaoteSuccessStatus = false
      }
      this.show = true
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
    },
    fx () {
      this.fxaSHOW = true
    },
    vote () {
      if (Number(this.$store.state.activeInfo.activityStatus) === 2) {
        this.$dialog.alert({
          message: '该活动已结束，无法投票！'
        })
      }
      let currentOpenId = this.getCookie('openId')
      let currentMemberId = this.getCookie('memberId')
      // let pp = {
      //   currentOpenId: currentOpenId,
      //   currentMemberId: currentMemberId
      // }
      // alert(JSON.stringify(pp))
      if (!currentOpenId && !currentMemberId) {
        alert('用户信息未获取到！')
        return
      }
      this.$store.commit('setGloblLoading', true)
      vote({
        activityId: this.$route.query.id,
        signUpUserId: this.$route.query.uid,
        memberId: currentMemberId,
        openId: currentOpenId
      }).then(r => {
        if (r.code !== '2') {
          this.vaoteSuccessStatus = true
          this.querySignUpUser()
        } else {
          if (r.content === '您今天的免费票以为该活动的某位小主投过票了哦，可以礼物支持呀') {
            this.$dialog.alert({
              message: r.content
            })
          } else {
            this.$toast.fail('活动已结束')
          }
        }
      }).finally(() => { this.$store.commit('setGloblLoading', false) })
    },
    goto () {
      this.$router.push({
        path: '/records1',
        query: {
          id: this.$route.query.id
        }
      })
    },
    querySignUpUser () {
      querySignUpUser({
        id: this.$route.query.uid
      }).then(res => {
        this.info = {
          ...res.data.signUpUser,
          top: res.data.top
        }
        wxShowMenu(
          `我是${this.info.userName},编号${this.info.num},正在参加-${res.data.activityName}`,
          `投票主题：${res.data.activityName}`,
          window.location.href,
          JSON.parse(this.info.img || '[]')[0])
      })
    },

    payMoenyTo () {
      if (this.payMoeny === null) {
        this.$notify('请输入您要送的票数！')
        return
      }
      if (this.payMoeny.indexOf('.') !== -1) {
        this.$notify('请输入整数！')
        return
      }
      if (this.payMoeny <= 0) {
        this.$notify('请输入大于0的数！')
        return
      }
      this.handleWeChatPay(this.payMoeny)
    },
    getWXPayParams (m) {
      let currentOpenId = this.getCookie('openId')
      let currentMemberId = this.getCookie('memberId')
      if (!currentOpenId || !currentMemberId) {
        return
      }
      let params = {
        openId: currentOpenId,
        memberId: currentMemberId,
        toPay: Math.floor(m / 3)
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
      let that = this
      // eslint-disable-next-line no-undef
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', params,
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            let currentOpenId = that.getCookie('openId')
            let currentMemberId = that.getCookie('memberId')
            vote({
              activityId: that.$route.query.id,
              signUpUserId: that.$route.query.uid,
              memberId: currentMemberId,
              openId: currentOpenId,
              diamondSum: 1
            }).then(r => {
              if (r.code !== '2') {
                that.$dialog.alert({
                  message: '投票成功, 已为他投了' + m + '票'
                })
                that.querySignUpUser()
              } else {
                that.$toast.fail('投票失败')
              }
            })
          } else {
            alert('您取消了支付')
          }
        }
      )
    },

    setCookie (name, value, expiredays) {
      var exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie = name + '=' + escape(value) +
((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
    }
  },
  created () {
    this.querySignUpUser()
  },
  beforeCreate () {
    this.$store.commit('setGloblLoading', true)
  },
  mounted () {
    setTimeout(() => {
      this.$store.commit('setGloblLoading', false)
    }, 400)
  }
}
</script>

<style lang="scss" scoped>
.vsShow.voteSuccess {
 top: 0;
 opacity: 1;
}
.voteSuccess {

  position: fixed;
  top: -999px;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #fff;
  padding: 40px 30px 0;
  z-index: 99;
  text-align: center;
  box-sizing: border-box;
  transition: all 0.3s;
  opacity: 0;
  img {
    width: 100px;
    height: 100px;
  }
  .text {
    text-align: center;
    font-size: 16px;
    padding: 20px 0;
  }
  .bbtn {
    span {
      font-size: 16px;
      letter-spacing: 2px;;
    }
  }
}
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
	justify-content: space-around;
	flex-wrap: wrap;
	.btn {
		width: 70px;
    height: 70px;
		display: inline-block;
		padding: 0 5px;
		border-color: #59a0de;
		margin: 10px;
    border-radius: 50%;
    border: 1px solid #59a0de;
  }
  .text  {
		font-size: 14px;
		font-weight: 600;
		color: #59a0de;
	}
	img {
	width: 25px;
    height: 25px;
    margin-left: 5px;
	}
}
.fxa {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background-color: rgba(0, 0,0, 0.7);
	z-index: 99;
	img {
		width: 100px;
    transform: rotate(45deg);
    float: right;
	}
	p {
		color: #fff;
    font-size: 28px;
    letter-spacing: 3px;
    font-weight: 500;
		text-align: center;
		margin: 10px 0;
	}
}
.action {
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 70px;
	background-color: rgba(0, 0, 0, 0.7);
	position: fixed;
	bottom: 50px;
	left: 0;
	width: 100%;
	padding: 10px 20px;
	box-sizing: border-box;
	z-index: 1;

	.song {
		position: absolute;
    top: -20px;
    left: 50%;
    right: 0;
    bottom: 0;
    margin-left: -25px;
    display: inline-block;
    width: 60px;
		text-align: center;
		span {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		p {
			font-size: 16px;
			color: #fff;
			letter-spacing: 1px;
		}
		img {
width: 50px;
    height: 50px;
		}
	}
	.btn {
		padding: 5px;
		background: #fff;
		border-radius: 2px;
		.icon {
			vertical-align: top;
			color: #5db9ef;
			font-size: 20px;
			margin-right: 5px;
			font-weight: 600;
		}
		span {
			font-weight: 600;
  font-size: 16px;
		}
	}
}
.username {
	display: flex;
	align-items: center;
	padding: 10px;
	img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 10px;
	}
}
.chart-info {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 10px 0;
    background-color: #f7f5f5;
    border-bottom: 1px solid #bababa;
		li {
			position: relative;
			&::before {
				content: '';
				position: absolute;
				width: 1px;
				height: 100%;
				background-color: #989696;
				left: -50%;
				top: 0;
			}
			&:first-child::before {
				display: none;
			}
		}
		span {
			letter-spacing: 2px;
		}
		.icon {
			display: inline-block;
			font-size: 20PX;
			vertical-align: top;
			margin-right: 5px;
		}
		.chart-num {
			display: block;
			text-align: center;
			font-size: 16px;
		padding-top: 5px;
		}
	}
</style>
