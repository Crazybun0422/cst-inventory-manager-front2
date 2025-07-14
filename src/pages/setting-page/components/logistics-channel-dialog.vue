<!--
* @description  参数1
* @fileName  logistics-channel-dialog
* @author wjp
* @date 2024-01-23 17:39:57
!-->
<template>
  <div id="logistics-channel-dialog" class="logistics-channel-dialog">
    <el-dialog
      :title="
        submitType === 'add'
          ? $t('message.myAccount.addLogisticsChannel')
          : $t('message.myAccount.editLogisticsChannel')
      "
      :visible.sync="logisticsChannelVisible"
      @close="closeLogisticsChannelDialog"
      :close-on-click-modal="false"
      width="30%"
      v-loading="loading"
    >
      <el-form
        :model="addLogisticsChannelForm"
        :rules="addLogisticsChannelRules"
        ref="addLogisticsChannelForm"
        label-position="top"
        :label="$t('message.myAccount.logisticsAPIName')"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              prop="api_name"
              :label="$t('message.myAccount.logisticsAPIName')"
            >
              <SelectLogisticService
                v-model="addLogisticsChannelForm.api_name"
              ></SelectLogisticService>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.internalChannelId')"
              prop="channel_params.internal_channel_id"
            >
              <SelectInternalChannel
                ref="selectInternalChannel"
                v-model="
                  addLogisticsChannelForm.channel_params.internal_channel_id
                "
                :api_name="addLogisticsChannelForm.api_name"
                @update-channel-name="handleUpdateChannelName"
              ></SelectInternalChannel>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.logisticsChannelName')"
              prop="channel_name"
            >
              <el-input
                clearable
                style="width: 215px"
                :placeholder="
                  $t('message.myAccount.logisticsChannelNamePlaceholder')
                "
                :disabled="true"
                v-model="addLogisticsChannelForm.channel_name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.logisticsChannelCode')"
              prop="channel_code"
            >
              <el-input
                clearable
                style="width: 215px"
                :placeholder="
                  $t('message.myAccount.logisticsChannelCodePlaceholder')
                "
                v-model="addLogisticsChannelForm.channel_code"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeLogisticsChannelDialog">{{
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
import SelectLogisticService from '@/pages/components/select-logistics-api.vue'
import SelectInternalChannel from '@/pages/setting-page/components/logistics-channel/select-internal-channel.vue'
export default {
  name: 'logistics-channel-dialog',
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
    SelectLogisticService,
    SelectInternalChannel
  },
  data () {
    return {
      loading: false,
      formLabelWidth: '150px',
      logisticsChannelVisible: false,

      options: [],
      addLogisticsChannelForm: {
        api_name: '',
        channel_name: '',
        channel_code: '',
        channel_params: {
          internal_channel_id: ''
        }
      },
      addLogisticsChannelRules: {
        api_name: [
          { required: true, message: this.$t('message.myAccount.logisticsAPINamePlaceholder'), trigger: 'blur' },
        ],
        channel_name: [
          { required: true, message: this.$t('message.myAccount.logisticsChannelNamePlaceholder'), trigger: 'blur' },
        ],
        channel_code: [
          { required: true, message: this.$t('message.myAccount.logisticsChannelCodePlaceholder'), trigger: 'blur' },
        ],
        'channel_params.internal_channel_id': [
          { required: true, message: this.$t('message.myAccount.internalChannelIdPlaceholder'), trigger: 'blur' },
        ],
      },

    }
  },
  methods: {
    closeLogisticsChannelDialog () {
      this.logisticsChannelVisible = false;
      this.$emit('close');
    },
    handleUpdateChannelName (channelName) {
      // 更新 channel_name
      this.addLogisticsChannelForm.channel_name = channelName;
    },
    submitData (type) {
      this.$refs.addLogisticsChannelForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let methodType = 'post';
          let reqUrl = '/api-prefix/api/logistics/define-channel';
          let provider_uuid = localStorage.getItem('shop_provider_uuid');
          if (!provider_uuid) {
            this.$message.error(this.$t('message.myAccount.noShop'));
            this.$router.push({ name: 'p-login' })
          }
          this.addLogisticsChannelForm['provider_uuid'] = provider_uuid;

          if (type === 'edit') {
            // delete this.addLogisticsChannelForm.customer_id
            // delete this.addLogisticsChannelForm.create_time
            methodType = 'put';
            reqUrl = '/api-prefix/api/logistics/modify-channels';
          }
          this.$ajax({
            method: methodType,
            url: reqUrl,
            data: this.addLogisticsChannelForm,
            roleType: this.roleType
          }).then(res => {
            if (this.$isRequestSuccessful(res.code)) {
              this.$message({
                message: this.$t('common.operationSuccessful'),
                type: 'success'
              })
              this.closeLogisticsChannelDialog();
              this.$refs.addLogisticsChannelForm.resetFields();
              this.addLogisticsChannelForm = Object.assign({}, {
                api_name: '',
                channel_name: '',
                channel_code: '',
                channel_params: {
                  internal_channel_id: ''
                }
              },)
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
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
    'addLogisticsChannelForm.api_name' (newVal) {
      // 当 api_name 变化时，清空 internal_channel_id
      this.addLogisticsChannelForm.channel_params.internal_channel_id = '';
      this.$refs.selectInternalChannel.selectedValue = ''
    }
  },
  mounted () {
    // this.remoteQueryLogisticsApiMethod('');
  },
  watch: {
    visible (val) {
      if (val) {
        this.logisticsChannelVisible = val;
        if (this.submitType === 'edit' && this.currentData) {
          this.addLogisticsChannelForm = Object.assign({}, this.currentData);
          this.addLogisticsChannelForm.api_id = this.currentData.id;
          // 确保 api_params 被正确处理
          let channel_params = this.currentData.channel_params || {};
          this.addLogisticsChannelForm.channel_params.internal_channel_id = channel_params.internal_channel_id || '';
        }
      }
    }
  }

}
</script>
<style scoped lang='css'>
</style>