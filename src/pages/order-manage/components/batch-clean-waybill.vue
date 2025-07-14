<!--
* @description  参数1
* @fileName  batch-clean-waybill
* @author wjp
* @date 2024-06-06 22:31:44
!-->
<template>
  <div id="batch-clean-waybill" class="batch-clean-waybill">
    <el-dialog
      :title="$t('message.orderManagement.batchClearOrderNumbers')"
      :visible.sync="dialogVisible"
      width="20%"
      :before-close="handleClose"
    >
      <el-form
        :model="modalWaybillForm"
        ref="modalShippingForm"
        :rules="waybillRules"
        ><el-row :gutter="24">
          <el-form-item prop="orderType">
            <el-select
              v-model="modalWaybillForm.orderType"
              :placeholder="$t('message.orderManagement.orderTypeSelect')"
              style="width: 100%"
            >
              <el-option
                v-for="item in clearOrderTypeMap"
                :key="item.value"
                :label="item.label[$languageType]"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose"> {{ $t('common.cancel') }}</el-button>
        <el-button @click="submitForm" type="primary">{{
          $t('common.save')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { clearOrderTypeMap } from '@/common/field-maping'
export default {
  name: 'batch-clean-waybill',
  props: {
    orderIds: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {

  },
  data () {
    return {
      clearOrderTypeMap: clearOrderTypeMap,
      modalWaybillForm: {
        orderType: ''
      },
      waybillRules: {
        orderType: [
          { required: true, message: this.$t("message.orderManagement.orderTypeSelect"), trigger: 'change' }
        ]
      },
      dialogVisible: false
    }
  },
  methods: {
    handleClose (refresh = false) {
      this.$emit('close', refresh)
    },
    submitForm () {
      this.$refs.modalShippingForm.validate(valid => {
        if (valid) {
          this.handleClose(true)
        }
      })
    },
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