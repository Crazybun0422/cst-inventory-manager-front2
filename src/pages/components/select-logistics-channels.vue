<!--
* @description  获取物流渠道
* @fileName  select-logistics-channels
* @author wjp
* @date 2024-08-27 22:24:45
!-->
<template>
  <el-select
    v-model="selectedValue"
    filterable
    remote
    reserve-keyword
    :placeholder="$t('common.pleaseSelect')"
    :remote-method="remoteQueryLogisticsChannelMethod"
    :loading="remoteLoading"
    :loading-text="$t('common.loading')"
    clearable
    style="width: 215px"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { queryLogisticsChannels } from '@/common/common-func'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    queryKey: {
      type: String,
      default: 'channel_name'
    }
  },
  data () {
    return {
      selectedValue: this.value,
      options: [],
      remoteLoading: false
    };
  },
  watch: {
    value (newVal) {
      this.selectedValue = newVal;
    },
    selectedValue (newVal) {
      this.$emit('input', newVal);
    }
  },
  methods: {
    queryLogisticsChannels,
    remoteQueryLogisticsChannelMethod (query) {
      this.remoteLoading = true;
      let queryParams = {
        // provider的userRelatedId就是provider_uuid
        provider_uuid: this.provider_uuid,
      }

      queryParams[this.queryKey] = query
      this.queryLogisticsChannels(queryParams).then(resData => {
        this.options = resData.map(item => ({
          label: item,
          value: item
        }))
      }).catch(() => {
        this.options = []
      }).finally(() => {
        this.remoteLoading = false
      })

    },
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
  },
  mounted () {
    this.remoteQueryLogisticsChannelMethod('');
  }
};
</script>

<style scoped>
/* Add any specific styles for your select component here */
</style>
