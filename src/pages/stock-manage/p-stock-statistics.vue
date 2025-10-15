<template>
  <div class="p-stock-statistics" v-loading="loading">
    <PageHead :title="$t('navigate.inventoryStatistics')" />
    <SearchCard>
      <el-form :inline="true" :model="queryForm" class="stock-form">
        <el-form-item>
          <el-input
            v-model="queryForm.query"
            :placeholder="$t('message.inventory.searchPlaceholder')"
            clearable
            @input="handleQueryInput"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryForm.storage_uuid"
            filterable
            clearable
            :placeholder="$t('message.storage.warehouseSelect')"
            @change="handleStorageChange"
          >
            <el-option
              v-for="item in storageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryForm.date"
            type="daterange"
            :range-separator="$t('common.to')"
            :start-placeholder="$t('common.startTime')"
            :end-placeholder="$t('common.endTime')"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-popover
            placement="bottom-start"
            trigger="click"
            width="260"
            popper-class="inventory-column-pop"
            v-model="columnSelectorVisible"
            @show="ensureLoadColumnSettings"
          >
            <div class="column-selector">
              <div class="column-selector__header">
                <span>{{ $t('message.inventory.columnSettings') }}</span>
                <el-button type="text" size="mini" @click="resetColumnSelection">
                  {{ $t('common.reset') }}
                </el-button>
              </div>
              <el-checkbox-group
                v-model="activeVisibleColumns"
                @change="handleColumnSelectionChange"
              >
                <el-checkbox
                  v-for="col in activeColumnOptions"
                  :key="col.id"
                  :label="col.id"
                  class="selector-item"
                >
                  {{ getColumnLabel(col) }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <el-button
              slot="reference"
              icon="el-icon-view"
              circle
              size="mini"
              :title="$t('message.inventory.columnSettings')"
            ></el-button>
          </el-popover>
        </el-form-item>
      </el-form>
    </SearchCard>
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane name="total" :label="$t('message.inventory.totalStock')">
        <el-table
          v-if="activeTab === 'total'"
          ref="totalTable"
          :data="tableData"
          border
          size="small"
          style="width: 100%"
          :empty-text="$t('common.noDataAvailable')"
        >
          <el-table-column
            v-if="isColumnVisible('image')"
            key="total-image"
            :label="$t('message.productManagement.productImage')"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <AuthImg
                v-if="scope.row.image_url"
                :src="scope.row.image_url"
                :styleInfo="'width:48px;height:48px;border-radius:4px;object-fit:cover;'"
              />
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isColumnVisible('barcode')"
            prop="barcode"
            :label="$t('message.productManagement.productBarcode')"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('sku')"
            prop="sku"
            :label="$t('message.productManagement.productSku')"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('chinese_name')"
            prop="chinese_name"
            :label="$t('message.productManagement.chineseName')"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('english_name')"
            prop="english_name"
            :label="$t('message.productManagement.englishName')"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('available_stock')"
            prop="available_location_stock"
            :label="$t('message.inventory.availableStock')"
            width="110"
            align="center"
          >
            <template slot-scope="scope">
              <span
                :class="['stock-level', getAvailableStockClass(scope.row.available_location_stock)]"
              >
                {{ scope.row.available_location_stock }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isColumnVisible('draft_occupied')"
            prop="draft_occupied"
            :label="$t('message.inventory.draftOccupied')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('unpicked_occupied')"
            prop="unpicked_occupied"
            :label="$t('message.inventory.unpickedOccupied')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('picking_occupied')"
            prop="picking_occupied"
            :label="$t('message.inventory.pickingOccupied')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('location_stock')"
            prop="location_stock"
            :label="$t('message.inventory.locationStockQuantity')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('location')"
            prop="location"
            :label="$t('message.storage.location')"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('entry_numbers')"
            prop="entry_numbers"
            :label="$t('message.inventory.entryNumbers')"
            min-width="180"
            :formatter="formatArrayCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('batch_numbers')"
            prop="batch_numbers"
            :label="$t('message.inventory.batchNumbers')"
            min-width="140"
            :formatter="formatArrayCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('production_date')"
            prop="production_date"
            :label="$t('message.inventory.productionDate')"
            min-width="160"
            :formatter="formatIsoDateCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('expiration_date')"
            prop="expiration_date"
            :label="$t('message.inventory.expirationDate')"
            min-width="160"
            :formatter="formatIsoDateCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('inbound_time')"
            prop="inbound_time"
            :label="$t('message.inventory.inboundTime')"
            min-width="160"
            :formatter="formatTimestampCell"
            show-overflow-tooltip
          />
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="location" :label="$t('message.inventory.locationStock')">
        <el-table
          v-if="activeTab === 'location'"
          ref="locationTable"
          :data="tableData"
          border
          size="small"
          style="width: 100%"
          :empty-text="$t('common.noDataAvailable')"
        >
          <el-table-column
            v-if="isColumnVisible('image')"
            key="location-image"
            :label="$t('message.productManagement.productImage')"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <AuthImg
                v-if="scope.row.image_url"
                :src="scope.row.image_url"
                :styleInfo="'width:48px;height:48px;border-radius:4px;object-fit:cover;'"
              />
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isColumnVisible('location')"
            prop="location"
            :label="$t('message.storage.location')"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('barcode')"
            prop="barcode"
            :label="$t('message.productManagement.productBarcode')"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('sku')"
            prop="sku"
            :label="$t('message.productManagement.productSku')"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('chinese_name')"
            prop="chinese_name"
            :label="$t('message.productManagement.chineseName')"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('english_name')"
            prop="english_name"
            :label="$t('message.productManagement.englishName')"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('available_stock')"
            prop="available_location_stock"
            :label="$t('message.inventory.availableStock')"
            width="110"
            align="center"
          >
            <template slot-scope="scope">
              <span
                :class="['stock-level', getAvailableStockClass(scope.row.available_location_stock)]"
              >
                {{ scope.row.available_location_stock }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isColumnVisible('location_stock')"
            prop="location_stock"
            :label="$t('message.inventory.locationStockQuantity')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('draft_occupied')"
            prop="draft_occupied"
            :label="$t('message.inventory.draftOccupied')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('unpicked_occupied')"
            prop="unpicked_occupied"
            :label="$t('message.inventory.unpickedOccupied')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('picking_occupied')"
            prop="picking_occupied"
            :label="$t('message.inventory.pickingOccupied')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('entry_numbers')"
            prop="entry_numbers"
            :label="$t('message.inventory.entryNumbers')"
            min-width="180"
            :formatter="formatArrayCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('batch_numbers')"
            prop="batch_numbers"
            :label="$t('message.inventory.batchNumbers')"
            min-width="140"
            :formatter="formatArrayCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('production_date')"
            prop="production_date"
            :label="$t('message.inventory.productionDate')"
            min-width="160"
            :formatter="formatIsoDateCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('expiration_date')"
            prop="expiration_date"
            :label="$t('message.inventory.expirationDate')"
            min-width="160"
            :formatter="formatIsoDateCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('inbound_time')"
            prop="inbound_time"
            :label="$t('message.inventory.inboundTime')"
            min-width="160"
            :formatter="formatTimestampCell"
            show-overflow-tooltip
          />
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="customer" :label="$t('message.inventory.customerStock')">
        <el-table
          v-if="activeTab === 'customer'"
          ref="customerTable"
          :data="tableData"
          border
          size="small"
          style="width: 100%"
          :empty-text="$t('common.noDataAvailable')"
        >
          <el-table-column
            v-if="isColumnVisible('image')"
            key="customer-image"
            :label="$t('message.productManagement.productImage')"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <AuthImg
                v-if="scope.row.image_url"
                :src="scope.row.image_url"
                :styleInfo="'width:48px;height:48px;border-radius:4px;object-fit:cover;'"
              />
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isColumnVisible('owner_code')"
            prop="user_code"
            :label="$t('message.inventory.ownerCode')"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('barcode')"
            prop="barcode"
            :label="$t('message.productManagement.productBarcode')"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('sku')"
            prop="sku"
            :label="$t('message.productManagement.productSku')"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('chinese_name')"
            prop="chinese_name"
            :label="$t('message.productManagement.chineseName')"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('english_name')"
            prop="english_name"
            :label="$t('message.productManagement.englishName')"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('available_stock')"
            prop="available_location_stock"
            :label="$t('message.inventory.availableStock')"
            width="110"
            align="center"
          >
            <template slot-scope="scope">
              <span
                :class="['stock-level', getAvailableStockClass(scope.row.available_location_stock)]"
              >
                {{ scope.row.available_location_stock }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isColumnVisible('location')"
            prop="location"
            :label="$t('message.storage.location')"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('location_stock')"
            prop="location_stock"
            :label="$t('message.inventory.locationStockQuantity')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('draft_occupied')"
            prop="draft_occupied"
            :label="$t('message.inventory.draftOccupied')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('unpicked_occupied')"
            prop="unpicked_occupied"
            :label="$t('message.inventory.unpickedOccupied')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('picking_occupied')"
            prop="picking_occupied"
            :label="$t('message.inventory.pickingOccupied')"
            width="110"
            align="center"
          />
          <el-table-column
            v-if="isColumnVisible('entry_numbers')"
            prop="entry_numbers"
            :label="$t('message.inventory.entryNumbers')"
            min-width="180"
            :formatter="formatArrayCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('batch_numbers')"
            prop="batch_numbers"
            :label="$t('message.inventory.batchNumbers')"
            min-width="140"
            :formatter="formatArrayCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('production_date')"
            prop="production_date"
            :label="$t('message.inventory.productionDate')"
            min-width="160"
            :formatter="formatIsoDateCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('expiration_date')"
            prop="expiration_date"
            :label="$t('message.inventory.expirationDate')"
            min-width="160"
            :formatter="formatIsoDateCell"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isColumnVisible('inbound_time')"
            prop="inbound_time"
            :label="$t('message.inventory.inboundTime')"
            min-width="160"
            :formatter="formatTimestampCell"
            show-overflow-tooltip
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class="pagination-wrapper">
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper, ->, total"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :page-sizes="pageSizeOptions"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import AuthImg from '@/components/auth-img.vue'
import { getStorageDefinition, formatTimestamp } from '@/common/common-func'

const COLUMN_SETTINGS_VERSION = 1

export default {
  name: 'p-stock-statistics',
  components: { PageHead, SearchCard, AuthImg },
  data() {
    const columnOptions = {
      total: [
        { id: 'image', labelKey: 'message.productManagement.productImage', default: true },
        { id: 'barcode', labelKey: 'message.productManagement.productBarcode', default: true },
        { id: 'sku', labelKey: 'message.productManagement.productSku', default: true },
        { id: 'chinese_name', labelKey: 'message.productManagement.chineseName', default: true },
        { id: 'english_name', labelKey: 'message.productManagement.englishName', default: true },
        { id: 'available_stock', labelKey: 'message.inventory.availableStock', default: true },
        { id: 'location_stock', labelKey: 'message.inventory.locationStockQuantity', default: true },
        { id: 'draft_occupied', labelKey: 'message.inventory.draftOccupied', default: true },
        { id: 'unpicked_occupied', labelKey: 'message.inventory.unpickedOccupied', default: true },
        { id: 'picking_occupied', labelKey: 'message.inventory.pickingOccupied', default: true },
        { id: 'location', labelKey: 'message.storage.location', default: true },
        { id: 'entry_numbers', labelKey: 'message.inventory.entryNumbers', default: true },
        { id: 'batch_numbers', labelKey: 'message.inventory.batchNumbers', default: true },
        { id: 'production_date', labelKey: 'message.inventory.productionDate', default: true },
        { id: 'expiration_date', labelKey: 'message.inventory.expirationDate', default: true },
        { id: 'inbound_time', labelKey: 'message.inventory.inboundTime', default: true }
      ],
      location: [
        { id: 'image', labelKey: 'message.productManagement.productImage', default: true },
        { id: 'location', labelKey: 'message.storage.location', default: true },
        { id: 'barcode', labelKey: 'message.productManagement.productBarcode', default: true },
        { id: 'sku', labelKey: 'message.productManagement.productSku', default: true },
        { id: 'chinese_name', labelKey: 'message.productManagement.chineseName', default: true },
        { id: 'english_name', labelKey: 'message.productManagement.englishName', default: false },
        { id: 'available_stock', labelKey: 'message.inventory.availableStock', default: true },
        { id: 'location_stock', labelKey: 'message.inventory.locationStockQuantity', default: true },
        { id: 'draft_occupied', labelKey: 'message.inventory.draftOccupied', default: true },
        { id: 'unpicked_occupied', labelKey: 'message.inventory.unpickedOccupied', default: true },
        { id: 'picking_occupied', labelKey: 'message.inventory.pickingOccupied', default: true },
        { id: 'entry_numbers', labelKey: 'message.inventory.entryNumbers', default: true },
        { id: 'batch_numbers', labelKey: 'message.inventory.batchNumbers', default: true },
        { id: 'production_date', labelKey: 'message.inventory.productionDate', default: true },
        { id: 'expiration_date', labelKey: 'message.inventory.expirationDate', default: true },
        { id: 'inbound_time', labelKey: 'message.inventory.inboundTime', default: true }
      ],
      customer: [
        { id: 'image', labelKey: 'message.productManagement.productImage', default: true },
        { id: 'owner_code', labelKey: 'message.inventory.ownerCode', default: true },
        { id: 'barcode', labelKey: 'message.productManagement.productBarcode', default: true },
        { id: 'sku', labelKey: 'message.productManagement.productSku', default: true },
        { id: 'chinese_name', labelKey: 'message.productManagement.chineseName', default: true },
        { id: 'english_name', labelKey: 'message.productManagement.englishName', default: false },
        { id: 'available_stock', labelKey: 'message.inventory.availableStock', default: true },
        { id: 'location', labelKey: 'message.storage.location', default: true },
        { id: 'location_stock', labelKey: 'message.inventory.locationStockQuantity', default: true },
        { id: 'draft_occupied', labelKey: 'message.inventory.draftOccupied', default: false },
        { id: 'unpicked_occupied', labelKey: 'message.inventory.unpickedOccupied', default: false },
        { id: 'picking_occupied', labelKey: 'message.inventory.pickingOccupied', default: false },
        { id: 'entry_numbers', labelKey: 'message.inventory.entryNumbers', default: true },
        { id: 'batch_numbers', labelKey: 'message.inventory.batchNumbers', default: true },
        { id: 'production_date', labelKey: 'message.inventory.productionDate', default: true },
        { id: 'expiration_date', labelKey: 'message.inventory.expirationDate', default: true },
        { id: 'inbound_time', labelKey: 'message.inventory.inboundTime', default: true }
      ]
    }
    const defaultsFor = tab =>
      columnOptions[tab].filter(col => col.default !== false).map(col => col.id)

    return {
      queryForm: {
        query: '',
        storage_uuid: '',
        date: [],
        page_number: 1,
        page_size: 20
      },
      storageOptions: [],
      activeTab: 'total',
      tableData: [],
      columnOptions,
      visibleColumnsMap: {
        total: defaultsFor('total'),
        location: defaultsFor('location'),
        customer: defaultsFor('customer')
      },
      columnSelectorVisible: false,
      settingsLoaded: false,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      pageSizeOptions: [10, 20, 50, 100],
      loading: false,
      filterTimer: null,
      saveColumnTimer: null
    }
  },
  computed: {
    roleType() {
      return this.$getRoleType(this.$route.path)
    },
    provider_uuid() {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
    activeColumnOptions() {
      return this.columnOptions[this.activeTab] || []
    },
    activeVisibleColumns: {
      get() {
        return this.visibleColumnsMap[this.activeTab] || []
      },
      set(val) {
        this.$set(this.visibleColumnsMap, this.activeTab, val)
      }
    }
  },
  watch: {
    provider_uuid(newVal) {
      if (newVal && !this.settingsLoaded) {
        this.loadColumnSettings()
      }
    }
  },
  methods: {
    async fetchStorage() {
      const res = await getStorageDefinition(this.provider_uuid, this.roleType)
      if (this.$isRequestSuccessful(res?.code)) {
        this.storageOptions = res.data.map(item => ({
          label: item.name,
          value: item.storage_define_uuid
        }))
      }
    },
    getDefaultVisibleColumns(tab) {
      return this.columnOptions[tab]
        ? this.columnOptions[tab].filter(col => col.default !== false).map(col => col.id)
        : []
    },
    ensureLoadColumnSettings() {
      if (!this.settingsLoaded && this.provider_uuid) {
        this.loadColumnSettings()
      }
    },
    getSettingsKey() {
      return 'inventory_statistics_columns'
    },
    getLocalSettingsKey() {
      return `${this.getSettingsKey()}_local`
    },
    applyVisibleMap(map) {
      Object.keys(this.columnOptions).forEach(tab => {
        const optionIds = this.columnOptions[tab].map(col => col.id)
        const incoming = Array.isArray(map[tab]) ? map[tab] : null
        const filtered = incoming
          ? incoming.filter(id => optionIds.includes(id))
          : this.getDefaultVisibleColumns(tab)
        const finalVisible = filtered.length ? filtered : this.getDefaultVisibleColumns(tab)
        this.$set(this.visibleColumnsMap, tab, finalVisible)
      })
      this.$nextTick(() => {
        const refs = ['totalTable', 'locationTable', 'customerTable']
        refs.forEach(ref => {
          if (this.$refs[ref] && this.$refs[ref].doLayout) {
            this.$refs[ref].doLayout()
          }
        })
      })
    },
    async loadColumnSettings() {
      const key = this.getSettingsKey()
      const localKey = this.getLocalSettingsKey()
      const defaults = {}
      Object.keys(this.columnOptions).forEach(tab => {
        defaults[tab] = this.getDefaultVisibleColumns(tab)
      })

      const applyFromPayload = payload => {
        if (payload && typeof payload === 'object' && payload.tabs) {
          this.applyVisibleMap(payload.tabs)
          return true
        }
        return false
      }

      let loaded = false
      try {
        const params = {}
        if (this.provider_uuid) params.provider_uuid = this.provider_uuid
        const res = await this.$ajax({
          url: '/api-prefix/api/customer-settings/global-user-settings',
          method: 'get',
          params,
          roleType: this.roleType
        })
        if (this.$isRequestSuccessful(res?.code) && res.data && res.data[key]) {
          let payload = res.data[key]
          if (typeof payload === 'string') {
            try {
              payload = JSON.parse(payload)
            } catch (e) {
              payload = null
            }
          }
          if (applyFromPayload(payload)) {
            loaded = true
          }
        }
      } catch (error) {
        console.warn('load column settings failed', error)
      }

      if (!loaded) {
        try {
          const local = localStorage.getItem(localKey)
          if (local) {
            const payload = JSON.parse(local)
            if (applyFromPayload(payload)) {
              loaded = true
            }
          }
        } catch (error) {
          console.warn('parse local column settings failed', error)
        }
      }

      if (!loaded) {
        this.applyVisibleMap(defaults)
      }

      this.settingsLoaded = true
    },
    scheduleSaveColumnSettings() {
      clearTimeout(this.saveColumnTimer)
      this.saveColumnTimer = setTimeout(() => {
        this.saveColumnSettings()
      }, 250)
    },
    async saveColumnSettings() {
      const payload = {
        version: COLUMN_SETTINGS_VERSION,
        tabs: {}
      }
      Object.keys(this.columnOptions).forEach(tab => {
        payload.tabs[tab] = this.visibleColumnsMap[tab] || this.getDefaultVisibleColumns(tab)
      })
      try {
        localStorage.setItem(this.getLocalSettingsKey(), JSON.stringify(payload))
      } catch (error) {
        console.warn('save local column settings failed', error)
      }
      if (!this.provider_uuid) return
      try {
        const data = {
          [this.getSettingsKey()]: JSON.stringify(payload),
          provider_uuid: this.provider_uuid
        }
        await this.$ajax({
          url: '/api-prefix/api/customer-settings/global-user-settings',
          method: 'post',
          data,
          headers: { 'Content-Type': 'application/json' },
          roleType: this.roleType
        })
      } catch (error) {
        console.warn('save remote column settings failed', error)
      }
    },
    buildQueryParams() {
      const params = {}
      if (this.queryForm.query) params.query = this.queryForm.query
      if (this.queryForm.storage_uuid) params.storage_uuid = this.queryForm.storage_uuid
      if (Array.isArray(this.queryForm.date) && this.queryForm.date.length === 2) {
        params.inbound_time_begin = this.queryForm.date[0]
        params.inbound_time_end = this.queryForm.date[1]
      }
      params.page_number = this.pagination.page
      params.page_size = this.pagination.pageSize
      return params
    },
    transformResponseData(rawData) {
      const fallback = { rows: [], total: 0 }
      if (!rawData || typeof rawData !== 'object') {
        return fallback
      }
      const total = typeof rawData.total === 'number' ? rawData.total : 0
      if (this.activeTab === 'total') {
        const results = Array.isArray(rawData.results)
          ? rawData.results
          : Array.isArray(rawData)
            ? rawData
            : []
        return {
          rows: results,
          total: total || results.length
        }
      }
      if (this.activeTab === 'location') {
        const rows = []
        const results = rawData.results && typeof rawData.results === 'object' ? rawData.results : {}
        Object.keys(results).forEach(locationKey => {
          const items = Array.isArray(results[locationKey]) ? results[locationKey] : []
          items.forEach(item => {
            rows.push({
              ...item,
              location: item.location || locationKey
            })
          })
        })
        return {
          rows,
          total: total || rows.length
        }
      }
      if (this.activeTab === 'customer') {
        const rows = []
        const results = rawData.results && typeof rawData.results === 'object' ? rawData.results : {}
        Object.keys(results).forEach(userKey => {
          const items = Array.isArray(results[userKey]) ? results[userKey] : []
          items.forEach(item => {
            rows.push({
              ...item,
              user_code: item.user_code || userKey
            })
          })
        })
        return {
          rows,
          total: total || rows.length
        }
      }
      return fallback
    },
    async fetchData({ resetPage = false } = {}) {
      if (resetPage) {
        this.pagination.page = this.queryForm.page_number || 1
        this.pagination.pageSize = this.queryForm.page_size || this.pagination.pageSize
      }
      this.loading = true
      const params = this.buildQueryParams()
      let url = '/api/product-stock/query-total'
      if (this.activeTab === 'location') url = '/api/product-stock/query-location'
      if (this.activeTab === 'customer') url = '/api/product-stock/query-user'
      try {
        const res = await this.$ajax({ url, method: 'get', params, roleType: this.roleType })
        const rawData = this.$isRequestSuccessful(res?.code) ? (res.data || res) : null
        const { rows, total } = this.transformResponseData(rawData)
        this.tableData = rows
        this.pagination.total = total
      } catch (error) {
        console.error(error)
        this.tableData = []
        this.pagination.total = 0
      } finally {
        this.loading = false
        this.queryForm.page_number = this.pagination.page
        this.queryForm.page_size = this.pagination.pageSize
      }
    },
    handleTabChange() {
      this.columnSelectorVisible = false
      this.pagination.page = 1
      this.queryForm.page_number = 1
      this.fetchData({ resetPage: true })
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.pagination.page = 1
      this.queryForm.page_size = size
      this.queryForm.page_number = 1
      this.fetchData()
    },
    handleCurrentChange(page) {
      this.pagination.page = page
      this.queryForm.page_number = page
      this.fetchData()
    },
    handleQueryInput() {
      this.pagination.page = 1
      this.queryForm.page_number = 1
      clearTimeout(this.filterTimer)
      this.filterTimer = setTimeout(() => {
        this.fetchData({ resetPage: true })
      }, 400)
    },
    handleStorageChange() {
      this.pagination.page = 1
      this.queryForm.page_number = 1
      this.fetchData({ resetPage: true })
    },
    handleDateChange() {
      this.pagination.page = 1
      this.queryForm.page_number = 1
      this.fetchData({ resetPage: true })
    },
    formatArrayCell(row, column, cellValue) {
      if (Array.isArray(cellValue)) {
        return cellValue.join(', ')
      }
      if (cellValue === null || cellValue === undefined || cellValue === '') {
        return '-'
      }
      return cellValue
    },
    formatIsoDateCell(row, column, cellValue) {
      if (!cellValue) return '-'
      const date = new Date(cellValue)
      if (Number.isNaN(date.getTime())) return '-'
      const year = date.getFullYear()
      const month = `${date.getMonth() + 1}`.padStart(2, '0')
      const day = `${date.getDate()}`.padStart(2, '0')
      const hours = `${date.getHours()}`.padStart(2, '0')
      const minutes = `${date.getMinutes()}`.padStart(2, '0')
      const seconds = `${date.getSeconds()}`.padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    formatTimestampCell(row, column, cellValue) {
      if (!cellValue) return '-'
      if (typeof cellValue === 'number') {
        return formatTimestamp(cellValue)
      }
      const numericValue = Number(cellValue)
      if (!Number.isNaN(numericValue)) {
        return formatTimestamp(numericValue)
      }
      return '-'
    },
    isColumnVisible(columnId) {
      const active = this.visibleColumnsMap[this.activeTab] || []
      return active.includes(columnId)
    },
    handleColumnSelectionChange(val) {
      if (!Array.isArray(val) || val.length === 0) {
        const defaults = this.getDefaultVisibleColumns(this.activeTab)
        this.$nextTick(() => {
          this.activeVisibleColumns = defaults
          this.scheduleSaveColumnSettings()
        })
        return
      }
      this.scheduleSaveColumnSettings()
      this.$nextTick(() => {
        const tableRef =
          this.activeTab === 'total'
            ? this.$refs.totalTable
            : this.activeTab === 'location'
              ? this.$refs.locationTable
              : this.$refs.customerTable
        tableRef && tableRef.doLayout && tableRef.doLayout()
      })
    },
    resetColumnSelection() {
      const defaults = this.getDefaultVisibleColumns(this.activeTab)
      this.activeVisibleColumns = defaults
      this.handleColumnSelectionChange(defaults)
    },
    getColumnLabel(col) {
      return this.$t(col.labelKey)
    },
    getAvailableStockClass(value) {
      const number = Number(value)
      if (Number.isNaN(number)) return 'stock-level-default'
      if (number <= 10) return 'stock-level-low'
      if (number < 50) return 'stock-level-medium'
      if (number >= 100) return 'stock-level-high'
      return 'stock-level-default'
    }
  },
  async mounted() {
    await this.fetchStorage()
    if (this.provider_uuid) {
      await this.loadColumnSettings()
    }
    this.fetchData({ resetPage: true })
  },
  beforeDestroy() {
    clearTimeout(this.filterTimer)
    clearTimeout(this.saveColumnTimer)
  }
}
</script>

<style scoped>
.p-stock-statistics {
  display: flex;
  flex-direction: column;
}

.stock-form {
  gap: 12px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.column-selector {
  max-height: 260px;
  overflow-y: auto;
}

.column-selector__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: #606266;
}

.selector-item {
  display: block;
  margin: 6px 0;
}

.stock-level {
  font-weight: 600;
}

.stock-level-high {
  color: #0f7a4f;
}

.stock-level-medium {
  color: #d8a731;
}

.stock-level-low {
  color: #d64545;
}

.stock-level-default {
  color: #303133;
}
</style>

<style>
.inventory-column-pop {
  width: 260px !important;
}

.inventory-column-pop .el-checkbox {
  display: block !important;
  margin: 6px 0 !important;
}
</style>

