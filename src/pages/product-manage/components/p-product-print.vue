<!--
* @description  参数1
* @fileName  p-product-print
* @author wjp
* @date 2024-07-21 16:51:08
!-->
<template>
  <div id="p-product-print" class="p-product-print">
    <el-dialog
      title="打印商品标签"
      :visible.sync="dialogVisible"
      width="25%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <el-form
        :model="printProductTagForm"
        :rules="printProductTagFormRules"
        ref="printProductTagForm"
        label-width="120px"
      >
        <el-form-item
          :label="$t('message.productInfo.tags')"
          prop="product_tag_id"
        >
          <el-select
            v-model="printProductTagForm.product_tag_id"
            clearable
            filterable
            :placeholder="$t('common.pleaseSelect')"
          >
            <el-option
              v-for="item in productTagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="medium">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitForm">
          {{ $t('common.print') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { printProductLabel, getProductTagPdf, getProductLabelList } from '@/common/common-func'

export default {
  name: 'p-product-print',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    product_uuids: {
      type: Array,
      default: () => []
    }
  },
  components: {

  },
  data () {
    return {
      dialogVisible: false,
      loading: false,
      printProductTagForm: {
        product_tag_id: '',
      },
      printProductTagFormRules: {
        product_tag_id: [
          { required: true, message: '请选择标签类型', trigger: 'change' }
        ],
      },
      providerUuidOptions: [],
      productTagOptions: [],
      productTagParams: {
        width_cm: '',
        height_cm: '',
        img_type: '',
        is_center: '',
        has_english_title: '',
      }
    }
  },
  methods: {
    printProductLabel,
    getProductTagPdf,
    getProductLabelList,
    handleClose () {
      this.dialogVisible = false
      this.$emit('close')
    },
    submitForm () {
      this.$refs['printProductTagForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.printProductLabel(this.product_uuids, this.productTagParams).then(async res => {
            if (this.$isRequestSuccessful(res.code)) {
              this.$message({
                message: this.$t('common.printSuccessful'),
                type: 'success'
              })
              await this.getProductTagPdf(res.data, this.roleType)
            }
          }).catch(err => {
          }).finally(() => {
            this.loading = false
            this.handleClose()
          })
        }
      })
    },
    getProductTagInfo () {
      let queryParam = {
        provider_uuid: this.provider_uuid,
        page_num: 1,
        page_size: 100
      }
      this.getProductLabelList(queryParam).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          if (res.data.total !== 0) {
            this.productTageList = res.data.results
            this.productTagOptions = res.data.results.map(item => {
              return {
                label: item.config_name,
                value: item.format_id
              }
            })
          }
          if (this.productTagOptions.length !== 0) {
            this.printProductTagForm.product_tag_id = this.productTagOptions[0].value
            this.getProductTag(this.productTagOptions[0].value)
          }
        }
      })
    },
    getProductTag (val) {
      if (this.productTageList.length !== 0) {
        const productTag = this.productTageList.find(item => item.format_id === val)
        this.printProductTagForm.product_tag_id = val
        this.productTagParams = {
          width_cm: productTag.width_cm,
          height_cm: productTag.height_cm,
          img_type: productTag.img_type,
          is_center: productTag.is_center,
          has_english_title: productTag.has_english_title,
        }
      }

    }
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },

  },
  mounted () {

  },
  watch: {
    visible (val) {
      if (val) {
        this.dialogVisible = true
        this.getProductTagInfo()
      }
    }
  }
}
</script>
<style scoped lang='css'>
</style>