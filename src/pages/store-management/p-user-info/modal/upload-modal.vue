<template>
  <section class="upload-modal">
    <el-form :model="submitData" :rules="rules" ref="form" label-position="left" label-width="110px"
      v-loading="pageLoading" :disabled="showUploadProgress">
      <el-form-item :label="$t('message.userInfo.formLabelShopUrl')" prop="ewis_shop_url">
        <el-select v-model="submitData.ewis_shop_url" :placeholder="$t('common.pleaseSelect')" style="width: 100%"
          filterable>
          <el-option v-for="item in parentTableData.length && parentTableData" :key="item.ewis_shop_url"
            :label="item.ewis_shop_url" :value="item.ewis_shop_url">
            <span class="custom-select-option-left">{{
              item.ewis_shop_url
            }}</span>
            <span class="custom-select-option-right">{{
              item.ewis_user_name
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('message.userInfo.uploadFile')" prop="fileList">
        <div>
          <el-upload ref="upload" action="/api/shop-manager/fulfill-all" accept=".xls,.xlsx" :limit="1"
            :auto-upload="false" :file-list="fileList" :http-request="upLoadFile" :on-change="handleChange"
            :on-remove="handleRemove">
            <el-button slot="trigger" size="small" type="primary"
              :disabled="!submitData.ewis_shop_url || showUploadProgress">{{ $t('message.userInfo.selectFile')
              }}</el-button>
            <!-- <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button> -->
          </el-upload>
          <!-- 文本提示 -->
          <p>
            {{ $t('message.userInfo.downloadTemplateFileDescription') }}
            <span @click="downloadTemplate" style="color: #409eff; cursor: pointer; user-select: none">
              {{ $t('message.userInfo.downloadTemplateFile') }}
            </span>
          </p>
        </div>
      </el-form-item>
      <UploadFileProgress v-show="showUploadProgress" :mission_id="mission_id" @satrt-upload="startFulfill"
        @options-completed="fulfillComplete" @fulfill-status-info="fulfillStatusInfo" />
    </el-form>
    <ResetFulfillment :errorData="errorMessages" :visible="errorMessagesVisible" :mission_id="mission_id"
      @close="handleCloseErrorMessages" @reset-fulfillment="resetFulfillment" />
  </section>
</template>

<script>
/**
 * @file 上传弹窗
 * @date 2024/03/24
 */

// 组件
import UploadFileProgress from '@/components/upload-file-progress.vue'
import ResetFulfillment from '../../p-order-info/components/reset-fulfillment.vue'
// mixins
import formMixin from '@/common/form-mixin'

// 函数
import pick from 'lodash/pick'
import {
  getTemplateFile,
  getBatchFulfillStatus,
  resetSyncOrder
} from '@/common/common-func'
// 常量

export default {
  name: 'upload-modal',
  components: { UploadFileProgress, ResetFulfillment },
  mixins: [formMixin],
  props: {
    parentTableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      submitData: {
        ewis_shop_url: ''
      },
      showUploadProgress: false,
      pageLoading: false,
      fileList: [],
      mission_id: '',
      errorMessages: [],
      errorMessagesVisible: false,
      rules: {
        ewis_shop_url: [
          {
            required: true,
            message: this.$t('message.userInfo.shopSelectPlaceholder'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    // showUploadProgress () {
    //   // 当mission_id存在 但是 存在错误信息是不显示精度条
    //   return this.mission_id !== '' && this.mission_id !== undefined
    // }
  },
  methods: {
    resetSyncOrder,
    getTemplateFile,
    getBatchFulfillStatus,
    startFulfill() {
      this.showUploadProgress = true
      this.$emit('upload-success')
    },
    handleCloseErrorMessages() {
      this.errorMessagesVisible = false
    },
    fulfillComplete() {
      this.$emit('fulfill-completed')
    },
    getData() {
      return pick(this.submitData, ['tracking_url', 'delay_secs'])
    },
    resetFulfillment(mission_id) {
      let queryParmas = {}
      if (mission_id) {
        queryParmas.mission_id = mission_id
      }
      this.resetSyncOrder(queryParmas)
        .then(() => {
          this.mission_id = ''
          this.fileList = []
          this.errorMessages = null
          this.errorMessagesVisible = false
        })
        .catch((error) => {
          console.error('resetSyncOrder error:', error)
        })
    },
    downloadTemplate() {
      this.pageLoading = true
      this.getTemplateFile({ filename: 'fulfillment_template.xls' })
        .then((res) => {
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = 'fulfillment_template.xls' // 默认文件名
          link.click()
          URL.revokeObjectURL(link.href)
        })
        .catch((error) => {
          this.$message.error('下载模板失败')
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    fulfillStatusInfo(mission_id = '') {
      if (!this.submitData.ewis_shop_url) {
        return
      }
      this.pageLoading = true
      let vm = this
      this.getBatchFulfillStatus({ "shop_url": vm.submitData.ewis_shop_url })
        .then((res) => {
          if (res.data?.error) {
            console.log(res.data)
            this.errorMessages = res.data.error
            this.errorMessagesVisible = true
            this.showUploadProgress = mission_id === '' || mission_id === undefined ? false : true
          } else if (res.data?.mission_id) {
            this.showUploadProgress = true
            this.mission_id = res.data?.mission_id
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    upLoadFile(file) {
      let vm = this
      let formData = new FormData()
      formData.append('upload', file.file)
      vm.$ajax({
        url: `${file.action}?shop_url=${vm.submitData.ewis_shop_url}`,
        method: 'post',
        roleType: vm.roleType,
        data: formData
      }).then(({ data = {} }) => {
        this.mission_id = data.mission_id
        vm.fileList[0] = {
          ...vm.fileList[0],
          mission_id: data.mission_id,
          status: 'success'
        }
      })
    },
    handleChange(file, fileList) {
      this.fileList[0] = {
        name: file.name,
        status: file.status
      }
    },
    handleRemove(file, fileList) {
      this.fileList = []
    }
  },
  mounted() {
    this.fulfillStatusInfo()
  }
}
</script>

<style scoped lang="scss">
.upload-modal {}

.custom-select-option-left {
  float: left;
}

.custom-select-option-right {
  float: right;
  color: #8492a6;
  font-size: 13px;
}
</style>
