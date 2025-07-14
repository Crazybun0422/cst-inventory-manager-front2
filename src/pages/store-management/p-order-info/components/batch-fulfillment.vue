<template>
  <div>
    <el-dialog
      :title="$t('message.storeSettings.batchFulfillment')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{
          $t('common.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBatchFulfillStatus } from '@/common/store-management/index'

export default {
  name: 'batch-fulfillment',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentShopUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      uploadDialogLoading: false
    }
  },
  methods: {
    getBatchFulfillStatus,
    getTemplateFile,
    handleClose () {
      this.dialogVisible = false
      this.$emit('close')
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
      this.getBatchFulfillStatus().then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // 如果数据不为空，说明有正在进行的批量发货或者报错
          // console.log('res.data: ', res.data);

        }
      })
    }
  }
}
</script>

<style scoped>
</style>