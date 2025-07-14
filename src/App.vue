<template>
  <div class="default" id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker/index.vue'
export default {
  name: 'App',
  components: {
    ThemePicker
  },
  computed: {

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang="scss">
.app-main {
  width: 100%;
  min-height: 100vh;
}

/* 针对英文单词换行的样式 */
.break-word {
  word-break: keep-all;
  word-wrap: break-word;
}
.status-tag {
  width: 100%;
  text-align: center;
}
</style>
