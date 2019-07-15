<template>
	<div class="m1Index">
    <Ainfo></Ainfo>
		<editing title="活动奖品" :content="$store.state.activeInfo.prize"></editing>
	</div>
</template>

<script>
import Ainfo from './com/aInfo.vue'
import editing from './com/editing.vue'
import { wxShowMenu } from '@/libs/wxShowMenu.js'
export default {
  beforeMount () {
    let i = this.$store.state.activeInfo
    wxShowMenu(i.name, i.content, window.location.href, i.img[0] || [])
  },
  components: {
    Ainfo,
    editing
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
