<template>
  <div class="home">
    <van-loading type="spinner" color="#1989fa" class="globlLoading" v-show="$store.state.globlLoading" />
    <router-view class="container" />
  </div>
</template>

<script>
import router from '@/router'
import { queryActivity, addVisits } from '@/api'
import store from '../store'
export default {
  name: 'App',
  beforeRouteEnter (to, from, next) {
    console.log('aa')
    let id = to.query.id
    if (!id) {
      alert('该活动不存在！')
      next()
      return
    }
    queryActivity({ id: id }).then(res => {
      let info = res.data
      if (Number(info.activityType) === 0) {
        router.push({
          path: '/error'
        })
      } else {
        info.adImg = JSON.parse(info.adImg)
        info.img = JSON.parse(info.img)
        store.commit('setActiveInfo', res.data)
      }
      document.title = info.name
    })

    addVisits({ activityId: id })
    next()
  }
}
</script>
<style scoped lang='scss'>
  .home {
    height: 100%;
    padding-bottom: 80px;
  }
</style>
