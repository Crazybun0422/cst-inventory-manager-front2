<!--
* @description  参数1
* @fileName  p-batch-import-measurement
* @author wjp
* @date 2024-07-24 21:10:36
!-->
<template>
  <div id="p-batch-import-measurement" class="p-batch-import-measurement">
    <el-dialog
      :title="
        $t('message.productManagement.batchImportMeasurementQualityInspection')
      "
      :visible.sync="dialogVisible"
      width="25%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <div class="upload-style">
        <div
          style="
            display: flex;
            align-self: self-start;
            margin-left: 22px;
            margin-bottom: 10px;
            font-size: 16px;
          "
        >
          {{ $t('common.noTemplateFile')
          }}<a>{{ $t('common.clickToDownloadTheTemplateFile') }}</a>
        </div>
        <div>
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t('common.uploadPromp') }}&nbsp;
              <em>{{ $t('common.clickToUpload') }}</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              {{ $t('common.excelUploadLimit') }}
            </div>
          </el-upload>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'p-batch-import-measurement',
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
<style scoped lang='scss'>
.upload-style {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>