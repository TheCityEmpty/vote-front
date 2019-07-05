<template>
  <div class="home">
    <router-view class="container" />
  </div>
</template>

<script>
import router from '@/router'
export default {
  name: 'App',

  beforeRouteEnter (to, from, next) {
    setTimeout(() => {
      let i = 1
      router.push({
        path: `model${i}`
      })
    }, 1000)
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
  }
</style>
