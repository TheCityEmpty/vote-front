<template>
  <div class="model-home">
    <van-notice-bar :text="$store.state.activeInfo.notice" class="customBar" left-icon="volume-o" />
    <swiperBox :imgList="$store.state.activeInfo.adImg"></swiperBox>
    <router-view class="model-box" />

    <van-tabbar v-model="active">
      <van-tabbar-item
				v-for="(item, index) in footerList"
				:key="index"
				:icon="item.icon"
				replace
				:to="{ path: item.to ,query: { id: $route.query.id }}">{{ item.title }}</van-tabbar-item>
    </van-tabbar>
  </div>

</template>

<script>
import swiperBox from '@_com/swiperBox/swiperBox.vue'
export default {
  name: 'model1',
  components: {
    swiperBox
  },

  data () {
    return {
      footerList: [
        {
          to: '/m1Index1',
          icon: 'wap-home',
          title: '首页'
        },
        {
          to: '/gift1',
          icon: 'point-gift-o',
          title: '奖品'
        },
        {
          to: '/records1',
          icon: 'records',
          title: '报名'
        },
        {
          to: '/chart1',
          icon: 'chart-trending-o',
          title: '榜单'
        }
        // {
        //   to: '/my1',
        //   icon: 'manager-o',
        //   title: '我的'
        // }
      ],
      active: 0
    }
  }

}
</script>
