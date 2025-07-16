<template>
  <div class="p-stock-statistics" v-loading="loading">
    <PageHead :title="$t('navigate.inventoryStatistics')"></PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="queryForm.query" :placeholder="$t('common.pleaseInput')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.storage_uuid" filterable clearable :placeholder="$t('message.storage.warehouseSelect')">
            <el-option v-for="item in storageOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="queryForm.date" type="daterange" :range-separator="$t('common.to')"
            :start-placeholder="$t('common.startTime')" :end-placeholder="$t('common.endTime')"
            format="yyyy-MM-dd" value-format="timestamp" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="fetchData">{{ $t('common.search') }}</el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane name="total" :label="$t('message.inventory.totalStock')">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="barcode" label="Barcode" />
          <el-table-column prop="sku" label="SKU" />
          <el-table-column prop="name" :label="$t('common.name')" />
          <el-table-column prop="number" :label="$t('message.productManagement.productStock')" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="location" :label="$t('message.inventory.locationStock')">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="location" :label="$t('message.storage.location')" />
          <el-table-column prop="number" :label="$t('message.productManagement.productStock')" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="customer" :label="$t('message.inventory.customerStock')">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="owner" :label="$t('message.customerManagement.customer')" />
          <el-table-column prop="number" :label="$t('message.productManagement.productStock')" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import { getStorageDefinition } from '@/common/common-func'

export default {
  name: 'p-stock-statistics',
  components: { PageHead, SearchCard },
  data() {
    return {
      queryForm: { query: '', storage_uuid: '', date: [] },
      storageOptions: [],
      activeTab: 'total',
      tableData: [],
      loading: false
    }
  },
  computed: {
    roleType() {
      return this.$getRoleType(this.$route.path)
    },
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    }
  },
  methods: {
    async fetchStorage() {
      const res = await getStorageDefinition(this.provider_uuid, this.roleType)
      if (this.$isRequestSuccessful(res.code)) {
        this.storageOptions = res.data.map(item => ({ label: item.name, value: item.storage_define_uuid }))
      }
    },
    async fetchData() {
      this.loading = true
      const params = {}
      if (this.queryForm.query) params.query = this.queryForm.query
      if (this.queryForm.storage_uuid) params.storage_uuid = this.queryForm.storage_uuid
      if (Array.isArray(this.queryForm.date) && this.queryForm.date.length === 2) {
        params.inbound_time_begin = this.queryForm.date[0]
        params.inbound_time_end = this.queryForm.date[1]
      }
      let url = '/api/product-stock/query-total'
      if (this.activeTab === 'location') url = '/api/product-stock/query-location'
      if (this.activeTab === 'customer') url = '/api/product-stock/query-user'
      const res = await this.$ajax({ url, method: 'get', params, roleType: this.roleType })
      this.tableData = this.$isRequestSuccessful(res.code) ? res.data : []
      this.loading = false
    },
    handleTabChange() {
      this.fetchData()
    }
  },
  async mounted() {
    await this.fetchStorage()
    this.fetchData()
  }
}
</script>

<style scoped>
</style>

