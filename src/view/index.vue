<template>
  <div class="home">
    <van-loading type="spinner" color="#1989fa" class="globlLoading" v-show="$store.state.globlLoading" />
    <router-view class="container" />
  </div>
</template>

<script>
import router from '@/router'
import { queryActivity } from '@/api'
import store from '../store'
export default {
  name: 'App',

  beforeRouteEnter (to, from, next) {
    let id = to.query.id
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
        router.push({
          path: `model${res.data.model}`,
          query: {
            id: id
          }
        })
      }
      document.title = info.name
    })
    next()
  },

  data () {
    return {

    }
  },
  methods: {

    // getAc
  }
}
</script>
<style scoped lang='scss'>
  .home {
    height: 100%;
    padding-bottom: 80px;
  }
</style>
