<!--
* @description  参数1
* @fileName  batch-edit-order
* @author wjp
* @date 2024-01-05 22:02:11
!-->
<template>
  <div id="batch-edit-order" class="batch-edit-order">
    <el-dialog
      :title="$t('common.batchModify')"
      width="40%"
      @close="closeDialog"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <el-form
        :model="modalShippingForm"
        ref="modalShippingForm"
        :rules="shippingRules"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item prop="shippingKey">
              <el-select
                v-model="modalShippingForm.shippingKey"
                disabled
                :placeholder="$t('common.pleaseSelect')"
              >
                <el-option
                  v-for="item in shippingOptions"
                  :key="item.value"
                  :label="item.label[$languageType]"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- TODO: 这里需要远程加载 -->
          <el-col :span="10">
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
          <el-col :span="6">
            <el-form-item>
              <el-button
                @click="editShipping"
                plain
                type="primary"
                class="submit-button"
                >{{ $t('message.myAccount.editLogisticsChannel') }}</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        :model="modalStorageForm"
        ref="modalStorageForm"
        :rules="storageRules"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item prop="storageKey">
              <el-select
                v-model="modalStorageForm.storageKey"
                disabled
                :placeholder="$t('common.pleaseSelect')"
              >
                <el-option
                  v-for="item in storageOptions"
                  :key="item.value"
                  :label="item.label?.[$languageType]"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="storageValue">
              <el-select
                v-model="modalStorageForm.storageValue"
                :placeholder="$t('common.pleaseSelect')"
                style="width: 280px"
              >
                <el-option
                  v-for="item in storageListOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button
                @click="editStorage"
                plain
                type="primary"
                class="submit-button"
                >{{ $t('message.storage.editStore') }}</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model="modalOrderForm" ref="modalOrderForm" :rules="orderRules">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item prop="orderKey">
              <el-select
                v-model="modalOrderForm.orderKey"
                :placeholder="$t('common.pleaseSelect')"
              >
                <el-option
                  v-for="item in orderOptions"
                  :key="item.value"
                  :label="item.label?.[$languageType]"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="orderValue">
              <el-input
                v-model="modalOrderForm.orderValue"
                style="width: 280px"
                :placeholder="$t('common.pleaseEnterContent')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button
                @click="editOrder"
                plain
                type="primary"
                class="submit-button"
                >{{ $t('message.orderManagement.editeOrder') }}</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { query_all_logistics_channels } from '@/common/common-func'
import SelectShippingChannel from './select-shipping-channel'
import { shippingOptions, batchModifyOrderOptions, batchModifyOrderWarehouseOptions } from '@/common/field-maping'
export default {
  name: 'batch-edit-order',
  props: {
    visible: { type: Boolean, default: false },
    orderIds: { type: Array, default: () => [] },
    storageList: { type: Array, default: () => [] }
  },
  components: {
    SelectShippingChannel
  },
  data () {
    return {
      logistics_channels: [],
      shippingRules: {
        shippingValue: [
          {
            required: true,
            message: this.$t('message.myAccount.logisticsChannelsSelect'),
            trigger: 'change'
          }
        ]
      },
      storageRules: {
        storageValue: [
          {
            required: true,
            message: this.$t('message.storage.warehouseSelect'),
            trigger: 'change'
          }
        ]
      },
      orderRules: {
        orderValue: [
          {
            required: true,
            message: this.$t('common.pleaseEnterContent'),
            trigger: 'change'
          }
        ]
      },
      modalProductForm: {
        productKey: 'product_info',
        productValue: ''
      },
      modalOrderForm: {
        orderKey: 'state',
        orderValue: ''
      },
      modalShippingForm: {
        shippingKey: 'channel_code',
        shippingValue: ''
      },
      modalStorageForm: {
        storageKey: 'storage_uuid',
        storageValue: ''
      },
      batchEditOrderIds: [],
      loading: false,

      dialogFormVisible: false,
      shippingOptions,
      storageOptions: batchModifyOrderWarehouseOptions,
      orderOptions: batchModifyOrderOptions,
      storageListOptions: [],
    }

  },
  methods: {
    handleUpdate (value) {

      this.modalShippingForm.shippingValue = value
    },
    resetFormFunc () {
      this.modalStorageForm = Object.assign({}, {
        storageKey: 'storage_uuid',
        storageValue: ''
      })
      this.$refs.modalStorageForm.resetFields()
      this.modalOrderForm = Object.assign({}, {
        orderKey: 'state',
        orderValue: ''
      })
      this.$refs.modalOrderForm.resetFields()
      this.modalShippingForm = Object.assign({}, {
        shippingKey: 'channel_code',
        shippingValue: ''
      })
      this.$refs.modalShippingForm.resetFields()
    },
    editOrder () {
      this.$refs.modalOrderForm.validate(async (valid) => {
        if (valid) {
          let updateData = {}
          updateData[this.modalOrderForm.orderKey] = this.modalOrderForm.orderValue
          await this.submitEdit(updateData)

        } else {
          return false
        }
      })
    },
    editStorage () {
      this.$refs.modalStorageForm.validate(async (valid) => {
        if (valid) {
          let updateData = {}
          updateData[this.modalStorageForm.storageKey] = this.modalStorageForm.storageValue
          await this.submitEdit(updateData)

          // this.$emit('editStorage', this.modalStorageForm)
        } else {
          return false
        }
      })
    },
    editShipping () {
      this.$refs.modalShippingForm.validate(async (valid) => {
        if (valid) {
          let updateData = {}
          updateData[this.modalShippingForm.shippingKey] = this.modalShippingForm.shippingValue
          await this.submitEdit(updateData)
          // this.$emit('editShipping', this.modalShippingForm)
        } else {
          return false
        }
      })
    },
    closeDialog () {
      this.dialogFormVisible = false
      this.resetFormFunc()
      this.$refs.modalShippingForm.clearValidate();
      this.$refs.modalStorageForm.clearValidate();
      this.$refs.modalOrderForm.clearValidate();
      this.$emit('close')
    },
    async submitEdit (form) {
      try {
        this.loading = true
        const res = await this.$ajax({
          url: '/api-prefix/api/order/batch-modify',
          method: 'put',
          data: {
            modification: {
              order_ids: this.batchEditOrderIds,
              ...form
            }
          }
        })
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(this.$t('common.editSuccessful'))
          this.$emit('confirm')
        }
      }
      catch (error) {
        console.error(error);
      }
      finally {

        this.loading = false
      }
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
    dsCurrentProviderUuid () {
      return this.$store.state.user.dsCurrentProviderUuid
    },

  },
  mounted () {

  },
  watch: {
    visible: {
      handler (newValue) {
        this.dialogFormVisible = newValue
        this.batchEditOrderIds = this.orderIds
        this.storageListOptions = this.storageList
      },
      immediate: true
    },
    // dsCurrentProviderUuid () {
    //   this.getLogisticsChannels()
    // }
  }
}
</script>
<style scoped lang='css'>
.submit-button {
  width: 145px;
}
</style>