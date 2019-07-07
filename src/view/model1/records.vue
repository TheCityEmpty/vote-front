<template>
  <div class="records" style="padding: 20px 0;">
    <van-cell-group>
      <van-field v-model="name" required  label="用户名" placeholder="请输入姓名" />

      <van-field v-model="phone" required label="手机号码" placeholder="请输入手机号码" />

      <van-field v-model="address" required label="地址" placeholder="请输入地址" />

      <van-field v-model="content" label="宣言介绍" type="textarea" placeholder="宣言介绍" rows="1" autosize />

      <p style="padding: 15px 10px;"> <span style="color: #f00">*</span>参赛照片（1~5张）</p>

      <div style="padding: 0 10px;"> <van-uploader :max-count="5" v-model="fileList" multiple /></div>
    </van-cell-group>
    <div style="padding: 40px 10px 10px;">
      <van-button type="danger" @click="signUp" :block="true" size="normal">报名</van-button>
    </div>

  </div>
</template>

<script>
import { createSignUpUser } from '@/api'
export default {
  data () {
    return {
      name: '',
      phone: '',
      address: '',
      content: '',
      fileList: []
    }
  },

  methods: {
    signUp () {
      let name = this.name.trim()
      let phone = this.phone.trim()
      let address = this.address.trim()
      if (name === '') {
        this.$notify('请输入姓名！')
        return
      }
      if (name.length > 20) {
        this.$notify('输入文字超过20个！')
        return
      }
      if (phone === '') {
        this.$notify('请输入手机号码！')
        return
      }
      if (!(/^1[3456789]\d{9}$/.test(phone))) {
        this.$notify('手机号码有误，请重新输入！')
        return
      }
      if (address === '') {
        this.$notify('请输入地址！')
        return
      }
      if (this.fileList.length === 0) {
        this.$notify('请上传至少一张参赛照片！')
        return
      }
      this.$store.commit('setGloblLoading', true)
      createSignUpUser({
        activityId: this.$route.query.id,
        name: this.name,
        phone: this.phone,
        address: this.address,
        content: this.content,
        img: this.fileList.map(item => item.content)
      }).then(res => {
        if (res.code !== '2') {
          this.$toast.success('报名成功')
          this.$router.push({
            path: '/m1Index',
            query: {
              id: this.$route.query.id
            }
          })
        }
      }).finally(() => { this.$store.commit('setGloblLoading', false) })
    }
  },
  beforeCreate () {
    if (Number(this.$store.state.activeInfo.signUpStatus) !== 1) {
      this.$toast('该活动已结束，无法报名！')
      this.$router.go(-1)
    }
    this.$store.commit('setGloblLoading', true)
  },
  mounted () {
    setTimeout(() => {
      this.$store.commit('setGloblLoading', false)
    }, 400)
  }
}
</script>
