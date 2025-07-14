<!--
* @description  新增,修改产品
* @fileName  edit-product
* @author wjp
* @date 2023-06-01 21:35:50
!-->
<template>
  <div>
    <el-dialog
      :title="
        operationType === 'add'
          ? $t('common.add') + ' ' + $t('message.productManagement.product')
          : $t('common.edit') + ' ' + $t('message.productManagement.product')
      "
      :visible.sync="modalVisible"
      width="800px"
      @close="handlerClose"
      :close-on-click-modal="false"
      class="global-modal-class"
      ref="productDialog"
      :lock-scroll="false"
      :append-to-body="true"
      v-loading="loading"
    >
      <div>
        <el-form
          :model="modalForm"
          ref="modalForm"
          label-width="150px"
          :rules="rules"
          label-position="top"
        >
          <el-row :gutter="24" justify="center">
            <el-col :span="11">
              <el-form-item
                :label="$t('message.productManagement.englishName')"
                prop="english_name"
              >
                <el-input
                  clearable
                  v-model.trim="modalForm.english_name"
                  :placeholder="
                    $t('common.pleaseInput') +
                    ' ' +
                    $t('message.productManagement.englishName')
                  "
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                :label="$t('message.productManagement.chineseName')"
                prop="chinese_name"
              >
                <el-input
                  clearable
                  v-model.trim="modalForm.chinese_name"
                  :placeholder="
                    $t('common.pleaseInput') +
                    ' ' +
                    $t('message.productManagement.chineseName')
                  "
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                :label="$t('common.classification')"
                prop="category"
              >
                <el-select
                  clearable
                  v-model="modalForm.category"
                  :placeholder="
                    $t('common.pleaseInput') + ' ' + $t('common.classification')
                  "
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, key) in productCategoryMap"
                    :key="key"
                    :label="item[$languageType]"
                    :value="key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item
            :label="$t('message.productManagement.specificDescription')"
            prop="description"
          >
            <el-input
              clearable
              v-model.trim="modalForm.description"
              :placeholder="
                $t('common.pleaseInput') +
                ' ' +
                $t('message.productManagement.specificDescription')
              "
              :maxlength="20000"
              type="textarea"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 3 }"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('message.productManagement.uploadProductImages')"
            prop="image_url"
          >
            <ImageUpload
              :image-url="modalForm.main_image_url"
              @change="handleUploadImage"
            ></ImageUpload>
          </el-form-item>
          <el-collapse
            accordion
            v-for="(categoryInfo, index) in modalForm.product_variants"
            :key="index"
            v-model="activeName"
          >
            <el-collapse-item :name="categoryInfo.num">
              <template slot="title">
                <div class="categoryInfo-class">
                  <span
                    >{{ $t('common.classification')
                    }}{{ categoryInfo.num }}</span
                  >
                  <span>
                    <el-button
                      icon="el-icon-plus"
                      type="text"
                      @click.stop="addCategoryInfo"
                      class="mr-24"
                    >
                      {{ $t('message.productManagement.addNewCategory') }}
                    </el-button>
                    <el-popconfirm
                      :title="$t('common.confirmDelete')"
                      @confirm="deletCategory(categoryInfo, index)"
                    >
                      <span slot="reference">
                        <el-button
                          icon="el-icon-delete"
                          type="text"
                          style="margin-left: 10px"
                          v-if="modalForm.product_variants.length !== 1"
                        >
                          {{ $t('common.delete') }}
                        </el-button>
                      </span>
                    </el-popconfirm>
                  </span>
                </div>
              </template>
              <el-card class="box-card">
                <el-row :gutter="24">
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('common.status')"
                      :prop="'product_variants.' + index + '.status'"
                      :rules="[
                        {
                          required: true,
                          message: $t('common.pleaseSelectStatus'),
                          trigger: ['blur', 'change']
                        }
                      ]"
                    >
                      <el-radio-group
                        v-model="categoryInfo.status"
                        :placeholder="$t('common.pleaseSelectStatus')"
                      >
                        <el-radio
                          v-for="(item, key) in productStatusMap"
                          :key="key"
                          :label="Number(key)"
                          >{{ item[$languageType] }}</el-radio
                        >
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item
                      :label="$t('message.productManagement.englishName')"
                      :prop="'product_variants.' + index + '.sub_english_name'"
                      :rules="rules.sub_english_name"
                    >
                      <el-input
                        clearable
                        v-model.trim="categoryInfo.sub_english_name"
                        :placeholder="
                          $t('common.pleaseInput') +
                          ' ' +
                          $t('message.productManagement.englishName')
                        "
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item
                      :label="$t('message.productManagement.chineseName')"
                      :prop="'product_variants.' + index + '.sub_chinese_name'"
                      :rules="rules.sub_chinese_name"
                    >
                      <el-input
                        clearable
                        v-model.trim="categoryInfo.sub_chinese_name"
                        :placeholder="
                          $t('common.pleaseInput') +
                          ' ' +
                          $t('message.productManagement.chineseName')
                        "
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item
                      :label="$t('message.productManagement.productCode')"
                      :prop="'product_variants.' + index + '.product_code_sku'"
                      :rules="rules.product_code_sku"
                    >
                      <el-input
                        clearable
                        v-model="categoryInfo.product_code_sku"
                        :placeholder="
                          $t('common.pleaseInput') +
                          ' ' +
                          $t('message.productManagement.productCode')
                        "
                        :step="1"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item
                      :label="$t('message.productManagement.productBarcode')"
                      :prop="'product_variants.' + index + '.product_barcode'"
                      :rules="rules.product_barcode"
                    >
                      <el-input
                        clearable
                        v-model.trim="categoryInfo.product_barcode"
                        :placeholder="
                          $t('common.pleaseInput') +
                          ' ' +
                          $t('message.productManagement.productBarcode')
                        "
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item
                      :label="$t('message.productManagement.productUnit')"
                      :prop="'product_variants.' + index + '.product_unit'"
                      :rules="rules.product_unit"
                    >
                      <el-select
                        clearable
                        v-model.trim="categoryInfo.product_unit"
                        :placeholder="
                          $t('common.pleaseSelect') +
                          ' ' +
                          $t('message.productManagement.productUnit')
                        "
                        style="width: 100%"
                      >
                        <el-option
                          v-for="(item, key) in productUnitMap"
                          :key="key"
                          :label="item[$languageType]"
                          :value="key"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item
                      :label="$t('message.productManagement.productSize')"
                      :prop="'product_variants.' + index + '.size'"
                    >
                      <el-select
                        clearable
                        v-model.trim="categoryInfo.size"
                        :placeholder="
                          $t('common.pleaseSelect') +
                          ' ' +
                          $t('message.productManagement.productSize')
                        "
                        style="width: 100%"
                      >
                        <el-option label="M" value="M"></el-option>
                        <el-option label="S" value="S"></el-option>
                        <el-option label="L" value="L"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('message.productManagement.price')"
                      :prop="'product_variants.' + index + '.price'"
                      :rules="rules.price"
                    >
                      <el-input-number
                        style="width: 50%"
                        clearable
                        v-model.trim="categoryInfo.price"
                        :placeholder="
                          $t('message.productManagement.pricePlaceholder')
                        "
                        :min="0"
                        :step="1"
                      >
                      </el-input-number>
                      <el-select
                        style="width: 70px"
                        v-model="categoryInfo.unit"
                      >
                        <el-option
                          v-for="(item, key) in currencyCodes"
                          :key="key"
                          :label="item.symbol"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="6">
                    <el-form-item
                      :prop="'product_variants.' + index + '.unit'"
                      :rules="rules.unit"
                    >
                      <el-select
                        style="width: 50%"
                        v-model="categoryInfo.unit"
                        :placeholder="
                          $t('message.productManagement.unitSelect')
                        "
                      >
                        <el-option
                          v-for="(item, key) in currencyCodes"
                          :key="key"
                          :label="item.symbol"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="12">
                    <el-form-item
                      :label="
                        $t('message.productManagement.inventoryWarningQuantity')
                      "
                      :prop="'product_variants.' + index + '.alarm_number'"
                      :rules="rules.alarm_number"
                    >
                      <el-input-number
                        style="width: 50%"
                        clearable
                        v-model.trim="categoryInfo.alarm_number"
                        :placeholder="
                          $t('common.pleaseInput') +
                          ' ' +
                          $t(
                            'message.productManagement.inventoryWarningQuantity'
                          )
                        "
                        :step-strictly="true"
                        :min="1"
                        :step="1"
                      >
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('message.productManagement.productColor')"
                      :prop="'product_variants.' + index + '.color'"
                      :rules="rules.color"
                    >
                      <el-color-picker
                        v-model="categoryInfo.color"
                        size="mini"
                      ></el-color-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('message.productManagement.weight')"
                      :prop="
                        'product_variants' +
                        index +
                        'quality_inspection_weight_kg'
                      "
                    >
                      <el-input-number
                        style="width: 50%"
                        clearable
                        v-model.trim="categoryInfo.quality_inspection_weight_kg"
                        :placeholder="
                          $t('common.pleaseInput') +
                          ' ' +
                          $t('message.productManagement.weight')
                        "
                        :precision="3"
                        :step="1"
                        :min="0"
                      >
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('message.productManagement.length')"
                      :prop="
                        'product_variants' +
                        index +
                        'quality_inspection_length_cm'
                      "
                    >
                      <el-input-number
                        style="width: 50%"
                        clearable
                        v-model.trim="categoryInfo.quality_inspection_length_cm"
                        :placeholder="
                          $t('common.pleaseInput') +
                          ' ' +
                          $t('message.productManagement.length')
                        "
                        :min="0"
                        :step="0.01"
                        :precision="2"
                      >
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('message.productManagement.width')"
                      :prop="
                        'product_variants' +
                        index +
                        'quality_inspection_width_cm'
                      "
                    >
                      <el-input-number
                        style="width: 50%"
                        clearable
                        v-model.trim="categoryInfo.quality_inspection_width_cm"
                        :placeholder="
                          $t('common.pleaseInput') +
                          ' ' +
                          $t('message.productManagement.width')
                        "
                        :min="0"
                        :step="0.01"
                        :precision="2"
                      >
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('message.productManagement.height')"
                      :prop="
                        'product_variants' +
                        index +
                        'quality_inspection_height_cm'
                      "
                    >
                      <el-input-number
                        style="width: 50%"
                        clearable
                        v-model.trim="categoryInfo.quality_inspection_height_cm"
                        :placeholder="
                          $t('common.pleaseInput') +
                          ' ' +
                          $t('message.productManagement.height')
                        "
                        :min="0"
                        :precision="2"
                        :step="0.01"
                      >
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item
                  :label="$t('message.productManagement.uploadProductImages')"
                  :prop="'product_variants.' + index + '.sub_image_url'"
                >
                  <ImageUpload
                    :image-url="categoryInfo.sub_image_url"
                    @change="handleUploadSubImage(arguments, categoryInfo)"
                  ></ImageUpload>
                </el-form-item>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerClose" size="medium">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="onSubmit" size="medium">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  productCategoryMap,
  productUnitMap,
  productStatusMap,
  currencyCodes
} from '@/common/field-maping'
import ImageUpload from './image-upload.vue'
import utils from '@/utils/index'
export default {
  name: 'EditProduct',
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    originalDataArr: { type: Array, default: () => [] }
  },
  components: { ImageUpload },
  data () {
    return {
      currencyCodes,
      productCategoryMap: productCategoryMap,
      productUnitMap: productUnitMap,
      productStatusMap: productStatusMap,
      activeName: 1,
      disableSubmitButton: true, // 控制“确定”按钮是否可点击
      operationType: 'add',
      submitData: {},
      loading: false,
      mainImgList: [],
      subImgList: [],
      modalForm: {
        chinese_name: '',
        english_name: '',
        category: '',
        product_unit: '',
        description: '',
        product_variants: [],
        main_image_url: ''
      },
      productVariantsInfo: {
        num: 1, // 标识
        status: 1,
        sub_chinese_name: '',
        sub_english_name: '',
        product_code_sku: '',
        product_barcode: '',
        size: '',
        color: '',
        quality_inspection_weight_kg: '',
        quality_inspection_length_cm: '',
        quality_inspection_width_cm: '',
        quality_inspection_height_cm: '',
        image_url: '',
        alarm_number: '',
        price: '',
        unit: 'USD'
      },
      modalVisible: false,
      rules: {
        chinese_name: [
          {
            required: true,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.chineseName'),
            trigger: ['blur', 'change']
          }
        ],
        english_name: [
          {
            required: true,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.englishName'),
            trigger: ['blur', 'change']
          }
        ],
        category: [
          {
            required: true,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('common.classification'),
            trigger: ['blur', 'change']
          }
        ],
        product_unit: [
          {
            required: false,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.productUnit'),
            trigger: ['blur', 'change']
          }
        ],
        description: [
          {
            required: true,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.specificDescription'),
            trigger: ['blur', 'change']
          }
        ],
        sub_chinese_name: [
          {
            required: true,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.chineseName'),
            trigger: ['blur', 'change']
          }
        ],
        sub_english_name: [
          {
            required: true,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.englishName'),
            trigger: ['blur', 'change']
          }
        ],
        product_code_sku: [
          {
            required: true,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.productSku'),
            trigger: ['blur', 'change']
          }
        ],
        product_barcode: [
          {
            required: true,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.productBarcode'),
            trigger: ['blur', 'change']
          }
        ],
        alarm_number: [
          {
            required: true,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.inventoryWarningQuantity'),
            trigger: ['blur', 'change']
          }
        ],
        status: [
          {
            required: false,
            message:
              this.$t('common.pleaseSelect') +
              ' ' +
              this.$t('message.orderManagement.warehouse'),
            trigger: ['blur', 'change']
          }
        ],
        size: [
          {
            required: false,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.productSize'),
            trigger: ['blur', 'change']
          }
        ],
        color: [
          {
            required: false,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.productColor'),
            trigger: ['blur', 'change']
          }
        ],
        quality_inspection_weight_kg: [
          {
            required: false,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.weight'),
            trigger: ['blur', 'change']
          }
        ],
        quality_inspection_length_cm: [
          {
            required: false,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.length'),
            trigger: ['blur', 'change']
          }
        ],
        quality_inspection_width_cm: [
          {
            required: false,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.width'),
            trigger: ['blur', 'change']
          }
        ],
        quality_inspection_height_cm: [
          {
            required: false,
            message:
              this.$t('common.pleaseInput') +
              ' ' +
              this.$t('message.productManagement.height'),
            trigger: ['blur', 'change']
          }
        ],
        image_url: [
          {
            required: false,
            message: this.$t(
              'message.productManagement.uploadCategoryPictures'
            ),
            trigger: ['blur', 'change']
          }
        ],
        imageUrl: [
          {
            required: false,
            message: this.$t('message.productManagement.uploadProductImages'),
            trigger: ['blur', 'change']
          }
        ],
        price: [
          {
            required: true,
            message: this.$t('message.productManagement.pricePlaceholder'),
            trigger: ['blur', 'change']
          }
        ]
      },
      imageUrl: '',
      imgUploadDialogVisible: false,
      disabled: false
    }
  },
  methods: {
    onSubmit () {
      this.$refs.modalForm.validate((valid) => {
        if (valid) {
          if (this.operationType === 'add') {
            this.addProduct()
          } else {
            this.editProduct()
          }
        } else {
          return false
        }
      })
    },
    addProduct () {
      // 组装数据
      // const requestData = objectToFormData(this.modalForm)
      this.loading = true
      this.modalForm.source = 0
      this.$ajax({
        url: '/api-prefix/api/product/create-product',
        method: 'post',
        data: this.modalForm,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.modalVisible = false
            this.$emit('confirm')
          } else if (res.code === 7005) {
            // 7005 代表重复了
            //数据格式 res.data => [{location:'dsadsa'},{name:"sdsadsa"},{code:'sddadsa'}]
            const repeatKeys = res.data.map((obj) => Object.keys(obj))
            const repeatMsg = repeatKeys
              .map((key) => this.$t(`message.storage.${key}`))
              .join(',')
            this.$message.error(`${repeatMsg} is duplicated.`)
            this.addWarehousingLoading = false
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    editProduct () {
      this.submitData = utils.deepClone(this.modalForm)
      this.loading = true
      if (this.currentData.product_variants.length === 1) {
        // 取当前数据的product_uuid 在originalData中找到原始数据 进行替换
        const originalData = this.originalDataArr.filter((item) => {
          return item.product_uuid === this.modalForm.product_uuid
        })
        originalData[0].product_variants.forEach((el) => {
          if (el.variant_id !== this.modalForm.variant_id) {
            this.submitData.product_variants.push(el)
          }
        })
      }
      this.$ajax({
        url: '/api-prefix/api/product/modify-product-definition',
        method: 'post',
        data: this.submitData,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.modalVisible = false
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
    checkFormChanges () {
      // 如果 operationType 不为add 则需要判断表单数据是否变动来进行按钮的禁用
      if (this.operationType !== 'add') {
        this.disableSubmitButton = this.isFormDataUnchanged(
          this.currentData,
          this.modalForm
        )
      }
    },
    handlerClose () {
      this.$emit('close')
    },
    // 图片上传
    handleUploadImage (fileList) {
      if (fileList && fileList.length !== 0) {
        this.modalForm.main_image_url = fileList[0].file_url
      } else {
        this.modalForm.main_image_url = undefined
      }
      // 主图片处理函数
    },
    handleUploadSubImage (fileList, categoryInfo) {
      // 主图片处理函数
      if (
        arguments[0] &&
        arguments[0].length !== 0 &&
        arguments[0][0] &&
        arguments[0][0].length !== 0
      ) {
        this.$set(categoryInfo, 'sub_image_url', arguments[0][0][0].file_url)
      } else {
        arguments[1].sub_image_url = undefined
      }
    },
    deletCategory (categoryInfo, index) {
      this.modalForm.product_variants.splice(index, 1)
      // 重置卡片顺序
      this.modalForm.product_variants.forEach((el, i) => {
        el.num = i + 1
      })
      this.$forceUpdate()
    },
    addCategoryInfo () {
      if (!this.modalForm.product_variants) {
        this.modalForm.product_variants = []
      }
      this.modalForm.product_variants.push(
        utils.deepClone(this.productVariantsInfo)
      )
      this.modalForm.product_variants.forEach((el, i) => {
        el.num = i + 1
      })
      this.activeName = this.modalForm.product_variants.length
      this.$forceUpdate()
    },
    // 检查表单数据是否发生变化
    isFormDataUnchanged (originalFormData, newFormData) {
      // 比较表单数据与原始表单数据是否相同
      return JSON.stringify(newFormData) === JSON.stringify(originalFormData)
    }
  },
  mounted () { },
  watch: {
    visible: {
      handler (newValue) {
        this.modalVisible = newValue
        this.activeName = 1
        this.$refs.modalForm?.resetFields()
        const keys = Object.keys(this.currentData).filter(
          (key) => key !== '__ob__'
        )
        if (keys.length !== 0) {
          this.operationType = 'edit'
          if (
            this.currentData.product_variants &&
            this.currentData.product_variants !== 0
          ) {
            this.currentData.product_variants.forEach((el, index) => {
              el.num = index + 1
            })
          }
          this.modalForm = utils.deepClone(this.currentData)
        } else {
          this.operationType = 'add'
          this.modalForm = { product_variants: [] }
          this.modalForm.product_variants.push(
            utils.deepClone(this.productVariantsInfo)
          )
        }
      },
      immediate: true
    }
  },
  computed: {
    // 列表
    list () {
      let temp = 1
      if (this.value) {
        // 首先将值转为数组
        const list = Array.isArray(this.value) ? this.value : [this.value]
        // 然后将数组转为对象数组
        return list.map((item) => {
          if (typeof item === 'string') {
            item = { name: item, url: item }
          }
          item.uid = item.uid || new Date().getTime() + temp++
          return item
        })
      } else {
        this.fileList = []
        return []
      }
    }
  }
}
</script>
<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}
.avatar-uploader {
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  ::v-deep .el-upload:hover {
    border-color: #409eff;
  }
  ::v-deep .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.categoryInfo-class {
  margin-right: 20px;
  flex: 1;
  display: flex;
  justify-content: space-between;
}
</style>
