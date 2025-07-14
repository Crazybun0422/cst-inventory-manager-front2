<!--
* @description  参数1
* @fileName  wave-strategy-detail
* @author wjp
* @date 2024-05-26 23:19:39
!-->
<template>
  <div id="wave-strategy-detail" class="wave-strategy-detail">
    <el-drawer
      title="波次策略详情"
      :visible.sync="descriptionsVisible"
      direction="rtl"
      size="45%"
      :before-close="handleClose"
    >
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item label="执行优先级">{{
          form.execution_priority
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.storage.warehouse')">{{
          warehousingNameMap[form.storage_id]
        }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{
          form.name
        }}</el-descriptions-item>
        <el-descriptions-item label="产品的起始数量">{{
          form.product_quantity_start
        }}</el-descriptions-item>
        <el-descriptions-item label="产品的结束数量">{{
          form.product_quantity_end
        }}</el-descriptions-item>
        <el-descriptions-item label="产品品种的起始数量">{{
          form.product_variety_quantity_start
        }}</el-descriptions-item>
        <el-descriptions-item label="产品品种的结束数量">{{
          form.product_variety_quantity_end
        }}</el-descriptions-item>
        <el-descriptions-item label="每个波次的订单数量">{{
          form.orders_per_wave
        }}</el-descriptions-item>
        <el-descriptions-item label="是否按物流服务分组">
          <el-checkbox
            v-model="form.group_by_logistics_service"
            :disabled="true"
          ></el-checkbox>
        </el-descriptions-item>
        <el-descriptions-item label="是否按SKU分组"
          ><el-checkbox
            v-model="form.group_by_sku"
            :disabled="true"
          ></el-checkbox
        ></el-descriptions-item>
        <el-descriptions-item label="是否生成剩余订单"
          ><el-checkbox
            v-model="form.generate_remaining_orders"
            :disabled="true"
          ></el-checkbox
        ></el-descriptions-item>
        <el-descriptions-item label="订单使用的物流服务">{{
          logistics_channels.find(
            (item) => item.channel_code == form.logistics_service
          )?.channel_code
        }}</el-descriptions-item>
        <el-descriptions-item label="SKU分组的起始数量">{{
          form.sku_group_start_quantity
        }}</el-descriptions-item>
        <el-descriptions-item
          :label="$t('message.productManagement.productBarcode')"
          >{{ form.product_barcode }}</el-descriptions-item
        >
        <el-descriptions-item label="订单关联的国家">{{
          form.country
        }}</el-descriptions-item>
        <el-descriptions-item label="订单关联的客户">{{
          customers.find((item) => item.user_id === form.customer)?.user_code
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.createTime')">{{
          formatTimestamp(form.created_time)
        }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script>
import { formatTimestamp, query_all_logistics_channels, query_all_customers } from "@/common/common-func"

export default {
  name: 'wave-strategy-detail',
  props: {
    currentData: {
      type: Object,
      default: () => { }
    },
    visible: {
      type: Boolean,
      default: false
    },
    warehousingNameMap: {
      type: Array,
      default: () => []
    },
  },
  components: {

  },
  data () {
    return {
      formatTimestamp,
      descriptionsVisible: false,
      form: {},
      remoteQueryNum: 1,
      remoteQuerySize: 100,
      customersRemoteLoading: false,
      remoteLoading: false,
      logistics_channels: [],
      customers: []
    }
  },
  methods: {
    getcustomers () {
      this.customersRemoteLoading = true
      let provider_uuid = this.$store.state.user.dsCurrentProviderUuid
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: this.remoteQueryNum,
        page_size: this.remoteQuerySize
      }
      query_all_customers(queryParams, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.customers = res.data.results.map(item => ({
            user_code: item.user_code,
            user_id: item.related_id //TODO： 这里看是否需要转ID
          }))
        }
      }).finally(() => {
        this.customersRemoteLoading = false
      })
    },
    getLogisticsChannels () {
      this.remoteLoading = true
      let provider_uuid = this.$store.state.user.dsCurrentProviderUuid
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: this.remoteQueryNum,
        page_size: this.remoteQuerySize
      }
      query_all_logistics_channels(queryParams, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.logistics_channels = res.data.results.map(item => ({
            channel_name: item.channel_name,
            channel_code: item.channel_code //TODO： 这里看是否需要转ID
          }))
        }
      }).finally(() => {
        this.remoteLoading = false
      })

    },
    handleClose () {
      this.descriptionsVisible = false
      this.$emit('close')
    }
  },
  computed: {

    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
  },
  mounted () {
    this.getLogisticsChannels()
    this.getcustomers()
  },
  watch: {
    visible (val) {
      if (val) {
        this.descriptionsVisible = val
        this.form = this.currentData
      }
    }
  }
}
</script>
<style scoped lang='css'>
</style>