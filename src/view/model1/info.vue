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
				<p class="chart-num">{{ $route.query.p }}</p>
			</li>
		</ul>
		<div class="username" v-if="info.img">
			<img :src="JSON.parse(info.img)[0]" />
			<p>{{ info.userName }}</p>
		</div>
		<p class="adress" style="padding: 0 10px 10px 10px;">
			<van-icon name="home-o" style="vertical-align: sub;font-size: 18px;"/>
			地址：{{ info.address }}
		</p>
		<div v-if="info.img" style="padding: 10px;">
			<img :src="JSON.parse(info.img)[0]" />
		</div>
		<div style="padding: 10px;">
			<van-button type="danger" :block="true" size="normal" @click="goto">我要报名</van-button>
		</div>

		<div class="action">
			<div class="song">
				<span>
					<img src="@_img/zs.svg" />
				</span>

				<p>送砖石</p>
			</div>
			<div class="btn" @click="vote">
				<van-icon name="like-o" class="icon" />
				<span>给ta投票</span>
			</div>
			<div class="btn">
				<van-icon name="friends-o" class="icon" />
				<span>分享活动</span>
			</div>
		</div>
		<!-- <img src="@_img/fx.jpg" style="width: 100%;height: 100%" /> -->
	</div>
</template>

<script>
import { querySignUpUser, vote, getWeiXinUserInfo } from '@/api'
export default {
  data () {
    return {
      info: {},
      code: '',
      redirectUrl: ''
    }
  },

  methods: {
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
    },
    getCode () {
      this.code = this.getUrlCode().code
      this.redirectUrl = window.location.href
      if (!this.code) {
        // alert('当前没有code,appID' + this.appid)
        let href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5034eac230f45c1b&redirect_uri=${this.redirectUrl || window.location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
        window.location.href = href
      } else {
        alert('回调路径， code为:' + this.code)
        getWeiXinUserInfo({ code: this.code }).then(res => {
          // eslint-disable-next-line camelcase
          let { openid, memberId, access_token } = res.data
          alert(JSON.stringify(res.data))
          // eslint-disable-next-line camelcase
          if (!this.getCookie('openId')) {
            this.setCookie('openId', openid, 365)
          }
          if (!this.getCookie('access_token')) {
            this.setCookie('access_token', access_token, 365)
          }
          if (!this.getCookie('memberId')) {
            this.setCookie('memberId', memberId, 365)
          }
          vote({
            activityId: this.$route.query.id,
            signUpUserId: this.$route.query.uid,
            memberId: memberId,
            openId: openid
          }).then(r => {
            if (r.code !== '2') {
              this.$toast.success('投票成功')
            } else {
              this.$toast.fail('投票失败')
            }
          })
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
    vote () {
      this.getCode()
    },
    goto () {
      this.$router.push({
        path: '/records',
        query: {
          id: this.$route.query.id
        }
      })
    }
  },
  created () {
    querySignUpUser({
      id: this.$route.query.uid
    }).then(res => {
      this.info = res.data.signUpUser
    })
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
