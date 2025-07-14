<!--
* @description  参数1
* @fileName  p-exception-management-detail
* @author wjp
* @date 2024-07-09 22:48:21
!-->
<template>
  <div id="p-exception-management-detail" class="p-exception-management-detail">
    <el-drawer
      title="异常单详情"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="60%"
      @close="onCloseDrawer"
      class="global-drawer-class"
    >
    </el-drawer>
  </div>
</template>

<script>
import CstFormCard from '@/components/cst-form-card/index.vue'
export default {
  name: 'p-exception-management-detail',
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: {} },
    storageMap: { type: Object, default: {} }
  },
  components: { CstFormCard },
  data () {
    return {
      drawerVisible: false,
    }
  },
  methods: {
    onCloseDrawer () {
      this.drawerVisible = false
      this.$emit('close')
    },
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible: {
      handler (newValue) {
        this.drawerVisible = newValue
      },
      immediate: true
    },
  }
}
</script>
<style scoped lang='css'>
</style>