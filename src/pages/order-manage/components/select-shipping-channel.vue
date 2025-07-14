<!--
* @description  参数1
* @fileName  select-shipping-channel
* @author wjp
* @date 2024-02-02 21:04:10
!-->
<template>
  <el-select
    popper-class="more-tag-data"
    v-model="currentData"
    clearable
    filterable
    style="width: 160px"
    :placeholder="placeholder"
    @change="handleChange"
  >
    <el-option
      v-for="item in logisticsChannels"
      :key="item.channel_code"
      :label="item.channel_name"
      :value="item.channel_code"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    currentData: String,
    placeholder: String,
    providerUuid: String
  },
  data () {
    return {
      logisticsChannels: [],
      remoteLoading: false,
      pageNumber: 1,
      pageSize: 10,
    };
  },
  methods: {
    getLogisticsChannels (query) {
      this.remoteLoading = true;
      let queryParams = {
        provider_uuid: this.providerUuid,
        channel_name: query,
        page_number: this.pageNumber,
        page_size: this.pageSize
      };
      this.$ajax({
        url: "/api-prefix/api/logistics/fetch-all-channels",
        method: "get",
        params: queryParams,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.logisticsChannels = res.data.results.map(item => ({
            channel_name: item.channel_name,
            channel_code: item.channel_code
          }));
        }
      }).finally(() => {
        this.remoteLoading = false;
      });
    },
    handleChange (value) {
      this.$emit('updateChange', value);
    }
  },
  computed: {

  },
};
</script>
