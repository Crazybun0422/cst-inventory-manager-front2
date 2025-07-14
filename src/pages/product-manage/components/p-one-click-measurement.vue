<!--
* @description  参数1
* @fileName  p-one-click-measurement
* @author wjp
* @date 2024-07-21 17:22:59
!-->
<template>
  <div id="p-one-click-measurement" class="p-one-click-measurement">
    <el-dialog
      title="一键质检"
      :visible.sync="dialogVisible"
      width="25%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <span>产品质检尺寸引用客户预约尺寸？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="medium">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitForm" size="medium">
          {{ $t('common.confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'p-one-click-measurement',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    variantIds: {
      type: Array,
      default: () => []
    }
  },
  components: {

  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      printProductTagForm: {

      },
      printProductTagFormRules: {

      }
    }
  },
  methods: {
    submitForm () {
      this.$message.success(this.$t('common.operationSuccessful'))
      this.dialogVisible = false
      this.$emit('close')
    },
    handleClose () {
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