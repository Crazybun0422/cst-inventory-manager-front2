<!--
* @description  参数1
* @fileName  p-change-order
* @author wjp
* @date 2024-07-24 21:10:36
!-->
<template>
  <div id="p-change-order" class="p-change-order">
    <el-dialog
      :title="$t('message.orderInfo.changeOrders')"
      :visible.sync="dialogVisible"
      width="25%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <span
        >{{ $t('common.noTemplateFile')
        }}<a>{{ $t('common.clickToDownloadTheTemplateFile') }}</a></span
      >
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t('common.uploadPromp')
          }}<em>{{ $t('common.clickToUpload') }}</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          {{ $t('common.excelUploadLimit') }}
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'p-change-order',
  props: {
    visible: {
      type: Boolean,
      default: false
    },

  },
  components: {

  },
  data () {
    return {
      dialogVisible: false,
      loading: false,

    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false
      this.$emit('close')
    },
    submitForm () {
    },

  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },

  },
  mounted () {

  },
  watch: {
    visible (val) {
      if (val) {
        this.dialogVisible = true
      }
    }
  }
}
</script>
<style scoped lang='css'>
</style>