<template>
  <section>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column
        prop="email"
        :label="$t('message.orderInfo.emailLabel')"
      ></el-table-column>
      <el-table-column
        prop="phone"
        :label="$t('message.orderInfo.phoneLabel')"
      ></el-table-column>
      <el-table-column
        prop="createdAt"
        :label="$t('message.orderInfo.createdAtLabel')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="currencyCode"
        :label="$t('message.orderInfo.currencyCodeLabel')"
      ></el-table-column>
      <el-table-column
        prop="displayFinancialStatus"
        :label="$t('message.orderInfo.financialStatusLabel')"
      >
        <template slot-scope="{ row }">
          <el-tag
            :type="EWIS_PAYMENT_STATUS.type[row.displayFinancialStatus]"
            effect="dark"
            class="status-tag"
          >
            {{
              EWIS_PAYMENT_STATUS.text[row.displayFinancialStatus] ||
              row.displayFinancialStatus
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="displayFulfillmentStatus"
        :label="$t('message.orderInfo.fulfillmentStatusLabel')"
      >
        <template slot-scope="{ row }">
          <el-tag
            :type="EWIS_FULFILLMENT_STATUS.type[row.displayFulfillmentStatus]"
            effect="dark"
            class="status-tag"
          >
            {{
              EWIS_FULFILLMENT_STATUS.text[row.displayFulfillmentStatus] ||
              row.displayFulfillmentStatus
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        :label="$t('message.orderInfo.totalPriceLabel')"
      >
        <template v-if="row.totalPriceSet.shopMoney" slot-scope="{ row }">
          {{ row.totalPriceSet.shopMoney.amount }}
          {{ row.totalPriceSet.shopMoney.currencyCode }}
        </template>
      </el-table-column>
      <el-table-column
        prop="shippingAddress"
        :label="$t('message.orderInfo.shippingAddressLabel')"
        min-width="120"
      >
        <!-- 在 slot-scope 中，默认显示一段简短的文本 -->
        <template slot-scope="{ row }">
          <el-popover trigger="hover" placement="top-start">
            <!-- Popover内容：显示详细的地址信息 -->
            <el-descriptions
              v-if="row.shippingAddress"
              :column="2"
              :size="size"
              border
            >
              <el-descriptions-item
                :label="$t('message.orderInfo.nameLabel')"
                >{{ row.shippingAddress.name }}</el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.orderInfo.countryLabel')"
                >{{ row.shippingAddress.country }}</el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.orderInfo.cityLabel')"
                >{{ row.shippingAddress.city }}</el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.orderInfo.zipCodeLabel')"
                >{{ row.shippingAddress.zip }}</el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.orderInfo.addressLabel')"
                :span="2"
                >{{ row.shippingAddress.address1 }}</el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.orderInfo.addressLabel') + '2'"
                :span="2"
                >{{ row.shippingAddress.address2 }}</el-descriptions-item
              >

              <el-descriptions-item
                :label="$t('message.orderInfo.phoneLabel')"
                >{{ row.shippingAddress.phone }}</el-descriptions-item
              >
            </el-descriptions>
            <!-- 默认显示简短信息 -->
            <el-button type="text" slot="reference" class="ellipsis">
              {{ $t('message.orderInfo.nameLabel') }}：
              {{ row.shippingAddress.name }},
              {{ $t('message.orderInfo.countryLabel') }}：
              {{ row.shippingAddress.city }},
              {{ $t('message.orderInfo.cityLabel') }}：
              {{ row.shippingAddress.city }},
              {{ $t('message.orderInfo.zipCodeLabel') }}：
              {{ row.shippingAddress.zip }},
              {{ $t('message.orderInfo.addressLabel') }}：
              {{ row.shippingAddress.address1 }},
              {{ $t('message.orderInfo.addressLabel') + '2' }}：
              {{ row.shippingAddress.address2 }},
              {{ $t('message.orderInfo.phoneLabel') }}：
              {{ row.shippingAddress.phone }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('message.orderInfo.orderItemsLabel')"
        min-width="100"
      >
        <template slot-scope="{ row }">
          <el-popover
            trigger="hover"
            placement="top-start"
            v-if="Array.isArray(row.lineItems.edges)"
          >
            <el-table
              :data="row.lineItems.edges"
              v-loading="loading"
              style="width: 900px"
              :max-height="600"
            >
              <el-table-column
                prop="node.title"
                :label="$t('message.orderInfo.title')"
              ></el-table-column>
              <el-table-column
                prop="node.variant.sku"
                :label="$t('message.orderInfo.sku')"
              ></el-table-column>
              <el-table-column
                prop="node.variant.barcode"
                :label="$t('message.productInfo.barcode')"
              ></el-table-column>
              <el-table-column
                prop="node.variant.price"
                :label="$t('message.productInfo.price')"
              ></el-table-column>
              <el-table-column
                prop="node.variant.weight"
                :label="$t('message.productInfo.weight')"
              ></el-table-column>
              <el-table-column
                prop="node.variant.weightUnit"
                :label="$t('message.productInfo.weightUnit')"
              ></el-table-column>
              <el-table-column
                prop="node.quantity"
                :label="$t('message.orderInfo.quantityLabel')"
              ></el-table-column>
            </el-table>
            <!-- 默认显示简短信息 -->
            <el-button type="text" slot="reference" class="ellipsis">
              <span v-for="(item, index) in row.lineItems.edges" :key="index">
                {{ item.node.title }} ({{ item.node.sku }}) x
                {{ item.node.quantity }}
              </span>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="$t('message.orderInfo.events')" min-width="100">
        <template slot-scope="{ row }">
          <el-popover
            trigger="hover"
            placement="top-start"
            v-if="Array.isArray(row.events.edges)"
          >
            <el-table
              :data="row.events.edges"
              v-loading="loading"
              style="width: 900px"
              :max-height="600"
            >
              <el-table-column
                prop="node.createdAt"
                :label="$t('common.createTime')"
                width="160"
              ></el-table-column>
              <el-table-column
                prop="node.appTitle"
                :label="$t('message.orderInfo.appTitle')"
              ></el-table-column>
              <el-table-column
                prop="node.message"
                :label="$t('message.orderInfo.message')"
              ></el-table-column>
            </el-table>
            <!-- 默认显示简短信息 -->
            <el-button type="text" slot="reference" class="ellipsis">
              <span v-for="(item, index) in row.events.edges" :key="index">
                {{ item.node.appTitle }}：{{ item.node.message }}
              </span>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
/**
 * @file 订单信息 - 子表
 * @date 2024/03/17
 */

// 组件

// mixins

// 函数

// 常量
import { EWIS_PAYMENT_STATUS, EWIS_FULFILLMENT_STATUS } from './const.js'

export default {
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      EWIS_PAYMENT_STATUS,
      EWIS_FULFILLMENT_STATUS,
      loading: false,
      tableData: []
    }
  },
  computed: {
    shopifyShopUrl() {
      return this.$store.getters.shopifyShopUrl
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      let vm = this
      vm.loading = true

      vm.$ajax({
        url: `/api/shop-manager/fetch-order-detail`,
        method: 'get',
        roleType: vm.roleType,
        params: {
          shop_url: vm.shopifyShopUrl,
          order_name: vm.rowData.ewis_name
        }
      }).then(({ data = {} }) => {
        vm.tableData = [data.node]
        vm.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* 根据需要调整宽度 */
}
</style>
