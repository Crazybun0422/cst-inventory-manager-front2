<!--
* @description  参数1
* @fileName  p-order-info
* @author wjp
* @date 2024-06-09 20:44:07
!-->
<template>
  <div id="p-order-info" class="p-order-info">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card class="card-item">
          <div slot="header" class="clearfix">
            <span> {{ $t('common.basicInformation') }}</span>
          </div>
          <el-descriptions class="margin-top" :column="3">
            <el-descriptions-item
              :label="$t('message.orderInfo.orderNumber')"
              >{{
                currentData.order_id ? currentData.order_id : '-'
              }}</el-descriptions-item
            >
            <el-descriptions-item
              :label="$t('message.orderInfo.receivingBatch')"
              >{{
                currentData.receiving_batch ? currentData.receiving_batch : '-'
              }}</el-descriptions-item
            >
            <el-descriptions-item :label="$t('message.storage.bagNumber')">{{
              currentData.bag_number ? currentData.bag_number : '-'
            }}</el-descriptions-item>
            <el-descriptions-item
              :label="$t('message.orderInfo.totalFreight')"
              >{{
                currentData.total_freight ? currentData.total_freight : '-'
              }}</el-descriptions-item
            >
            <el-descriptions-item :label="$t('message.orderInfo.orderStatus')">
              <el-tag
                :type="orderStatusMarkColorMap[currentData.order_status]"
                effect="plain"
                class="status-tag"
              >
                {{
                  StockEntryStatusMap[currentData.order_status]?.[
                    $languageType
                  ] || ''
                }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item
              :label="$t('message.orderInfo.problemCutOffStatus')"
              >{{
                currentData?.issue_status ? currentData?.issue_status : '-'
              }}</el-descriptions-item
            >

            <el-descriptions-item
              :label="$t('message.orderInfo.severalPerTicket')"
              >{{
                currentData.items_per_shipment
                  ? currentData.items_per_shipment
                  : '-'
              }}</el-descriptions-item
            >
            <el-descriptions-item :label="$t('message.orderInfo.salesman')">{{
              currentData.salesman ? currentData.salesman : '-'
            }}</el-descriptions-item>

            <el-descriptions-item :label="$t('common.chargeableWeight')">{{
              currentData.billable_weight ? currentData.billable_weight : '-'
            }}</el-descriptions-item>
            <el-descriptions-item
              :label="$t('message.orderInfo.actualweight')"
              >{{
                currentData.actual_weight ? currentData.actual_weight : '-'
              }}</el-descriptions-item
            >
            <el-descriptions-item :label="$t('message.storage.volumeWeight')">{{
              currentData.volume_weight ? currentData.volume_weight : '-'
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('common.createTime')">{{
              currentData.create_time ? currentData.create_time : '-'
            }}</el-descriptions-item>
            <el-descriptions-item
              :label="$t('message.orderInfo.weighingAndBillingTime')"
              >{{
                currentData.weighing_time ? currentData.weighing_time : '-'
              }}</el-descriptions-item
            >
            <el-descriptions-item :label="$t('message.storage.deliveryTime')">{{
              currentData.shipping_time ? currentData.shipping_time : '-'
            }}</el-descriptions-item>
            <el-descriptions-item
              :label="$t('message.orderInfo.domesticTrackingNumber')"
              >{{
                currentData.domestic_tracking_number
                  ? currentData.domestic_tracking_number
                  : '-'
              }}</el-descriptions-item
            >
            <el-descriptions-item :label="$t('message.orderManagement.notes')"
              >待补充</el-descriptions-item
            >
            <el-descriptions-item
              :label="$t('message.orderInfo.insuredamount')"
              >{{
                currentData.insurance_amount_remarks
                  ? currentData.insurance_amount_remarks
                  : '-'
              }}</el-descriptions-item
            >
          </el-descriptions>
        </el-card>
        <el-card class="card-item"
          ><div slot="header" class="clearfix">
            <span>{{ $t('message.myAccount.sender') }} </span>
          </div>
          <el-descriptions :column="3">
            <el-descriptions-item :label="$t('message.orderInfo.nameLabel')"
              >Jerry</el-descriptions-item
            >
            <el-descriptions-item
              :label="$t('message.myAccount.company')"
            ></el-descriptions-item>
            <el-descriptions-item :label="$t('message.orderInfo.zipCodeLabel')"
              >00</el-descriptions-item
            >
            <el-descriptions-item :label="$t('common.country')"
              >CN-中国</el-descriptions-item
            >
            <el-descriptions-item :label="$t('common.stateProvince')"
              >00</el-descriptions-item
            >
            <el-descriptions-item :label="$t('message.orderInfo.cityLabel')"
              >00</el-descriptions-item
            >
            <el-descriptions-item :label="$t('message.storage.location')"
              >中国杭州</el-descriptions-item
            >
            <el-descriptions-item :label="$t('common.phone')"
              >00</el-descriptions-item
            >
            <el-descriptions-item label="Email"></el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card class="card-item">
          <div slot="header" class="clearfix">
            <span>收件人 </span>
            <el-button
              style="float: right; padding: 3px 0; color: #67c23a"
              type="text"
              @click="onSubmitRecipientInformation"
              >{{ $t('common.save') }}</el-button
            >
          </div>
          <el-form
            ref="recipientInformationForm"
            :model="recipientInformationForm"
            :rules="recipientInformationRules"
            label-width="160px"
          >
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderManagement.consigneeName')"
                  prop="recipient_name"
                >
                  <el-input
                    v-model="recipientInformationForm.recipient_name"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderInfo.orderStatus')"
                  prop="order_status"
                >
                  <el-select v-model="recipientInformationForm.order_status">
                    <el-option
                      v-for="item in StockEntryStatusEnum"
                      :key="item.value"
                      :label="item.label[$languageType]"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('common.country')" prop="country">
                  <SelectCountry
                    v-model="recipientInformationForm.country"
                  ></SelectCountry>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.myAccount.company')"
                  prop="company_name"
                >
                  <el-input
                    v-model="recipientInformationForm.company_name"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('common.stateProvince')" prop="state">
                  <el-input v-model="recipientInformationForm.state"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderInfo.zipCodeLabel')"
                  prop="zip_code"
                >
                  <el-input
                    v-model="recipientInformationForm.zip_code"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderInfo.cityLabel')"
                  prop="city"
                >
                  <el-input v-model="recipientInformationForm.city"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('common.area')" prop="area">
                  <el-input v-model="recipientInformationForm.area"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('common.houseNumber')"
                  prop="house_number"
                >
                  <el-input
                    v-model="recipientInformationForm.house_number"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('common.phone')"
                  prop="recipient_phone"
                >
                  <el-input
                    v-model="recipientInformationForm.recipient_phone"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderInfo.mobileNumberLabel')"
                  prop="recipient_mobile"
                >
                  <el-input
                    v-model="recipientInformationForm.recipient_mobile"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderInfo.emailLabel')"
                  prop="recipient_email"
                >
                  <el-input
                    v-model="recipientInformationForm.recipient_email"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderManagement.address') + '1'"
                  prop="address_1"
                >
                  <el-input
                    v-model="recipientInformationForm.address_1"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderManagement.address') + '2'"
                  prop="address_2"
                >
                  <el-input
                    v-model="recipientInformationForm.address_2"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderInfo.CODcurrency')"
                  prop="cod_type"
                >
                  <el-input
                    v-model="recipientInformationForm.cod_type"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderInfo.CODAmount')"
                  prop="cod_amount"
                >
                  <el-input
                    v-model="recipientInformationForm.cod_amount"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderManagement.iossNumber')"
                  prop="ioss_number"
                >
                  <el-input
                    v-model="recipientInformationForm.ioss_number"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('message.orderManagement.vatNo')"
                  prop="vat_number"
                >
                  <el-input
                    v-model="recipientInformationForm.vat_number"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card-item">
          <div slot="header" class="clearfix">
            <span>{{ $t('message.orderManagement.logisticsServices') }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="addLogistics"
              >{{ $t('message.orderManagement.addLogistics') }}</el-button
            >
          </div>
          <el-card
            class="card-item"
            v-for="(shippingInfo, index) in shippingList"
            :key="shippingInfo.shipping_id"
          >
            <div slot="header" class="clearfix">
              <span>{{ index + 1 }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
              <span style="">
                {{ $t('message.orderManagement.packageWeight') }}:
                {{ shippingInfo.package_info.package_weight }}&nbsp;&nbsp;
                {{ $t('message.orderManagement.packageVolume') }}:
                {{ shippingInfo.package_info.package_length }}*{{
                  shippingInfo.package_info.package_width
                }}*{{ shippingInfo.package_info.package_height }}</span
              >

              <el-popconfirm
                :confirm-button-text="$t('common.confirm')"
                :cancel-button-text="$t('common.cancel')"
                icon="el-icon-info"
                icon-color="red"
                :title="$t('common.confirmDelete')"
                @confirm="deleteLogisticsServices(shippingInfo)"
              >
                <el-button
                  slot="reference"
                  style="float: right; padding: 3px 0; color: #f10c0c"
                  type="text"
                  v-if="!editStatus"
                  >{{ $t('common.delete') }}</el-button
                >
              </el-popconfirm>
              <el-button
                style="
                  float: right;
                  padding: 3px 0;
                  margin-right: 10px;
                  color: #67c23a;
                "
                type="text"
                v-if="editStatus"
                @click="onSubmitLogisticsServices(shippingInfo)"
                >{{ $t('common.save') }}</el-button
              >
              <!-- <el-button
                style="
                  float: right;
                  padding: 3px 0;
                  margin-right: 10px;
                  color: #666;
                "
                type="text"
                @click="editStatus = false"
                v-if="editStatus"
                >{{ $t('common.cancel') }}</el-button
              > -->

              <el-button
                style="float: right; padding: 3px 0; margin-right: 10px"
                type="text"
                @click="handleEdit(shippingInfo)"
                >{{ $t('common.edit') }}</el-button
              >
            </div>
            <el-form
              ref="logisticsServicesForm"
              :model="shippingInfo"
              label-width="165px"
            >
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.orderManagement.logisticsServices')"
                  >
                    <span class="shipping-info-content">{{
                      logisticsCompanyMap[shippingInfo.shipping_company]
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('message.storage.waybillNumber')">
                    <span class="shipping-info-content">{{
                      shippingInfo?.tracking_number
                        ? shippingInfo?.tracking_number
                        : ' - '
                    }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.storage.transferOrderNumber')"
                  >
                    <span class="shipping-info-content">{{
                      shippingInfo?.transfer_number
                        ? shippingInfo?.transfer_number
                        : ' - '
                    }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-table
                  :data="shippingInfo.shipping_content"
                  style="width: 100%"
                >
                  <el-table-column
                    v-if="$languageType == 'zh_cn'"
                    :label="$t('message.productManagement.chineseName')"
                    prop="sub_chinese_name"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column
                    v-else
                    :label="$t('message.productManagement.englishName')"
                    prop="sub_english_name"
                    show-overflow-tooltip
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="sku"
                    :label="$t('message.productManagement.productCode')"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    prop="quantity"
                    :label="$t('message.productManagement.quantity')"
                    width="80"
                  >
                  </el-table-column>
                </el-table>
              </el-row>
            </el-form>
          </el-card>

          <el-empty
            :description="$t('common.noDataAvailable')"
            v-if="shippingList.length < 1"
          ></el-empty>
        </el-card>
      </el-col>
    </el-row>
    <!-- 新增,修改物流 -->
    <AddShipping
      :visible="addLogisticsVisible"
      :currentData="currentData"
      :operationType="operationType"
      :currentShippingId="currentShippingId"
      :logistics_channels="logistics_channels"
      :logisticsCompanyMap="logisticsCompanyMap"
      @close="onCloseShippingInfoModel"
      @confirm="onConfirm"
    ></AddShipping>
  </div>
</template>

<script>
import SelectCountry from '@/pages/components/select-country.vue'
import { StockEntryStatusMap, orderStatusMarkColorMap, StockEntryStatusEnum } from '@/common/field-maping'
import AddShipping from '@/pages/order-manage/components/add-shipping.vue'
import { deleteLogistics, getOrderInfoList } from '@/common/common-func'
export default {
  name: 'p-order-info',
  props: {
    currentData: {
      type: Object,
      default: () => { }
    },
    logistics_channels: { type: Array, default: () => [] },
    logisticsCompanyMap: { type: Object, default: () => { } }
  },
  components: {
    SelectCountry, AddShipping
  },
  data () {
    return {
      operationType: 'add',
      currentShippingId: '',
      editStatus: false,
      shippingList: [],
      StockEntryStatusMap,
      StockEntryStatusEnum,
      orderStatusMarkColorMap,
      currentOrderData: {},
      logisticsServicesForm: {},
      recipientInformationForm: {},
      recipientInformationRules: {
        recipient_name: [
          { required: true, message: this.$t('message.orderInfo.pleaseEnterNameLabel'), trigger: 'blur' }
        ],
        order_status: [
          { required: true, message: this.$t('message.orderInfo.pleaseSelectOrderStatus'), trigger: 'change' }
        ],
        company_name: [
          { required: false, message: this.$t('message.myAccount.pleaseEnterCompany'), trigger: 'blur' }
        ],
        zip_code: [
          { required: true, message: this.$t('message.orderInfo.pleaseEnterZipCode'), trigger: 'blur' }
        ],
        country: [
          { required: true, message: this.$t('common.countryPlaceholder'), trigger: 'change' }
        ],
        state: [
          { required: true, message: this.$t('common.stateProvincePlaceholder'), trigger: 'blur' }
        ],
        city: [
          { required: true, message: this.$t('common.cityPlaceholder'), trigger: 'blur' }
        ],
        area: [
          { required: false, message: this.$t('common.areaPlaceholder'), trigger: 'blur' }
        ],
        house_number: [
          { required: false, message: this.$t('common.houseNumberPlaceholder'), trigger: 'blur' }
        ],
        postalCode: [
          { required: true, message: this.$t('message.orderInfo.pleaseEnterZipCode'), trigger: 'blur' }
        ],
        recipient_phone: [
          { required: false, message: this.$t('message.orderInfo.pleaseEnterPhoneNumber'), trigger: 'blur' }
        ],
        recipient_mobile: [
          { required: false, message: this.$t('message.orderInfo.pleaseEnterMobileNumber'), trigger: 'blur' }
        ],
        recipient_email: [
          { required: false, message: this.$t('message.orderInfo.emailPlaceholder'), trigger: 'blur' }
        ],
        address_1: [
          { required: true, message: this.$t('message.orderManagement.addressPlaceholder') + "1", trigger: 'blur' }
        ],
        address_2: [
          { required: false, message: this.$t('message.orderManagement.addressPlaceholder') + "2", trigger: 'blur' }
        ],
        cod_type: [
          { required: false, message: this.$t('message.orderInfo.pleaseEnterCODCurrency'), trigger: 'blur' }
        ],
        cod_amount: [
          { required: false, message: this.$t('message.orderInfo.pleaseEnterCODAmount'), trigger: 'blur' }
        ],
        ioss_number: [
          { required: false, message: this.$t('message.orderManagement.iossNumberPlaceholder'), trigger: 'blur' }
        ],
        vat_number: [
          { required: false, message: this.$t('message.orderManagement.vatNoPlaceholder'), trigger: 'blur' }
        ]
      },
      addLogisticsVisible: false
    }
  },
  methods: {
    deleteLogistics,

    getOrderInfoList,
    // 弹窗确认后刷新列表
    onConfirm () {
    },
    refreshData () {
      let queryParam = {
        order_id: this.currentOrderData.order_id,
        provider_uuid: this.providerUuidBySelectStore,
        page_number: 1,
        page_size: 1,
        shop: "ALL",
        storage_uuid: this.currentOrderData.storage_uuid
      }
      this.getOrderInfoList(queryParam).then(response => {
        if (this.$isRequestSuccessful(response.code)) {
          this.formatData(response.data.results[0])
        }
      })
    },
    addLogistics () {
      this.addLogisticsVisible = true
      this.operationType = 'add'
    },
    handleEdit (shippingInfo) {
      this.addLogisticsVisible = true
      this.operationType = 'edit'
      this.currentShippingId = shippingInfo.shipping_id
    },
    onCloseShippingInfoModel (data) {
      this.addLogisticsVisible = false
      // if (data) {
      //   this.shippingList.push(data)
      // }
      this.refreshData()
    },
    deleteLogisticsServices (shippingInfo) {
      let queryParam = {
        shipping_ids: [shippingInfo.shipping_id],
        provider_uuid: this.providerUuidBySelectStore
      }
      this.deleteLogistics(queryParam).then(response => {
        if (this.$isRequestSuccessful(response.code)) {
          this.shippingList = this.shippingList.filter(item => item.shipping_id !== shippingInfo.shipping_id);
          this.$message.success(this.$t('common.operationSuccessful'));
          this.refreshData()
        }
      })

    },
    onSubmitLogisticsServices (shippingInfo) {
      const data = {
        tacking_data: [
          {
            shipping_id: shippingInfo.shipping_id,
            transfer_number: shippingInfo.transfer_number
          }
        ]
      };
      this.$ajax({
        url: '/api-prefix/api/shipping_status/modify-shipping-status-provider',
        method: 'put',
        data: data,
        roleType: this.roleType
      }
      ).then(response => {
        if (this.$isRequestSuccessful(response.code)) {
          // 保存成功后更新收件人表单数据确保在更新物流后更新对应数据
          this.recipientInformationForm.shipping_statuses = this.recipientInformationForm.shipping_statuses.map(status => {
            if (status.shipping_id === shippingInfo.shipping_id) {
              return {
                ...status,
                transfer_number: shippingInfo.transfer_number
              };
            }
            return status;
          });
          this.$message.success(this.$t('common.operationSuccessful'));
          return this.refreshData()
        }
      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.editStatus = false
      })
    },
    onSubmitRecipientInformation () {
      this.$refs.recipientInformationForm.validate((valid) => {
        if (valid) {
          const order_id = this.recipientInformationForm.order_id
          delete this.recipientInformationForm.order_id
          this.$ajax({
            url: '/api-prefix/api/order/modify-order-contact-info',
            method: 'put',
            data: this.recipientInformationForm,
            params: {
              order_id
            },
            roleType: this.roleType
          }
          ).then(response => {
            if (this.$isRequestSuccessful(response.code)) {
              this.$message.success(this.$t('common.operationSuccessful'))
              this.refreshData()
            }
          })
        } else {
          return false
        }
      })
    },
    formatData (val) {
      this.currentOrderData = val
      this.recipientInformationForm = {
        order_id: val.order_id,
        recipient_name: val.recipient_name,
        country: val.country,
        company_name: val.company_name,
        state: val.state,
        zip_code: val.zip_code,
        city: val.city,
        area: val.area,
        order_status: val.order_status,
        house_number: val.house_number,
        recipient_phone: val.recipient_phone,
        recipient_mobile: val.recipient_mobile,
        recipient_email: val.recipient_email,
        address_1: val.address_1,
        address_2: val.address_2,
        cod_type: val.cod_type,
        cod_amount: val.cod_amount,
        ioss_number: val.ioss_number,
        vat_number: val.vat_number
      }
      if (val.shipping_statuses) {
        // 修改数组
        this.$set(this, 'shippingList', val.shipping_statuses);
      }
    }
  },
  computed: {
    onSubmitLogisticsServicesDisabled () {
      return !this.logisticsServicesForm.waybillNumber && !this.logisticsServicesForm.transferOrderNumber
    },
    onSubmitRecipientInformationDisabled () {
      return this.$refs.recipientInformationForm ? !this.$refs.recipientInformationForm.validate(() => { }) : true;

    }
  },
  mounted () {
    this.logisticsServicesForm = Object.assign({
      serveName: '',
      waybillNumber: '',
      transferOrderNumber: ''
    }, this.logisticsServicesForm)

  },
  watch: {
    currentData: {
      handler (val) {
        this.formatData(val)
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang='css'>
.p-order-info .card-item {
  margin-bottom: 10px; /* Adds space below each card */
}
.p-order-info .card-item:last-child {
  margin-bottom: 0; /* Removes the margin from the last card */
}
.shipping-info-content {
  color: #8e44ad;
  font-weight: bold;
}
::v-deep .is-edit-status .el-input__inner {
  border: 1px solid #dcdfe6;
}
::v-deep .is-editing .el-input__inner {
  /* background-color: #d35400; */
  border: 2px solid #409eff;
}
</style>