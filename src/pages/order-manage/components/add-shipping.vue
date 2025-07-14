<!--
* @description  新增,修改物流信息
* @fileName  add-shipping
* @author wjp
* @date 2023-06-01 21:35:50
!-->
<template>
  <el-dialog
    :title="
      operationType === 'add'
        ? $t('message.productManagement.addLogisticsInformation')
        : $t('message.productManagement.editLogisticsInformation')
    "
    :visible.sync="modalVisible"
    width="900px"
    @close="handlerClose"
    class="global-modal-class"
    ref="shippingDialog"
    :lock-scroll="false"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <div>
      <el-form
        v-loading="loading"
        :model="modalForm"
        ref="modalForm"
        label-width="160px"
        :rules="rules"
        ><el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.logisticsChannels')"
              prop="shipping_company"
            >
              <!-- <SelectShippingChannel
                :currentData="modalForm.shipping_company"
                @updateChange="handleUpdate"
              ></SelectShippingChannel> -->
              <el-select
                popper-class="more-tag-data"
                v-model="modalForm.shipping_company"
                clearable
                filterable
                style="width: 220px"
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
          <el-col :span="24">
            <el-form-item
              :label="$t('message.productManagement.logisticsNumber')"
              prop="tracking_number"
            >
              <el-input
                clearable
                v-model.trim="modalForm.tracking_number"
                :placeholder="
                  $t('message.productManagement.logisticsNumberPlaceholder')
                "
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.productManagement.logisticsTime')"
              prop="shipping_time"
            >
              <el-date-picker
                v-model="modalForm.shipping_time"
                type="date"
                :placeholder="
                  $t('message.productManagement.logisticsTimePlaceholder')
                "
                clearable
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.orderInfo.logisticsCosts')"
              prop="shipping_fee"
            >
              <el-input-number
                clearable
                style="width: 100%"
                v-model.trim="modalForm.shipping_fee"
                :placeholder="$t('message.orderInfo.logisticsCostsPlaceholder')"
                :min="0"
                :step="0.01"
                :precision="2"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.orderManagement.packageWeight')"
              prop="package_info.package_weight"
            >
              <el-input-number
                v-model.trim="modalForm.package_info.package_weight"
                :precision="2"
                :step="0.1"
                style="width: 100%"
                :placeholder="
                  $t('message.orderManagement.packageWeightPlaceholder')
                "
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.orderManagement.packageHeight')"
              prop="package_info.package_height"
            >
              <el-input-number
                v-model.trim="modalForm.package_info.package_height"
                :precision="2"
                :step="0.1"
                style="width: 100%"
                :placeholder="
                  $t('message.orderManagement.packageHeightPlaceholder')
                "
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.orderManagement.packageLength')"
              prop="package_info.package_length"
            >
              <el-input-number
                v-model.trim="modalForm.package_info.package_length"
                :precision="2"
                :step="0.1"
                style="width: 100%"
                :placeholder="
                  $t('message.orderManagement.packageLengthPlaceholder')
                "
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.orderManagement.packageWidth')"
              prop="package_info.package_width"
            >
              <el-input-number
                v-model.trim="modalForm.package_info.package_width"
                :precision="2"
                :step="0.1"
                style="width: 100%"
                :placeholder="
                  $t('message.orderManagement.packageWidthPlaceholder')
                "
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('message.orderManagement.notes')"
              prop="shipping_remark"
            >
              <el-input
                clearable
                v-model.trim="modalForm.shipping_remark"
                :placeholder="$t('message.orderManagement.notesPlaceholder')"
                :maxlength="100"
                type="textarea"
                show-word-limit
                :autosize="{ minRows: 3, maxRows: 5 }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="item in shipping_content" :key="item.sku" :gutter="24">
          <el-form
            :model="item"
            label-width="160px"
            :rules="rules1"
            ref="shippingContent"
          >
            <el-col :span="10">
              <el-form-item
                :label="$t('message.productManagement.productSku')"
                prop="sku"
              >
                <el-select
                  v-model="item.sku"
                  style="width: 220px"
                  :placeholder="$t('message.storage.pleaseEnterASKU')"
                  @visible-change="onVisibleChangeSku($event, item)"
                  @change="onChangeSku($event, item)"
                >
                  <el-option
                    v-for="item in productSkus"
                    :key="item.product_code_sku"
                    :label="item.product_code_sku"
                    :value="item.product_code_sku"
                    :disabled="
                      item.disabled ||
                      !statuses[item.product_code_sku]?.canSelect
                    "
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                :label="$t('message.productManagement.quantity')"
                prop="quantity"
              >
                <el-input-number
                  v-model.trim="item.quantity"
                  clearable
                  :min="1"
                  :step="1"
                  :step-strictly="true"
                  :max="
                    operationType === 'edit'
                      ? statuses[item.sku]?.maxQuantity +
                        (shippingIdToSKUQuantities[modalForm.shipping_id]?.[
                          item.sku
                        ] || 0)
                      : statuses[item.sku]?.maxQuantity
                  "
                  :placeholder="
                    $t('message.productManagement.quantityPlaceholder')
                  "
                ></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <div class="add-button">
                <a @click="addShopContent(item)" style="margin-right: 8px">
                  {{ $t('common.add') }}
                </a>
                <a @click="delShopContent(item)">{{ $t('common.delete') }}</a>
              </div>
            </el-col>
          </el-form>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handlerClose" size="medium" :disabled="loading">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button
        type="primary"
        @click="onSubmit(1)"
        size="medium"
        :disabled="disableConfirmButton || loading"
      >
        {{ $t('common.save') }}
      </el-button>
      <el-button
        type="success"
        @click="onSubmit(2)"
        size="medium"
        :disabled="!disableConfirmButton || loading"
      >
        {{ $t('message.orderManagement.saveAndreport') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  query_all_logistics_channels,
  showErrorAlert
} from '@/common/common-func'
import { initProductData } from '@/common/common-func'
import SelectShippingChannel from './select-shipping-channel'
import utils from '@/utils/index'
export default {
  name: 'EditShipping',
  components: {
    SelectShippingChannel
  },
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    operationType: { type: String, default: 'add' },
    currentShippingId: { type: String, default: '' },
    logistics_channels: { type: Array, default: () => [] },
    logisticsCompanyMap: { type: Object, default: () => { } }
  },
  data () {
    return {
      loading: false,
      errorInfo: null,
      skuInfoMap: {},
      productVidQuantity: {},
      remoteLoading: false,
      statuses: {},
      page_number: 1,
      page_size: 10000, // 一次全部查出来
      total: 0,
      shippingIdToSKUQuantities: {},
      submitData: {},
      modalForm: {
        package_info: {
          package_height: null,
          package_weight: null,
          package_length: null,
          package_width: null
        }
      },
      shipping_content: [],
      shippingContentInfo: {
        //num: 1, // 标识
        quantity: 1
      },
      modalVisible: false,
      rules: {
        shipping_time: [
          {
            required: false,
            message: this.$t('common.datePlaseholder'),
            trigger: ['blur', 'change']
          }
        ],
        shipping_company: [
          {
            required: true,
            message: this.$t('message.orderManagement.logisticsCompanyEnter'),
            trigger: ['blur', 'change']
          }
        ],
        tracking_number: [
          {
            required: false,
            message: this.$t(
              'message.productManagement.logisticsNumberPlaceholder'
            ),
            trigger: ['blur', 'change']
          }
        ],
        shipping_fee: [
          {
            required: false,
            message: this.$t('message.orderInfo.logisticsCostsPlaceholder'),
            trigger: ['blur', 'change']
          }
        ],
        sku: [
          {
            required: true,
            message: this.$t('message.storage.pleaseSelectASKU'),
            trigger: ['blur', 'change']
          }
        ],
        quantity: [
          {
            required: true,
            message: this.$t('message.productManagement.quantityPlaceholder'),
            trigger: ['blur', 'change']
          }
        ]
      },
      rules1: {
        sku: [
          {
            required: true,
            message: this.$t('message.storage.pleaseSelectASKU'),
            trigger: ['blur', 'change']
          }
        ],
        quantity: [
          {
            required: true,
            message: this.$t('message.productManagement.quantityPlaceholder'),
            trigger: ['blur', 'change']
          }
        ]
      },
      productSkus: [], // 产品sku下拉
      shippingStatuses: [],
      oldSkuData: null
    }
  },
  methods: {
    initProductData,
    handleUpdate (value) {
      this.modalForm.shipping_company = value
    },
    onVisibleChangeSku (visible, item) {
      // 该函数的作用是在同一下拉框反复选择时记录上一次选择项用于还原上一次选择项的状态
      if (visible) {
        if (item.sku) {
          this.oldSkuData = utils.deepClone(item)
        }
      }
    },
    onChangeSku (newSku, item) {
      // 需要切换时需要改变这个值
      // this.$refs.shippingContent.quantity = 1
      this.productSkus.forEach((el) => {
        if (el.product_code_sku === newSku) {
          el.disabled = true
          this.statuses[newSku].canSelect = false
          // 选择了之后最大选择数字不变  但是不能让新增的选择选中
          this.statuses[newSku].maxQuantity = this.statuses[newSku].maxQuantity
        } else {
          el.disabled = false
        }
      })
      if (this.oldSkuData) {
        // 恢复上一个选择的状态
        this.statuses[this.oldSkuData.sku].canSelect = true
        // this.statuses[this.oldSkuData.sku].maxQuantity = this.statuses[this.oldSkuData.sku].maxQuantity +
        //   this.oldSkuData.quantity
        this.oldSkuData = null
      }
    },
    // 选择物流号后修改对应条数
    onChangeShipping (value) {
      const selectForm = this.shippingStatuses.filter((el) => {
        return el.shipping_id === value
      })
      this.modalForm = {
        order_id: selectForm[0].order_id,
        shipping_time: selectForm[0].shipping_time,
        shipping_remark: selectForm[0].shipping_remark,
        shipping_company: selectForm[0].shipping_company,
        tracking_number: selectForm[0].tracking_number,
        shipping_fee: selectForm[0].shipping_fee,
        shipping_id: selectForm[0].shipping_id,
        package_info: {
          package_height: selectForm[0].package_info?.package_height,
          package_weight: selectForm[0].package_info?.package_weight,
          package_length: selectForm[0].package_info?.package_length,
          package_width: selectForm[0].package_info?.package_width
        }
      }

      if (
        selectForm[0].shipping_content &&
        selectForm[0].shipping_content !== 0
      ) {
        this.shipping_content = utils.deepClone(selectForm[0].shipping_content)
      } else {
        this.shipping_content = []
        this.shipping_content.push(utils.deepClone(this.shippingContentInfo))
      }
    },
    onSubmit (buttonType) {
      const shippingContentValid = []
      this.$refs.modalForm.validate((valid) => {
        shippingContentValid.push(valid)
      })
      this.$refs.shippingContent.forEach((el) => {
        el.validate((valid) => {
          shippingContentValid.push(valid)
        })
      })
      const flag = shippingContentValid.every((el) => {
        return el
      })
      if (flag) {
        this.modalForm.shipping_content = utils.deepClone(this.shipping_content)
        if (this.operationType === 'add') {
          this.addshipping(buttonType)
        } else {
          this.editshipping(buttonType)
        }
        // if (buttonType === 2) {
        //   this.singleReport()
        // }
      } else {
        return false
      }
    },
    // 新增产品
    addShopContent (content) {
      if (!content.sku) {
        // 如果没选择sku提示告警
        this.$message.warning(
          this.$t('message.productManagement.pleaseSelectSKU')
        )
        return
      }
      // 遍历获取已经选择的sku
      const sku_list = this.shipping_content.map((el) => {
        return el.sku
      })
      this.productSkus.forEach((el) => {
        // 如果已经选择了sku则不可再选择
        if (sku_list.includes(el.product_code_sku)) {
          el.disabled = true
        } else {
          el.disabled = false
        }
      })

      // 遍历productSkus如果都是disabled则不新增
      const disabled = this.productSkus.every((el) => {
        return el.disabled
      })
      if (disabled) {
        this.$message.warning(
          this.$t('message.productManagement.noProductCanAdd')
        )
        return
      }
      this.shipping_content.push({ sku: null, quantity: 1 }) // , num: this.shipping_content.length + 1
    },
    // 删除产品
    delShopContent (content) {
      if (this.shipping_content.length === 1) {
        this.shipping_content = [{ sku: null, quantity: 1 }]
      } else {
        this.shipping_content.forEach((el, index) => {
          if (content.sku === el.sku) {
            this.shipping_content.splice(index, 1)
          }
        })
      }

      if (content.sku) {
        this.statuses[content.sku].canSelect = true
        // this.statuses[content.sku].maxQuantity = this.statuses[content.sku].maxQuantity + content.quantity
      }
      this.productSkus.forEach((el) => {
        if (el.product_code_sku === content.sku) {
          el.disabled = false
        }
      })
      this.oldSkuData = null
      // this.shipping_content.map((el, index) => {
      //   return el.num = index + 1
      // })
    },
    showErrorAlert,
    resetFiledFuc () {
      this.modalForm = Object.assign(
        {},
        {
          order_id: null,
          shipping_time: null,
          shipping_remark: null,
          shipping_company: null,
          tracking_number: null,
          shipping_fee: null,
          shipping_id: null,
          package_info: {
            package_height: 20,
            package_weight: 0.2,
            package_length: 20,
            package_width: 20
          }
        }
      )
      this.$refs.modalForm?.resetFields()
    },
    addshipping (buttonType) {
      this.loading = true
      this.submitData = utils.deepClone(this.modalForm)
      if (!this.submitData.tracking_number) {
        this.submitData.tracking_number = '-'
      }
      delete this.submitData.products
      this.submitData.shipping_content = this.submitData.shipping_content.map(
        (el) => {
          return Object.assign({}, el, this.skuInfoMap[el.sku])
        }
      )
      // 组装数据
      // const requestData = objectToFormData(this.modalForm)
      const reqUrl =
        buttonType === 2
          ? '/api-prefix/api/shipping_status/create-shipping-report'
          : '/api-prefix/api/shipping_status/create-shipping-status'
      this.$ajax({
        url: reqUrl,
        method: 'post',
        data: this.submitData,
        roleType: this.roleType,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.$message.success(this.$t('common.operationSuccessful'))
            this.$emit('confirm')
            this.modalVisible = false
            this.resetFiledFuc()
          } else {
            this.errorInfo = res.data
            const content = this.showErrorAlert(this.errorInfo)
            this.$alert(content, this.$t('common.errorInfo'), {
              confirmButtonText: this.$t('common.confirm'),
              dangerouslyUseHTMLString: true,
              type: 'error',
              center: true
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    editshipping (buttonType) {
      this.loading = true
      this.submitData = utils.deepClone(this.modalForm)
      delete this.submitData.products
      this.submitData.shipping_content = this.submitData.shipping_content.map(
        (el) => {
          return Object.assign({}, el, this.skuInfoMap[el.sku])
        }
      )
      const reqUrl =
        buttonType === 2
          ? '/api-prefix/api/shipping_status/modify-shipping-report'
          : '/api-prefix/api/shipping_status/modify-shipping-status'
      this.$ajax({
        url: reqUrl,
        method: 'put',
        data: this.submitData,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.$message.success(this.$t('common.editSuccessful'))
            this.$emit('confirm')
            this.resetFiledFuc()
            this.modalVisible = false
          } else {
            this.errorInfo = res.data
            const content = this.showErrorAlert(this.errorInfo)
            this.$alert(content, this.$t('common.errorInfo'), {
              confirmButtonText: this.$t('common.confirm'),
              dangerouslyUseHTMLString: true,
              type: 'error',
              center: true
            })
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
      this.resetFiledFuc()
      this.$emit('close')
      this.modalVisible = false
    },
    initSelect (arr) {
      const options = []
      if (arr && arr.length !== 0) {
        arr.forEach((el) => {
          const pid = el.pid
          el.product_variants.forEach((item) => {
            options.push({
              product_code_sku: item.product_code_sku,
              disabled: false
            })
            // 按sku作为key存储信息
            this.skuInfoMap[item.product_code_sku] = {
              sub_chinese_name: el.chinese_name + '-' + item.sub_chinese_name,
              sub_english_name: el.english_name + '-' + item.sub_english_name,
              barcode: item.product_barcode,
              unit: item.unit,
              price: item.price,
              pid: pid,
              vid: item.vid
            }
          })
        })
        this.productSkus = options
      }
    },
    getSkuStatuses () {
      let statuses = {}
      // 创建一个映射来存储每个 SKU 的 shippingQuantity 获取的是所有物流中各sku的总数
      let shippingQuantities = this.currentData.shipping_statuses.reduce(
        (acc, status) => {
          if (status.shipping_content) {
            status.shipping_content.forEach((content) => {
              acc[content.sku] = (acc[content.sku] || 0) + content.quantity
            })
          }
          return acc
        },
        {}
      )
      this.currentData.products.forEach((product) => {
        if (product.product_variants) {
          product.product_variants.forEach((variant) => {
            const sku = variant.product_code_sku
            const productQuantity = variant.quantity
            const shippingQuantity = shippingQuantities[sku] || 0
            statuses[sku] = {
              canSelect: shippingQuantity < productQuantity,
              maxQuantity: productQuantity - shippingQuantity
            }
          })
        }
      })
      this.getShippingIdToSKUQuantities()
      return statuses
    },
    getShippingIdToSKUQuantities () {
      let map = {}
      this.currentData.shipping_statuses.forEach((status) => {
        if (status.shipping_content) {
          let skuQuantities = status.shipping_content.reduce((acc, content) => {
            acc[content.sku] = (acc[content.sku] || 0) + content.quantity
            return acc
          }, {})

          map[status.shipping_id] = skuQuantities
        }
      })
      this.shippingIdToSKUQuantities = map
    }
  },
  mounted () { },
  computed: {
    dsCurrentProviderUuid () {
      return this.$store.state.user.dsCurrentProviderUuid
    },
    disableConfirmButton () {
      return (
        !this.modalForm.tracking_number ||
        this.modalForm.tracking_number === '-'
      )
    },
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    }
  },

  watch: {
    visible: {
      handler (newValue) {
        this.modalVisible = newValue
        if (!newValue) {
          return
        }
        this.$refs.modalForm?.resetFields()
        if (this.$refs.shippingContent) {
          this.$refs.shippingContent.forEach((el) => {
            el.resetFields()
          })
        }
        //  初始化产品数据
        this.loading = true
        // 获取对应vid和数量
        this.currentData?.products.forEach((el) => {
          if (el.variants && el.variants.length !== 0) {
            el.variants.forEach((variant) => {
              this.productVidQuantity[variant.vid] = variant.quantity
            })
          }
        })
        this.initProductData(this.currentData.products)
          .then((res) => {
            this.initSelect(utils.deepClone(res))
            if (this.currentData && this.operationType === 'edit') {
              // 保存当前订单的物流信息
              this.shippingStatuses = this.currentData.shipping_statuses
              this.onChangeShipping(this.currentShippingId)
            } else {
              this.modalForm = {
                order_id: this.currentData.order_id,
                shipping_fee: null,
                package_info: {
                  package_height: 20,
                  package_weight: 0.2,
                  package_length: 20,
                  package_width: 20
                }
              }
              this.shipping_content = []
              this.shipping_content.push(
                utils.deepClone(this.shippingContentInfo)
              )
            }
            this.statuses = this.getSkuStatuses()
          })
          .catch((err) => {
            console.error(err)
          })
          .finally(() => {
            this.loading = false
          })
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
