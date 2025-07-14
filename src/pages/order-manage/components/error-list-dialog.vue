<!--
* @description  参数1
* @fileName  error-list-dialog
* @author wjp
* @date 2024-02-29 21:16:42
!-->
<template>
  <el-dialog
    :title="$t('common.errorInfo')"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">{{
        $t('common.confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'error-list-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    errorInfo: [String, Array, Object]
  },
  components: {

  },
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false
      this.$emit('close')
    }
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    }

  }
}
</script>
<style scoped lang='css'>
</style>