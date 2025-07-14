<!--
* @description  收货
!-->
<template>
  <div>
    <el-dialog
      :title="$t('common.takeDelivery')"
      :visible.sync="modalVisible"
      width="1400px"
      :close-on-click-modal="false"
      @close="handlerClose"
      class="global-modal-class"
    >
      <el-row :gutter="24">
        <el-col :span="5">
          <el-card class="card-height">
            <div slot="header" class="clearfix">
              <span>{{
                $t('message.storage.warehousingOrderInformation')
              }}</span>
            </div>
            <el-descriptions
              class="margin-top font-style"
              :column="1"
              direction="vertical"
            >
              <el-descriptions-item :label="$t('message.storage.warehouse')">
                <span>
                  {{ storageMap[currentData.storage_uuid] }}</span
                ></el-descriptions-item
              >
              <el-descriptions-item :label="$t('message.storage.waybillNumber')"
                ><span>{{
                  currentData.shipment_number
                }}</span></el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.storage.systemOrderNumber')"
              >
                <span>
                  {{ currentData.system_number }}</span
                ></el-descriptions-item
              >
              <el-descriptions-item :label="$t('message.storage.referenceNo')">
                <span>
                  {{
                    currentData.reference_number
                      ? currentData.reference_number
                      : '-'
                  }}</span
                ></el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.storage.numberOfReservedBoxes')"
              >
                <span> {{ totalQuantity }}</span></el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.storage.warehousingType')"
                ><span>{{
                  warehousingTypeMap[currentData.entry_type]
                }}</span></el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.storage.warehousingClassification')"
                ><span>
                  {{ entryCategoryListMap[currentData.entry_category] }}</span
                ></el-descriptions-item
              >
              <el-descriptions-item :label="$t('message.storage.packingType')"
                ><span>
                  {{ packingTypeListMap[currentData.packing_type] }}</span
                ></el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.storage.transportationMethod')"
                ><span>{{
                  deliveryMethodListMap[currentData.delivery_method]
                }}</span></el-descriptions-item
              >
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="10">
          <div>
            <div v-loading="loading">
              <el-card class="box-card card-height">
                <div slot="header" class="clearfix">
                  <span>{{ $t('common.takeDelivery') }}</span>
                </div>
                <el-form
                  :model="modalForm"
                  ref="modalForm"
                  label-width="120px"
                  :rules="rules"
                  style="width: 350px"
                >
                  <el-form-item
                    :label="$t('message.storage.receiptNumber')"
                    prop="receive_type"
                  >
                    <el-select
                      clearable
                      v-model.trim="modalForm.receive_type"
                      @change="changeReceiveType"
                      :placeholder="$t('common.pleaseSelect')"
                      style="width: 350px"
                    >
                      <el-option
                        :label="$t('message.storage.systemOrderNumber')"
                        :value="0"
                      ></el-option>
                      <el-option
                        :label="$t('message.storage.waybillNumber')"
                        :value="1"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item
                    :label="$t('message.storage.orderNumber')"
                    prop="target_number"
                  >
                    <el-input
                      clearable
                      v-model.trim="modalForm.target_number"
                      :placeholder="$t('common.pleaseInput')"
                      style="width: 350px"
                    >
                    </el-input>
                  </el-form-item>

                  <el-form-item
                    :label="$t('message.storage.unloadingUnit')"
                    prop="unit"
                  >
                    <el-select
                      clearable
                      v-model.trim="modalForm.unit"
                      filterable
                      :placeholder="$t('common.pleaseSelect')"
                      style="width: 350px"
                    >
                      <el-option
                        v-for="item in unitMapOptions"
                        :key="item.value"
                        :label="item.label[$languageType]"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="$t('message.storage.numberOfBoxesArriving')"
                    prop="landed_num_of_boxes"
                  >
                    <el-input-number
                      v-model="modalForm.landed_num_of_boxes"
                      :step="1"
                      :min="0"
                      :placeholder="$t('common.pleaseInput')"
                      style="width: 350px"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item
                    :label="$t('message.storage.unloadedQuantity')"
                    prop="landed_quantity"
                  >
                    <el-input-number
                      v-model="modalForm.landed_quantity"
                      :step="1"
                      :min="0"
                      :max="maxLandedQuantity"
                      :placeholder="$t('common.pleaseInput')"
                      style="width: 350px"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item
                    :label="$t('message.storage.grossWeight')"
                    prop="sum_weight"
                  >
                    <el-input-number
                      v-model="modalForm.sum_weight"
                      :precision="2"
                      :step="1"
                      :placeholder="$t('common.pleaseInput')"
                      style="width: 350px"
                    ></el-input-number>
                  </el-form-item>

                  <el-form-item
                    :label="$t('message.storage.totalCapacity')"
                    prop="sum_cmb"
                  >
                    <el-input-number
                      v-model="modalForm.sum_cmb"
                      :precision="2"
                      :step="1"
                      :placeholder="$t('common.pleaseInput')"
                      style="width: 350px"
                    ></el-input-number>
                  </el-form-item>

                  <el-form-item
                    :label="$t('message.orderManagement.notes')"
                    prop="remark"
                  >
                    <el-input
                      clearable
                      type="textarea"
                      maxlength="500"
                      show-word-limit
                      v-model.trim="modalForm.remark"
                      :placeholder="$t('common.pleaseInput')"
                      style="width: 350px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <!-- <el-button @click="handlerClose" size="medium">
                {{ $t('common.cancel') }}
              </el-button> -->
                    <el-button
                      type="primary"
                      @click="onSubmit"
                      size="medium"
                      style="margin-left: 120px"
                    >
                      {{ $t('common.save') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
          </div>
        </el-col>
        <el-col :span="9">
          <el-card class="box-card card-height">
            <div slot="header" class="clearfix">
              <span>{{ $t('message.storage.deliveryInformation') }}</span>
              <!-- <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="refreshDeliveryInformation"
                >{{ $t('common.refresh') }}</el-button
              > -->
            </div>
            <el-table
              :data="takeDeliveryList"
              style="width: 100%"
              height="480"
              max-height="480"
            >
              <el-table-column
                prop="create_time"
                sortable
                :label="$t('message.storage.receiptTime')"
                width="140"
              ></el-table-column>
              <el-table-column
                prop="landed_num_of_boxes"
                :label="$t('message.storage.numberOfBoxesArriving')"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="sum_cmb"
                :label="$t('message.storage.totalCapacity')"
                width="100"
              ></el-table-column>

              <el-table-column
                prop="landed_quantity"
                :label="$t('message.storage.unloadedQuantity')"
                width="100"
              ></el-table-column>

              <el-table-column
                prop="remark"
                :label="$t('message.orderManagement.notes')"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="sum_weight"
                :label="$t('message.storage.grossWeight')"
                width="100"
              ></el-table-column>
              <el-table-column
                :label="$t('message.storage.unloadingUnit')"
                width="100"
              >
                <template slot-scope="scope">
                  {{
                    productUnitMap[scope.row.unit]
                      ? productUnitMap[scope.row.unit][$languageType]
                      : ''
                  }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerClose" size="medium">
          {{ $t('common.cancel') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  warehousingTypeList,
  unitOptions,
  productUnitMap,
  entryCategoryList,
  packingTypeList,
  deliveryMethodList
} from '@/common/field-maping'
export default {
  name: 'TakeDeliveryModal',
  props: {
    value: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    storageMap: { type: Object, default: () => { } }
  },
  data () {
    return {
      packingTypeList,
      deliveryMethodList,
      unitOptions,
      productUnitMap,
      warehousingTypeList,
      entryCategoryList,
      loading: false,
      modalForm: {
        target_number: '',
        landed_quantity: 0,
        landed_num_of_boxes: 0,
        unit: 1,
        sum_weight: 0,
        sum_cmb: 0,
        remark: ''
      },
      isRefresh: false,
      takeDeliveryList: [],
      modalVisible: false,
      rules: {
        receive_type: [
          {
            required: true,
            message: this.$t('common.pleaseSelect'),
            trigger: ['blur', 'change']
          }
        ],
        target_number: [
          {
            required: true,
            message: this.$t('common.pleaseInput'),
            trigger: ['blur', 'change']
          }
        ],
        landed_quantity: [
          {
            required: true,
            message: this.$t('common.pleaseInput'),
            trigger: ['blur', 'change']
          }
        ],
        landed_num_of_boxes: [
          {
            required: true,
            message: this.$t('common.pleaseInput'),
            trigger: ['blur', 'change']
          }
        ],
        unit: [
          {
            required: true,
            message: this.$t('common.pleaseSelect'),
            trigger: ['blur', 'change']
          }
        ],
        sum_weight: [
          {
            required: true,
            message: this.$t('common.pleaseInput'),
            trigger: ['blur', 'change']
          }
        ],
        sum_cmb: [
          {
            required: true,
            message: this.$t('common.pleaseInput'),
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {
    maxLandedQuantity () {
      if (!this.currentData?.product_info &&
        !Array.isArray(this.currentData.product_info)) return 0
      // 产品总数计算
      const sumQuantity = this.currentData.product_info.reduce((acc, cur) => {
        return acc + cur.quantity
      }, 0)
      // 收货列表的总数
      const takeDeliverySumQuantity = this.takeDeliveryList.reduce((acc, cur) => {
        return acc + cur.landed_quantity
      }, 0)
      // const sumQuantity = this.currentData.product_info.reduce((acc, cur) => {
      //   return acc + cur.quantity
      // }, 0)
      return sumQuantity - takeDeliverySumQuantity
    },
    // ...mapState('warehousing', ['warehousingInfoList'])
    unitMapOptions () {
      return Object.keys(this.productUnitMap).map((key) => ({
        label: this.productUnitMap[key],
        value: parseInt(key)
      }))
    },

    warehousingTypeMap () {
      let mapData = {}
      this.warehousingTypeList.forEach((element) => {
        mapData[element.value] = element.label[this.$languageType]
      })
      return mapData
    },
    entryCategoryListMap () {
      let mapData = {}
      this.entryCategoryList.forEach((element) => {
        mapData[element.value] = element.label[this.$languageType]
      })
      return mapData
    },
    // unitOptionsMap () {
    //   let mapData = {}
    //   this.unitOptions.forEach(element => {
    //     mapData[element.value] = element.label[this.$languageType]
    //   });
    //   return mapData
    // },
    packingTypeListMap () {
      let mapData = {}
      this.packingTypeList.forEach((element) => {
        mapData[element.value] = element.label[this.$languageType]
      })
      return mapData
    },
    deliveryMethodListMap () {
      let mapData = {}
      this.deliveryMethodList.forEach((element) => {
        mapData[element.value] = element.label[this.$languageType]
      })
      return mapData
    },
    totalQuantity () {
      // 预约箱数
      const totalQuantity =
        this.currentData.product_info &&
          Array.isArray(this.currentData.product_info)
          ? this.currentData.product_info.length
          : 0
      return totalQuantity
    }
  },
  methods: {
    changeReceiveType (value) {
      if (value === 0) {
        this.modalForm.target_number = this.currentData.system_number
      } else {
        this.modalForm.target_number = this.currentData.shipment_number
      }
    },
    onSubmit () {
      this.$refs.modalForm.validate((valid) => {
        if (valid) {
          // this.addWarehousing()
          this.getTakeDeliveryList()
        } else {
          return false
        }
      })
    },
    // receiptGoods () {
    //   this.loading = true
    //   this.$ajax({
    //     url: '/api-prefix/api/storage-m/receive-goods',
    //     method: 'put',
    //     roleType: this.roleType,
    //     data: this.modalForm
    //   })
    //     .then((res) => {
    //       if (this.$isRequestSuccessful(res.code)) {
    //         this.$message.success(this.$t('common.operationSuccessful'))
    //         this.isRefresh = true
    //         this.$refs.modalForm.resetFields()
    //         this.modalForm = Object.assign({}, undefined)
    //         this.getTakeDeliveryList()
    //         // this.$emit('close', true)
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    //     .finally(() => {
    //       this.loading = false
    //     })
    // },
    handlerClose () {
      this.$refs.modalForm.resetFields()
      this.modalVisible = false
      this.modalForm = Object.assign({}, undefined)
      // 如果操作成功 则关闭时刷新 否则不刷新
      this.$emit('close', this.isRefresh)
    },
    // 获取收货信息
    getTakeDeliveryList () {
      this.loading = true
      this.$ajax({
        url: '/api-prefix/api/storage-m/receive-goods',
        method: 'get',
        roleType: this.roleType,
        params: {
          target_number: this.currentData.system_number,
          receive_type: 0
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.takeDeliveryList = res.data.received_result
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    refreshDeliveryInformation () {
      this.getTakeDeliveryList()
    }
  },
  mounted () { },
  watch: {
    value: {
      handler (newValue) {
        this.modalVisible = newValue
        if (newValue) {
          this.modalForm.receive_type = 0
          this.modalForm.target_number = this.currentData.system_number
          // this.modalForm.unit = 2
          if (this.modalForm.target_number) {
            this.getTakeDeliveryList()
          }
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-dialog {
  height: 770px;
  top: -50px;
  overflow-y: auto;
}
::v-deep .el-dialog__body {
  max-height: 600px;
}
.font-style span {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}
.card-height {
  height: 590px;
  overflow: scroll;
}
</style>
