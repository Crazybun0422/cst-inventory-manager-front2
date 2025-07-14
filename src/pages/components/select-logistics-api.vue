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
    remote
    reserve-keyword
    :placeholder="$t('common.pleaseSelect')"
    :remote-method="remoteQueryLogisticsApiMethod"
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
import { queryLogisticsApi } from '@/common/common-func'
export default {
  props: {
    value: {
      type: String,
      default: ''
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
    queryLogisticsApi,
    remoteQueryLogisticsApiMethod (query) {
      this.remoteLoading = true;
      let queryParams = { provider_uuid: this.providerUuidBySelectStore, api_name: query };
      this.queryLogisticsApi(queryParams).then(resData => {
        this.options = resData.map(item => ({
          label: item,
          value: item
        }));
      })
        .catch(error => {
          console.error('Fetching logistics data failed:', error);
        })
        .finally(() => {
          this.remoteLoading = false;
        });
    }
  },
  computed: {
  },
  mounted () {
    this.remoteQueryLogisticsApiMethod('');
  }
};
</script>

<style scoped>
/* Add any specific styles for your select component here */
</style>
