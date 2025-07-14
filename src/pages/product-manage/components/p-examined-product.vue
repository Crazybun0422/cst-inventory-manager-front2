<!--
* @description  审核产品
* @fileName  p-examined-product
* @author wjp
* @date 2024-07-21 17:22:59
!-->
<template>
  <div id="p-examined-product" class="p-examined-product">
    <el-dialog
      title="审核"
      :visible.sync="dialogVisible"
      width="25%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <span>确定审核？</span>
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
  name: 'p-examined-product',
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