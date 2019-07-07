<template>
	<div class="my" style="padding: 30px 10px;">
		<p class="title">基本信息</p>
		<p style="padding: 10px 0;">用户名： {{ userInfo.memberName }}</p>
		<p style="padding: 10px 0;">钻石数： {{ userInfo.diamond }}</p>
		<div style="padding: 30px 10px;">
        <van-button type="danger" @click="pay" :block="true" size="normal">充值钻石</van-button>
    </div>
	</div>
</template>

<script>
import { queryMemberMsg } from '@/api'
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    queryMemberMsg({
      id: '1144236048440623104'
    }).then(res => {
      this.userInfo = res.data
    })
  },
  methods: {
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
    pay () {
      this.$router.push({
        path: '/zs',
        query: {
          id: this.$route.query.id,
          uid: this.$route.query.uid
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my {
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
}
</style>
