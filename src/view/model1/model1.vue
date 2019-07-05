<template>
  <div class="model-home">
    <van-notice-bar :text="text" class="customBar" left-icon="volume-o" />
    <swiperBox :imgList="imgs"></swiperBox>
    <router-view class="model-box" />

    <van-tabbar v-model="active">
      <van-tabbar-item
				v-for="(item, index) in footerList"
				:key="index"
				:icon="item.icon"
				replace
				:to="item.to">{{ item.title }}</van-tabbar-item>
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
          to: '/m1Index',
          icon: 'wap-home',
          title: '首页'
        },
        {
          to: '/gift',
          icon: 'point-gift-o',
          title: '奖品'
        },
        {
          to: '/records',
          icon: 'records',
          title: '报名'
        },
        {
          to: '/chart',
          icon: 'chart-trending-o',
          title: '榜单'
        }
      ],
      active: 0,
      text: `平台最新福利：凡开启活动后每天排名第一名商家免费赠送价值1000元首页顶部滚轴广告推广一天，五天
			活动中每天晚上23：30数据为准，次日9：00后开始更新。更加强而有力地增加曝光度和知名度！本活动为
			公益评选，公平公正，免费参加，活动奖品均为真实，最终解释权归主办方所有！`,
      imgs: [
        {
          imgUrl: require('@_img/1.jpg')
        },
        {
          imgUrl: require('@_img/2.jpg')
        },
        {
          imgUrl: require('@_img/1.png')
        }
      ]
    }
  }
}
</script>
