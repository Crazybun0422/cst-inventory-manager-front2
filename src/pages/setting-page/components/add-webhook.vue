<!--
* @description  参数1
* @fileName  add-webhook
* @author wjp
* @date 2023-12-27 21:22:43
!-->
<template>
  <div id="add-webhook" class="add-webhook">
    <el-dialog
      :title="
        formType === 'edit'
          ? $t('message.webhook.editWebhook')
          : $t('message.webhook.addWebhook')
      "
      :visible.sync="webhookVisible"
      width="45%"
      @close="handleClose"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <el-form
        :model="webhookForm"
        label-suffix=":"
        :rules="webhookRules"
        ref="webhookForm"
      >
        <el-form-item :label="$t('message.webhook.source')" prop="source">
          <el-select
            v-model="webhookForm.source"
            clearable
            :placeholder="$t('message.webhook.sourceSelectPlaceholder')"
            style="width: 100%"
          >
            <el-option
              v-for="item in webhookSourceOptions"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('message.webhook.webhookName')"
          prop="subscription_name"
        >
          <el-input
            v-model.trim="webhookForm.subscription_name"
            :placeholder="$t('message.webhook.webhookNamePlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('message.webhook.webhookUrl')"
          prop="callback_url"
        >
          <el-input
            v-model.trim="webhookForm.callback_url"
            :placeholder="$t('message.webhook.webhookUrlPlaceholder')"
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('message.webhook.webhookType')"
          prop="subscription_type"
        >
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >{{ $t('common.allCheck') }}</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="webhookForm.subscription_type"
            @change="handleChecked"
          >
            <el-checkbox
              v-for="webhook in webhookMap"
              :label="webhook.value"
              :key="webhook.value"
              >{{ webhook.label[$languageType] }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item :label="$t('common.authInfo')" prop="authorization">
          <el-input v-model.trim="webhookForm.authorization"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{
          $t('common.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { webhooksTypeMap, webhookSourceOptions } from '@/common/field-maping'
export default {
  name: 'add-webhook',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    cuurentWebhook: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {

  },
  data () {
    return {
      loading: false,
      checkAll: false,
      webhookVisible: false,
      webhookSourceOptions,
      formType: 'add',
      webhooks: webhooksTypeMap.map(item => item.value),
      isIndeterminate: false,
      webhookForm: {
        subscription_name: '',
        callback_url: '',
        subscription_type: [],
        authorization: '',
        source: null
      },
      webhookRules: {
        subscription_name: [
          { required: true, message: this.$t('message.webhook.webhookNamePlaceholder'), trigger: 'blur' }
        ],
        callback_url: [
          { required: true, message: this.$t('message.webhook.webhookUrlPlaceholder'), trigger: 'blur' }
        ],
        subscription_type: [
          { required: true, message: this.$t('message.webhook.webhookTypeSelect'), trigger: 'blur' }
        ],
        authorization: [
          { required: false, message: this.$t('message.webhook.webhookAuthInfoPlaceholder'), trigger: 'blur' }
        ],
        source: [
          { required: true, message: this.$t('message.webhook.sourceSelectPlaceholder'), trigger: 'change' }
        ]
      },
      webhookMap: webhooksTypeMap,
    }
  },
  methods: {
    handleClose () {
      this.$refs.webhookForm.resetFields()
      this.webhookForm = Object.assign({ subscription_type: [] }, undefined)
      this.$emit('close')
    },
    handleCheckAllChange (val) {
      this.webhookForm.subscription_type = val ? this.webhooks : [];
      this.isIndeterminate = false;
    },
    handleChecked (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.webhookMap.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.webhookMap.length;
    },
    async updateWebhook () {
      try {
        this.loading = true
        const res = await this.$ajax({
          url: '/api-prefix/api/webhook-subscribe/update',
          method: 'put',
          data: this.webhookForm
        })
        if (this.$isRequestSuccessful(res.code)) {
          this.$message({
            message: this.$t('common.editSuccessful'),
            type: 'success'
          })
          this.$emit('ok')
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          })
        }
      }
      catch (e) {
        this.loading = false
      }
      finally {
        this.loading = false
      }
    },
    async creatWebhook () {
      try {
        this.loading = true
        const res = await this.$ajax({
          url: '/api-prefix/api/webhook-subscribe/create',
          method: 'post',
          data: this.webhookForm
        })
        if (this.$isRequestSuccessful(res.code)) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$emit('ok')
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          })
        }
      }
      catch (e) {
        this.loading = false
      }
      finally {
        this.loading = false
      }
    },
    async submitForm () {
      this.$refs.webhookForm.validate(async valid => {
        if (valid) {
          if (this.formType === 'add') {
            await this.creatWebhook()
          } else {
            await this.updateWebhook()
          }
        } else {
          return false
        }
      })
    }
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    dialogVisible: {
      handler (val) {
        this.webhookVisible = val
        if (!val) {
          return
        }
        if (this.cuurentWebhook && this.cuurentWebhook.subscription_id) {
          this.formType = 'edit'
          this.webhookForm = this.cuurentWebhook
          this.checkAll = this.cuurentWebhook.subscription_type.length === this.webhookMap.length;
          if (!this.webhookForm.subscription_type) {
            this.webhookForm.subscription_type = []
          }

        } else {
          this.formType = 'add'
          this.webhookForm = Object.assign({ subscription_type: [] }, undefined)
          this.checkAll = false
          if (!this.webhookForm.subscription_type) {
            this.webhookForm.subscription_type = []
          }
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang='css'>
</style>