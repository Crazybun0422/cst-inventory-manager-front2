<!--
* @description  参数1
* @fileName  p-batch-bagging
* @author wjp
* @date 2024-07-25 15:30:07
!-->
<template>
  <div id="p-batch-bagging" class="p-batch-bagging">
    <el-dialog
      :title="$t('message.storage.batchBagging')"
      :visible.sync="dialogVisible"
      width="80%"
      top="2vh"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card shadow="hover" class="card-style"
            ><div slot="header" class="clearfix">
              <span>{{ $t('message.storage.conditionSetting') }}</span>
            </div>
            <el-form
              :inline="true"
              :model="batchBaggingInfoForm"
              :rules="batchBaggingRules"
              class="demo-form-inline"
            >
              <el-form-item>
                <el-select
                  v-model="queryData.storage_uuid"
                  filterable
                  clearable
                  style="width: 140px"
                  :placeholder="$t('message.storage.warehouseSelect')"
                >
                  <el-option
                    v-for="item in storageList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="shipping_company">
                <el-select
                  popper-class="more-tag-data"
                  v-model="queryData.shipping_company"
                  clearable
                  filterable
                  :loading="logisticsRemoteLoading"
                  style="width: 140px"
                  @focus="getLogisticsChannels"
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

              <el-form-item prop="country">
                <SelectCountry v-model="queryData.country"></SelectCountry>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="queryResult">{{
                  $t('common.search')
                }}</el-button>
                <el-button type="primary" @click="resetQuery">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="card-style"
            ><div slot="header" class="clearfix">
              <span>{{ $t('message.storage.baggingInformation') }}</span>
            </div>

            <el-form
              :model="changeBagForm"
              ref="changeBagForm"
              label-width="100px"
            >
              <el-row>
                <el-form-item :label="$t('common.prompt')">
                  <span>{{ changeBagForm.prompt }}</span>
                </el-form-item>
              </el-row>
              <el-row :gutter="24">
                <el-form-item :label="$t('message.storage.bagNumber')">
                  <el-col :span="18">
                    <el-input
                      v-model="changeBagForm.bag_number"
                      disabled
                    ></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-button>{{ $t('common.print') }}</el-button>
                  </el-col>
                </el-form-item>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-card shadow="hover" class="table-card-style">
          <CstTableHead>
            <template slot="top-right">
              <el-button
                icon="el-icon-document-add"
                @click="batchBagging"
                type="primary"
                plain
                >{{ $t('message.storage.batchBagging') }}</el-button
              >
              <el-button
                icon="el-icon-download"
                @click="exportInfo"
                type="primary"
                plain
                >{{ $t('common.export') }}</el-button
              ></template
            >
          </CstTableHead>
          <el-table
            :data="tableData"
            style="width: 100%"
            height="225px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column
              prop="system_number"
              sortable
              :label="$t('message.storage.systemOrderNumber')"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="shipment_number"
              sortable
              :label="$t('message.storage.waybillNumber')"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="transfer_order_number"
              :label="$t('message.storage.transferOrderNumber')"
              width="160"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              :label="$t('message.myAccount.clientId')"
              prop="customer_id"
              sortable
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="logistics_services"
              :label="$t('message.orderManagement.logisticsServices')"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="recipient_name"
              :label="$t('message.myAccount.recipient')"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="country"
              :label="$t('message.storage.recipientIsCountry')"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="receipt_time"
              sortable
              :label="$t('message.storage.receiptTime')"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end" style="margin-top: 5px">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="queryTableData.page_number"
              :page-sizes="[10, 50, 100]"
              :page-size="queryTableData.page_size"
              layout="total,sizes, prev, pager, next"
              :total="total"
              background
            >
            </el-pagination>
          </el-row>
        </el-card>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="medium">
          {{ $t('common.cancel') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectCountry from '@/pages/components/select-country.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import { query_all_logistics_channels, query_all_customers, getStorageDefinition } from '@/common/common-func'

export default {
  name: 'p-batch-bagging',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  components: {
    SelectCountry, CstTableHead
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      storageList: [],
      changeBagForm: {
      },
      multipleSelection: [],
      queryTableData: {
        page_number: 1,
        page_size: 10
      },
      total: 0,
      tableData: [
        {
          system_number: '123456',
          shipment_number: '123456',
          transfer_order_number: '123456',
          customer: 1007,
          logistics_services: '顺丰',
          recipient_name: '张三',
          country: '中国',
          receipt_time: '2021-07-09 00:01'
        },
      ],
      batchBaggingInfoForm: {
        operate_type: '',
        service_provider: '',
        logistics_services: '',
        country: ''
      },
      batchBaggingRules: {
        operate_type: [
          { required: true, message: '请选择操作类型', trigger: 'change' }
        ],
        service_provider: [
          { required: true, message: '请选择服务商', trigger: 'change' }
        ],
        logistics_services: [
          { required: true, message: '请选择物流服务', trigger: 'change' }
        ],
        country: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ]
      },
      queryData: {
        storage_uuid: '',
        shipping_company: '',
        country: ''
      },
      customersRemoteLoading: false,
      logistics_channels: [],
      logisticsRemoteLoading: false,
      customers: [],
      query_all_logistics_channels, query_all_customers,
      getStorageDefinition,
      storageMap: {}
    }
  },
  methods: {
    batchBagging () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('common.pleaseSelectAtLeastOneData'))
        return
      }
      this.$message.success(this.$t('common.operationSuccessful'))
    },
    exportInfo () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('common.pleaseSelectAtLeastOneData'))
        return
      }
      this.$message.success(this.$t('common.operationSuccessful'))
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    queryResult () {
    },
    resetQuery () {
      this.queryData = {
        storage_uuid: '',
        shipping_company: '',
        country: ''
      }
    },
    async queryStorageDefinition () {
      const res = await getStorageDefinition(this.provider_uuid, this.roleType)
      if (this.$isRequestSuccessful(res.code)) {
        this.storageList = res.data.map(item => ({
          label: item.name,
          value: item.storage_define_uuid
        }));
        res.data.forEach((obj) => {
          this.$set(this.storageMap, obj.storage_define_uuid, obj.name)
        })
        this.queryData.storage_uuid = this.storageList[0].value
      }
    },
    handleClose () {
      this.dialogVisible = false
      this.$emit('close')
    },
    getcustomers () {
      this.customersRemoteLoading = true
      let provider_uuid = this.provider_uuid
      if (!provider_uuid) {
        console.error("provider_uuid is null or undefined");
        this.remoteLoading = false;
        return;
      }
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: 1,
        page_size: 1000
      }
      query_all_customers(queryParams, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.customers = res.data.results.map(item => ({
            user_code: item.user_code,
            user_id: item.related_id //TODO： 这里看是否需要转ID
          }))
        }
      }).finally(() => {
        this.customersRemoteLoading = false
      })
    },
    async getLogisticsChannels () {
      this.logisticsRemoteLoading = true
      let provider_uuid = this.provider_uuid
      if (!provider_uuid) {
        console.error("provider_uuid is null or undefined");
        return;
      }
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: 1,
        page_size: 1000
      }
      //TODO: 这里this.roleType获取不到只能this.$getRoleType(this.$route.path)需要优化
      await query_all_logistics_channels(queryParams, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.logistics_channels = res.data.results.map(item => ({
            channel_name: item.channel_name,
            channel_code: item.channel_code
          }))
        }
      }).finally(() => {
        this.logisticsRemoteLoading = false
      })

    },
    handleSizeChange (val) {
      this.queryData.page_size = val
    },
    handleCurrentChange (val) {
      this.queryData.page_number = val

    },
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },

  },
  async mounted () {
    if (this.provider_uuid) {
      await this.getLogisticsChannels();
      await this.queryStorageDefinition()
      this.getcustomers()
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    },
    provider_uuid (newVal) {
      if (newVal) {
        this.getLogisticsChannels();
        this.getcustomers()
      }
    }
  }
}
</script>
<style scoped lang='css'>
.card-style {
  height: 175px;
}
</style>