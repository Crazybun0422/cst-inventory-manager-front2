<!--
* @description  参数1
* @fileName  p-scan-and-print-code
* @author wjp
* @date 2024-07-24 21:10:41
!-->
<template>
  <div id="p-scan-and-print-code" class="p-scan-and-print-code">
    <el-dialog
      :title="$t('message.productManagement.scanAndPrintCode')"
      :visible.sync="dialogVisible"
      width="25%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <el-form
        :model="printProductForm"
        :rules="printProductFormRules"
        ref="printProductForm"
        label-width="120px"
      >
        <el-form-item :label="$t('common.outputFormat')" prop="output_format">
          <el-select
            v-model="printProductForm.output_format"
            clearable
            filterable
            :placeholder="$t('common.pleaseSelect')"
            class="selectStyle"
          >
            <el-option
              v-for="item in outputFormatMap"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.template')" prop="template">
          <el-select
            v-model="printProductForm.template"
            clearable
            filterable
            :placeholder="$t('common.pleaseSelect')"
            class="selectStyle"
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
        <el-form-item :label="$t('common.numberType')" prop="number_type">
          <el-select
            v-model="printProductForm.number_type"
            clearable
            filterable
            :placeholder="$t('common.pleaseSelect')"
            class="selectStyle"
          >
            <el-option
              v-for="item in numberTypeMap"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.number')" prop="number">
          <el-input
            v-model="printProductForm.number"
            placeholder="请输入号码"
          ></el-input>
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
import { numberTypeMap, outputFormatMap } from '@/common/field-maping'
export default {
  name: 'p-scan-and-print-code',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  components: {

  },
  data () {
    return {
      numberTypeMap, outputFormatMap,
      dialogVisible: false,
      loading: false,
      printProductForm: {
        template: '',
        output_format: numberTypeMap[0].value,
        number_type: outputFormatMap[0].value,
        number: ''
      },
      printProductFormRules: {
        output_format: [
          { required: true, message: '请选择输出格式', trigger: 'change' }
        ],
        template: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ],
        template: [
          { required: true, message: '请选择标签类型', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入号码', trigger: 'blur' }
        ]
      },
      providerUuidOptions: [],
      productTagOptions: []
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false
      this.$emit('close')
    },
    submitForm () {
      this.$refs['printProductForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.$message.success(this.$t('common.printSuccessful'))
          this.dialogVisible = false
          this.$emit('close')
          this.loading = false
        }
      })
    },
    getProductTagInfo () {
      if (!this.provider_uuid) return
      this.$ajax({
        // url: '/api-prefix/api/customer-settings/specific-print-label-info',
        url: '/api-prefix/api/customer-settings/print-label-info-list',
        method: 'get',
        roleType: this.roleType,
        params: {
          provider_uuid: this.provider_uuid,
          // config_name: this.printProductForm.template,
          page_num: 1,
          page_size: 100
        }
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.productTagOptions = res.data.results.map(item => {
            return {
              label: item.config_name,
              value: item.format_id
            }
          })
          this.$set(this.printProductForm, 'template', this.productTagOptions[0].value)
        }
      })
    },
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
.selectStyle {
  width: 318px;
}
</style>