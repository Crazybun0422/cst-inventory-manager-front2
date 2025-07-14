<!--
* @description  参数1
* @fileName  print-product-tag-dialog
* @author wjp
* @date 2024-01-24 21:37:53
!-->
<template>
  <div id="print-product-tag-dialog" class="print-product-tag-dialog">
    <el-dialog
      :title="$t('common.print')"
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
          :label="$t('message.myAccount.store')"
          prop="provider_uuid"
        >
          <el-select
            v-model="printProductTagForm.provider_uuid"
            clearable
            :placeholder="$t('common.pleaseSelect')"
            @change="getProductTagInfo"
          >
            <el-option
              v-for="item in providerUuidOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('message.myAccount.productLabel')"
          prop="product_tag_id"
        >
          <el-select
            v-model="printProductTagForm.product_tag_id"
            clearable
            :placeholder="$t('common.pleaseSelect')"
            @change="getProductTag"
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
        <el-button type="primary" @click="submitPrint">{{
          $t('common.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWarehouseRelatedInfo, printProductLabel, getProductTagPdf, getProductLabelList } from '@/common/common-func'
export default {
  name: 'print-product-tag-dialog',
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
      loading: false,
      printProductTagForm: {
        provider_uuid: '',
        product_tag_id: ""
      },
      printProductTagFormRules: {
        provider_uuid: [
          { required: true, message: this.$t('message.storage.warehousingSelect'), trigger: 'change' }
        ],
        product_tag_id: [
          { required: true, message: this.$t('message.myAccount.productLabelSelect'), trigger: 'change' }
        ]

      },
      dialogVisible: false,
      providerUuidOptions: [

      ],
      productTagOptions: [

      ],
      productTageList: [

      ],
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
    getWarehouseRelatedInfo,
    printProductLabel,
    getProductTagPdf,
    getProductLabelList,
    submitPrint () {
      this.$refs.printProductTagForm.validate(async valid => {
        if (valid) {
          // this.$emit('submit', this.printProductTagForm)
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
            console.error("err: ", err);
          }).finally(() => {
            this.loading = false
            this.handleClose()
          })
        }
      })
    },
    handleClose () {
      this.dialogVisible = false
      this.$refs.printProductTagForm.resetFields()

      this.$emit('close')
    },
    getProviderInfo () {
      this.getWarehouseRelatedInfo().then((resData) => {
        this.providerUuidOptions = resData.map(item => {
          return {
            label: item.name,
            value: item.provider_uuid
          }
        })
        this.printProductTagForm.provider_uuid = this.providerUuidOptions[0].value
        if (this.providerUuidOptions[0].value) {
          this.getProductTagInfo()
        }
      })

    },
    getProductTagInfo (val) {
      if (!this.printProductTagForm.provider_uuid) {
        // this.getProviderInfo()
        return
      }
      let queryParam = {
        provider_uuid: this.printProductTagForm.provider_uuid,
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
    provider_uuid: {
      get () {
        // ds 获取provider_uuid 通过 this.$store.state.user.dsCurrentProviderUuid
        return this.$store.state.user.dsCurrentProviderUuid
      },
      set () { }//添加一个空setter防止报错
    },
  },
  mounted () {
    this.getProviderInfo()
    // this.getProductTagInfo()
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    }
  }
}
</script>
<style scoped lang='css'>
</style>