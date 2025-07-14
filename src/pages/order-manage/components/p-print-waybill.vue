<!--
* @description  参数1
* @fileName  p-print-waybill
* @author wjp
* @date 2024-06-06 21:50:38
!-->
<template>
  <div id="p-print-waybill" class="p-print-waybill">
    <el-dialog
      :title="$t('message.orderManagement.printWaybill')"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form :model="form" label-width="80px" :rules="formRules">
        <el-form-item
          :label="$t('message.orderManagement.paperType')"
          prop="paper_type"
        >
          <el-select
            v-model="form.paper_type"
            :placeholder="$t('message.orderManagement.selectPaperType')"
          >
            <el-option
              v-for="item in paperTypeMap"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('message.orderManagement.printType')"
          prop="print_type"
        >
          <el-select
            v-model="form.print_type"
            :placeholder="$t('message.orderManagement.selectPrintType')"
          >
            <el-option
              v-for="item in printTypeMap"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose"> {{ $t('common.cancel') }} </el-button>
        <el-button type="primary" @click="submitForm">
          {{ $t('common.confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { printTypeMap, paperTypeMap } from '@/common/field-maping'
export default {
  name: 'p-print-waybill',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderIds: {
      type: Array,
      default: () => []
    }
  },
  components: {

  },
  data () {
    return {
      paperTypeMap: paperTypeMap,
      printTypeMap: printTypeMap,
      formRules: {
        paper_type: [
          { required: true, message: this.$t('message.orderManagement.selectPaperType'), trigger: 'change' }
        ],
        print_type: [
          { required: true, message: this.$t('message.orderManagement.selectPrintType'), trigger: 'change' }
        ]
      },
      form: {
        paper_type: paperTypeMap[0].value,
        print_type: printTypeMap[0].value
      },
      dialogVisible: false
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handleClose()
        }
      })
    }
  },
  computed: {

  },
  mounted () {

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