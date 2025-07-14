<!--
* @description  参数1
* @fileName  edit-addwarehousing
* @author wjp
* @date 2023-10-29 19:40:09
!-->
<template>
  <div id="edit-addwarehousing" class="edit-addwarehousing">
    <el-dialog
      :title="operationType === 'add' ? $t('common.add') : $t('common.edit')"
      :visible.sync="modalVisible"
      :close-on-click-modal="false"
      width="1200px"
      @close="handlerClose"
      class="global-modal-class"
      ref="addWarehousingDialog"
      :lock-scroll="false"
      :append-to-body="true"
      v-loading="loading"
    >
      <el-form
        :model="addWarehousingForm"
        :rules="addWarehousingFormRules"
        ref="addWarehousingForm"
        label-width="100px"
        class="warehouse-receipt"
        label-position="top"
      >
        <el-card class="form-format">
          <div slot="header">
            <span>{{ $t('message.storage.warehouseReceipt') }}</span>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('message.storage.warehouse')"
                prop="storage_uuid"
              >
                <el-select
                  v-model="addWarehousingForm.storage_uuid"
                  filterable
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
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('message.storage.packingType')"
                prop="packing_type"
              >
                <el-select
                  v-model="addWarehousingForm.packing_type"
                  :placeholder="$t('message.storage.packingTypeSelect')"
                >
                  <el-option
                    v-for="item in packingTypeList"
                    :key="item.value"
                    :label="item.label[$languageType]"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('message.storage.warehousingType')"
                prop="entry_type"
              >
                <el-select
                  v-model="addWarehousingForm.entry_type"
                  :placeholder="$t('message.storage.warehousingTypeSelect')"
                >
                  <el-option
                    v-for="item in warehousingTypeList"
                    :key="item.value"
                    :label="item.label[$languageType]"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item> </el-col
            ><el-col :span="12">
              <el-form-item
                :label="$t('message.storage.transportationMethod')"
                prop="delivery_method"
              >
                <el-select
                  v-model="addWarehousingForm.delivery_method"
                  :placeholder="
                    $t('message.storage.transportationMethodSelect')
                  "
                >
                  <el-option
                    v-for="item in deliveryMethodList"
                    :key="item.value"
                    :label="item.label[$languageType]"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('message.storage.warehousingClassification')"
                prop="entry_category"
              >
                <el-select
                  v-model="addWarehousingForm.entry_category"
                  :placeholder="
                    $t('message.storage.warehousingClassificationSelect')
                  "
                >
                  <el-option
                    v-for="item in entryCategoryList"
                    :key="item.value"
                    :label="item.label[$languageType]"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('message.storage.waybillNumber')"
                prop="shipment_number"
              >
                <el-input
                  v-model="addWarehousingForm.shipment_number"
                  :placeholder="$t('message.storage.waybillNumberPlaceholder')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :label="$t('message.storage.referenceNo')"
                prop="reference_number"
              >
                <el-input
                  v-model="addWarehousingForm.reference_number"
                  :placeholder="$t('message.storage.referenceNoPlaceholder')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('message.storage.returnOrderNumber')"
                prop="return_order_number"
              >
                <el-input
                  v-model="addWarehousingForm.return_order_number"
                  :placeholder="
                    $t('message.storage.returnOrderNumberPlaceholder')
                  "
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
      <el-form
        label-position="top"
        :model="productForm"
        :rules="productFormRules"
        ref="productForm"
        label-width="100px"
        class="productInfo"
      >
        <el-card class="form-format2">
          <div slot="header" class="clearfix">
            <span>{{ $t('message.productManagement.productInfo') }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              disabled
              >{{ $t('message.storage.batchNew') }}</el-button
            >
          </div>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item
                :label="$t('message.productManagement.productCode')"
                prop="product_detail.sku"
              >
                <template>
                  <el-input
                    v-model="productForm.product_detail.sku"
                    :placeholder="$t('message.storage.pleaseQueryAndAddSKU')"
                    disabled
                    style="width: 190px"
                  ></el-input>
                  <el-button
                    icon="el-icon-search"
                    style="margin-left: 5px"
                    circle
                    @click="searchProduct"
                  ></el-button>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                :label="$t('message.storage.caseNumber')"
                prop="box_number"
              >
                <el-input
                  v-model.number="productForm.box_number"
                  :placeholder="$t('message.storage.caseNumberPlaceholder')"
                  style="width: 190px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item
                :label="$t('message.productManagement.quantity')"
                prop="quantity"
              >
                <el-input-number
                  v-model="productForm.quantity"
                  :placeholder="
                    $t('message.productManagement.quantityPlaceholder')
                  "
                  :min="0"
                  :step="1"
                  :step-strictly="true"
                  style="width: 90px"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item
                :label="$t('message.storage.unloadingUnit')"
                prop="unit"
              >
                <el-select
                  v-model="productForm.unit"
                  :placeholder="$t('message.storage.pleaseSelectTheUnit')"
                  style="width: 90px"
                >
                  <el-option
                    v-for="item in unitMapOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                :label="$t('message.storage.waybillNumber')"
                prop="shipment_number"
              >
                <el-input
                  v-model="productForm.shipment_number"
                  :placeholder="$t('message.storage.waybillNumberPlaceholder')"
                  style="width: 200px"
                ></el-input>
                <el-button
                  style="margin-left: 15px; padding: 0 15"
                  type="primary"
                  @click="productOnSubmit"
                  size="small"
                  icon="el-icon-plus"
                  >{{ $t('common.add') }}</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 这里实现表格嵌套表单的形式, 查询产品的时候可以多选产品 在表格中进行数据的编辑 -->
          <el-table
            :data="tableData"
            height="250"
            style="width: 100%"
            :tree-props="{ children: 'children' }"
            border
          >
            <el-table-column :label="$t('common.operation')" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  icon="el-icon-remove-outline"
                ></el-button>
              </template>
            </el-table-column>
            <!-- TODO:这里根据平台选择的语言来动态选择显示中文还是英文 -->
            <el-table-column
              show-overflow-tooltip
              v-if="languageType == 'zh_cn'"
              :label="$t('message.productManagement.chineseName')"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.product_detail.chinese_name +
                  '-' +
                  scope.row.product_detail.sub_chinese_name
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              v-if="languageType == 'en_us'"
              label="Name"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.product_detail.english_name +
                  '-' +
                  scope.row.product_detail.sub_english_name
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="product_detail.barcode"
              :label="$t('message.productManagement.productBarcode')"
              width="160"
              align="center"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="product_detail.sku"
              :label="$t('message.productManagement.productCode')"
              width="160"
              align="center"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="box_number"
              :label="$t('message.storage.caseNumber')"
              width="100"
              align="center"
            >
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              prop="quantity"
              :label="$t('message.productManagement.quantity')"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="unit"
              :label="$t('message.productManagement.productUnit')"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                {{
                  productUnitMap[scope.row.unit]
                    ? productUnitMap[scope.row.unit][$languageType]
                    : scope.row.unit
                }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="shipment_number"
              sortable
              :label="$t('message.storage.waybillNumber')"
              align="center"
            >
            </el-table-column>
          </el-table>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="addWarehousing">{{
          $t('common.confirm')
        }}</el-button>
      </div>
      <ProductPage
        :visible="searchProductVisible"
        :isSingleChoice="true"
        @close="closeSearchProduct"
        @select-product="getProduct"
      ></ProductPage>
    </el-dialog>
  </div>
</template>

<script>
import utils from '@/utils/index'
import { getLanguage } from '@/common/language'
import { warehousingTypeList, productUnitMap, entryCategoryList, packingTypeList, deliveryMethodList } from "@/common/field-maping"
import ProductPage from '@/pages/warehousing-servers/components/product-page.vue'
export default {
  name: 'edit-addwarehousing',
  components: {
    ProductPage
  },
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    originalDataArr: { type: Array, default: () => [] },
    operationType: { type: String, default: 'add' },
    storageList: { type: Array, default: () => [] }
  },
  data () {
    return {
      loading: false,
      languageType: 'en_us',
      modalVisible: false,
      searchProductVisible: false,
      multipleSelection: [],
      tableData: [],
      addWarehousingForm: {
        storage_uuid: '',
        entry_type: '',
        delivery_method: '',
        packing_type: '',
        entry_category: '',
        shipment_number: "",
        return_order_number: "",
        product_info: {
          box_number: "",
          quantity: "",
          shipment_number: "",
          unit: "",
          product_detail: {
            product_uuid: "",
            variant_id: ""
          }
        },
        reference_number: ''
      },
      productForm: {
        box_number: '',
        quantity: 1,
        shipment_number: "",
        unit: 1,
        product_detail: {},
      },
      addWarehousingFormRules: {
        storage_uuid: [
          { required: true, message: this.$t('message.storage.warehouseSelect'), trigger: 'blur' }
        ],
        entry_type: [
          { required: true, message: this.$t('message.storage.warehousingTypeSelect'), trigger: 'blur' }
        ],
        delivery_method: [
          { required: true, message: this.$t('message.storage.transportationMethodSelect'), trigger: 'blur' }
        ],
        packing_type: [
          { required: true, message: this.$t('message.storage.packingTypeSelect'), trigger: 'blur' }

        ],
        entry_category: [
          { required: true, message: this.$t('message.storage.warehousingClassification'), trigger: 'blur' }
        ],
        shipment_number: [
          { required: true, message: this.$t('message.storage.waybillNumberPlaceholder'), trigger: 'change' }
        ],
        return_order_number: [
          { required: false, message: this.$t('message.storage.returnOrderNumberPlaceholder'), trigger: 'change' }
        ],
      },
      productFormRules: {
        product_detail: { sku: [{ required: true, message: this.$t('message.storage.pleaseSelectASKU'), trigger: 'change' }] },
        box_number: [
          { required: true, message: this.$t('message.storage.caseNumberPlaceholder'), trigger: 'blur' },
          { type: 'number', message: this.$t('common.mustBeANumber') }],
        quantity: [{ required: true, message: this.$t('message.productManagement.quantityPlaceholder'), trigger: 'blur' }],
        shipment_number: [{ required: false, message: this.$t('message.storage.waybillNumberPlaceholder'), trigger: 'blur' }],
        unit: [{ required: true, message: this.$t('message.storage.pleaseSelectTheUnit'), trigger: 'change' }]
      },
      warehousingTypeList: warehousingTypeList,
      deliveryMethodList: deliveryMethodList,
      packingTypeList: packingTypeList,
      entryCategoryList: entryCategoryList,
      productUnitMap: productUnitMap
    }
  },

  methods: {
    formatUnit (row, column) {
      // 在这里执行单位映射操作

      const mergedproductUnitMap = this.productUnitMap.reduce((mergedDict, currentDict) => {
        // 合并当前字典的label和value到mergedDict中
        mergedDict[currentDict.value] = currentDict.label[this.$languageType];
        return mergedDict;
      }, {});
      return mergedproductUnitMap[row.unit] || row.unit;
    },
    getProduct (productList) {
      if (typeof productList[0].product_unit === 'string' && !isNaN(productList[0].product_unit)) {
        productList[0].product_unit = Number(productList[0].product_unit);
      }
      this.productForm.unit = productList[0]?.product_unit || this.unitMapOptions[0].value
      this.productForm.product_detail = {
        chinese_name: productList[0].chinese_name,
        english_name: productList[0].english_name,
        sub_chinese_name: productList[0].sub_chinese_name,
        sub_english_name: productList[0].sub_english_name,
        barcode: productList[0].product_barcode,
        sku: productList[0].product_code_sku,
        product_unit: productList[0]?.product_unit,
        product_unique: {
          pid: productList[0].product_uuid,
          vid: productList[0].variant_id
        }
      }
    },

    handleDelete (index, row) {
      // 按照row的variant_id来删除
      this.tableData = this.tableData.filter((item, index) => {
        return item.product_detail.product_unique.vid !== row.product_detail.product_unique.vid && item.box_number !== row.box_number
          && index !== row.index
      }
      )
    },
    productOnSubmit () {
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          let newProductData = JSON.parse(JSON.stringify(this.productForm))
          let isExist = false
          let shipmentNumberError = false
          if (this.tableData) {
            // 判断是否存在 箱号相同但运单号不同的情况
            if (newProductData.shipment_number) {
              // 当运单号不为空时判断
              shipmentNumberError = this.tableData.some((item) => (item.box_number === newProductData.box_number && item.shipment_number != newProductData.shipment_number))
            }
            for (let index = 0; index < this.tableData.length; index++) {

              // 校验成功后需要判断新增的产品 对应的箱号和运单号是否已存在  如果已存在且产品相同数量累加, 单位不同不累加
              // 这里根据后端变更了判断 由原来判断product_uuid和variant_id  变为只判断sku
              if (this.tableData[index].product_detail.sku == newProductData.product_detail.sku &&
                this.tableData[index].box_number == newProductData.box_number &&
                this.tableData[index].shipment_number == newProductData.shipment_number &&
                this.tableData[index].unit == newProductData.unit
              ) {
                isExist = true
                this.tableData[index].quantity += newProductData.quantity
                break
              }
            }
          }

          if (shipmentNumberError) {
            this.$message.error(this.$t('message.storage.waybillNumberErrorInfo'))
            return
          }
          if (!isExist) {
            // 如果不存在 则追加
            this.tableData.push(newProductData)
          }

          //重置表单数据
          Object.assign(this.productForm, undefined)
          this.$refs.productForm.resetFields();
        } else {
          return false
        }
      })

    },
    addWarehousing () {
      this.$refs.addWarehousingForm.validate((valid) => {
        if (valid && this.tableData?.length) {
          this.loading = true
          this.addWarehousingForm.product_info = this.tableData
          let reqMethod = 'post'
          let reqUrl = "/api-prefix/api/storage-m/create-storage-entry"
          if (this.operationType != 'add') {
            reqMethod = 'put'
            reqUrl = '/api-prefix/api/storage-m/modify-storage-entry'
          }
          const res = this.$ajax({
            url: reqUrl,
            method: reqMethod,
            data: this.addWarehousingForm,
            headers: {
              "Content-Type": 'application/json',
            }
          }).then(res => {
            if (this.$isRequestSuccessful(res.code)) {
              //关闭并清空表单
              if (this.operationType == 'add') {
                this.$message.success(this.$t('common.operationSuccessful'))
              } else {
                this.$message.success(this.$t('common.editSuccessful'))
              }
              //清空数据
              this.addWarehousingForm.product_info = {}
              this.tableData = []
              this.$refs.addWarehousingForm.resetFields()
              this.$refs.productForm.resetFields()
              this.$emit('confirm')
              // this.handlerClose()

            }
          }).catch((error) => {
            console.error(error);
          }).finally(() => {
            this.loading = false
          })

          //重置表单数据
          // Object.assign(this.addWarehousingForm, undefined)
          // this.$refs.addWarehousingForm.resetFields();
        } else {
          if (!valid && !this.tableData?.length) {
            this.$message.error(this.$t('message.storage.formErrorInfo'))
          }
          else if (!this.tableData?.length) {
            this.$message.error(this.$t('message.storage.pleaseAddProductInformation'))
          }
          else if (!valid) {
            this.$message.error(this.$t('common.filledError'))
          }
          return false
        }
      })
    },
    searchProduct () {
      this.searchProductVisible = true
    },
    closeSearchProduct () {
      this.searchProductVisible = false
    },
    handlerClose () {
      this.addWarehousingForm.product_info = {}
      this.tableData = []
      this.$refs.addWarehousingForm.resetFields()
      this.$refs.productForm.resetFields()
      this.$emit('close')
    },

  },
  computed: {
    unitMapOptions () {
      return Object.keys(this.productUnitMap).map(key => ({
        label: this.productUnitMap[key][this.languageType],
        value: parseInt(key)
      }));
    },
  },
  mounted () {
    this.languageType = getLanguage()

  },
  watch: {
    visible: {
      handler (newValue) {
        this.modalVisible = newValue
        this.tableData = []
        this.$refs.modalForm?.resetFields()
        if (this.operationType == 'edit') {
          // 这里需要吧当前数据赋值给两个表单
          this.addWarehousingForm = utils.deepClone(this.currentData)
          this.tableData = utils.deepClone(this.currentData.product_info)
        } else {
          this.modalForm = { product_variants: [] }
        }

      },
      immediate: true
    }

  }
}
</script>
<style scoped lang='css'>
::v-deep .form-format input,
select {
  width: 300px;
}
.productInfo {
  margin-top: 10px;
}
</style>