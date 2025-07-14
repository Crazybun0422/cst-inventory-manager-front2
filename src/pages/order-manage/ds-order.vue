<!--
* @Description: ds-订单
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div v-loading="loading">
    <PageHead :title="$t('message.orderManagement.order')">
      <template slot="head-right">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="mini"
          @click="showOrderModal({}, 'add')"
        >
          {{ $t('common.add') }}
        </el-button>
      </template>
    </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryData.storage_uuid"
            filterable
            clearable
            :placeholder="$t('message.storage.warehouseSelect')"
          >
            <el-option
              v-for="item in storageList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.queryKeyWord"
            :placeholder="$t('common.pleaseSelect')"
          >
            <el-option
              v-for="item in orderFieldSelectMap"
              :key="item.value"
              :label="item.label?.[$languageType]"
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
            :placeholder="$t('common.pleaseInput') + ' ' + queryKeyWordValue"
            :remote-method="remoteQueryMethod"
            :loading="remoteLoading"
            :loading-text="$t('common.loading')"
            clearable
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
        <el-form-item>
          <el-select
            v-model="queryData.shop"
            :placeholder="$t('message.storeSettings.pleaseSelectShop')"
            filterable
            style="width: 230px"
          >
            <el-option
              v-for="item in shops"
              :key="item"
              :label="item"
              :value="item"
            >
              <span class="custom-select-option-left">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryData.date"
            type="daterange"
            :range-separator="$t('common.to')"
            :start-placeholder="$t('common.startTime')"
            :end-placeholder="$t('common.endTime')"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryOrder">{{
            $t('common.search')
          }}</el-button>
          <el-button type="primary" @click="resetQuery">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead>
      <template slot="top-left">
        <el-radio-group
          v-model="radioAuditStatus"
          @change="handleRadioChange"
          class="auditStatus"
        >
          <el-badge
            :value="auditStatusMap[item.value]"
            class="badge-inside-button"
            v-for="item in StockEntryStatusEnum"
            :key="item.value"
            :max="99"
            :type="orderStatusMarkColorMap[item.value]"
          >
            <el-radio-button :label="item.value" :value="item.value">
              <span>{{ item.label[$languageType] }}</span>
            </el-radio-button>
          </el-badge>
        </el-radio-group>
      </template>
      <template slot="top-right">
        <el-button
          icon="el-icon-check"
          type="success"
          size="mini"
          plain
          v-if="radioAuditStatus === 0"
          @click="submitShipment(0)"
        >
          {{ $t('message.orderManagement.submitConfirmation') }}
        </el-button>
        <!-- <el-button
          icon="el-icon-delete"
          type="danger"
          plain
          v-if="radioAuditStatus === 0"
          @click="submitShipment(3)"
          >作废</el-button
        > -->
        <el-button
          icon="el-icon-position"
          type="success"
          size="mini"
          plain
          v-if="radioAuditStatus === 1"
          @click="submitShipment(1)"
        >
          {{ $t('message.orderManagement.returnTtoDraft') }}
        </el-button>
        <el-button
          icon="el-icon-s-release"
          type="success"
          size="mini"
          plain
          v-if="[1, 2, 3, 4].includes(radioAuditStatus)"
          @click="submitShipment(4)"
        >
          {{ $t('message.orderManagement.cutOffOrders') }}
        </el-button>

        <!-- <el-button icon="el-icon-folder-add" type="primary" disabled plain
          >批量新建
        </el-button> -->
        <!--TODO: 点击导出会立马返回结果   导出成功后websocket会返回提醒 此外增加一个按钮 显示可下载列表 下载完重新获取待下载列表 -->
        <el-popconfirm
          ref="exportOrderPopconfirm"
          trigger="click"
          :title="
            multipleSelection.length === 0
              ? $t('common.exportAllDataUnderCurrentConditions') + '?'
              : $t('common.exportSelectedData') + '?'
          "
          style="margin-left: 10px"
          :width="240"
          placement="top-start"
          @cancel="closeExportPopconfirm"
          @confirm="exportOrder"
        >
          <el-button
            icon="el-icon-download"
            type="primary"
            slot="reference"
            size="mini"
            plain
            >{{ $t('common.export') }}</el-button
          >
        </el-popconfirm>
        <el-badge :is-dot="hasDownload" class="item" style="margin-top: -2px">
          <el-button
            icon="el-icon-folder-add"
            style="margin-left: 10px"
            size="mini"
            type="primary"
            plain
            @click="showDownloadList"
            >{{ $t('common.download') }}
          </el-button>
        </el-badge>
        <el-dropdown style="margin-left: 10px">
          <el-button icon="el-icon-menu">
            {{ $t('common.tool')
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              ><el-button
                type="text"
                icon="el-icon-document-copy"
                @click="copyOrder"
                >{{ $t('message.orderManagement.copyOrder') }}</el-button
              ></el-dropdown-item
            >
            <el-dropdown-item
              ><el-button
                type="text"
                icon="el-icon-edit"
                @click="batchEditOrder"
                >{{ $t('common.batchModify') }}</el-button
              ></el-dropdown-item
            >
            <el-dropdown-item
              ><el-button
                icon="el-icon-s-flag"
                type="text"
                @click="markOrder"
                >{{ $t('common.mark') }}</el-button
              ></el-dropdown-item
            >
            <el-dropdown-item
              ><el-button
                icon="el-icon-printer"
                type="text"
                @click="printWaybill"
                >{{ $t('message.orderManagement.printWaybill') }}</el-button
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>

      <template slot="bottom-left"> </template>
    </CstTableHead>

    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%"
      size="small"
      @selection-change="handleSelectionChange"
      @expand-change="handleExpandChange"
    >
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('common.operation')"
        width="140"
        prop="operate"
        fixed="left"
      >
        <template slot-scope="scope">
          <a style="margin-right: 12px" @click="showDetail(scope.row)">
            {{ $t('common.check') }}
          </a>
          <!-- <el-button
            style="margin-right: 12px"
            @click="copyData(scope.row)"
            type="text"
            size="small"
            icon="el-icon-document-copy"
          >
            {{ $t('common.copy') }}
          </el-button> -->
          <el-dropdown
            trigger="click"
            :hide-on-click="false"
            @command="handleDropdownCommand"
          >
            <a>
              {{ $t('common.more') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{ editOrder: scope.row }">
                <a>
                  <!-- @click.stop="showOrderModal(scope.row, 'edit')" -->
                  {{ $t('common.edit') + $t('message.orderManagement.order') }}
                </a></el-dropdown-item
              ><el-popconfirm
                ref="popconfirm"
                trigger="click"
                :title="$t('common.confirmDelete')"
                placement="top-start"
                @cancel="closePopconfirm"
                @confirm="delOrder(scope.row)"
                v-if="radioAuditStatus === 0"
                ><span slot="reference">
                  <el-dropdown-item :command="{ delOrder: scope.row }">
                    <a>
                      {{
                        $t('common.delete') +
                        $t('message.orderManagement.order')
                      }}
                    </a>
                  </el-dropdown-item>
                </span>
              </el-popconfirm>
              <el-dropdown-item :command="{ addShipping: scope.row }">
                <a>
                  <!-- @click.stop="showModal(scope.row, 'add')" -->
                  {{ $t('message.orderManagement.addLogistics') }}
                </a></el-dropdown-item
              >
              <el-dropdown-item
                v-if="
                  scope.row.shipping_statuses &&
                  scope.row.shipping_statuses.length !== 0
                "
                :command="{ shippingInfo: scope.row }"
              >
                <a>
                  <!-- @click.stop="showModal(scope.row, 'edit')" -->
                  {{ $t('message.orderManagement.logisticsInformation') }}
                </a>
              </el-dropdown-item>
              <el-dropdown-item :command="{ logDetail: scope.row }">
                <a>
                  {{ $t('common.log') }}
                </a>
              </el-dropdown-item>
              <!-- <el-dropdown-item
                v-if="
                  scope.row.shipping_statuses &&
                  scope.row.shipping_statuses.length !== 0
                "
                :command="{ delShipping: scope.row }"
              >
                <el-button icon="el-icon-delete" type="text">
               
                  {{
                    $t('common.delete') +
                    $t('message.orderManagement.logisticsInformation')
                  }}
                </el-button>
              </el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column align="center" type="expand">
        <template slot-scope="data">
          <el-table
            :data="data.row.productsInfo"
            style="width: 80%; margin-left: 24px"
            border
            size="small"
            v-loading="!data.row.loadInfo"
          >
            <el-table-column
              align="center"
              prop="main_image_url"
              :label="$t('message.orderManagement.productImages')"
              width="120"
            >
              <template slot-scope="scope">
                <AuthImg
                  :src="scope.row?.main_image_url"
                  :styleInfo="'width:50px;height:50px;margin-right:8px'"
                >
                </AuthImg>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="product_code_sku"
              :label="$t('message.productManagement.productSku')"
              width="160"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="
                    copyData(
                      scope.row.product_code_sku,
                      $t('message.productManagement.productSku')
                    )
                  "
                  >{{ scope.row.product_code_sku }}</el-button
                >
              </template>
            </el-table-column>

            <el-table-column
              prop="english_name"
              show-overflow-tooltip
              align="center"
              :label="$t('message.productManagement.englishName')"
              width="160"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="chinese_name"
              align="center"
              :label="$t('message.productManagement.chineseName')"
              width="160"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="price"
              align="center"
              :label="$t('message.productManagement.price')"
              width="80"
            >
              <template slot-scope="scope">
                {{ scope.row.price }} {{ currencySymbolMap[scope.row.unit] }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="quantity"
              align="center"
              :label="$t('message.productManagement.quantity')"
              width="80"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="alarm_number"
              align="center"
              :label="$t('message.productManagement.inventoryWarningQuantity')"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="description"
              align="center"
              :label="$t('common.describe')"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="quality_inspection_weight_kg"
              align="center"
              :label="$t('message.productManagement.weight')"
              width="100"
            >
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column
        prop="order_id"
        sortable
        :label="$t('message.orderManagement.order') + 'ID'"
        show-overflow-tooltip
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="
              copyData(
                scope.row.order_id,
                $t('message.orderManagement.order') + 'ID'
              )
            "
            >{{ scope.row.order_id }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="cs_reference"
        sortable
        :label="$t('message.orderManagement.csReferenceNumber')"
        show-overflow-tooltip
        width="260"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="order_type"
        :label="$t('message.orderManagement.orderType')"
        show-overflow-tooltip
        width="160"
      >
        <template slot-scope="scope">
          <span>
            {{
              Number(scope.row.order_type) === 1
                ? $t('message.orderManagement.onePieceForShipping')
                : null
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('message.orderManagement.order') + $t('common.status')"
        prop="order_status"
        width="110"
      >
        <template slot-scope="scope">
          <el-tag
            :type="orderStatusMarkColorMap[scope.row.order_status]"
            effect="plain"
            class="status-tag"
          >
            {{
              StockEntryStatusMap[scope.row.order_status]?.[$languageType] || ''
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.source')"
        width="100"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip
            :content="$t('common.source') + ':' + scope.row?.shop"
            placement="bottom"
            v-if="scope.row.source !== 0"
          >
            <el-tag
              effect="plain"
              :style="getTagStyle(scope.row.source, sourceColorMap)"
              class="status-tag"
            >
              {{ souringMap[scope.row.source]?.[$languageType] }}
            </el-tag>
          </el-tooltip>
          <el-tag
            effect="plain"
            :style="getTagStyle(scope.row.source, sourceColorMap)"
            class="status-tag"
            v-else
          >
            {{ souringMap[scope.row.source]?.[$languageType] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('message.orderManagement.warehouse')"
        prop="storage_uuid"
        width="180"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <span>
            {{ storageMap[scope.row.storage_uuid] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        :label="$t('common.createTime')"
        width="160"
        sortable
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="recipient_name"
        :label="$t('message.orderManagement.consigneeName')"
        show-overflow-tooltip
        width="130"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="recipient_phone"
        :label="$t('common.phone')"
        show-overflow-tooltip
        width="160"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('message.orderManagement.receivingCountry')"
        show-overflow-tooltip
        width="145"
        prop="country"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('message.orderManagement.address') + '1'"
        show-overflow-tooltip
        prop="address_1"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('message.orderManagement.logisticsInformation')"
        show-overflow-tooltip
        width="175"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            v-for="shipping_statu in scope.row.shipping_statuses"
            :key="shipping_statu.shipping_id"
            style="display: block; target: _blank"
            @click="toShippingDetail(scope.row)"
          >
            {{ shipping_statu.tracking_number }}
          </el-link>
        </template>
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
    <el-dialog
      :title="$t('message.orderManagement.logisticsInformation')"
      :visible.sync="shippingInfoVisible"
      width="30%"
      v-loading="shippingInfoLoading"
      :before-close="closeShipingInfo"
    >
      <el-table
        ref="multipleTable"
        :data="shipingInfoList"
        :max-height="tableMaxHeight"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleDelShipping"
      >
        <!-- <el-table-column
          type="selection"
          width="55"
          v-if="shippingOption !== 'edit'"
        >
        </el-table-column> -->
        <el-table-column
          :label="$t('message.orderManagement.logisticsCompany')"
        >
          <template slot-scope="scope">
            <span>{{ logisticsCompanyMap[scope.row.shipping_company] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('message.orderManagement.logistics') + 'ID'"
          prop="tracking_number"
        >
        </el-table-column>
        <el-table-column
          fixed="left"
          :label="$t('common.operation')"
          width="140"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="shippingTableOption(scope.row, 'edit')"
              >{{ $t('common.edit') }}</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm
              ref="popconfirm"
              trigger="click"
              :title="$t('common.confirmDelete')"
              placement="top-start"
              @cancel="closePopconfirm"
              @confirm="shippingTableOption(scope.row, 'delete')"
              ><span slot="reference">
                <el-button icon="el-icon-delete" type="text">
                  {{ $t('common.delete') }}
                </el-button>
              </span>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeShipingInfo">{{
          $t('common.cancel')
        }}</el-button>
        <!-- <el-button
          v-if="shippingOption !== 'edit'"
          type="primary"
          @click="delShipping"
          >{{ $t('common.confirm') }}</el-button
        > -->
      </span>
    </el-dialog>
    <DownloadList
      :visible="showDownloadListVisible"
      :downloadObject="downloadObject"
      @close="closeDownloadList"
    ></DownloadList>
    <MarkOrder
      :visible="markOrderVisible"
      :markOrderIds="markOrderIds"
      @close="onCloseModal"
      @confirm="onConfirm"
    >
    </MarkOrder>
    <!-- 新增,修改物流 -->
    <AddShipping
      :visible="shippingVisible"
      :currentData="currentData"
      :operationType="operationType"
      :currentShippingId="currentShippingId"
      :logistics_channels="logistics_channels"
      :logisticsCompanyMap="logisticsCompanyMap"
      @close="onCloseShippingInfoModel"
      @confirm="onConfirm"
    ></AddShipping>
    <AddOrder
      :visible="orderVisible"
      :currentData="currentData"
      :operationType="operationType"
      @close="onCloseModal"
      @confirm="onConfirm"
      :storageList="storageList"
      :radioAuditStatus="radioAuditStatus"
    ></AddOrder>
    <BatchEditOrder
      :visible="batchEditOrderVisible"
      :storageList="storageList"
      :orderIds="batchEditOrderIds"
      @close="onCloseModal"
      @confirm="onConfirm"
    >
    </BatchEditOrder>
    <!-- 订单详情 -->
    <OrderDetail
      :visible="detailVisible"
      :currentData="currentData"
      @close="onCloseDrawer"
      :storageMap="storageMap"
      :logistics_channels="logistics_channels"
      :logisticsCompanyMap="logisticsCompanyMap"
    >
    </OrderDetail>
    <LogList
      :visible="logDetailVisible"
      :currentData="currentData"
      :title="$t('message.orderManagement.orderLog')"
      @close="closeLogDetail"
    ></LogList>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import { mapGetters } from 'vuex'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import BatchEditOrder from '@/pages/order-manage/components/batch-edit-order.vue'
import AddShipping from '@/pages/order-manage/components/add-shipping.vue'
import AddOrder from '@/pages/order-manage/components/add-order.vue'
import DownloadList from '@/pages/order-manage/components/download-list.vue'
import OrderDetail from '@/pages/order-manage/components/order-detail.vue'
import MarkOrder from '@/pages/order-manage/components/mark-order.vue'
import LogList from '@/pages/order-manage/components/log-list.vue'
import {
  removeEmptyStringValues,
  copyData,
  queryDsRelateStorage,
  showErrorAlert,
  fetchSpecificElementsQueryResults,
  query_all_logistics_channels,
  getTagStyle,
  deleteLogistics
} from '@/common/common-func'
import {
  orderFieldSelectMap,
  StockEntryStatusEnum,
  orderStatusMarkColorMap,
  StockEntryStatusMap,
  currencySymbolMap,
  souringMap,
  sourceColorMap
} from '@/common/field-maping'
import utils from '@/utils/index'

import { initProductData } from '@/common/common-func'
import AuthImg from '@/components/auth-img.vue'
import { del } from 'vue'
export default {
  name: 'order',
  components: {
    LogList,
    DownloadList,
    AddShipping,
    PageHead,
    OrderDetail,
    SearchCard,
    AddOrder,
    AuthImg,
    CstTableHead,
    BatchEditOrder,
    MarkOrder
  },
  data () {
    return {
      logistics_channels: [],
      logisticsCompanyMap: {},
      souringMap,
      sourceColorMap,
      logDetailVisible: false,
      currentSelectOrderId: '',
      shippingOption: 'edit',
      StockEntryStatusMap,
      currencySymbolMap,
      loading: false,
      tableHeight: 450,
      hasDownload: false,
      markOrderVisible: false,
      printWaybillVisible: false,
      markOrderIds: [],
      printWaybillOrderIds: [],
      downloadObject: {},
      batchEditOrderIds: [],
      batchEditOrderVisible: false,
      dropdownVisible: false,
      shipingInfoList: [],
      shippingInfoVisible: false,
      shippingInfoLoading: false,
      auditStatusMap: {},
      radioAuditStatus: StockEntryStatusEnum[0].value,
      StockEntryStatusEnum: StockEntryStatusEnum,
      orderStatusMarkColorMap: orderStatusMarkColorMap,
      orderFieldSelectMap,
      tableData: [],
      variantsTotal: 0,
      total: 0,
      multipleSelection: [],
      shippingVisible: false,
      orderVisible: false,
      currentData: {},
      recordData: {},
      operationType: 'add',
      currentShippingId: '',
      // 抽屉
      detailVisible: false,
      queryData: {
        page_number: 1,
        page_size: 10,
        date: '',
        tracking_number: null,
        remoteQuerySelect: [],
        queryKeyWord: orderFieldSelectMap[0].value,
        shop: 'ALL'
      },
      storageList: [],
      storageMap: {},
      remoteLoading: false,
      remoteQueryOptions: [],
      multipleSelectionShipping: [],
      isPopconfirmVisible: false,
      showDownloadListVisible: false
    }
  },
  computed: {
    ...mapGetters(['shouldRefreshDownloads']),
    //计算queryKeyWord的value值
    queryKeyWordValue () {
      return this.orderFieldSelectMap.find(
        (item) => item.value === this.queryData.queryKeyWord
      ).label[this.$languageType]
    },
    dsCurrentProviderUuid () {
      return this.$store.state.user.dsCurrentProviderUuid
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
  methods: {
    initProductData,
    deleteLogistics,
    getTagStyle,
    fetchSpecificElementsQueryResults,
    showErrorAlert,
    copyData,
    queryDsRelateStorage,
    copyOrder () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('common.selectCopyData'))
        return
      } else if (this.multipleSelection.length > 1) {
        this.$message.warning(this.$t('common.onlySelectOneData'))
        return
      } else {
        this.showOrderModal(this.multipleSelection[0], 'copy')
      }
    },
    closeDownloadList () {
      this.showDownloadListVisible = false
      this.getDownLoadList()
    },
    async getLogisticsChannels () {
      let queryParams = {
        provider_uuid: this.dsCurrentProviderUuid,
        page_number: this.page_number,
        page_size: this.page_size
      }
      await query_all_logistics_channels(queryParams, this.roleType)
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.logistics_channels = res.data.results.map((item) => ({
              channel_name: item.channel_name,
              channel_code: item.channel_code
            }))
            this.logisticsCompanyMap = res.data.results.reduce((acc, cur) => {
              acc[cur.channel_code] = cur.channel_name
              return acc
            }, {})
          }
        })
        .finally(() => { })
    },
    showDownloadList () {
      this.showDownloadListVisible = true
    },
    getDownLoadList () {
      this.$ajax({
        url: '/api-prefix/api/order/query-order-export',
        method: 'get',
        roleType: this.roleType
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.hasDownload = res.data.completed.length !== 0
            this.downloadObject = res.data
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    closeExportPopconfirm () {
    },
    async exportOrder () {
      let queryParam = {
        lan: this.$languageType
      }
      let queryString = ''
      if (this.multipleSelection.length !== 0) {
        queryString = this.multipleSelection
          .map((item) => `order_ids=${item.order_id}`)
          .join('&')
      } else {
        if (this.radioAuditStatus) {
          queryParam['order_status'] = this.radioAuditStatus
        }
        if (this.queryData.date !== '' && this.queryData.date.length !== 0) {
          queryParam['start_date'] = this.queryData.date[0]
          queryParam['end_date'] = this.queryData.date[1]
        }
        if (
          this.queryData.queryKeyWord === 'tracking_number' &&
          this.queryData.remoteQuerySelect !== null
        ) {
          queryParam['tracking_number'] = this.queryData.remoteQuerySelect
        }
        // 删除空字符串值
        queryParam = removeEmptyStringValues(queryParam)
        // 将 queryParam 对象转换为查询字符串
        const additionalQueryString = Object.entries(queryParam)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')

        queryString = additionalQueryString
      }
      try {
        const res = await this.$ajax({
          url: `/api-prefix/api/order/order-export?${queryString}`,
          method: 'get',
          roleType: this.roleType
        })
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(this.$t('message.orderManagement.exportInfo'))
        }
      } catch (error) {
        console.error(error)
      }
    },
    batchEditOrder () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('common.selectEditData'))
        return
      }
      this.batchEditOrderIds = this.multipleSelection.map(
        (item) => item.order_id
      )
      this.batchEditOrderVisible = true
    },
    markOrder () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('message.orderManagement.markWaringInfo'))
        return
      }
      this.markOrderVisible = true
      this.markOrderIds = this.multipleSelection.map((item) => item.order_id)
    },
    printWaybill () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('message.orderManagement.printWaybillInfo')
        )
        return
      }
      this.loading = true
      this.printWaybillVisible = true
      this.printWaybillOrderIds = this.multipleSelection.map(
        (item) => item.order_id
      )
      // 将 order_ids 转换为查询参数字符串
      let queryString = this.printWaybillOrderIds
        .map((id) => `order_ids=${id}`)
        .join('&')

      // 使用模板字符串构造完整的 URL，包含查询参数
      const url = `/api-prefix/api/order/print-label?&${queryString}`
      this.$ajax({
        url: url,
        method: 'get',
        data: { order_ids: this.printWaybillOrderIds },
        headers: {
          'Content-Type': 'application/json'
        },
        roleType: this.roleType
      })
        .then(async (res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.$message.success(this.$t('common.operationSuccessful'))
            if (Object.keys(res.data).length > 0) {
              await this.getPrintWaybillPdf(res.data)
              await this.getOrderList()
            } else {
              this.$message.warning(
                this.$t('message.orderManagement.noWaybillInfo')
              )
            }
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    async getPrintWaybillPdf (data) {
      // 遍历data对象
      for (const [fileName, fileUrl] of Object.entries(data)) {
        // 使用URL对象解析URL
        const urlObj = new URL(fileUrl)
        // 获取路径和查询字符串
        const urlPath = '/api-prefix' + urlObj.pathname + urlObj.search
        const params = new URLSearchParams(urlObj.search)
        const filenameWithExtension = params.get('filename')
        const filenameId = filenameWithExtension.split('.')[0] // 通过'.'分割字符串并取第一部分

        // 使用fetch API下载PDF文件
        try {
          const res = await this.$ajax({
            url: urlPath,
            method: 'get',
            responseType: 'blob'
          })
          const pdfBlob = new Blob([res], { type: 'application/pdf' })

          // 创建临时下载链接
          const downloadUrl = window.URL.createObjectURL(pdfBlob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = fileName + '-' + filenameId // 设置下载的文件名
          // link.setAttribute('download', fileName); // 为下载的文件命名
          document.body.appendChild(link)
          link.click()

          // 清理并移除链接
          link.parentNode.removeChild(link)
          window.URL.revokeObjectURL(downloadUrl)
        } catch (error) {
          console.error('下载 PDF 文件时出错:', error)
        }
      }
    },
    closeDropdown () {
      this.dropdownVisible = false
    },
    handleDropdownCommand (command) {
      const keys = Object.keys(command)
      const key = keys[0]
      let rowData = command[key]
      this.currentData = rowData
      this.recordData = rowData
      switch (key) {
        case 'editOrder':
          this.showOrderModal(rowData, 'edit')
          this.closeDropdown()
          break
        case 'logDetail':
          this.showLogDetail(rowData)
          break
        case 'addShipping':
          this.showModal('add')
          this.closeDropdown()
          break
        case 'shippingInfo':
          this.handleShippingInfo(rowData)
          break
        default:
          break
      }
    },
    shippingTableOption (row, optionType) {
      this.currentShippingId = row.shipping_id
      if (optionType === 'delete') {
        this.shippingInfoLoading = true
        this.delShippingByButton(this.currentShippingId).then(() => {
          let targetOrder = this.tableData.filter(
            (order) => order.order_id === this.currentSelectOrderId
          )
          this.shipingInfoList =
            targetOrder.length > 0 ? targetOrder[0].shipping_statuses : []
          if (this.shipingInfoList.length === 0) {
            this.shippingInfoVisible = false
          }
          this.shippingInfoLoading = false
        })


      } else {
        this.currentData = this.recordData
        this.showModal('edit')
      }
    },
    handleDelShippingInfo (row) {
      this.closePopconfirm()
      this.shipingInfoList = row.shipping_statuses
      this.shippingInfoVisible = true
    },
    showLogDetail (row) {
      this.logDetailVisible = true
      this.currentData = row
    },
    closeLogDetail (refresh = false) {
      this.logDetailVisible = false
      if (refresh) {
        this.getOrderList()
      }
    },
    handleShippingInfo (row) {
      this.currentSelectOrderId = row.order_id
      this.closePopconfirm()
      this.shipingInfoList = row.shipping_statuses
      this.shippingInfoVisible = true
    },
    closePopconfirm () {
      // 模拟点击其他位置形成气泡确认框关闭
      document.body.click()
    },
    closeShipingInfo () {
      this.shippingInfoVisible = false
    },
    handleDelShipping (val) {
      this.multipleSelectionShipping = val
    },
    async handleExpandChange (row, expandedRows) {
      let loadStatus = row.loadInfo || false
      if (expandedRows.length !== 0 && !loadStatus) {
        // 获取对应的产品信息
        await this.initTableData([row])
        row.loadInfo = true
      }
    },
    toShippingDetail (row) {
      //TODO: 跳转到物流详情页 需要从row中获取 url
      let url = 'http://www.baidu.com'
      window.open(url)
    },
    submitShipment (value) {
      // TODO: 目前还没有接口 需要变更的
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t('common.selectSubmitData'))
        return
      }
      this.loading = true
      const reqUrl = {
        0: '/api-prefix/api/order/confirm-order', //提交确认
        1: '/api-prefix/api/order/return-back-draft', //提交草稿
        3: '/api-prefix/api/storage-m/cancel' //废除
      }
      const reqMethod = {
        0: 'put', //提交确认
        1: 'put', //提交草稿
        3: 'delete' //废除
      }
      let order_ids = this.multipleSelection.map((item) => {
        return item.order_id
      })
      this.$ajax({
        url: reqUrl[value],
        method: reqMethod[value],
        data: { order_ids: order_ids },
        headers: {
          'Content-Type': 'application/json'
        },
        roleType: this.roleType
      })
        .then(async (res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.$message.success(this.$t('common.operationSuccessful'))
            this.multipleSelection = []
            await this.getOrderList()
            this.getWarehousingEntry(this.queryData)
          } else if (value === 0 && res.code === 11006) {
            const content = this.showErrorAlert(res.data.errors)
            this.$alert(content, this.$t('common.errorInfo'), {
              confirmButtonText: this.$t('common.confirm'),
              dangerouslyUseHTMLString: true,
              type: 'error',
              center: true
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // radio切换
    async handleRadioChange () {
      await this.getOrderList()
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
        [this.queryData.queryKeyWord]: query
      }
      this.fetchSpecificElementsQueryResults(queryParam)
        .then((remoteQueryResult) => {
          // 成功获取数据后的处理逻辑
          this.remoteQueryOptions = remoteQueryResult.map((item) => {
            return {
              label: item,
              value: item
            }
          })
          this.queryData.remoteQuerySelect = query
        })
        .catch(() => {
          // 处理错误情况
          this.remoteQueryOptions = []
          this.queryData.remoteQuerySelect = query
        })
        .finally(() => {
          this.remoteLoading = false
        })
    },
    // 初始化表格数据,将产品信息插入
    initTableData (arr) {
      if (!arr || arr.length === 0) {
        this.tableData = []
        return
      }
      const initProductPromises = arr.map(async (el) => {
        if (el.products && el.products.length !== 0) {
          return this.initProductData(el.products).then((res) => {
            el.productsInfo = utils.deepClone(res)
          })
        }
      })
      arr.forEach((obj) => {
        const index = this.tableData.findIndex((item) => {
          return item.order_id === obj.order_id
        })
        if (index !== -1) {
          // this.tableData[index].productsInfo = obj.productsInfo
          this.$nextTick(() => {
            this.$set(this.tableData[index], 'productsInfo', obj.productsInfo)
          })
        }
      })
    },
    rowSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (column.property !== 'sku' && column.property !== 'quantity') {
        return { rowspan: row.rowspan, colspan: 1 }
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    showDetail (row) {
      this.detailVisible = true
      this.currentData = row
    },

    onCloseDrawer () {
      this.detailVisible = false
    },
    showModal (type) {
      this.closePopconfirm()
      this.shippingVisible = true
      this.operationType = type
    },
    // 新增订单
    showOrderModal (orderInfo, type) {
      this.closePopconfirm()
      this.closeDropdown()
      this.operationType = type
      this.orderVisible = true
      this.currentData = orderInfo
    },
    // 删除物流信息
    delShipping () {
      if (this.multipleSelectionShipping.length === 0) {
        this.$message.warning(this.$t('common.selectDeleteData'))
        return
      }
      const shipping_ids = this.multipleSelectionShipping.map((item) => {
        return item.shipping_id
      })
      let queryParam = { shipping_ids: shipping_ids }
      this.deleteLogistics(queryParam)
        .then(async (res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.$message.success(this.$t('common.deleteSuccessful'))
            this.shippingInfoVisible = false
            await this.getOrderList()
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // 删除物流信息
    delShippingByButton (shipping_id) {
      let queryParam = {
        shipping_ids: [shipping_id],
        provider_uuid: this.dsCurrentProviderUuid
      }
      return this.deleteLogistics(queryParam)
        .then(async (res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.$message.success(this.$t('common.deleteSuccessful'))
            await this.getOrderList()
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // 删除订单
    delOrder (row) {
      this.$ajax({
        url: '/api-prefix/api/order/delete-order',
        method: 'delete',
        params: { order_id: row.order_id },
        headers: {
          'Content-Type': 'application/json'
        },
        roleType: this.roleType
      })
        .then(async (res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.closePopconfirm()
            await this.getOrderList()
          } else {
            this.$message.success(this.$t('common.operationFailed'))
            this.closePopconfirm()
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    async onCloseModal () {
      this.markOrderVisible = false
      this.batchEditOrderVisible = false
      this.shippingVisible = false
      this.orderVisible = false
      this.currentData = {}
    },
    async onCloseShippingInfoModel () {
      await this.getOrderList()
      let targetOrder = this.tableData.filter(
        (order) => order.order_id === this.currentSelectOrderId
      )
      this.shipingInfoList =
        targetOrder.length > 0 ? targetOrder[0].shipping_statuses : []
      this.recordData = targetOrder[0]
      this.shippingVisible = false
    },
    // 弹窗确认后刷新列表
    async onConfirm () {
      this.markOrderVisible = false
      this.shippingVisible = false
      this.orderVisible = false
      this.batchEditOrderVisible = false
      await this.getOrderList()
    },
    async getOrderList () {
      this.loading = true
      const queryParam = {
        // 这里需要增加状态的筛选字段
        order_status: this.radioAuditStatus,
        page_number: this.queryData.page_number,
        page_size: this.queryData.page_size
        // tracking_number: this.queryData.tracking_number,
      }
      if (this.queryData.remoteQuerySelect !== '') {
        queryParam[this.queryData.queryKeyWord] =
          this.queryData.remoteQuerySelect
      }
      //组装日期查询
      if (this.queryData.date.length > 0) {
        queryParam['start_date'] = this.queryData.date[0]
        queryParam['end_date'] = this.queryData.date[1]
      }
      if (this.queryData.storage_uuid !== '') {
        queryParam['storage_uuid'] = this.queryData.storage_uuid
      }
      if (this.dsCurrentProviderUuid) {
        queryParam['provider_uuid'] = this.dsCurrentProviderUuid
      }
      queryParam['shop'] = this.queryData.shop
      try {
        const res = await this.$ajax({
          url: '/api-prefix/api/order/query-order',
          method: 'get',
          params: queryParam,
          headers: {
            'Content-Type': 'application/json'
          },
          roleType: this.roleType
        })
        if (this.$isRequestSuccessful(res.code)) {
          // this.initTableData(utils.deepClone(res.data.results))
          let results = utils.deepClone(res.data.results)
          results.map((item) => {
            item.loadInfo = false
            item.productsInfo = []
          })
          this.tableData = results
          this.total = res.data.total
          this.objectSpanFlag = false
          // 获取订单各状态数量
          return this.queryCountStatus(queryParam)
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async handleSizeChange (val) {
      this.queryData.page_size = val
      await this.getOrderList()
    },
    async handleCurrentChange (val) {
      this.queryData.page_number = val
      await this.getOrderList()
    },
    async queryOrder () {
      this.queryData.page_number = 1
      await this.getOrderList()
    },
    queryStorage () {
      const queryParam = {
        provider_uuid: this.dsCurrentProviderUuid
      }
      this.queryDsRelateStorage(queryParam)
        .then((res) => {
          if (
            (Array.isArray(res.data) && res.data.length === 0) ||
            Object.keys(res.data).length === 0
          ) {
            this.storageList = []
            this.storageMap = {}
          } else {
            this.storageList = res.data.map((item) => ({
              label: item.name,
              value: item.storage_uuid
            }))
            res.data.forEach((obj) => {
              this.storageMap[obj.storage_uuid] = obj.name
            })
          }
        })
        .catch((error) => {
          console.error('Login error:', error)
        })
    },
    queryCountStatus (param = {}) {
      let queryParam = {
        provider_uuid: this.dsCurrentProviderUuid,
        ...param
      }
      delete queryParam.order_status
      delete queryParam.page_number
      delete queryParam.page_size

      if (this.queryData.shop) {
        queryParam['shop'] = this.queryData.shop
      }
      this.$ajax({
        url: '/api-prefix/api/order/query-count-status',
        method: 'get',
        params: queryParam,
        roleType: this.roleType
      }).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          this.auditStatusMap = {}
          for (let obj of res.data) {
            Object.assign(this.auditStatusMap, obj)
            // 草稿和未收货使用红色 作废用灰色啥的  完成用绿色 其他中间态用橙色
          }
        }
      })
    },
    resetQuery () {
      this.queryData = {
        queryKeyWord: orderFieldSelectMap[0].value,
        remoteQuerySelect: '',
        date: ['', ''],
        storage_uuid: '',
        page_number: 1,
        page_size: 10
      }
    }
  },

  async mounted () {
    if (this.dsCurrentProviderUuid) {
      this.queryStorage()
      await this.getOrderList()
      this.getDownLoadList()
      await this.getLogisticsChannels()
    }
  },
  watch: {
    'queryData.queryKeyWord': {
      handler (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.queryData.remoteQuerySelect = ''
          this.remoteQueryOptions = []
        }
      }
    },
    shouldRefreshDownloads (val) {
      if (val) {
        this.getDownLoadList()
        this.$store.dispatch('user/resetDownloadRefreshTrigger')
      }
    },
    async dsCurrentProviderUuid (val) {
      if (val) {
        await this.getOrderList()
        this.queryStorage()
        await this.getLogisticsChannels()
      }
    }
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
