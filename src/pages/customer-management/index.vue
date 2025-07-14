<!--
* @Description: 客户管理
* @Author: wjp
* @Date: 2024
* @LastEditors: wjp
* @LastEditTime: 2024
-->
<!--
* @Description: p-订单
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div v-loading="loading">
    <PageHead :title="$t('message.customerManagement.customer')"> </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryData.queryKeyWord"
            :placeholder="$t('common.pleaseSelect')"
            style="width: 140px"
          >
            <el-option
              v-for="item in customerFieldMap"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.remoteQuerySelect"
            filterable
            remote
            reserve-keyword
            :placeholder="$t('common.pleaseInput')"
            :remote-method="remoteQueryMethod"
            :loading="remoteLoading"
            :loading-text="$t('common.loading')"
            clearable
            style="width: 140px"
          >
            <el-option
              v-for="item in remoteQueryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select
            v-model="queryData.customer"
            filterable
            clearable
            style="width: 140px"
            :placeholder="$t('common.pleaseSelectCustomer')"
          >
            <el-option
              v-for="item in customers"
              :key="item.user_id"
              :label="item.user_code"
              :value="item.user_code"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="getDataList">{{
            $t('common.search')
          }}</el-button>
          <el-button type="primary" @click="resetQuery">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead>
      <template slot="top-right">
        <el-button icon="el-icon-printer" @click="resetPassword">{{
          $t('message.customerManagement.resetPassword')
        }}</el-button>
        <el-button icon="el-icon-edit" @click="wechatUnbind">{{
          $t('message.customerManagement.wechatUnbind')
        }}</el-button>
      </template>
    </CstTableHead>

    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%"
      :max-height="tableMaxHeight"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column align="center" type="selection" width="55">
      </el-table-column> -->
      <!-- <el-table-column
        align="center"
        :label="$t('common.operation')"
        width="140"
        prop="operate"
        fixed="left"
      >
        <template slot-scope="scope">
          <el-button
            style="margin-right: 12px"
            @click="showDetail(scope.row)"
            type="text"
            size="small"
          >
            {{ $t('common.check') }}
          </el-button>
          <el-dropdown
            trigger="click"
            :hide-on-click="false"
            @command="handleDropdownCommand"
          >
            <el-button type="text" size="small">
              {{ $t('common.more') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{ toExamine: scope.row }">
                <el-button type="text" size="small">
                  {{ $t('message.customerManagement.toExamine') }}
                </el-button>
              </el-dropdown-item>

              <el-dropdown-item :command="{ finance: scope.row }">
                <el-button type="text" size="small">
                  {{ $t('message.customerManagement.finance') }}
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->

      <el-table-column
        align="center"
        prop="client"
        :label="$t('message.customerManagement.Client')"
        show-overflow-tooltip
        width="140"
      >
        <template slot-scope="scope">
          <a
            class="el-icon-link"
            style="font-size: 18px"
            @click="toClient(scope.row)"
          >
          </a>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="user_code"
        sortable
        :label="$t('message.userInfo.formLabelUserCode')"
        show-overflow-tooltip
        width="140"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="username"
        :label="$t('message.customerManagement.username')"
        show-overflow-tooltip
      >
      </el-table-column>
      <!-- <el-table-column
        align="center"
        prop="customer_name"
        :label="$t('message.customerManagement.customerName')"
        show-overflow-tooltip
        width="140"
      >
      </el-table-column> -->
      <!-- <el-table-column
        align="center"
        prop="company_name"
        :label="$t('message.customerManagement.companyName')"
        show-overflow-tooltip
        width="140"
      >
      </el-table-column> -->
      <el-table-column
        align="center"
        prop="account_status"
        :label="$t('message.customerManagement.accountStatus')"
        show-overflow-tooltip
        width="140"
      >
        <template slot-scope="scope">
          {{ scope.row.account_status || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="payment_method"
        :label="$t('message.customerManagement.paymentMethod')"
        show-overflow-tooltip
        width="140"
      >
        <template slot-scope="scope">
          {{ scope.row.payment_method || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="account_balance"
        :label="$t('message.customerManagement.accountBalance')"
        show-overflow-tooltip
        width="140"
      >
        <template slot-scope="scope">
          {{ scope.row.account_balance || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="credit_limit"
        :label="$t('message.customerManagement.creditLimit')"
        show-overflow-tooltip
        width="140"
      >
        <template slot-scope="scope">
          {{ scope.row.credit_limit || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone_number"
        :label="$t('message.customerManagement.phoneNumber')"
        show-overflow-tooltip
        width="140"
      >
        <template slot-scope="scope">
          {{ scope.row.phone_number || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="wechat_id"
        :label="$t('message.customerManagement.wechatId')"
        show-overflow-tooltip
        width="140"
      >
        <template slot-scope="scope">
          {{ scope.row.wechat_id || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="country"
        :label="$t('common.recipientCountry')"
        show-overflow-tooltip
        width="130"
        align="center"
      >
        <template slot-scope="scope">
          {{
            scope.row.country
              ? getCountryByAbbreviation(scope.row.country)
              : '-'
          }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('common.createTime')"
        prop="date_joined"
        width="160"
      >
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryData.page_number"
        :page-sizes="[10, 50, 100]"
        :page-size="queryData.page_size"
        layout="total,sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import {
  getCountryByAbbreviation, query_all_customers, loadHomeData, customerLogin, storeHomeData, queryUserFields
} from '@/common/common-func'
import {
  customerFieldMap,
} from '@/common/field-maping'
export default {
  name: 'order',
  components: {
    PageHead,
    SearchCard,
    CstTableHead,
  },
  data () {
    return {
      customers: [],
      logDetailVisible: false,
      remarkList: [],
      currentSelectOrderId: '',
      shippingOption: 'edit',
      loading: false,
      tableHeight: 450,
      customerFieldMap,
      tableData: [

      ],
      variantsTotal: 0,
      total: 0,
      multipleSelection: [],
      currentData: {},
      recordData: {},
      queryData: {
        page_number: 1,
        page_size: 10,
        date_joined: '',
        remoteQuerySelect: [],
        queryKeyWord: customerFieldMap[0].value,
      },
      remoteLoading: false,
      remoteQueryOptions: [],
      customersRemoteLoading: false
    }
  },

  methods: {
    getCountryByAbbreviation,
    customerLogin,
    storeHomeData,
    loadHomeData,
    queryUserFields,
    toClient (row) {
      let params = {
        related_id: row.related_id
      }
      this.customerLogin(params).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          // 另起页面打开
          const { access } = res.data
          localStorage.setItem(
            this.config[this.config.dropShipper.role].accessToken,
            access
          )
          // 另起一个页面打开用户端 加个标记
          const userHomeUrl = `${this.config[this.config.dropShipper.role].homePath}?type=p2ds`;
          window.open(userHomeUrl, '_blank');
        }
        else {
          return Promise.reject(new Error('login error'))
        }
      }).catch((error) => {
        console.error('error: ', error)
      })
    },
    getcustomers () {
      this.customersRemoteLoading = true
      let provider_uuid = this.provider_uuid
      if (!provider_uuid) {
        console.error('provider_uuid is null or undefined')
        this.remoteLoading = false
        return
      }
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: 1,
        page_size: 1000
      }
      query_all_customers(queryParams, this.roleType)
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.tableData = res.data.results
            this.total = res.data.total
            this.customers = res.data.results.map((item) => ({
              user_code: item.user_code,
              user_id: item.related_id //TODO： 这里看是否需要转ID
            }))
          }
        })
        .finally(() => {
          this.customersRemoteLoading = false
        })
    },


    resetPassword () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('message.orderManagement.printWaybillInfo')
        )
        return
      }
    },
    wechatUnbind () {
    },
    handleDropdownCommand (command) {
      const keys = Object.keys(command)
      const key = keys[0]
      let rowData = command[key]
      this.currentData = rowData
      this.recordData = rowData
      switch (key) {
        case 'toExamine':
          // this.showLogDetail(rowData)
          break
        case 'finance':
          // this.showRemark(rowData)
          break

        default:
          break
      }
    },

    closePrintWaybill () {
      this.printWaybillVisible = false
    },
    closePopconfirm () {
      // 模拟点击其他位置形成气泡确认框关闭
      document.body.click()
    },
    // 获取查询参数
    remoteQueryMethod (query) {
      if (query === '') {
        this.remoteQueryOptions = []
        return
      }
      // 用来远程获取数据
      this.remoteLoading = true
      const queryParam = {
        [this.queryData.queryKeyWord]: query,
        provider_uuid: this.provider_uuid
      }
      this.queryUserFields(queryParam).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          // data 为对象 获取key作为选择性
          this.remoteQueryOptions = Object.keys(res.data).map((item) => ({
            value: item,
            label: item
          }))
        }
      }).finally(() => {
        this.remoteLoading = false
      })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    getDataList () {
      let queryParams = {
        page_number: this.queryData.page_number,
        page_size: this.queryData.page_size,
        provider_uuid: this.provider_uuid
      }
      if (this.queryData.date_joined) {
        queryParams.date_joined = this.queryData.date_joined
      }
      if (this.queryData.remoteQuerySelect) {
        queryParams[this.queryData.queryKeyWord] = this.queryData.remoteQuerySelect
      }
      query_all_customers(queryParams, this.roleType)
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.tableData = res.data.results
            this.total = res.data.total
            this.customers = res.data.results.map((item) => ({
              user_code: item.user_code,
              user_id: item.related_id //TODO： 这里看是否需要转ID
            }))
          }
        })

    },
    handleSizeChange (val) {
      this.queryData.page_size = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.queryData.page_number = val
      this.getDataList()
    },


    resetQuery () {
      this.queryData = {
        page_number: 1,
        page_size: 10,
        date_joined: '',
        remoteQuerySelect: [],
        queryKeyWord: customerFieldMap[0].value,
      }
    }
  },
  mounted () {
    // if (this.provider_uuid) {
    //   //   this.getLogisticsChannels()
    //   this.getcustomers()
    //   //   await this.queryStorageDefinition()
    // }
    if (this.provider_uuid) {
      this.getDataList()
    }
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
    shops () {
      let shopList = ['ALL']
      const storedShops = JSON.parse(
        localStorage.getItem(this.config[this.roleType].shopList)
      )
      if (Array.isArray(storedShops) && storedShops.length > 0) {
        shopList = shopList.concat(storedShops)
      }
      return shopList
    },
    tableMaxHeight () {
      // 视窗高度-(头部-搜索框)-(分页-底部)  通用列表自适应视窗高度
      return window.innerHeight - 290 - 90
    }
  },
  watch: {

  }
}
</script>
<style lang="scss" scoped>
::v-deep
  .audit-status:last-child
  .badge-inside-button
  .el-radio-button
  .el-radio-button__inner:last-child {
  border-radius: 0 4px 4px 0;
  background-color: green;
}

::v-deep .el-badge__content {
  z-index: 100;
}

.auditStatus {
  ::v-deep div.badge-inside-button {
    .el-radio-button__inner {
      border-radius: 0 0 0 0;
    }
  }

  ::v-deep div.badge-inside-button:first-child {
    .el-radio-button__inner {
      border-radius: 4px 0 0 4px;
    }
  }

  ::v-deep div.badge-inside-button:last-child {
    .el-radio-button__inner {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>
