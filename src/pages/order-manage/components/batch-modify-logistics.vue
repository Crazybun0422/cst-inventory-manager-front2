<!--
* @description  参数1
* @fileName  batch-modify-logistics
* @author wjp
* @date 2024-06-04 23:09:41
!-->
<template>
  <div id="batch-modify-logistics" class="batch-modify-logistics">
    <el-dialog
      :title="$t('message.orderManagement.batchModifyLogisticsInformation')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      v-loading="loading"
    >
      <el-form
        :model="modalShippingForm"
        ref="modalShippingForm"
        :rules="shippingRules"
      >
        <el-row :gutter="18">
          <el-col :span="8">
            <el-form-item prop="shippingKey">
              <el-select
                v-model="modalShippingForm.shippingKey"
                :placeholder="$t('common.pleaseSelect')"
              >
                <el-option
                  v-for="item in shippingOptions"
                  :key="item.value"
                  :label="item.label?.[$languageType]"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="shippingValue">
              <el-select
                v-model="modalShippingForm.shippingValue"
                clearable
                filterable
                @focus="getLogisticsChannels"
                style="width: 280px"
                :placeholder="$t('message.myAccount.logisticsChannelsSelect')"
              >
                <el-option
                  v-for="item in logistics_channels"
                  :key="item.channel_code"
                  :label="item.channel_name"
                  :value="item.channel_code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose"> {{ $t('common.cancel') }} </el-button>
        <el-button @click="submitForm" type="primary">
          {{ $t('message.orderManagement.saveAndreport') }}</el-button
        >
      </span>
      <el-dialog
        :title="$t('common.prompt')"
        :visible.sync="promptVisible"
        width="30%"
        :before-close="handleClose"
        :modal-append-to-body="false"
        v-loading="loading"
      >
        <p style="text-indent: 1em">
          <span class="prompt-message">{{
            $t('message.orderManagement.batchModifyLogisticsPrompt')
          }}</span>
        </p>
        <p style="text-indent: 1em; margin-top: 10px">
          <span class="order-ids">{{ haveTrackingNumberList.join(', ') }}</span>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ $t('common.no') }}</el-button>
          <el-button type="primary" @click="coverLogistics">{{
            $t('common.yes')
          }}</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="$t('common.errorPrompt')"
        :visible.sync="errorInfoVisible"
        width="30%"
        :before-close="handleErrorInfoClose"
        :modal-append-to-body="false"
      >
        <p style="text-indent: 1em">
          <span class="prompt-message">{{ errorMessages[$languageType] }}</span>
        </p>
        <div
          v-for="(item, index) in errorInfoList"
          :key="index"
          class="error-item"
        >
          <!-- 先显示 orderNames, 然后显示错误信息，分别设置样式 -->
          <p style="text-indent: 1em; margin-top: 10px">
            <span class="order-ids">{{ item.order_id }}</span
            >:
            <span class="error-message">{{ item.message }}</span>
          </p>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleErrorInfoClose">{{
            $t('common.cancel')
          }}</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { query_all_logistics_channels, batchUpdateLogistics } from '@/common/common-func'
import { shippingOptions } from '@/common/field-maping'
export default {
  name: 'batch-modify-logistics',
  props: {
    orderInfo: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {

  },
  data () {
    return {
      dialogVisible: false,
      promptVisible: false,
      errorInfoVisible: false,
      loading: false,
      modalShippingForm: {
        shippingKey: 'channel_code',
        shippingValue: ''
      },
      shippingOptions,
      logistics_channels: [],
      shippingRules: {
        shippingValue: [
          { required: true, message: this.$t('message.myAccount.logisticsChannelsSelect'), trigger: 'change' }
        ]
      },
      haveTrackingNumberList: [],
      errorInfoList: [],
      errorMessages: {},
    }
  },
  methods: {
    batchUpdateLogistics,
    handleClose (refresh = false) {
      this.dialogVisible = false
      this.promptVisible = false
      this.$refs.modalShippingForm.resetFields()
      this.$set(this.modalShippingForm, 'shippingValue', '')
      this.$emit('close', refresh)
    },
    handleErrorInfoClose (refresh = false) {
      this.errorInfoVisible = false
      this.$refs.modalShippingForm.resetFields()
      this.$set(this.modalShippingForm, 'shippingValue', '')
      this.$emit('close', refresh)
    },
    submitForm () {
      this.$refs.modalShippingForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.haveTrackingNumberList = this.orderInfo.filter(order =>
            order.shipping_statuses.some(status =>
              status.tracking_number && status.tracking_number.trim() !== ""
            )
          ).map(order => order.order_id);
          if (this.haveTrackingNumberList.length > 0) {
            this.promptVisible = true
            this.loading = false
            return
          }
          else {
            this.saveAndReportLogistics()
          }
        }
      })
    },
    coverLogistics () {
      this.$refs.modalShippingForm.validate(valid => {
        if (valid) {
          this.saveAndReportLogistics()
        }
      })
    },
    saveAndReportLogistics () {
      this.loading = true
      let orderIds = this.orderInfo.map(item => item.order_id)
      let modificationParams = {
        modification: {
          order_ids: orderIds,
          [this.modalShippingForm.shippingKey]: this.modalShippingForm.shippingValue
        }
      }
      this.batchUpdateLogistics(modificationParams).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(this.$t('common.operationSuccessful'))
          this.handleClose(true)
        } else if (res.code === 11006) {
          this.errorInfoList = res.data?.errors
          this.errorMessages = res.msg
          this.promptVisible = false
          this.errorInfoVisible = true
        }

      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.loading = false
        // this.handleClose(true)
      })
    },
    getLogisticsChannels () {
      this.remoteLoading = true
      let provider_uuid = this.dsCurrentProviderUuid
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: 1,
        page_size: 10000
      }
      query_all_logistics_channels(queryParams, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.logistics_channels = res.data.results.map(item => ({
            channel_name: item.channel_name,
            channel_code: item.channel_code
          }))
        }
      }).finally(() => {
        this.remoteLoading = false
      })

    },

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
.order-ids {
  color: #409eff;
  font-weight: bold;
}

.prompt-message {
  color: #f10c0c;
  font-weight: bold;
  word-break: break-word;
}
.error-message {
  color: #f10c0c;
  font-weight: 400;
  word-break: break-word;
}
</style>