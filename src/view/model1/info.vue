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
    <div v-if="info.img" style="padding: 10px;">
      <img :src="JSON.parse(info.img)[0]" />
    </div>
    <div style="padding: 10px;">
      <van-button type="danger" :block="true" size="normal" @click="goto">我要报名</van-button>
    </div>

    <div class="action">
      <div class="song" @click="gotoZS">
        <span>
          <img src="@_img/zs.svg" />
        </span>

        <p>送钻石</p>
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

    <van-dialog :before-close="(action, done) => { this.beforeClose(action, done) }" v-model="show" title="礼物投票" show-cancel-button @confirm="confirm" @cancel="cancel">

      <p style="padding: 5px">给他投票：{{ info.userName }}</p>
      <p style="padding: 5px">您的钻石余额：{{ userInfo.diamond }}</p>
      <van-cell-group v-if="userInfo.diamond">
        <van-field v-model="diamondSum" type="number" placeholder="输入您要送出的钻石数" />
      </van-cell-group>
			<p style="padding: 5px" v-if="userInfo.diamond">钻石兑票数：{{ diamondSum * 3 }}</p>
			<p style="padding: 5px" v-if="!userInfo.diamond">您的砖石数为0， 请点击充值</p>
      <div style="padding: 30px 10px;">
        <van-button type="danger" @click="pay" :block="true" size="normal">充值投票</van-button>
      </div>

    </van-dialog>

  </div>
</template>

<script>
import { querySignUpUser, vote, queryMemberMsg } from '@/api'
export default {
  data () {
    return {
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
    pay () {
      this.$router.push({
        path: '/zs1',
        query: {
          id: this.$route.query.id,
          uid: this.$route.query.uid
        }
      })
    },
    beforeClose (action, done) {
      if (this.flag) {
        if (this.diamondSum === null) {
          this.$notify('请输入钻石数量！')
          done(false)
          return
        }
        if (this.diamondSum >= this.userInfo.diamond) {
          this.$notify('您没有这么多的钻石数，可点击充值增加！')
          done(false)
          return
        }
        let currentOpenId = this.getCookie('openId')
        let currentMemberId = this.getCookie('memberId')
        vote({
          activityId: this.$route.query.id,
          signUpUserId: this.$route.query.uid,
          memberId: currentMemberId,
          openId: currentOpenId,
          // memberId: '1144236048440623104',
          // openId: 'o8FsW5hyOWqPad9s2cor5hA8O7-Y',
          diamondSum: this.diamondSum
        }).then(r => {
          if (r.code !== '2') {
            done()
            this.$dialog.alert({
              message: '投票成功, 已为他投了' + this.diamondSum * 3 + '票'
            })
            this.querySignUpUser()
          } else {
            this.$toast.fail('投票失败')
          }
        })
      } else {
        done()
      }
    },
    cancel () {
      this.flag = false
    },
    confirm () {
      this.flag = true
    },
    gotoZS () {
      if (Number(this.$store.state.activeInfo.activityStatus) === 2) {
        this.$dialog.alert({
          message: '该活动已结束，无法投票！'
        })
        return
      }
      let mid = this.getCookie('memberId')
      queryMemberMsg({
        id: mid
      }).then(res => {
        this.show = true
        this.userInfo = res.data
      })
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
        return
      }
      let currentOpenId = this.getCookie('openId')
      let currentMemberId = this.getCookie('memberId')
      this.$store.commit('setGloblLoading', true)
      vote({
        activityId: this.$route.query.id,
        signUpUserId: this.$route.query.uid,
        memberId: currentMemberId,
        openId: currentOpenId
      }).then(r => {
        if (r.code !== '2') {
          this.$toast.success('投票成功')
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
      })
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
