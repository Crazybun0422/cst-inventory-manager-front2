<!--
* @description  参数1
* @fileName  logistics-channel-detail
* @author wjp
* @date 2024-01-24 20:53:27
!-->
<template>
  <div id="logistics-channel-detail" class="logistics-channel-detail">
    <el-drawer
      :title="$t('message.myAccount.logisticsChannelInfo')"
      :visible.sync="logisticsChannelVisible"
      direction="rtl"
      size="40%"
      class="global-drawer-class"
      @close="closeLogisticsChannelDetail"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item
          :label="$t('message.myAccount.logisticsAPIName')"
          >{{ currentDataForm.api_name }}</el-descriptions-item
        >

        <el-descriptions-item
          :label="$t('message.myAccount.logisticsChannelName')"
          >{{ currentDataForm.channel_name }}</el-descriptions-item
        >
        <el-descriptions-item
          :label="$t('message.myAccount.logisticsChannelCode')"
        >
          {{ currentDataForm.channel_code }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.internalChannelId')"
          >{{ currentDataForm.channel_params.internal_channel_id }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'logistics-channel-detail',
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
        channel_name: '',
        channel_code: '',
        channel_params: {
          internal_channel_id: ''
        }
      },
      showPassword: false,
      logisticsChannelVisible: false,
      inputType: 'password',
      apiTokenInputType: 'password',
      isIconOff: true,
      apiTokenIsIconOff: true,
    }
  },
  methods: {
    closeLogisticsChannelDetail () {
      this.logisticsChannelVisible = false;
      this.$emit('close');
    },

  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible (val) {
      if (val) {
        this.logisticsChannelVisible = val;
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