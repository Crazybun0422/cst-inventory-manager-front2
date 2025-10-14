<!--
* @description  参数1
* @fileName  quality-insepection-form
* @author wjp
* @date 2024-03-30 21:50:48
!-->
<template>
  <div id="quality-insepection-form" class="quality-insepection-form">
    <el-dialog
      :title="$t('message.storage.qualityInspection')"
      :visible.sync="modalVisible"
      width="1200px"
      @close="closeDialog"
    >
      <el-row :gutter="24">
        <el-col :span="8">
          <el-card style="height: 480px">
            <div slot="header" class="clearfix">
              <span>{{ $t('message.storage.appointmentInformation') }}</span>
            </div>
            <el-descriptions
              class="margin-top-20 font-style"
              :column="1"
              direction="vertical"
            >
              <el-descriptions-item
                :label="$t('message.storage.totalNumberOfAppointments')"
                ><span>{{
                  inspectionInfo.appointments_total
                }}</span></el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.storage.totalQuantityAlreadyInspected')"
                ><span>{{
                  inspectionInfo.qualified_total
                }}</span></el-descriptions-item
              >
              <el-descriptions-item
                :label="
                  $t(
                    'message.storage.totalQuantityThatHasPassedQualityInspection'
                  )
                "
                :span="2"
                ><span>{{
                  inspectionInfo.qualified_quantity
                }}</span></el-descriptions-item
              >
              <el-descriptions-item
                :label="
                  $t('message.storage.totalQuantityThatFailedQualityInspection')
                "
              >
                <span> {{ inspectionInfo.unqualified_quantity }}</span>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('message.storage.systemNumber')">
                <span>
                  {{ inspectionInfo.system_number }}</span
                ></el-descriptions-item
              >
              <el-descriptions-item :label="$t('message.storage.warehouse')">
                <span>{{
                  storageMap[inspectionInfo.storage_uuid]
                }}</span></el-descriptions-item
              >
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div slot="header" class="clearfix">
              <span>{{ $t('message.storage.productQualityInspection') }}</span>
            </div>
            <el-form
              :model="form"
              :rules="formRules"
              v-loading="loading"
              ref="form"
            >
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.storage.systemNumber')"
                    prop="system_number"
                  >
                    <el-input
                      v-model="form.system_number"
                      autocomplete="off"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.productManagement.productBarcode')"
                    prop="barcode"
                  >
                    <el-input
                      v-model="form.barcode"
                      autocomplete="off"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.storage.qualifiedQuantity')"
                    prop="qualified_quantity"
                  >
                    <el-input-number
                      v-model="form.qualified_quantity"
                      :min="0"
                      :max="maxInspectionNum"
                      autocomplete="off"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.storage.unqualifiedQuantity')"
                    prop="unqualified_quantity"
                  >
                    <el-input-number
                      v-model="form.unqualified_quantity"
                      :min="0"
                      autocomplete="off"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.storage.inspectionLength')"
                    prop="inspection_length"
                  >
                    <el-input-number
                      v-model="form.inspection_length"
                      :precision="2"
                      :min="0"
                      autocomplete="off"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.storage.inspectionWidth')"
                    prop="inspection_width"
                  >
                    <el-input-number
                      v-model="form.inspection_width"
                      :precision="2"
                      :min="0"
                      autocomplete="off"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.storage.inspectionHeight')"
                    prop="inspection_height"
                  >
                    <el-input-number
                      v-model="form.inspection_height"
                      :precision="2"
                      :min="0"
                      autocomplete="off"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('message.storage.inspectionWeight')"
                    prop="inspection_weight"
                  >
                    <el-input-number
                      v-model="form.inspection_weight"
                      :precision="2"
                      :min="0"
                      autocomplete="off"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <el-button type="primary" @click="submitData">
                  {{ $t('common.save') }}
                </el-button>
                <el-checkbox v-model="syncToProduct" style="margin-left: 16px">
                  {{ $t('message.storage.measurementSyncToProduct') }}
                </el-checkbox>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card style="height: 480px">
            <div slot="header" class="clearfix">
              <span>{{
                $t('message.storage.customerReservationForProductSize')
              }}</span>
            </div>
            <el-descriptions class="margin-top" :column="1" border>
              <template slot="extra">
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="referenceSize"
                  >{{ $t('message.storage.referenceSize') }}
                </el-button>
              </template>
              <el-descriptions-item
                :label="$t('message.storage.systemNumber')"
                >{{
                  appointmentInformation.system_number
                }}</el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.productManagement.productBarcode')"
                >{{ appointmentInformation.barcode }}</el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.productManagement.productCode')"
                >{{ appointmentInformation.sku }}</el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.productManagement.weight')"
              >
                {{ appointmentInformation.weight }}
              </el-descriptions-item>
              <el-descriptions-item
                :label="$t('message.productManagement.length')"
              >
                {{ appointmentInformation.length }}
              </el-descriptions-item>
              <el-descriptions-item
                :label="$t('message.productManagement.width')"
              >
                {{ appointmentInformation.width }}
              </el-descriptions-item>
              <el-descriptions-item
                :label="$t('message.productManagement.height')"
              >
                {{ appointmentInformation.height }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { qualifiedQuantityTotal, unqualifiedQuantityTotal } from '@/common/common-func'
export default {
  name: 'quality-insepection-form',
  props: {
    value: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    storageMap: { type: Object, default: () => { } }
  },
  components: {

  },
  data () {
    return {
      qualifiedQuantityTotal, unqualifiedQuantityTotal,
      modalVisible: false,
      form: {
      },
      // 是否将本次质检测量同步到产品（默认选中）
      syncToProduct: true,
      inspectionInfo: {
      },
      appointmentInformation: {
      },
      loading: false,
      formRules: {
        qualified_quantity: [
          { required: true, message: this.$t("message.storage.qualifiedQuantityPlaceholder"), trigger: 'blur' }
        ],
        unqualified_quantity: [
          { required: true, message: this.$t("message.storage.unqualifiedQuantityPlaceholder"), trigger: 'blur' }
        ],
        inspection_length: [
          { required: true, message: this.$t("message.storage.inspectionLengthPlaceholder"), trigger: 'blur' }
        ],
        inspection_width: [
          { required: true, message: this.$t("message.storage.inspectionWidthPlaceholder"), trigger: 'blur' }
        ],
        inspection_height: [
          { required: true, message: this.$t("message.storage.inspectionHeightPlaceholder"), trigger: 'blur' }
        ],
        inspection_weight: [
          { required: true, message: this.$t("message.storage.inspectionWeightPlaceholder"), trigger: 'blur' }
        ],
        system_number: [
          { required: true, message: this.$t('message.storage.pleaseEnterSystemNumber'), trigger: 'blur' }
        ],
        barcode: [
          { required: true, message: this.$t('message.productInfo.barcodePlaceholder'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    referenceSize () {
      this.form.inspection_length = this.appointmentInformation.length
      this.form.inspection_width = this.appointmentInformation.width
      this.form.inspection_height = this.appointmentInformation.height
      this.form.inspection_weight = this.appointmentInformation.weight
    },
    submitData () {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const res = await this.$ajax({
              method: 'put',
              url: '/api-prefix/api/storage-m/quality-check-one',
              // 将是否同步到产品以查询参数形式传递
              params: { sync_to_product: this.syncToProduct },
              data: this.form,
              roleType: this.roleType
            })
            if (this.$isRequestSuccessful(res.code)) {
              this.$message.success(this.$t('common.operationSuccessful'))
              this.$emit('close', true)
            }
          }
          catch (error) {
            console.error(error)
          }
          finally {
            this.loading = false

          }
        }
      })
    },
    closeDialog () {
      this.$emit('close')
    }
  },
  computed: {
    maxInspectionNum () {
      return this.inspectionInfo.appointments_total - this.inspectionInfo.qualified_quantity
    },
  },
  mounted () {

  },
  watch: {
    value: {
      handler (newValue) {
        this.modalVisible = newValue
        if (newValue) {
          this.form = {
            system_number: this.currentData.system_number,
            barcode: this.currentData.product_detail.barcode,
            qualified_quantity: 0,
            unqualified_quantity: 0,
            inspection_length: this.currentData?.measured_info?.inspection_length ||
              this.currentData.quality_inspection_info?.quality_inspection_length_cm || 0,
            inspection_width: this.currentData?.measured_info?.inspection_width ||
              this.currentData.quality_inspection_info?.quality_inspection_width_cm || 0,
            inspection_height: this.currentData?.measured_info?.inspection_height ||
              this.currentData.quality_inspection_info?.quality_inspection_height_cm || 0,
            inspection_weight: this.currentData?.measured_info?.inspection_weight ||
              this.currentData.quality_inspection_info?.quality_inspection_weight_kg || 0,
          }
          // 每次打开弹窗默认勾选“同步到产品”
          this.syncToProduct = true
          // 质检合格数量
          const qualified_quantity = this.currentData.quality_check ? this.qualifiedQuantityTotal(this.currentData.quality_check) : 0
          //质检不合格数量
          const unqualified_quantity = this.currentData.quality_check ? this.unqualifiedQuantityTotal(this.currentData.quality_check) : 0
          //已质检总数量
          const qualified_total = qualified_quantity + unqualified_quantity
          this.inspectionInfo = {
            system_number: this.currentData.system_number,
            storage_uuid: this.currentData.storage_uuid,
            appointments_total: this.currentData.quantity ? this.currentData.quantity : 0,
            qualified_total: qualified_total,
            qualified_quantity: qualified_quantity,
            unqualified_quantity: unqualified_quantity
          }
          this.appointmentInformation = {
            system_number: this.currentData.system_number,
            barcode: this.currentData.product_detail.barcode,
            sku: this.currentData.product_detail.sku,
            weight: this.currentData.quality_inspection_info?.quality_inspection_weight_kg || 0,
            length: this.currentData.quality_inspection_info?.quality_inspection_length_cm || 0,
            width: this.currentData.quality_inspection_info?.quality_inspection_width_cm || 0,
            height: this.currentData.quality_inspection_info?.quality_inspection_height_cm || 0,
          }
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang='css'>
.font-style span {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}
</style>
