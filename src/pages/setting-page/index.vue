<!--
* @description  参数1
* @fileName  index
* @author wjp
* @date 2023-12-03 19:21:47
!-->
<template>
  <div id="index" class="index"></div>
</template>

<script>
// 判断角色

export default {
  name: 'index',
  props: {
  },
  data () {
    return {
      userRole: ''
    }
  },
  components: {

  },
  methods: {

  },
  computed: {

  },
  mounted () {
    this.userRole = localStorage.getItem('userRole')
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>