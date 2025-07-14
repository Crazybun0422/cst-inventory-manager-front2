<!--
* @description  参数1
* @fileName  product-tag-dialog
* @author wjp
* @date 2024-01-23 17:39:57
!-->
<template>
  <div id="product-tag-dialog" class="product-tag-dialog">
    <el-dialog
      :title="
        submitType === 'add'
          ? $t('message.myAccount.addProductLabel')
          : $t('message.myAccount.editProductLabel')
      "
      :visible.sync="productTagVisible"
      @close="closeProductTagDialog"
      :close-on-click-modal="false"
      width="30%"
      v-loading="loading"
    >
      <el-form
        :model="addProductTagForm"
        :rules="addProductTagRules"
        ref="addProductTagForm"
        label-position="top"
      >
        <el-form-item
          :label="$t('message.myAccount.config_name')"
          prop="config_name"
        >
          <el-input
            v-model="addProductTagForm.config_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.width_cm')"
              prop="width_cm"
            >
              <el-input-number
                clearable
                style="width: 240px"
                :min="0"
                :precision="2"
                :step="0.01"
                v-model="addProductTagForm.width_cm"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.height_cm')"
              prop="height_cm"
            >
              <el-input-number
                style="width: 240px"
                clearable
                :min="0"
                :precision="2"
                :step="0.01"
                v-model="addProductTagForm.height_cm"
                >cm</el-input-number
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.img_type')"
              prop="img_type"
            >
              <el-radio-group v-model="addProductTagForm.img_type">
                <el-radio :label="0" border style="width: 100px">{{
                  $t('common.barcode')
                }}</el-radio>
                <el-radio :label="1" border style="width: 100px">{{
                  $t('common.qrCode')
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.is_center')"
              prop="is_center"
            >
              <el-radio-group v-model="addProductTagForm.is_center">
                <el-radio :label="1" border style="width: 100px">{{
                  $t('common.yes')
                }}</el-radio>
                <el-radio :label="0" border style="width: 100px">{{
                  $t('common.no')
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.has_english_title')"
              prop="has_english_title"
            >
              <el-radio-group v-model="addProductTagForm.has_english_title">
                <el-radio :label="1" border style="width: 100px">{{
                  $t('common.yes')
                }}</el-radio>
                <el-radio :label="0" border style="width: 100px">{{
                  $t('common.no')
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeProductTagDialog">{{
          $t('common.cancel')
        }}</el-button>
        <el-button type="primary" @click="submitData(submitType)">{{
          $t('common.confirm')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'product-tag-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentData: {
      type: Object,
      default: () => { }
    },
    submitType: {
      type: String,
      default: 'add'
    }
  },
  components: {

  },
  data () {
    return {
      loading: false,
      formLabelWidth: '150px',
      productTagVisible: false,
      addProductTagForm: {},
      addProductTagRules: {
        config_name: [
          { required: true, message: this.$t('message.myAccount.config_name'), trigger: 'blur' },
        ],
        width_cm: [
          { required: true, message: this.$t('message.myAccount.width_cm'), trigger: 'blur' },
        ],
        height_cm: [
          { required: true, message: this.$t('message.myAccount.height_cm'), trigger: 'blur' },
        ],
        img_type: [

          { required: true, message: this.$t('message.myAccount.img_type'), trigger: 'blur' },
        ],
        is_center: [
          { required: true, message: this.$t('message.myAccount.is_center'), trigger: 'change' },
        ],
        has_english_title: [
          { required: true, message: this.$t('message.myAccount.has_english_title'), trigger: 'change' },
        ],
      },

    }
  },
  methods: {
    closeProductTagDialog () {
      this.productTagVisible = false;
      this.$emit('close');
    },
    submitData (type) {
      this.$refs.addProductTagForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let methodType = 'post';
          let provider_uuid = localStorage.getItem('shop_provider_uuid');
          if (!provider_uuid) {
            this.$message.error(this.$t('message.myAccount.noShop'));
            this.$router.push({ name: 'p-login' })
          }
          this.addProductTagForm['provider_uuid'] = provider_uuid;
          if (type === 'edit') {
            delete this.addProductTagForm.customer_id
            delete this.addProductTagForm.create_time
            methodType = 'put';
          }
          this.addProductTagForm['customer_id'] = localStorage.getItem('customer_id');
          this.$ajax({
            method: methodType,
            url: '/api-prefix/api/customer-settings/print-label-info',
            data: this.addProductTagForm,
            roleType: this.roleType,
          }).then(res => {
            if (this.$isRequestSuccessful(res.code)) {
              this.$message({
                message: this.$t('common.operationSuccessful'),
                type: 'success'
              })
              this.closeProductTagDialog();
              this.$refs.addProductTagForm.resetFields();
              this.addProductTagForm = Object.assign({}, undefined)
              this.$emit('ok');
            }
          }).finally(() => {
            this.loading = false;
          })
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
      if (val) {
        this.productTagVisible = val;
        if (this.submitType === 'edit') {
          this.addProductTagForm = this.currentData;
        }
      }
    }

  }
}
</script>
<style scoped lang='css'>
</style>