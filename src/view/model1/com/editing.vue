<template>
	<div class="rules">
		<p class="title">
			<van-icon name="description" style="margin-right: 5px;font-size: 20px;vertical-align: top;" />
			{{ title }}
		</p>
		<p v-html="content" style="padding: 10px;"></p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      default: ''
    }
  }

}
</script>

<style lang="scss" scoped>
.rules {
  .title {
    background-color: #e2e1e1;;
    padding: 10px;
    color: #333;
  }
}
</style>
