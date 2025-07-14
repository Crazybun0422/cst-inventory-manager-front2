<!--
* @description  新增,修改订单
* @fileName  add-order
* @author wjp
* @date 2023-06-01 21:35:50
!-->
<template>
  <el-dialog
    :title="
      operationType === 'add'
        ? $t('message.orderManagement.createOrder')
        : operationType === 'copy'
        ? $t('message.orderManagement.copyOrder')
        : $t('message.orderManagement.editeOrder')
    "
    :visible.sync="modalVisible"
    width="1000px"
    @close="handlerClose"
    class="global-modal-class"
    ref="orderDialog"
    :lock-scroll="false"
    :append-to-body="true"
    :close-on-click-modal="false"
    v-loading="loading"
  >
    <div>
      <el-row>
        <el-row>
          <el-col>
            <el-button
              type="text"
              size="medium"
              @click="chooseProduct"
              :disabled="productCardDisabled"
              icon="el-icon-circle-plus"
            >
              {{ $t('message.orderManagement.clickToSelectProduct') }}
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <product-card
            ref="productCard"
            style="margin-bottom: 35px"
            :productData="productData"
            @updateData="updateProduct"
            :disabled="productCardDisabled"
          ></product-card>
        </el-row>
        <el-form
          :model="modalForm"
          ref="modalForm"
          label-width="140px"
          :rules="rules"
          label-position="top"
        >
          <el-card>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.consignee')"
                  prop="recipient_name"
                >
                  <!-- 实现选择收货人自动填充部分信息 -->
                  <el-select
                    v-model="modalForm.recipient_name"
                    filterable
                    remote
                    clearable
                    :disabled="productCardDisabled"
                    :placeholder="
                      $t('message.orderManagement.consigneePlaceholder')
                    "
                    :remote-method="getConsignee"
                    :loading="remoteLoading"
                    @change="selectConsignee"
                    @focus="getConsignee('')"
                  >
                    <el-option
                      v-for="item in consigneeOptions"
                      :key="item.contact_id"
                      :label="item.name"
                      :value="item.contact_id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.receivingCountry')"
                  prop="country"
                >
                  <SelectCountry
                    v-model="modalForm.country"
                    :disabled="productCardDisabled"
                  ></SelectCountry>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common.stateProvince')" prop="state">
                  <el-input
                    clearable
                    v-model.trim="modalForm.state"
                    :disabled="productCardDisabled"
                    :placeholder="$t('common.stateProvincePlaceholder')"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item :label="$t('common.city')" prop="city">
                  <el-input
                    clearable
                    v-model.trim="modalForm.city"
                    :disabled="productCardDisabled"
                    :placeholder="$t('common.cityPlaceholder')"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.address') + '1'"
                  prop="address_1"
                >
                  <el-input
                    clearable
                    v-model.trim="modalForm.address_1"
                    :disabled="productCardDisabled"
                    :placeholder="
                      $t('common.pleaseInput') +
                      ' ' +
                      $t('message.orderManagement.address') +
                      '1'
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.address') + '2'"
                  prop="address_2"
                >
                  <el-input
                    clearable
                    v-model.trim="modalForm.address_2"
                    :disabled="productCardDisabled"
                    :placeholder="
                      $t('common.pleaseInput') +
                      ' ' +
                      $t('message.orderManagement.address') +
                      '2'
                    "
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :label="$t('common.phone')"
                  prop="recipient_phone"
                >
                  <el-input
                    clearable
                    :disabled="productCardDisabled"
                    v-model.trim="modalForm.recipient_phone"
                    :placeholder="
                      $t('common.pleaseInput') + ' ' + $t('common.phone')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common.zipCode')" prop="zip_code">
                  <el-input
                    clearable
                    :disabled="productCardDisabled"
                    v-model.trim="modalForm.zip_code"
                    :placeholder="
                      $t('common.pleaseInput') + ' ' + $t('common.zipCode')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.roomNumber')"
                  prop="house_number"
                >
                  <el-input
                    clearable
                    :disabled="productCardDisabled"
                    v-model.trim="modalForm.house_number"
                    :placeholder="
                      $t('common.pleaseInput') +
                      ' ' +
                      $t('message.orderManagement.roomNumber')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.nameOfReceivingCompany')"
                  prop="company_name"
                >
                  <el-input
                    clearable
                    :disabled="productCardDisabled"
                    v-model.trim="modalForm.company_name"
                    :placeholder="
                      $t('common.pleaseInput') +
                      ' ' +
                      $t('message.orderManagement.nameOfReceivingCompany')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('common.email')"
                  prop="recipient_email"
                >
                  <el-input
                    clearable
                    :disabled="productCardDisabled"
                    v-model.trim="modalForm.recipient_email"
                    :placeholder="
                      $t('common.pleaseInput') + ' ' + $t('common.email')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.receivingRegion')"
                  prop="area"
                >
                  <el-input
                    clearable
                    :disabled="productCardDisabled"
                    v-model.trim="modalForm.area"
                    :placeholder="
                      $t('common.pleaseInput') +
                      ' ' +
                      $t('message.orderManagement.receivingRegion')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :label="$t('common.mobilePhone')"
                  prop="recipient_mobile"
                >
                  <el-input
                    clearable
                    :disabled="productCardDisabled"
                    v-model.trim="modalForm.recipient_mobile"
                    :placeholder="
                      $t('common.pleaseInput') + ' ' + $t('common.mobilePhone')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item
                  :label="$t('navigate.warehousing')"
                  prop="storage_uuid"
                >
                  <el-select
                    clearable
                    v-model="modalForm.storage_uuid"
                    :placeholder="
                      $t('common.pleaseSelect') +
                      ' ' +
                      $t('navigate.warehousing')
                    "
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in storageList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.orderType')"
                  prop="order_type"
                >
                  <el-select
                    v-model="modalForm.order_type"
                    :placeholder="
                      $t('common.pleaseSelect') +
                      ' ' +
                      $t('message.orderManagement.orderType')
                    "
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in orderTypeList"
                      :key="item.value"
                      :label="item.label[$languageType]"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common.status')" prop="order_status">
                  <el-select
                    v-model="modalForm.order_status"
                    :placeholder="
                      $t('common.pleaseSelect') + ' ' + $t('common.status')
                    "
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.label[$languageType]"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.csReferenceNumber')"
                  prop="cs_reference"
                >
                  <el-input
                    clearable
                    v-model.trim="modalForm.cs_reference"
                    :placeholder="
                      $t('message.orderManagement.csReferenceNumberPlaceholder')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('common.transportCode')"
                  prop="shipping_code"
                >
                  <el-input
                    clearable
                    v-model.trim="modalForm.shipping_code"
                    :placeholder="
                      $t('common.pleaseInput') +
                      ' ' +
                      $t('common.transportCode')
                    "
                  >
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.cashOnDeliveryType')"
                  prop="cod_type"
                >
                  <el-input
                    clearable
                    v-model.trim="modalForm.cod_type"
                    :placeholder="
                      $t('common.pleaseInput') +
                      ' ' +
                      $t('message.orderManagement.cashOnDeliveryType')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.cashOnDeliveryAmount')"
                  prop="cod_amount"
                >
                  <el-input
                    clearable
                    v-model.trim="modalForm.cod_amount"
                    :placeholder="
                      $t(
                        'message.orderManagement.cashOnDeliveryAmountPlaceholder'
                      )
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.iossNumber')"
                  prop="ioss_number"
                >
                  <el-input
                    clearable
                    v-model.trim="modalForm.ioss_number"
                    :placeholder="
                      $t('message.orderManagement.iossNumberPlaceholder')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.vatNo')"
                  prop="vat_number"
                >
                  <el-input
                    clearable
                    v-model.trim="modalForm.vat_number"
                    :placeholder="
                      $t('message.orderManagement.vatNoPlaceholder')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.idNo')"
                  prop="id_card"
                >
                  <el-input
                    clearable
                    v-model.trim="modalForm.id_card"
                    :placeholder="$t('message.orderManagement.idNoPlaceholder')"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  :label="$t('message.orderManagement.notes')"
                  prop="customer_remark"
                >
                  <el-input
                    clearable
                    v-model.trim="modalForm.customer_remark"
                    :placeholder="
                      $t('message.orderManagement.notesPlaceholder')
                    "
                    :maxlength="100"
                    type="textarea"
                    show-word-limit
                    :autosize="{ minRows: 1, maxRows: 3 }"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handlerClose" size="medium">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" @click="onSubmit" size="medium">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
    <ProductPage
      :visible="searchProductVisible"
      :isSingleChoice="false"
      @close="searchProductVisible = false"
      @select-product="getProduct"
    ></ProductPage>
  </el-dialog>
</template>

<script>
import ProductPage from '@/pages/warehousing-servers/components/product-page.vue'
import { getCurrentDateTime, getConsignee } from '@/common/common-func'
import {
  orderTypeList,
  orderStatusOptions,
  StockEntryStatusEnum
} from '@/common/field-maping'
import SelectCountry from '@/pages/components/select-country.vue'
import utils from '@/utils/index'
import ProductCard from './product-card.vue'
import { initProductData } from '@/common/common-func'
export default {
  name: 'Editorder',
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    operationType: { type: String, default: 'add' },
    storageList: { type: Array, default: () => [] },
    radioAuditStatus: { type: Number, default: 0 }
  },
  components: { ProductPage, ProductCard, SelectCountry },
  data () {
    return {
      remoteLoading: false,
      orderTypeList: orderTypeList,
      disableSubmitButton: true, // 控制“确定”按钮是否可点击
      submitData: {},
      loading: false,
      modalForm: { source: 0 },
      modalVisible: false,
      rules: {
        order_type: [
          {
            required: true,
            message: this.$t('message.orderManagement.orderTypeSelect'),
            trigger: ['blur', 'change']
          }
        ],
        recipient_name: [
          {
            required: true,
            message: this.$t('message.orderManagement.consigneePlaceholder'),
            trigger: ['blur', 'change']
          }
        ],
        country: [
          {
            required: true,
            message: this.$t('message.orderManagement.receivingCountrySelect'),
            trigger: ['blur', 'change']
          }
        ],
        state: [
          {
            required: true,
            message: this.$t('common.stateProvincePlaceholder'),
            trigger: ['blur', 'change']
          }
        ],
        cs_reference: [
          {
            required: true,
            message: this.$t(
              'message.orderManagement.csReferenceNumberPlaceholder'
            ),
            trigger: ['blur', 'change']
          }
        ],
        city: [
          {
            required: true,
            message: this.$t('common.cityPlaceholder'),
            trigger: ['blur', 'change']
          }
        ],
        area: [
          {
            required: false,
            message: this.$t('common.areaPlaceholder'),
            trigger: ['blur', 'change']
          }
        ],
        address_1: [
          {
            required: true,
            message:
              this.$t('message.orderManagement.addressPlaceholder') + '1',
            trigger: ['blur', 'change']
          }
        ],
        order_status: [
          {
            required: true,
            message: this.$t('common.statusSelect'),
            trigger: ['blur', 'change']
          }
        ],
        storage_uuid: [
          {
            required: true,
            message: this.$t('message.storage.warehousingSelect'),
            trigger: ['blur', 'change']
          }
        ]
      },
      searchProductVisible: false,
      productData: [], // 选中的产品
      statusOptions: StockEntryStatusEnum,
      consigneeOptions: []
    }
  },
  methods: {
    initProductData,
    getCurrentDateTime,
    selectConsignee (val) {
      // 清除时 val为空
      if (!val) return
      const consignee = this.consigneeOptions.filter(
        (item) => item.contact_id === val
      )[0]
      // this.modalForm.recipient_email = consignee.email
      this.modalForm.recipient_name = consignee.name
      this.modalForm.recipient_phone = consignee.phone
      // this.modalForm.recipient_mobile = consignee.mobile
      this.modalForm.country = consignee.country
      this.modalForm.state = consignee.state
      this.modalForm.city = consignee.city
      // this.modalForm.area = consignee.area
      this.modalForm.address_1 = consignee.address
      // this.modalForm.address_2 = consignee.address_2
      // this.modalForm.house_number = consignee.house_number
      this.modalForm.zip_code = consignee.postal_code
      // this.modalForm.company_name = consignee.company_name
    },
    async getConsignee (val) {
      this.remoteLoading = true
      let queryParam = {
        contact_type: 'recipient',
        page_num: 1,
        page_size: 10
      }
      if (val) {
        queryParam.name = val
      }
      try {
        const res = await getConsignee(queryParam)
        if (this.$isRequestSuccessful(res.code)) {
          this.consigneeOptions = res.data.results
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.remoteLoading = false
      }
    },

    onSubmit () {
      this.$refs.modalForm.validate(async (valid) => {
        if (valid) {
          this.modalForm.products = this.formatData(
            utils.deepClone(this.$refs.productCard.tableData)
          )
          if (this.productData.length === 0) {
            this.$message.error(
              this.$t('message.orderManagement.pleaseSelectTheProductFirst')
            )
            return
          }
          if (this.operationType === 'add' || this.operationType === 'copy') {
            await this.addorder()
          } else {
            this.editorder()
          }
        } else {
          this.$message.error(this.$t('common.pleaseCheckTheInput'))
          return false
        }
      })
    },
    // 按后台要求处理产品数据
    formatData (datas) {
      const arr = []
      datas.forEach((el) => {
        const variantsObj = {
          vid: el.product_variants[0].variant_id,
          quantity: el.product_variants[0].quantity,
          sku: el.product_variants[0].product_code_sku
        }
        const obj = {
          pid: el.product_uuid,
          source_related_id: el.source_related_id,
          variants: [variantsObj]
        }
        arr.push(obj)
      })
      return this.formatProducts(arr)
    },
    // 将相同产品的不同分类组合到一起
    formatProducts (arr) {
      const combinedData = {}
      arr.forEach((item) => {
        if (!combinedData[item.pid]) {
          combinedData[item.pid] = {
            pid: item.pid,
            variants: []
          }
        }
        combinedData[item.pid].variants.push(item.variants[0])
      })
      const result = Object.values(combinedData)
      return result
    },
    async addorder () {
      // delete (this.submitData.order_id)
      this.loading = true
      // 组装数据
      // 替换名字
      // this.modalForm.recipient_name = this.consigneeOptions[this.modalForm.recipient_name].name
      // web新增订单默认 source 为0
      this.modalForm.source = 0
      try {
        const res = await this.$ajax({
          url: '/api-prefix/api/order/create-order',
          method: 'post',
          data: this.modalForm,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(this.$t('common.operationSuccessful'))
          this.modalVisible = false
          this.$emit('confirm')
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    editorder () {
      this.loading = true
      this.submitData = utils.deepClone(this.modalForm)
      delete this.submitData.related_id
      delete this.submitData.order_id
      delete this.submitData.create_time
      delete this.submitData.shipping_statuses
      delete this.submitData.productsInfo
      delete this.submitData.loadInfo
      this.$ajax({
        url: '/api-prefix/api/order/modify-order',
        method: 'put',
        data: this.submitData,
        params: { order_id: this.modalForm.order_id },
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.modalVisible = false
            this.$message.success(this.$t('common.operationSuccessful'))
            this.$emit('confirm')
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handlerClose () {
      this.$emit('close')
    },
    // 选择产品
    chooseProduct () {
      this.searchProductVisible = true
    },
    getProduct (productList) {
      if (productList) {
        productList.forEach((el) => {
          el.product_variants.map((variants) => {
            return (variants.quantity = 1) // 默认数量为1
          })
        })
      }
      // 追加产品  如果已经添加了的 则不添加
      let newProductData = utils.deepClone(productList)
      newProductData.forEach((item) => {
        if (
          this.productData.some((productInfo) => {
            return (
              productInfo.product_variants[0].product_code_sku ===
              item.product_code_sku
            )
          })
        )
          return
        this.productData.push(item)
      })
    },
    updateProduct (productList) {
      this.productData = utils.deepClone(productList)
    }
  },
  computed: {
    dsCurrentProviderUuid () {
      return this.$store.state.user.dsCurrentProviderUuid
    },
    // isDisabled () {
    //   return this.radioAuditStatus !== 0
    // }
    productCardDisabled () {
      if (this.operationType === 'edit') {
        return this.currentData.order_status !== 0
      }
      return false
    }
  },
  mounted () {
    this.getConsignee('')
  },
  watch: {
    visible: {
      async handler (newValue) {
        this.modalVisible = newValue
        this.$refs.modalForm?.resetFields()
        if (this.operationType === 'edit') {
          if (this.currentData.products && this.currentData.products !== 0) {
            await this.initProductData(this.currentData.products).then(
              (res) => {
                this.productData = utils.deepClone(res)
              }
            )
          } else {
            this.productData = []
          }
          this.modalForm = utils.deepClone(this.currentData)
        } else if (this.operationType === 'copy') {
          this.modalForm = utils.deepClone(this.currentData)
          delete this.modalForm.order_id
          delete this.modalForm.create_time
          delete this.modalForm.related_id
          delete this.modalForm.order_id
          delete this.modalForm.shipping_statuses
          delete this.modalForm.loadInfo
          delete this.modalForm.productsInfo
          this.modalForm.cs_reference =
            this.modalForm.cs_reference + '-' + this.getCurrentDateTime()
          this.modalForm.order_status = 0
          if (this.currentData.products && this.currentData.products !== 0) {
            await this.initProductData(this.currentData.products).then(
              (res) => {
                this.productData = utils.deepClone(res)
              }
            )
          } else {
            this.productData = []
          }
        } else {
          this.modalForm = {
            order_status: 0,
            order_type: this.orderTypeList[0]?.value,
            storage_uuid: this.storageList[0]?.value
          } // 默认为未发货
          this.productData = []
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}
.add-button {
  height: 32px;
  line-height: 32px;
  display: block;
}
</style>
