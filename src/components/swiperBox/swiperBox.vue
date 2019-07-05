<template>
	<div class="custom-swiper">
		<swiper :options="swiperOption">
        <swiper-slide  class="my-swp-silde" v-for="(slide, key) in imgList" :key="key">
            <img class="my-swp-img" :src="slide.imgUrl" alt="" style="width: 100%;">
        </swiper-slide>
    </swiper>
	</div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: { swiper, swiperSlide },

  props: {
    imgList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      swiperOption: {
        pagination: { el: '.swiper-pagination' }, // 分页按钮
        autoplay: {
          disableOnInteraction: false, // 用户操作swiper之后，是否禁止autoplay
          delay: 3000 // 自动切换的时间间隔（单位ms）
        }
      }
    }
  }
}
</script>

<style scoped>
.custom-swiper {
	width: 100%;
	height: 260px;
}
</style>
