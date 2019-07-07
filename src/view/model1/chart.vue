<template>
	<div class="chart-box" style="padding: 10px;">
    <van-button type="danger" :block="true" size="normal" style="margin: 20px 0;" @click="refref">实时榜单</van-button>
    <ul class="user-list">
      <li v-for="(item, index) in userList" :key="index">
        <div class="left">
          <div class="imgs">
            <img :src="JSON.parse(item.img)[0]" />
          </div>
          <div class="info">
            <p class="name">
              {{ item.userName }}
              <span>{{ item.num }} 号</span>
            </p>
            <p class="num">票数: {{ item.virtualTicket }}</p>
          </div>
        </div>
        <span class="right">{{ index + 1 }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { selectSignUpUserCase } from '@/api'
export default {

  data () {
    return {
      userList: []
    }
  },

  created () {
    this.selectSignUpUserCase()
  },

  methods: {
    refref () {
      this.selectSignUpUserCase()
    },
    selectSignUpUserCase () {
      selectSignUpUserCase({
        status: 1,
        length: 1000,
        page: 1,
        activityId: this.$route.query.id
      }).then(res => {
        let result = res.data.list
        this.userList = (result || []).map(item => {
          return {
            ...item,
            ...item.signUpUser
          }
        })
      })
    }
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
.user-list {
  li {
    border-bottom: 1px solid #f1f1f1;
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .imgs {
    margin-right: 5px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .left {
    display: flex;
    justify-content: space-between;
  }
  .num {
    font-size: 12px;
    margin-top: 5px;
  }
  .name {
    font-weight: 600;
  }
  .right {
    font-size: 18px;
    color: #ed4014;
    font-weight: 600;

  }
}
</style>
