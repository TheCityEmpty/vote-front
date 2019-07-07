<template>
	<div class="aInfo">
		<ul class="chart-info">
			<li>
				<div class="chart-top">
					<van-icon name="friends-o" class="icon" />
					<span>已报名</span>
				</div>
				<p class="chart-num">{{ signUpNum }}</p>
			</li>
			<li>
				<div class="chart-top">
					<van-icon name="thumb-circle-o" class="icon" />
					<span>累积投票</span>
				</div>
				<p class="chart-num">{{ voteNum }}</p>
			</li>
		</ul>
		<div class="atime">
			<p class="title">活动结束倒计时</p>
			<div class="timer">
				<ul class="times">
					<li class="day">
						<span class="time-border">{{ d }}</span>
						<span>天</span>
					</li>
					<li class="day">
						<span class="time-border">{{ h }}</span>
						<span>时</span>
					</li>
					<li class="day">
						<span class="time-border">{{ m }}</span>
						<span>分</span>
					</li>
					<li class="day">
						<span class="time-border">{{ s }}</span>
						<span>秒</span>
					</li>
				</ul>
			</div>
			<van-button type="danger" :block="true" size="normal" @click="goto">我要报名</van-button>
		</div>
	</div>
</template>

<script>
import { selectActivityCase } from '@/api'
import { setInterval, clearInterval } from 'timers'
export default {

  data () {
    return {
      endTime: '',
      signUpNum: 0,
      voteNum: 0,
      d: '',
      h: '',
      m: '',
      s: '',
      timer: null
    }
  },

  watch: {
    '$store.state.activeInfo': {
      deep: true,
      handler (val) {
        this.timer = setInterval(() => {
          this.countTime(val)
        }, 1000)
      }
    }
  },

  methods: {
    goto () {
      this.$router.push({
        path: '/records1',
        query: {
          id: this.$route.query.id
        }
      })
    },
    countTime (val) {
      if (!val) return
      var date = new Date()
      var now = date.getTime()

      let endTime = val.activityEndTime
      let timeDiff = endTime - now

      let d
      let h
      let m
      let s
      if (timeDiff >= 0) {
        d = Math.floor(timeDiff / 1000 / 60 / 60 / 24)
        h = Math.floor(timeDiff / 1000 / 60 / 60 % 24)
        m = Math.floor(timeDiff / 1000 / 60 % 60)
        s = Math.floor(timeDiff / 1000 % 60)
      } else {
        clearInterval(this.timer)
      }
      this.d = d
      this.h = h
      this.m = m
      this.s = s
    }
  },

  created () {
    selectActivityCase({ id: this.$route.query.id, page: 1, length: 1 }).then(res => {
      this.voteNum = res.data.list[0].voteSum
      this.signUpNum = res.data.list[0].signUpSum
    })

    if (this.$store.state.activeInfo !== '{}') {
      this.timer = setInterval(() => {
        this.countTime(this.$store.state.activeInfo)
      }, 1000)
    }
  }

}
</script>

<style lang="scss" scoped>
.aInfo {
	.chart-info {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 10px 0;
    background-color: #f7f5f5;
    border-bottom: 1px solid #bababa;
		li {
			position: relative;
			&:last-child::before {
				content: '';
				position: absolute;
				width: 1px;
				height: 100%;
				background-color: #989696;
				left: -50%;
				top: 0;
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
	.atime {
		.title {
			text-align: center;
		}
		padding: 10px;
	}

	.times {
		padding: 20px 0;
		li {
			display: inline-block;
			margin-right: 5px;
			&:last-child {
				margin-right: 0;
			}
		}
	}

	.timer {
		display: flex;
		justify-content: center;
	}

	.time-border {
		display: inline-block;
    text-align: center;
    line-height: 40px;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 2px;
		margin-right: 3px;
		width: 30px;
	}
}
</style>
