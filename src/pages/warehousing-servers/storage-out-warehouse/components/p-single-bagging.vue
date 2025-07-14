<!--
* @description  参数1
* @fileName  p-single-bagging
* @author wjp
* @date 2024-07-25 15:29:36
!-->
<template>
  <div id="p-single-bagging" class="p-single-bagging">
    <el-dialog
      title="单个装袋"
      :visible.sync="dialogVisible"
      width="80%"
      top="2vh"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-loading="allPageLoading"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card shadow="hover" class="card-style"
            ><div slot="header" class="clearfix">
              <span>信息</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="resetForm"
                >重置</el-button
              >
            </div>
            <el-form
              :model="singleBaggingInfoForm"
              :rules="singleBaggingRules"
              ref="singleBaggingForm"
              label-width="100px"
              :disabled="singleBaggingInfoFormDisabled"
            >
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.orderManagement.logisticsServices')"
                    prop="logistic_service"
                  >
                    <SelectLogisticService
                      v-model="singleBaggingInfoForm.logistic_service"
                    ></SelectLogisticService>
                  </el-form-item>
                  <el-form-item
                    :label="$t('message.storage.channelCode')"
                    prop="logistics_services"
                  >
                    <SelectLogisticChannels
                      v-model="singleBaggingInfoForm.channel_code"
                      queryKey="channel_code"
                    ></SelectLogisticChannels>
                  </el-form-item>
                  <el-form-item
                    :label="$t('message.myAccount.country')"
                    prop="country"
                  >
                    <SelectCountry
                      v-model="singleBaggingInfoForm.country"
                      style="width: 215px"
                    ></SelectCountry>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="getPaidInBags"
                      class="big-button"
                    >
                      查询
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="card-style"
            ><div slot="header" class="clearfix">
              <span>袋装</span>
              <!-- <el-button
                @click="submitChangeBag"
                style="float: right; padding: 3px 0"
                type="text"
              >
                换袋</el-button
              > -->
            </div>

            <el-form
              :model="changeBagForm"
              :rules="changeBagRules"
              v-loading="changeBagFormLoading"
              ref="changeBagForm"
              label-width="100px"
            >
              <el-row :gutter="24">
                <el-form-item :label="$t('message.storage.bagNumber')">
                  <el-col :span="18">
                    <el-input v-model="changeBagForm.bag_number"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-button
                      @click="printBagNumbers"
                      :disabled="this.changeBagForm.bag_number == ''"
                      >{{ $t('common.print') }}</el-button
                    >
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item
                  :label="$t('message.storage.numberOfBagsAlreadyPacked')"
                >
                  <span
                    style="font-size: 16px; font-weight: 600; color: #409eff"
                    >{{ changeBagForm.quantity_bagged }}</span
                  >
                </el-form-item>
              </el-row>
              <el-row :gutter="24">
                <el-form-item
                  :label="$t('message.storage.waybillNumber')"
                  prop="tracking_number"
                >
                  <el-col :span="18"
                    ><el-input
                      v-model="changeBagForm.tracking_number"
                    ></el-input
                  ></el-col>
                  <el-col :span="6"
                    ><el-button
                      @click="putIntoBag"
                      :disabled="this.changeBagForm.tracking_number == ''"
                      >确认</el-button
                    ></el-col
                  >
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item>
                  <el-button
                    @click="putIntoBag('changingBag')"
                    :disabled="this.changeBagForm.tracking_number == ''"
                    >换袋</el-button
                  >
                </el-form-item>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-card shadow="hover" class="table-card-style">
          <CstTableHead>
            <template slot="top-left">
              <el-radio-group
                v-model="radioAuditStatus"
                @change="handleRadioChange"
                class="auditStatus"
              >
                <el-badge
                  :value="paidInBagsTotal"
                  class="badge-inside-button"
                  v-for="item in baggedStatusMap"
                  :key="item.value"
                  :max="99"
                  :hidden="paidInBagsTotal === 0"
                  :type="baggedStatusColorMap[item.value]"
                >
                  <el-radio-button :label="item.value" :value="item.value">
                    <span>{{ item.label[$languageType] }}</span>
                  </el-radio-button>
                </el-badge>
              </el-radio-group>
            </template>
          </CstTableHead>
          <el-table
            :data="paidInBagsTableData"
            style="width: 100%"
            height="225px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              prop="drop_shipping_id"
              sortable
              :label="$t('message.storage.dropShippingId')"
              show-overflow-tooltip
              width="130"
            >
            </el-table-column>
            <el-table-column
              prop="order_id"
              sortable
              :label="$t('message.storage.orderNumber')"
              show-overflow-tooltip
              width="160"
            >
            </el-table-column>
            <el-table-column
              prop="cs_reference"
              sortable
              :label="$t('message.storage.referenceNo')"
              width="140"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="wave_number"
              sortable
              :label="$t('message.storage.waybillNumber')"
              width="130"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>
                  {{
                    scope.row.wave_number !== '' ? scope.row.wave_number : '-'
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="transfer_shipping_number"
              sortable
              :label="$t('message.storage.transferOrderNumber')"
              width="160"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>
                  {{
                    scope.row.transfer_shipping_number !== ''
                      ? scope.row.transfer_shipping_number
                      : '-'
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('message.storage.shippingOrderNumber')"
              sortable
              width="170"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  v-for="shipping_info in scope.row.shipping_info"
                  :key="shipping_info._id"
                  style="display: block; target: _blank"
                  @click="toShippingDetail(scope.row)"
                >
                  {{ shipping_info.tracking_number }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              :label="$t('message.storage.pendingOrderStatus')"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tag
                  :type="onePiceForShippingStatusColorMap[scope.row.status]"
                  effect="plain"
                  class="status-tag"
                >
                  {{
                    onePiceForShippingStatusMap.find(
                      (item) => item.value === scope.row.status
                    ).label[$languageType]
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="customer_id"
              sortable
              :label="$t('message.storage.userCode')"
              show-overflow-tooltip
              width="100"
            >
            </el-table-column>

            <el-table-column
              prop="name"
              :label="$t('message.storage.warehouse')"
              show-overflow-tooltip
              width="160"
            >
              <template slot-scope="scope">
                {{ storageMap[scope.row.storage_uuid] }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common.recipientCountry')"
              show-overflow-tooltip
              width="130"
            >
              <template slot-scope="scope">
                {{ getCountryByAbbreviation(scope.row.recipient_info.country) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="confirm_time"
              sortable
              :label="$t('message.storage.submissionDeterminationTime')"
              show-overflow-tooltip
              width="220"
            >
            </el-table-column>
            <el-table-column
              prop="create_time"
              sortable
              :label="$t('common.createTime')"
              show-overflow-tooltip
              width="160"
            >
            </el-table-column>
            <!-- <el-table-column
              :label="$t('common.operation')"
              fixed="left"
              width="160"
            >
              <template slot-scope="scope">
                <el-button
                  @click="checkData(scope.row)"
                  type="text"
                  size="small"
                >
                  {{ $t('common.check') }}
                </el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <el-row type="flex" justify="end" style="margin-top: 5px">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paidInBagsQueryData.page_number"
              :page-sizes="[10, 50, 100]"
              :page-size="paidInBagsQueryData.page_size"
              layout="total,sizes, prev, pager, next"
              :total="paidInBagsTotal"
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
import {
  operateTypeOptions,
  baggedStatusMap,
  baggedStatusColorMap,
  onePiceForShippingStatusMap,
  onePiceForShippingStatusColorMap
} from '@/common/field-maping'
import SelectCountry from '@/pages/components/select-country.vue'
import {
  fetchBaggingListSpecificElements,
  fetchBagLabel,
  getCountryByAbbreviation,
  toShippingDetail,
  inBags
} from '@/common/common-func'
import CstTableHead from '@/components/cst-table-head/index.vue'
import SelectLogisticService from '@/pages/components/select-logistics-api.vue'
import SelectLogisticChannels from '@/pages/components/select-logistics-channels.vue'
import { del } from 'vue'

export default {
  name: 'p-single-bagging',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    storageMap: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    SelectLogisticService,
    CstTableHead,
    SelectCountry,
    SelectLogisticChannels
  },
  data () {
    return {
      allPageLoading: false,
      changeBagFormLoading: false,
      quantity_bagged: {},
      onePiceForShippingStatusMap,
      onePiceForShippingStatusColorMap,
      logistic_service_options: [],
      channel_code_options: [],
      logistic_service_remote_loading: false,
      channel_code_remote_loading: false,
      paidInBagsQueryData: {
        page_number: 1,
        page_size: 10
      },
      singleBaggingInfoFormDisabled: false,
      paidInBagsTotal: 0,
      paidInBagsTableData: [],
      radioAuditStatus: 1,
      baggedStatusMap,
      baggedStatusColorMap,
      auditStatusMap: {
        0: 0,
        1: 0
      },
      dialogVisible: false,
      operateTypeOptions,
      singleBaggingInfoForm: {},
      singleBaggingRules: {
        logistic_service: [
          {
            required: true,
            message: this.$t('message.orderManagement.logisticsServiceSelect'),
            trigger: 'change'
          }
        ]
      },
      changeBagForm: {
        bag_number: '',
        quantity_bagged: 0,
        tracking_number: ''
      },
      changeBagRules: {},
      multipleSelection: []
    }
  },
  methods: {
    inBags,
    toShippingDetail,
    getCountryByAbbreviation,
    resetForm () {
      this.singleBaggingInfoFormDisabled = false
      this.$refs.singleBaggingForm.resetFields()
      this.singleBaggingInfoForm = {}
      this.$refs.changeBagForm.resetFields()
      this.changeBagForm = {
        bag_number: '',
        quantity_bagged: 0,
        tracking_number: ''
      }
      this.paidInBagsTableData = []
      this.paidInBagsTotal = 0
      this.paidInBagsQueryData = {
        page_number: 1,
        page_size: 10
      }
    },
    getPaidInBags () {
      // 获取已付款（未袋装）代发单列表
      this.$refs.singleBaggingForm.validate((valid) => {
        if (valid) {
          this.allPageLoading = true
          this.singleBaggingInfoFormDisabled = true
          this.paidInBagsQueryData = {
            provider_uuid: this.provider_uuid,
            ...this.paidInBagsQueryData,
            ...this.singleBaggingInfoForm
          }
          this.$ajax({
            url: '/api-prefix/api/dropshipping/get-bagged-info',
            method: 'get',
            roleType: this.roleType,
            params: this.paidInBagsQueryData
          })
            .then((res) => {
              this.paidInBagsTableData = res.data.results
              this.paidInBagsTotal = res.data.total
            })
            .finally(() => {
              this.allPageLoading = false
            })
        }
      })
    },
    logisticServiceRemoteQueryMethod (query) { },

    fetchBagLabel,
    putIntoBag (operationType = '') {
      if (!this.changeBagForm.tracking_number) {
        this.$message.error(this.$t('message.storage.waybillNumberPlaceholder'))
        return
      }
      this.changeBagFormLoading = true
      let queryParam = {
        provider_uuid: this.provider_uuid,
        tracking_number: this.changeBagForm.tracking_number,
        bag_number: this.changeBagForm.bag_number
      }
      if (operationType === 'changingBag') {
        delete queryParam.bag_number
      }
      this.inBags(queryParam)
        .then((resData) => {
          if (this.quantity_bagged?.[this.changeBagForm.bag_number]) {
            this.quantity_bagged[this.changeBagForm.bag_number]++
          }
          this.changeBagForm.quantity_bagged =
            this.quantity_bagged[this.changeBagForm.bag_number]
          this.changeBagForm.bag_number = resData.bag_number
          this.changeBagForm.tracking_number = ''
          this.getPaidInBags()
        })
        .catch((error) => {
          console.error(error)
          Object.assign(this.quantity_bagged, {})
          this.quantity_bagged[this.changeBagForm.bag_number] = 1
        })
        .finally(() => {
          this.changeBagFormLoading = false
        })
    },
    printBagNumbers () {
      if (!this.changeBagForm.bag_number) {
        this.$message.error(this.$t('message.storage.bagNumberPlaceholder'))
        return
      }
      this.allPageLoading = true
      let queryParam = {
        bag_numbers: [this.changeBagForm.bag_number],
        provider_uuid: this.provider_uuid
      }
      this.fetchBagLabel(queryParam)
        .then((resData) => {
          this.getFileIndependently({
            filename: resData,
            provider_uuid: this.provider_uuid
          })
        })
        .finally(() => {
          this.allPageLoading = false
        })
    },
    fetchBaggingListSpecificElements,

    checkData (row) {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleClose () {
      this.dialogVisible = false
      this.$emit('close')
    },
    submitChangeBag () {
      this.$message.success(this.$t('common.operationSuccessful'))
    },
    handleRadioChange () {
      let queryParam = {
        radioAuditStatus,
        curPage: 1
      }
    },
    handleSizeChange (val) {
      this.paidInBagsQueryData.page_size = val
      this.getPaidInBags()
    },
    handleCurrentChange (val) {
      this.paidInBagsQueryData.page_number = val
      this.getPaidInBags()
    },
    queryOrder () {
      this.paidInBagsQueryData.page_number = 1
    }
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    }
  },
  mounted () { },
  watch: {
    visible (val) {
      this.dialogVisible = val
    }
  }
}
</script>
<style scoped lang="scss">
.card-style {
  height: 300px;
}
.table-card-style {
  height: 350px;
  margin-top: 5px;
}
::v-deep .el-badge__content {
  z-index: 100;
}
::v-deep
  .audit-status:last-child
  .badge-inside-button
  .el-radio-button
  .el-radio-button__inner:last-child {
  border-radius: 0 4px 4px 0;
  background-color: green;
}
.auditStatus {
  ::v-deep div.badge-inside-button {
    .el-radio-button__inner {
      border-radius: 0 0 0 0;
    }
  }
  ::v-deep div.badge-inside-button:first-child {
    .el-radio-button__inner {
      border-radius: 4px 0 0 4px;
    }
  }
  ::v-deep div.badge-inside-button:last-child {
    .el-radio-button__inner {
      border-radius: 0 4px 4px 0;
    }
  }
  .big-button {
    width: 100%;
  }
  .font-style {
    font-size: 16px;
    font-weight: 600;
    color: #409eff;
  }
}
</style>
