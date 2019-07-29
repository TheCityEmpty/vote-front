<template>
  <div class="m1Index">
    <Ainfo></Ainfo>
    <van-search v-model="value" placeholder="请输入编号搜索" show-action @search="querySelecct">
      <div slot="action" @click="querySelecct">搜索</div>
    </van-search>
    <div class="user-box">
      <p v-if="!userList.length" style="padding: 10px;text-align: center;">未搜索到结果</p>
      <ul class="userList">
        <li v-for="(item, index) in userList" :key="index" @click="goto(item.id, index + 1)">
          <div class="pic" style="position: relative;">
            <p class="user-info">
              <span class="num">{{ item.num }}号</span>
              <span class="name">{{ item.userName }}</span>
            </p>
            <img :src="JSON.parse(item.img)[0]" />
          </div>
          <p class="votes">{{ item.virtualTicket }} 票</p>
          <span class="button-vote">
            投票
          </span>
        </li>
      </ul>

      <van-pagination @change="pageChange" v-model="currentPage" :total-items="total" :show-page-size="3" force-ellipses />
    </div>
    <editing title="活动规则" :content="$store.state.activeInfo.rule"></editing>
  </div>
</template>

<script>
import Ainfo from './com/aInfo.vue'
import editing from './com/editing.vue'
import { selectSignUpUserCase, selectSignUpUserCaseForH5 } from '@/api'
import { wxShowMenu } from '@/libs/wxShowMenu.js'
export default {
  watch: {
    '$store.state.activeInfo': {
      deep: true,
      handler (val) {
        console.log(val)
        if (String(val.activityStatus) === '2') {
          this.$notify({
            message: '活动已结束',
            duration: 0
          })
        }
        wxShowMenu(val.name, val.content, window.location.href, val.img[0] || [])
      }
    }
  },
  components: {
    Ainfo,
    editing
  },
  data () {
    return {
      currentPage: 1,
      value: '',
      userList: [],
      total: 0
    }
  },

  beforeCreate () {
    this.$store.commit('setGloblLoading', true)
  },
  mounted () {
    setTimeout(() => {
      this.$store.commit('setGloblLoading', false)
    }, 400)
  },
  created () {
    // this.getCode()
    this.selectSignUpUserCase()
  },

  methods: {
    // getCode () {
    //   this.code = this.getUrlCode().code
    //   let h = window.location.href
    //   this.redirectUrl = String(h).replace('&', '%26')
    //   alert(h)
    //   alert(String(h).replace('&', '%26'))
    //   if (!this.code) {
    //     let href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5034eac230f45c1b&redirect_uri=${this.redirectUrl || window.location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    //     window.location.href = href
    //   } else {
    //     getWeiXinUserInfo({ code: this.code }).then(res => {
    //       // eslint-disable-next-line camelcase
    //       let { openid, memberId, access_token } = res.data
    //       // eslint-disable-next-line camelcase
    //       // if (!this.getCookie('openId')) {
    //       this.setCookie('openId', openid, 365)
    //       // }
    //       // if (!this.getCookie('access_token')) {
    //       this.setCookie('access_token', access_token, 365)
    //       // }
    //       // if (!this.getCookie('memberId')) {
    //       this.setCookie('memberId', memberId, 365)
    //       // }
    //     })
    //   }
    // },
    goto (uid, p) {
      this.$router.push({
        path: '/info1',
        query: {
          id: this.$route.query.id,
          uid: uid
        }
      })
    },
    querySelecct () {
      let p = {}
      if (this.value) {
        p = {
          activityId: this.$route.query.id,
          queryText: this.value,
          page: 1,
          length: 10
        }
      } else {
        p = {
          activityId: this.$route.query.id,
          page: 1,
          length: 10
        }
      }
      selectSignUpUserCaseForH5(p).then(res => {
        let result = res.data.list
        this.total = res.data.totalRows
        this.userList = (result || []).map(item => {
          return {
            ...item,
            ...item.signUpUser
          }
        })
      })
    },
    selectSignUpUserCase () {
      selectSignUpUserCase({
        status: 1,
        length: 10,
        page: this.currentPage,
        activityId: this.$route.query.id
      }).then(res => {
        let result = res.data.list
        this.total = res.data.totalRows
        this.userList = (result || []).map(item => {
          return {
            ...item,
            ...item.signUpUser
          }
        })
      })
    },
    pageChange () {
      this.selectSignUpUserCase()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-box {
  border-bottom: 1px dashed #ccc;
  padding-bottom: 20px;
}
.userList {
  padding: 10px;
  li {
    width: 49%;
    display: inline-block;
    box-sizing: border-box;
    margin-bottom: 10px;
    position: relative;
    &:nth-child(2n) {
      margin-left: 2%;
    }
  }
  .user-info {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 7px 5px;
    color: #fff;
    border-radius: 0 0 4px 4px;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    .num {
      margin-right: 5px;
      vertical-align: top;
      display: inline-block;
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 70%;
      display: inline-block;
      vertical-align: top;
    }
    span {
      font-size: 12px;
    }
  }

  .votes {
    padding: 5px 10px;
    color: #ed4014;
    background-color: #fff;
  }
  .button-vote {
    position: absolute;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background-color: #5cadff;
    border-radius: 50%;
    bottom: 5px;
    right: 5px;
  }

}
</style>
