<!--
* @description  参数1
* @fileName  logistics-api-detail
* @author wjp
* @date 2024-01-24 20:53:27
!-->
<template>
  <div id="logistics-api-detail" class="logistics-api-detail">
    <el-drawer
      :title="$t('message.myAccount.logisticsAPIInfo')"
      :visible.sync="logisticsApiVisible"
      direction="rtl"
      size="40%"
      class="global-drawer-class"
      @close="closeLogisticsApiDetail"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item
          :label="$t('message.myAccount.logisticsAPIName')"
          >{{ currentDataForm.api_name }}</el-descriptions-item
        >

        <el-descriptions-item :label="$t('message.myAccount.clientId')">{{
          currentDataForm.api_params.client_id
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.apiToken')">
          <el-input
            v-model="currentDataForm.api_params.api_token"
            :type="apiTokenInputType"
            readonly
            ref="apiKeyInput"
            ><i
              slot="suffix"
              :class="[
                'el-input__icon',
                'iconfont',
                apiTokenIsIconOff
                  ? 'icon-cst-inventory-view-off'
                  : 'icon-cst-inventory-view'
              ]"
              @click="changeApiTokenType"
            ></i>
          </el-input>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.account')"
          >{{ currentDataForm.api_params.u_account }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.password')">
          <el-input
            v-model="currentDataForm.api_params.password"
            :type="inputType"
            readonly
            ref="apiKeyInput"
            ><i
              slot="suffix"
              :class="[
                'el-input__icon',
                'iconfont',
                isIconOff
                  ? 'icon-cst-inventory-view-off'
                  : 'icon-cst-inventory-view'
              ]"
              @click="changeType"
            ></i>
          </el-input>
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'logistics-api-detail',
  props: {
    visible: { type: Boolean, default: false },
    currentData: {
      type: Object, default: () => ({

      })
    },
  },
  components: {

  },
  data () {
    return {
      currentDataForm: {
        api_name: '',

        api_params: {
          client_id: '',
          api_token: '',
          u_account: '',
          password: '',
        },
      },
      showPassword: false,
      logisticsApiVisible: false,
      inputType: 'password',
      apiTokenInputType: 'password',
      isIconOff: true,
      apiTokenIsIconOff: true,
    }
  },
  methods: {
    closeLogisticsApiDetail () {
      this.logisticsApiVisible = false;
      this.$emit('close');
    },
    changeType () {
      this.isIconOff = !this.isIconOff;
      this.inputType = this.inputType === 'password' ? 'text' : 'password'
    },
    changeApiTokenType () {
      this.apiTokenIsIconOff = !this.apiTokenIsIconOff;
      this.apiTokenInputType = this.apiTokenInputType === 'password' ? 'text' : 'password'
    },
  },
  computed: {
    passwordFieldType () {
      return this.showPassword ? 'text' : 'password';
    }
  },
  mounted () {

  },
  watch: {
    visible (val) {
      if (val) {
        this.logisticsApiVisible = val;
      }
      if (this.currentData) {
        this.currentDataForm = this.currentData;
      }
    }
  }
}
</script>
<style scoped lang='css'>
</style>