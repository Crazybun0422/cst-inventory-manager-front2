<!--
* @description  Dialog for creating and editing logistics track URLs
* @fileName  logistics-track-url-dialog
!-->
<template>
  <div class="logistics-track-url-dialog">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="visibleInternal"
      width="40%"
      :close-on-click-modal="false"
      v-loading="loading"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.logisticsTrackUrlZhName')"
              prop="zh_name"
            >
              <el-input
                v-model.trim="form.zh_name"
                :placeholder="$t('message.myAccount.logisticsTrackUrlZhNamePlaceholder')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.logisticsTrackUrlEnName')"
              prop="en_name"
            >
              <el-input
                v-model.trim="form.en_name"
                :placeholder="$t('message.myAccount.logisticsTrackUrlEnNamePlaceholder')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.logisticsTrackUrlIsDefault')"
              prop="is_default"
            >
              <el-switch
                v-model="form.is_default"
                :active-text="$t('common.yes')"
                :inactive-text="$t('common.no')"
                :disabled="!isProviderRole"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item
              :label="$t('message.myAccount.logisticsTrackUrlAddress')"
              prop="query_url"
            >
              <el-input
                v-model.trim="form.query_url"
                :placeholder="$t('message.myAccount.logisticsTrackUrlAddressPlaceholder')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createLogisticsQueryUrl,
  updateLogisticsQueryUrl
} from '@/common/common-func'
import { resolvePreferenceProviderUuid } from '@/common/global-user-settings'
import { config } from '@/common/commonconfig'

export default {
  name: 'logistics-track-url-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    submitType: {
      type: String,
      default: 'add'
    },
    currentData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      visibleInternal: false,
      loading: false,
      form: this.getDefaultForm(),
      rules: {
        zh_name: [
          {
            required: true,
            message: this.$t('message.myAccount.logisticsTrackUrlZhNamePlaceholder'),
            trigger: 'blur'
          }
        ],
        en_name: [
          {
            required: true,
            message: this.$t('message.myAccount.logisticsTrackUrlEnNamePlaceholder'),
            trigger: 'blur'
          }
        ],
        query_url: [
          {
            required: true,
            message: this.$t('message.myAccount.logisticsTrackUrlAddressPlaceholder'),
            trigger: 'blur'
          },
          {
            validator: this.validateUrl,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.submitType === 'edit'
        ? this.$t('message.myAccount.editLogisticsTrackUrl')
        : this.$t('message.myAccount.addLogisticsTrackUrl')
    },
    provider_uuid () {
      const uuid = resolvePreferenceProviderUuid(this.$store, this.roleType)
      if (uuid) return uuid
      const fallback = localStorage.getItem('shop_provider_uuid')
      return fallback || ''
    },
    isProviderRole () {
      return this.roleType === config.provider.role || this.roleType === config.operator.role
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler (val) {
        this.visibleInternal = val
        if (val) {
          this.initializeForm()
        }
      }
    },
    currentData: {
      deep: true,
      handler () {
        if (this.visibleInternal) {
          this.initializeForm()
        }
      }
    },
    'form.is_default' (val) {
      if (this.isProviderRole) {
        this.form.scope = val ? 'default' : 'custom'
      }
    }
  },
  methods: {
    createLogisticsQueryUrl,
    updateLogisticsQueryUrl,
    getDefaultForm () {
      return {
        id: '',
        zh_name: '',
        en_name: '',
        query_url: '',
        scope: this.isProviderRole ? 'default' : 'custom',
        is_default: this.isProviderRole
      }
    },
    initializeForm () {
      this.$nextTick(() => {
        const base = this.getDefaultForm()
        if (this.submitType === 'edit' && this.currentData) {
          this.form = Object.assign({}, base, this.currentData)
        } else {
          this.form = { ...base }
        }
        if (this.isProviderRole) {
          this.form.scope = this.form.is_default ? 'default' : 'custom'
        }
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate()
        }
      })
    },
    handleClose () {
      this.visibleInternal = false
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    handleSubmit () {
      if (!this.isProviderRole && !this.provider_uuid) {
        this.$message.error(this.$t('message.myAccount.noShop'))
        return
      }
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        this.loading = true
        const payload = {
          zh_name: this.form.zh_name,
          en_name: this.form.en_name,
          query_url: this.form.query_url
        }
        if (this.isProviderRole) {
          payload.scope = this.form.is_default ? 'default' : 'custom'
          payload.is_default = !!this.form.is_default
        } else {
          payload.scope = 'custom'
          payload.is_default = false
          payload.provider_uuid = this.provider_uuid
        }
        let request = null
        if (this.submitType === 'edit' && this.form.id) {
          payload.id = this.form.id
          if (this.form.scope) payload.scope = this.form.scope
          if (typeof this.form.is_default !== 'undefined') {
            payload.is_default = !!this.form.is_default
          }
          request = this.updateLogisticsQueryUrl(payload)
        } else {
          request = this.createLogisticsQueryUrl(payload)
        }
        request.then(res => {
          if (this.$isRequestSuccessful(res.code)) {
            this.$message.success(this.$t('common.operationSuccessful'))
            if (this.$refs.formRef) {
              this.$refs.formRef.resetFields()
            }
            this.handleClose()
            this.$emit('ok')
          } else {
            this.handleRequestError(res)
          }
        }).catch(err => {
          this.handleRequestError(err)
        }).finally(() => {
          this.loading = false
        })
      })
    },
    validateUrl (rule, value, callback) {
      if (!value) {
        return callback()
      }
      const urlPattern = /^(https?:\/\/).+/i
      if (!urlPattern.test(value)) {
        return callback(new Error(this.$t('message.myAccount.logisticsTrackUrlAddressInvalid')))
      }
      return callback()
    },
    handleRequestError (res) {
      if (res && res.msg) {
        const msg = res.msg[this.$languageType] || res.msg.en_us || res.msg.zh_cn
        if (msg) {
          this.$message.error(msg)
          return
        }
      }
      this.$message.error(this.$t('common.operationFailed'))
    }
  }
}
</script>

<style scoped>
.logistics-track-url-dialog {
  width: 100%;
}
</style>
