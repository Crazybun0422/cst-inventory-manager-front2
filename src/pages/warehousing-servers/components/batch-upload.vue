<!--
* @description  给批量上架和批量质检使用的上传组件
* @fileName  batch-upload
* @author wjp
* @date 2024-04-14 21:33:35
!-->
<template>
  <div id="batch-upload" class="batch-upload">
    <el-dialog
      :title="
        uploadType == 'qualityInspection'
          ? $t('message.storage.batchQualityInspection')
          : $t('message.storage.batchPutaway')
      "
      :visible.sync="modalVisible"
      :close-on-click-modal="false"
      @close="handlerClose"
      class="global-modal-class"
      v-loading="loading"
    >
      <el-card>
        <div slot="header" class="clearfix">
          <span>{{
            uploadType == 'qualityInspection'
              ? $t('message.storage.batchQualityInspection')
              : $t('message.storage.batchPutaway')
          }}</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="templateDownload"
            >{{ $t('message.storage.templateDownload') }}</el-button
          >
        </div>

        <el-row :gutter="24">
          <!-- <el-col :span="12"
            ></el-col
          > -->
          <el-col :span="24">
            <div class="upload-info">
              <span>{{ $t('message.storage.systemNumber') }}</span
              >: {{ currentData.system_number }}
            </div>
          </el-col>
          <el-col :span="24">
            <div class="upload-box">
              <el-upload
                class="upload-file"
                action="#"
                :limit="1"
                drag=""
                :file-list="fileUploadList"
                :on-exceed="handleExceed"
                :on-change="onChangeFile"
                :auto-upload="false"
                :multiple="false"
                ref="uploadFile"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  {{ $t('common.uploadPromp')
                  }}<em>{{ $t('message.signUp.upload') }}</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                  {{ $t('common.excelUploadLimit') }}
                </div>
              </el-upload>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="submit-but">
              <el-button
                type="primary"
                @click="uploadFile"
                :loading="loading"
                >{{ $t('common.clickToUpload') }}</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'batch-upload',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentData: {
      type: Object,
      default: () => ({})
    },
    uploadType: {
      type: String,
      default: ''
    },
  },
  components: {

  },
  data () {
    return {
      loading: false,
      modalVisible: false,
      fileUploadList: [],
      form: {
      },
    }
  },
  methods: {
    templateDownload () {
    },
    uploadFileRequest (param) {
      this.form = { check: param.file }
    },
    handleExceed () {
      this.$alert(this.$t('message.signUp.imgNumberLimitError'), {
        confirmButtonText: this.$t('message.signUp.confirmBtnText')
      })
    },
    onChangeFile (file) {
      // 限制只能上次Excel文件
      const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      const isAllowedType = allowedTypes.includes(file.raw.type)
      const isAllowedSize = file.raw.size / 1024 / 1024 < 10 // 文件大小限制为5MB

      if (!isAllowedType) {
        this.$message.error(this.$t('message.signUp.imgFormatError'))
        this.fileUploadList = []
        return false
      }
      if (!isAllowedSize) {
        this.$message.error(this.$t('message.signUp.imgSizeLimitError'))
        this.fileUploadList = []
        return false
      }
      this.fileUploadList = [file]
      return isAllowedType && isAllowedSize // 返回校验结果
    },
    handlerClose (isRefresh = false) {
      this.$emit('close', isRefresh)
    },
    uploadFile () {
      if (this.uploadType === 'qualityInspection') {
        this.batchQualityInspection()
      }
      else {
        this.batchPutaway()
      }
    },
    async batchQualityInspection () {
      try {
        if (this.fileUploadList.length === 0) {
          this.$message.error(this.$t('message.userInfo.uploadFilePlaceholder'))
          return
        }
        this.loading = true
        const reqData = {
          storage_uuid: this.currentData.storage_uuid,
          check: this.fileUploadList[0]
        }
        const res = await this.$ajax(
          {
            method: 'post',
            url: '/api-prefix/api/storage-m/batch-quality-check',
            params: { system_number: this.currentData.system_number },
            data: reqData,
            roleType: this.roleType
          })
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(this.$t('common.operationSuccessful'))
          this.handlerClose(true)
        }
      }
      catch (error) {
        console.error('error: ', error)
      }
      finally {
        this.loading = false
        // this.$emit('close')

      }

    },
    async batchPutaway () {
      try {
        this.loading = true
        if (this.fileUploadList.length === 0) {
          this.$message.error(this.$t('message.userInfo.uploadFilePlaceholder'))
          return
        }
        const res = await this.$ajax(
          {
            method: 'post',
            url: '/api-prefix/api/storage-m/batch-putaway',
            params: { system_number: this.currentData.system_number },
            data: {
              check: this.fileUploadList[0],
              storage_uuid: this.currentData.storage_uuid
            },
            roleType: this.roleType
          })
        if (this.$isRequestSuccessful(res.code)) {
          this.handlerClose(true)

        }
      }
      catch (error) {
        console.error('error: ', error)
      }
      finally {
        this.loading = false
        // this.$emit('close')
      }
    }
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible (val) {
      this.modalVisible = val
    }

  }
}
</script>
<style scoped lang='css'>
.upload-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.submit-but {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>