<!--
* @description  参数1
* @fileName  logistics-api-dialog
* @author wjp
* @date 2024-01-23 17:39:57
!-->
<template>
  <div id="logistics-api-dialog" class="logistics-api-dialog">
    <el-dialog
      :title="
        submitType === 'add'
          ? $t('message.myAccount.addLogisticsAPI')
          : $t('message.myAccount.editLogisticsAPI')
      "
      :visible.sync="logisticsApiVisible"
      @close="closeLogisticsApiDialog"
      :close-on-click-modal="false"
      width="40%"
      v-loading="loading"
    >
      <el-form
        :model="addLogisticsApiForm"
        :rules="addLogisticsApiRules"
        ref="addLogisticsApiForm"
        label-position="top"
      >
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item
              :label="$t('message.myAccount.logisticsAPIName')"
              prop="api_name"
            >
              <!-- <el-input
                v-model="addLogisticsApiForm.api_name"
                autocomplete="off"
                :placeholder="
                  $t('message.myAccount.logisticsAPINamePlaceholder')
                "
              ></el-input> -->
              <el-select
                v-model="addLogisticsApiForm.api_name"
                :placeholder="$t('common.pleaseSelect')"
                style="width: 240px"
              >
                <el-option
                  v-for="item in logisticsApiNameList"
                  :key="item.value"
                  :label="item.label[$languageType]"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">{{
          $t('message.myAccount.apiParameters')
        }}</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.clientId')"
              prop="api_params.client_id"
            >
              <el-input
                clearable
                style="width: 240px"
                :placeholder="$t('message.myAccount.clientIdPlaceholder')"
                v-model="addLogisticsApiForm.api_params.client_id"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.apiToken')"
              prop="api_params.api_token"
            >
              <el-input
                style="width: 240px"
                clearable
                :placeholder="$t('message.myAccount.apiTokenPlaceholder')"
                v-model="addLogisticsApiForm.api_params.api_token"
                type="password"
                show-password
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.account')"
              prop="api_params.u_account"
            >
              <el-input
                style="width: 240px"
                clearable
                :placeholder="$t('message.myAccount.accountPlaceholder')"
                v-model="addLogisticsApiForm.api_params.u_account"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.password')"
              prop="api_params.password"
            >
              <el-input
                style="width: 240px"
                clearable
                :placeholder="$t('message.myAccount.passwordPlaceholder')"
                type="password"
                show-password
                v-model="addLogisticsApiForm.api_params.password"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeLogisticsApiDialog">{{
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
import { getApiNameListInfo } from '@/common/common-func'
import { provide } from 'vue';
import { resolvePreferenceProviderUuid } from '@/common/global-user-settings'
export default {
  name: 'logistics-api-dialog',
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
      logisticsApiNameList: [],
      formLabelWidth: '150px',
      logisticsApiVisible: false,
      addLogisticsApiForm: {
        api_name: 'FLYT',
        api_params: {
          client_id: '',
          api_token: '',
          u_account: '',
          password: '',
        },
      },
      addLogisticsApiRules: {
        api_name: [
          { required: true, message: this.$t('message.myAccount.logisticsAPINamePlaceholder'), trigger: 'blur' },
        ],
        'api_params.client_id': [
          { required: false, message: this.$t('message.myAccount.clientIdPlaceholder'), trigger: 'blur' },
        ],
        'api_params.api_token': [
          { required: false, message: this.$t('message.myAccount.apiTokenPlaceholder'), trigger: 'blur' },
        ],
        'api_params.u_account': [
          { required: false, message: this.$t('message.myAccount.accountPlaceholder'), trigger: 'blur' },
        ],
        'api_params.password': [
          { required: false, message: this.$t('message.myAccount.passwordPlaceholder'), trigger: 'blur' },
        ],

      },

    }
  },
  methods: {
    getApiNameListInfo,
    closeLogisticsApiDialog () {
      this.logisticsApiVisible = false;
      this.$emit('close');
    },
    submitData (type) {
      this.$refs.addLogisticsApiForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let methodType = 'post';
          let reqUrl = '/api-prefix/api/logistics/define-api-params';
          const provider_uuid = this.provider_uuid;
          if (!provider_uuid) {
            this.$message.error(this.$t('message.myAccount.noShop'));
            this.loading = false;
            return;
          }
          this.addLogisticsApiForm['provider_uuid'] = provider_uuid;

          if (type === 'edit') {
            // delete this.addLogisticsApiForm.customer_id
            // delete this.addLogisticsApiForm.create_time
            methodType = 'put';
            reqUrl = '/api-prefix/api/logistics/modify-api-params';
          }
          this.$ajax({
            method: methodType,
            url: reqUrl,
            data: this.addLogisticsApiForm,
            roleType: this.roleType
          }).then(res => {
            if (this.$isRequestSuccessful(res.code)) {
              this.$message({
                message: this.$t('common.operationSuccessful'),
                type: 'success'
              })
              this.closeLogisticsApiDialog();
              this.$refs.addLogisticsApiForm.resetFields();
              this.addLogisticsApiForm = Object.assign({}, {
                api_name: '',
                api_params: {
                  client_id: '',
                  api_token: '',
                  u_account: '',
                  password: '',
                },
              })
              this.$emit('ok');
            }
          }).finally(() => {
            this.loading = false;
          })
        }
      })
    },
    getApiNameList () {
      this.getApiNameListInfo().then(result => {
        this.logisticsApiNameList = Object.keys(result).map(key => {
          return {
            value: key,
            label: result[key]
          };
        });
      }).catch(() => {
        this.logisticsApiNameList = []
      })
    }
  },
  computed: {
    provider_uuid () {
      const uuid = resolvePreferenceProviderUuid(this.$store, this.roleType)
      if (uuid) return uuid
      const fallback = localStorage.getItem('shop_provider_uuid')
      return fallback || ''
    },
  },
  mounted () {
    this.getApiNameList();
  },
  watch: {
    visible (val) {
      if (val) {
        this.logisticsApiVisible = val;
        // this.getApiNameList();
        if (this.submitType === 'edit' && this.currentData) {
          this.addLogisticsApiForm = Object.assign({}, this.currentData);
          this.addLogisticsApiForm.api_id = this.currentData.id;
          // 确保 api_params 被正确处理
          let apiParams = this.currentData.api_params || {};
          this.addLogisticsApiForm.api_params.client_id = apiParams.client_id || '';
          this.addLogisticsApiForm.api_params.api_token = apiParams.api_token || '';
          this.addLogisticsApiForm.api_params.u_account = apiParams.u_account || '';
          this.addLogisticsApiForm.api_params.password = apiParams.password || '';
        }
      }
    }
  }

}
</script>
<style scoped lang='css'>
</style>
