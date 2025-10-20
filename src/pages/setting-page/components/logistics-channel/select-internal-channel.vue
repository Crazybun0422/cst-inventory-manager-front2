<!--
* @description  获取物流API
* @fileName  select-logistics-api
* @author wjp
* @date 2024-08-27 22:24:45
!-->
<template>
  <el-select
    v-model="selectedValue"
    filterable
    reserve-keyword
    :disabled="remoteLoading || api_name === ''"
    v-loading="remoteLoading"
    :loading-text="$t('common.loading')"
    clearable
    style="width: 215px"
    @change="handleSelectionChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <span style="float: left">{{ item.label }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{
        item.value
      }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { getLogisticsInternalChannel } from '@/common/common-func'
import { resolvePreferenceProviderUuid } from '@/common/global-user-settings'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    api_name: {
      type: String,
      default: ''
    },
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
    },
    api_name (newVal) {
      if (newVal !== '' && newVal !== undefined && newVal !== null) {
        this.queryInternalChannel(newVal);
      } else if (newVal === '') {
        this.selectedValue = ''
        this.options = []
      }
    },
    provider_uuid (newVal, oldVal) {
      if (!newVal) {
        this.selectedValue = ''
        this.options = []
        return
      }
      if (newVal !== oldVal && this.api_name) {
        this.queryInternalChannel(this.api_name)
      }
    }
  },
  methods: {
    getLogisticsInternalChannel,
    queryInternalChannel (query) {
      this.remoteLoading = true;
      const provider_uuid = this.provider_uuid
      if (!provider_uuid) {
        this.options = []
        this.selectedValue = ''
        this.remoteLoading = false
        return
      }
      let queryParams = { api_name: query, provider_uuid };
      this.getLogisticsInternalChannel(queryParams).then(res => {
        this.options = Object.entries(res.data).map(([key, value]) => {
          return {
            value: key,
            label: value
          };
        });
        if (this.options.length > 0) {
          this.selectedValue = this.options[0].value
          this.$emit('update-channel-name', this.options[0].label);
        }

      })
        .catch(error => {
          console.error('Fetching logistics data failed:', error);
        })
        .finally(() => {
          this.remoteLoading = false;
        });
    },
    handleSelectionChange (value) {
      const selectedOption = this.options.find(option => option.value === value);
      if (selectedOption) {
        this.$emit('update-channel-name', selectedOption.label);  // 触发事件，传递 label
      }
    }
  },
  computed: {
    provider_uuid () {
      const uuid = resolvePreferenceProviderUuid(this.$store, this.roleType)
      if (uuid) return uuid
      if (typeof localStorage !== 'undefined') {
        const fallback = localStorage.getItem('shop_provider_uuid')
        if (fallback) return fallback
      }
      return ''
    }
  },
  mounted () {
    if (this.api_name !== '' && this.api_name !== undefined && this.api_name !== null) {
      this.queryInternalChannel(this.api_name);
    }
  }

};
</script>

<style scoped>
/* Add any specific styles for your select component here */
</style>
