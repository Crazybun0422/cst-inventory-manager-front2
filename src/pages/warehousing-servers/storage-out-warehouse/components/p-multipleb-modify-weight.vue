<!--
* @description  批量修改重量
* @fileName  p-multipleb-modify-weight
* @author wjp
* @date 2024-08-25 22:33:28
!-->
<template>
  <div id="p-multipleb-modify-weight" class="p-multipleb-modify-weight">
    <el-dialog
      :title="$t('navigate.batchWeighing')"
      :visible.sync="dialogVisible"
      width="20%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="$t('message.productManagement.weight')"
              prop="weight"
            >
              <el-input-number
                v-model="form.weight"
                style="width: 200px"
                :placeholder="$t('message.productManagement.weight')"
                :min="0"
                :step="0.01"
                :precision="2"
                clearable
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="batchModifyWeight">{{
          $t('common.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'p-multipleb-modify-weight',
  props: {
    delivery_ids: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
  },
  components: {

  },
  data () {
    return {
      dialogVisible: false,
      form: {
        weight: ''
      },
      rules: {
        weight: [
          {
            required: true, message: this.$t('message.productInfo.pleaseEnterWeight'), trigger: 'blur'
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleClose (refresh = false) {
      this.dialogVisible = false
      this.$refs.form.resetFields()
      this.form.weight = ''
      this.$emit('close', refresh)
    },
    batchModifyWeight () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$ajax({
            url: '/api-prefix/api/delivery_list/batch-delivery-weighing',
            method: 'put',
            data: {
              delivery_ids: this.delivery_ids,
              weight: this.form.weight
            },
            roleType: this.roleType
          }).then(res => {
            if (this.$isRequestSuccessful(res.code)) {
              this.$message.success(res.msg[this.$languageType])
              this.handleClose(true)
            }
          }).finally(() => {
            this.loading = false
          })
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
    },
  }
}
</script>
<style scoped lang='css'>
</style>