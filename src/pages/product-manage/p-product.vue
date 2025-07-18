<!--
* @Description: 产品
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div v-loading="loading || scrollLoading">
    <PageHead :title="$t('message.productManagement.product')">
      <template slot="head-right">
        <!-- <el-button type="primary" icon="el-icon-plus" @click="showModal(null)">
          新增产品
        </el-button> -->
      </template>
    </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="queryData.queryKeyWord" :placeholder="$t('common.pleaseSelect')">
            <el-option v-for="item in fieldOptions" :key="item.value" :label="item.label[$languageType]"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryData.remoteQuerySelect" filterable remote reserve-keyword style="width: 240px"
            :placeholder="$t('common.pleaseInput') + ' ' + queryKeyWordValue" :remote-method="remoteQueryMethod"
            :loading="remoteLoading" :loading-text="$t('common.loading')" clearable>
            <el-option v-for="item in remoteQueryOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryData.category" :placeholder="$t('common.classification')" clearable>
            <el-option v-for="(item, key) in productCategoryMap" :key="key" :label="item[$languageType]"
              :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryData.shop" :placeholder="$t('message.storeSettings.pleaseSelectShop')" filterable
            style="width: 230px">
            <el-option v-for="item in shops" :key="item" :label="item" :value="item">
              <span class="custom-select-option-left">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="queryData.date" type="daterange" :range-separator="$t('common.to')"
            :start-placeholder="$t('common.startTime')" :end-placeholder="$t('common.endTime')" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryProduct(false)">{{
            $t('common.search')
          }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="objectSpanFlag" size="small" @input="onChangeFlag">
            <el-radio-button :label="false">{{
              $t('message.productManagement.classicList')
            }}</el-radio-button>
            <el-radio-button :label="true">{{
              $t('message.productManagement.newList')
            }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead>
      <template slot="top-right">
        <el-button icon="el-icon-document-checked" @click="oneClickMeasurementOfQualityInspectionDimensions">{{
          $t(
            'message.productManagement.oneClickMeasurementOfQualityInspectionDimensions'
          )
        }}</el-button>
        <el-button icon="el-icon-document-add" @click="batchImportMeasurementQualityInspection">{{
          $t(
            'message.productManagement.batchImportMeasurementQualityInspection'
          )
        }}</el-button>
        <!-- <el-button icon="el-icon-printer" @click="scanAndPrintCode">{{
          $t('message.productManagement.scanAndPrintCode')
        }}</el-button> -->
        <el-button icon="el-icon-finished" @click="toExamineProduct">{{
          $t('common.toExamine')
        }}</el-button>
        <el-button icon="el-icon-printer" @click="printProductInfo">{{
          $t('common.print')
        }}</el-button>
        <el-popconfirm ref="exportOrderPopconfirm" trigger="click" :title="multipleSelection.length === 0
          ? $t('common.exportAllDataUnderCurrentConditions') + '?'
          : $t('common.exportSelectedData') + '?'
          " style="margin-left: 10px" :width="240" placement="top-start" @confirm="exportOrder">
          <el-button icon="el-icon-download" type="primary" slot="reference" size="mini" plain>{{ $t('common.export')
          }}</el-button>
        </el-popconfirm>
      </template>
    </CstTableHead>
    <!-- 新表单 使用翻页-->
    <div v-if="objectSpanFlag">
      <el-table :data="newTableData" style="width: 100%; word-break: keep-all; word-wrap: break-word" ref="newTable"
        class="break-word" :span-method="objectSpanMethod" size="small" :max-height="tableMaxHeight"
        @selection-change="oldHandleSelectionChange" :row-class-name="tableRowClassName"
        @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="main_image_url" :label="$t('message.productManagement.productImage')"
          column-key="main_image_url" width="110">
          <template slot-scope="scope">
            <AuthImg :src="scope.row.sub_image_url
              ? scope.row.sub_image_url
              : scope.row.main_image_url
              " :styleInfo="'width:50px;height:50px;'"></AuthImg>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.chineseName')" show-overflow-tooltip width="180"
          v-if="$languageType == 'zh_cn'">
          <template slot-scope="scope">
            <span>{{
              scope.row.chinese_name + '-' + scope.row.sub_chinese_name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else :label="$t('message.productManagement.englishName')" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <span>{{
              scope.row.english_name + '-' + scope.row.sub_english_name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category" :label="$t('common.classification')" width="110">
          <template slot-scope="scope">
            {{
              scope.row.category
                ? productCategoryMap[scope.row.category]?.[$languageType]
                : ''
            }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('common.source')" prop="source" width="100" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-tooltip :content="$t('common.source') + ':' + scope.row?.shop" placement="bottom"
              v-if="scope.row.source !== 0">
              <el-tag effect="plain" :style="getTagStyle(scope.row.source, sourceColorMap)" class="status-tag">
                {{ souringMap[scope.row.source]?.[$languageType] }}
              </el-tag>
            </el-tooltip>
            <el-tag effect="plain" :style="getTagStyle(scope.row.source, sourceColorMap)" class="status-tag" v-else>
              {{ souringMap[scope.row.source]?.[$languageType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="product_unit" :label="$t('message.productManagement.productUnit')" width="100">
          <template slot-scope="scope">
            {{
              scope.row.product_unit
                ? productUnitMap[scope.row.product_unit]?.[$languageType]
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.productCode')" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <a @click="
              copyData(
                scope.row.product_code_sku,
                $t('message.productManagement.productCode')
              )
              ">{{ scope.row.product_code_sku }}</a>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.productBarcode')" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <a @click="
              copyData(
                scope.row.product_barcode,
                $t('message.productManagement.productBarcode')
              )
              ">{{ scope.row.product_barcode }}</a>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" width="80">
          <template slot-scope="scope">
            <el-tag type="success" effect="plain" v-if="scope.row.status === 1" class="status-tag">
              {{
                scope.row.status
                  ? productStatusMap[scope.row.status]?.[$languageType]
                  : ''
              }}
            </el-tag>
            <el-tag type="danger" effect="plain" v-else-if="scope.row.status === 2" class="status-tag">
              {{
                scope.row.status
                  ? productStatusMap[scope.row.status]?.[$languageType]
                  : ''
              }}
            </el-tag>
            <el-tag type="danger" effect="plain" v-else class="status-tag">
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.auditStatus')" min-width="100">
          -
        </el-table-column>
        <el-table-column prop="create_time" sortable :label="$t('common.createTime')" width="160">
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.qualityInspectionWeight') + '[KG]'
          " width="210">
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_weight_kg }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.qualityInspectionLength') + '[CM]'
          " width="210">
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_length_cm }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.qualityInspectionWidth') + '[CM]'
          " width="210">
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_width_cm }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.qualityInspectionHeight') + '[CM]'
          " width="210">
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_height_cm }}</p>
          </template>
        </el-table-column>
        <el-table-column label="operate" fixed="left" width="100" prop="operate">
          <template slot-scope="scope">
            <a @click="showDetail(scope.row)" size="small">
              {{ $t('common.check') }}
            </a>
            <a size="small" @click="showModal(scope.row)">
              {{ $t('common.edit') }}
            </a>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="margin-top: 10px">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="curPage" :page-sizes="[10, 50, 100]" :page-size="pageSize"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination></el-row>
    </div>
    <!-- 经典表单  使用无限加载 -->
    <div v-if="!objectSpanFlag">
      <el-table :data="newTableData" ref="oldTable" v-el-table-infinite-scroll="loadTableData"
        :infinite-scroll-disabled="newRowDisabled" :infinite-scroll-distance="5" size="small" height="600px"
        highlight-current-row @select="handleSelectionChange" @select-all="handleSelectAll">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="main_image_url" :label="$t('message.productManagement.productImage')"
          column-key="main_image_url" width="110">
          <template slot-scope="scope">
            <AuthImg :src="scope.row.sub_image_url
              ? scope.row.sub_image_url
              : scope.row.main_image_url
              " :styleInfo="'width:50px;height:50px;'"></AuthImg>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.chineseName')" show-overflow-tooltip width="180"
          v-if="$languageType == 'zh_cn'">
          <template slot-scope="scope">
            <span>{{
              scope.row.chinese_name + '-' + scope.row.sub_chinese_name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else :label="$t('message.productManagement.englishName')" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <span>{{
              scope.row.english_name + '-' + scope.row.sub_english_name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category" :label="$t('common.classification')" width="110">
          <template slot-scope="scope">
            {{
              scope.row.category
                ? productCategoryMap[scope.row.category]?.[$languageType]
                : ''
            }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('common.source')" width="100" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-tooltip :content="$t('common.source') + ':' + scope.row?.shop" placement="bottom"
              v-if="scope.row.source !== 0">
              <el-tag effect="plain" :style="getTagStyle(scope.row.source, sourceColorMap)" class="status-tag">
                {{ souringMap[scope.row.source]?.[$languageType] }}
              </el-tag>
            </el-tooltip>
            <el-tag effect="plain" :style="getTagStyle(scope.row.source, sourceColorMap)" class="status-tag" v-else>
              {{ souringMap[scope.row.source]?.[$languageType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="product_unit" :label="$t('message.productManagement.productUnit')" width="100">
          <template slot-scope="scope">
            {{
              scope.row.product_unit
                ? productUnitMap[scope.row.product_unit]?.[$languageType]
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.productCode')" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <a @click="
              copyData(
                scope.row.product_code_sku,
                $t('message.productManagement.productCode')
              )
              ">{{ scope.row.product_code_sku }}</a>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.productBarcode')" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <a @click="
              copyData(
                scope.row.product_barcode,
                $t('message.productManagement.productBarcode')
              )
              ">{{ scope.row.product_barcode }}</a>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" width="80">
          <template slot-scope="scope">
            <el-tag type="success" effect="plain" v-if="scope.row.status === 1" class="status-tag">
              {{
                scope.row.status
                  ? productStatusMap[scope.row.status]?.[$languageType]
                  : ''
              }}
            </el-tag>
            <el-tag type="danger" effect="plain" v-else-if="scope.row.status === 2" class="status-tag">
              {{
                scope.row.status
                  ? productStatusMap[scope.row.status][$languageType]
                  : ''
              }}
            </el-tag>
            <el-tag type="danger" effect="plain" v-else class="status-tag">
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.auditStatus')" width="100">
          -
        </el-table-column>
        <el-table-column prop="create_time" sortable :label="$t('common.createTime')" width="160">
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.qualityInspectionWeight') + '[KG]'
          " width="210">
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_weight_kg }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.qualityInspectionLength') + '[CM]'
          " width="210">
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_length_cm }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.qualityInspectionWidth') + '[CM]'
          " width="210">
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_width_cm }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.productManagement.qualityInspectionHeight') + '[CM]'
          " width="210">
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_height_cm }}</p>
          </template>
        </el-table-column>
        <el-table-column label="operate" fixed="left" width="100" prop="operate">
          <template slot-scope="scope">
            <a @click="showDetail(scope.row)" size="small">
              {{ $t('common.check') }}
            </a>
            <a size="small" @click="showModal(scope.row)">
              {{ $t('common.edit') }}
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增,修改产品 -->
    <EditProduct :visible="productVisible" :currentData="currentData" :originalDataArr="tableData" @close="onCloseModal"
      @confirm="onConfirm"></EditProduct>
    <!-- 产品详情 -->
    <ProductDetail :visible="detailVisible" :currentData="currentData" :originalDataArr="tableData"
      @close="onCloseDrawer">
    </ProductDetail>
    <PProductPrint :visible="printProductVisible" :product_uuids="product_uuids" @close="onClosePrintModal">
    </PProductPrint>
    <POneClickMeasurement :visible="oneClickMeasurementVisible" :variantIds="multipleSelection"
      @close="onOneClickMeasurementModal"></POneClickMeasurement>
    <PExaminedProduct :visible="examinedVisible" :variantIds="multipleSelection" @close="onCloseExaminedModal">
    </PExaminedProduct>
    <PScanAndPrintCode :visible="scanAndPrintCodeVisible" @close="onCloseScanAndPrintCode"></PScanAndPrintCode>
    <PBatchImportMeasurement :visible="batchImportMeasurementVisible" @close="onCloseBatchImportMeasurement">
    </PBatchImportMeasurement>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import AuthImg from '@/components/auth-img.vue'
import { throttle } from 'lodash'
import ElTableInfiniteScroll from 'el-table-infinite-scroll'
import EditProduct from '@/pages/product-manage/components/edit-product.vue'
import ProductDetail from '@/pages/product-manage/components/product-detail.vue'
import {
  productCategoryMap,
  productUnitMap,
  productStatusMap,
  fieldSelectMap,
  souringMap,
  sourceColorMap
} from '@/common/field-maping'
import PProductPrint from '@/pages/product-manage/components/p-product-print.vue'
import POneClickMeasurement from '@/pages/product-manage/components/p-one-click-measurement.vue'
import PExaminedProduct from '@/pages/product-manage/components/p-examined-product.vue'
import utils from '@/utils/index'
import { copyData, getTagStyle } from '@/common/common-func'
import PScanAndPrintCode from './components/p-scan-and-print-code.vue'
import PBatchImportMeasurement from './components/p-batch-import-measurement.vue'
export default {
  name: 'product',
  directives: {
    'el-table-infinite-scroll': ElTableInfiniteScroll
  },
  components: {
    EditProduct,
    PageHead,
    ProductDetail,
    SearchCard,
    AuthImg,
    CstTableHead,
    PProductPrint,
    POneClickMeasurement,
    PExaminedProduct,
    PScanAndPrintCode,
    PBatchImportMeasurement
  },
  data() {
    return {
      souringMap,
      sourceColorMap,
      oneClickMeasurementVisible: false,
      batchImportMeasurementVisible: false,
      scanAndPrintCodeVisible: false,
      examinedVisible: false,
      printProductVisible: false,
      scrollLoading: false,
      loading: false,
      queryKeyWord: fieldSelectMap[0].value,
      remoteQuerySelect: [],
      remoteLoading: false,
      remoteQueryOptions: [],
      remoteQueryResult: [],
      fieldOptions: fieldSelectMap,
      productCategoryMap: productCategoryMap,
      productUnitMap: productUnitMap,
      productStatusMap: productStatusMap,
      objectSpanFlag: true,
      tableData: [],
      product_uuids: [],
      newTableData: [],
      curPage: 1,
      pageSize: 10,
      variantsTotal: 0,
      total: 0,
      multipleSelection: [],
      productVisible: false,
      currentData: {},
      // 抽屉
      detailVisible: false,
      queryData: {
        queryKeyWord: fieldSelectMap[0].value,
        remoteQuerySelect: [],
        category: '',
        date: '',
        storage_name: '',
        shop: 'ALL'
      },
      curRowArr: [],
      needSpanFields: [
        'operate',
        'main_image_url',
        'chinese_name',
        'english_name',
        'category',
        'create_time',
        'source',
        'product_unit'
      ]
    }
  },
  methods: {
    copyData,
    getTagStyle,
    onCloseBatchImportMeasurement() {
      this.batchImportMeasurementVisible = false
    },
    onCloseScanAndPrintCode() {
      this.scanAndPrintCodeVisible = false
    },
    onCloseExaminedModal() {
      this.examinedVisible = false
      this.multipleSelection = []
      if (this.objectSpanFlag) {
        this.$refs.newTable.clearSelection()
      } else {
        this.$refs.oldTable.clearSelection()
      }
    },
    onOneClickMeasurementModal() {
      this.oneClickMeasurementVisible = false
      this.multipleSelection = []
      if (this.objectSpanFlag) {
        this.$refs.newTable.clearSelection()
      } else {
        this.$refs.oldTable.clearSelection()
      }
    },
    onClosePrintModal() {
      this.printProductVisible = false
      this.multipleSelection = []
      if (this.objectSpanFlag) {
        this.$refs.newTable.clearSelection()
      } else {
        this.$refs.oldTable.clearSelection()
      }
    },
    oneClickMeasurementOfQualityInspectionDimensions() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: this.$t('message.productManagement.selectAtLeastOneProduct'),
          type: 'warning'
        })
        return
      }
      this.oneClickMeasurementVisible = true
    },
    batchImportMeasurementQualityInspection() {
      this.batchImportMeasurementVisible = true
    },
    scanAndPrintCode() {
      this.scanAndPrintCodeVisible = true
    },
    toExamineProduct() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: this.$t('message.productManagement.selectAtLeastOneProduct'),
          type: 'warning'
        })
        return
      }
      this.examinedVisible = true
    },
    printProductInfo() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: this.$t('message.productManagement.selectAtLeastOneProduct'),
          type: 'warning'
        })
        return
      }
      this.printProductVisible = true
      this.product_uuids = this.multipleSelection.map(
        (item) => item.product_uuid
      )
    },
    exportOrder() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: this.$t('message.productManagement.selectAtLeastOneProduct'),
          type: 'warning'
        })
        return
      }
    },
    loadTableData() {
      if (!this.objectSpanFlag) {
        if (this.tableData.length >= this.total) {
          return
        }
        this.curPage++
        this.queryProduct(true, { cur_page: this.curPage })
      }
    },
    handleSelectionChange(list, row) {
      if (list.length === 0) {
        this.multipleSelection = []
        return
      }
      this.multipleSelection = list
      if (!objectSpanFlag) {
        this.$refs.oldTable.clearSelection()
        this.newTableData.forEach((ele) => {
          //这里的数据是从后端拿到后进行分裂处理的 不是直接拿来用的
          if (ele.variant_id === row.variant_id) {
            this.$refs.productTable.toggleRowSelection(ele, true)
            this.multipleSelection = [ele]
          }
        })
      }
    },
    oldHandleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    handleSelectAll(selection) {
      if (!this.isSingleChoice) this.multipleSelection = selection
    },
    showDetail(row) {
      this.detailVisible = true
      this.currentData = row
    },
    onCloseDrawer() {
      this.detailVisible = false
    },
    showModal(row) {
      this.currentData = {}
      if (row) {
        this.currentData = row
      }
      this.productVisible = true
    },
    onCloseModal() {
      this.productVisible = false
      this.currentData = {}
    },
    onConfirm() {
      this.productVisible = false
      // this.objectSpanFlag = false
      this.getProductList()
    },
    onChangeFlag(val) {
      this.curPage = 1
      this.queryProduct(false, { cur_page: this.curPage })
      this.$nextTick(() => {
        // myTable是表格的ref属性值
        if (val && this.$refs.newTable) {
          this.$refs.newTable.doLayout()
        } else if (!val && this.$refs.oldTable) {
          this.$refs.oldTable.doLayout()
        }
      })
    },
    // 对数据进行格式化  一个变种一行以 变种为维度
    formatProductData(data) {
      const formattedData = []
      data.forEach((item) => {
        const parentData = {
          product_uuid: item.product_uuid,
          chinese_name: item.chinese_name,
          english_name: item.english_name,
          category: item.category,
          description: item.description,
          product_unit: item.product_unit,
          create_time: item.create_time,
          main_image_url: item.main_image_url,
          related_drop_shipper_id: item.related_drop_shipper_id,
          source: item.source,
          shop: item.shop
        }
        item.product_variants.forEach((variant, index) => {
          if (index === 0) {
            variant.rowspan = item.rowspan
          } else {
            variant.rowspan = null
          }
          const newVariant = {
            ...parentData,
            ...variant
          }
          if (this.objectSpanFlag) {
            // 如果合并 每一条都是全部变种信息
            newVariant.product_variants = item.product_variants
          } else {
            //如果不合并 每个变种都只有单个变种信息
            newVariant.product_variants = [variant]
          }
          formattedData.push(newVariant)
        })
      })
      return formattedData
    },
    getProductList(queryParam = {}, isScrollFlag = false) {
      this.loading = true
      if (isScrollFlag) {
        this.scrollLoading = true
      }
      queryParam = {
        ...queryParam,
        page_size: this.pageSize
      }
      if (!queryParam.cur_page) {
        this.curPage = 1
        queryParam.cur_page = this.curPage
      }
      if (this.provider_uuid) {
        queryParam.provider_uuid = this.provider_uuid
      }
      this.$ajax({
        url: '/api-prefix/api/product/query-product',
        method: 'get',
        roleType: this.roleType,
        params: (queryParam = {
          ...queryParam,
          page_size: this.pageSize
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            // 如果是无限加载 则后面追加数据
            if (isScrollFlag) {
              // 经典列表 无限加载  分裂数据的形式
              this.tableData = this.tableData.concat(
                utils.deepClone(res.data.result)
              )
              this.newTableData = this.newTableData.concat(
                this.formatProductData(utils.deepClone(res.data.result))
              )
            } else {
              // 新列表 翻页  合并数据的形式
              this.tableData = utils.deepClone(res.data.result)
              this.getRowCount()
              this.newTableData = this.formatProductData(
                utils.deepClone(this.tableData)
              )
            }
            this.total = res.data.total
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
          this.scrollLoading = false
          if (isScrollFlag && this.multipleSelection.length > 0) {
            this.$nextTick(() => {
              this.$refs.oldTable.clearSelection()
              this.newTableData.forEach((item) => {
                if (
                  this.multipleSelection.some(
                    (selection) => selection.variant_id === item.variant_id
                  )
                ) {
                  this.$refs.productTable.toggleRowSelection(item, true)
                }
              })
            })
          }
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      // TODO:这里还没做翻页和调整页面数量的逻辑
    },
    handleCurrentChange(val) {
      this.curPage = val
      // TODO:这里还没做翻页和调整页面数量的逻辑
      this.queryProduct(false, { cur_page: this.curPage })
    },
    // 标记需要合并的行
    getRowCount() {
      this.tableData.forEach((el, index) => {
        el.rowspan = el.product_variants.length
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.objectSpanFlag) {
        return
      }

      if (columnIndex === 0 || this.needSpanFields.includes(column.property)) {
        if (row.rowspan !== null) {
          if (row.rowspan !== 1) {
            return {
              rowspan: row.rowspan,
              colspan: 1
            }
          } else {
            return {
              rowspan: 1,
              colspan: 1
            }
          }
        } else {
          return {
            rowspan: 0,
            colspan: 1
          }
        }
      }
    },
    remoteQueryMethod(query) {
      // 用来远程获取数据
      if (query !== '') {
        this.remoteLoading = true
        const queryParam = {
          [this.queryData.queryKeyWord]: query
        }
        if (this.provider_uuid) {
          queryParam.provider_uuid = this.provider_uuid
        }
        this.$ajax({
          url: '/api-prefix/api/product/query-product-element',
          method: 'get',
          roleType: this.roleType,
          params: queryParam,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.remoteLoading = false
            if (res.data[this.queryData.queryKeyWord]) {
              // 保存查询的结果
              this.remoteQueryResult = res.data[this.queryData.queryKeyWord]
              this.remoteQueryOptions = this.remoteQueryResult.map((item) => {
                return {
                  label: item,
                  value: item
                }
              })
              // const flag = this.remoteQueryOptions.some(item => item.label === query)
              // if (!flag) {
              //   this.remoteQueryOptions.unshift({ label: query, value: query })
              // }
              this.queryData.remoteQuerySelect = query
            } else {
              this.remoteQueryOptions = []
              this.queryData.remoteQuerySelect = query
              // this.remoteQueryOptions = [{ label: query, value: query }];
            }
          }
        })
      } else {
        this.remoteQueryOptions = []
      }
    },
    queryProduct(isScroll = false, queryParam = {}) {
      // --------------组装查询参数------------
      //组装日期查询
      if (this.queryData.date.length > 0) {
        queryParam['start_date'] = this.queryData.date[0]
        queryParam['end_date'] = this.queryData.date[1]
      }
      queryParam['shop'] = this.queryData.shop
      // 组装查询关键字的key value 如果在远程查询结果中存在需要查询的keyword
      if (this.remoteQueryResult.length > 0) {
        if (
          this.remoteQueryResult.some(
            (value) => value === this.queryData.remoteQuerySelect
          )
        ) {
          queryParam[this.queryData.queryKeyWord] =
            this.queryData.remoteQuerySelect
        } else {
          queryParam[this.queryData.queryKeyWord + '_reg'] =
            this.queryData.remoteQuerySelect
        }
      } else {
        queryParam[this.queryData.queryKeyWord] =
          this.queryData.remoteQuerySelect
      }
      if (this.queryData.category) {
        queryParam['category'] = this.queryData.category
      }
      this.getProductList(queryParam, isScroll)
    },
    // filterMethod (value) {
    //   // 自定义筛选逻辑
    //   this.filteredOptions = this.remoteQueryOptions.filter(option =>
    //     option.label.toLowerCase().includes(value.toLowerCase())
    //   );
    //   //保留输入的值
    //   console.log('value: ', value);
    //   this.queryData.remoteQuerySelect = value
    // },

    tableRowClassName({ row, rowIndex }) {
      // 获取当前的高亮行索引数组
      let temArr = this.curRowArr.findIndex(
        (el) => el.product_uuid === row.product_uuid
      )
      if (temArr >= 0) {
        return 'high-row-class'
      }
    },
    // 鼠标移入单元格时触发的方法
    cellMouseEnter(row, column, cell, event) {
      this.curRowArr = [row]
    },

    // 鼠标移出单元格时触发的方法
    cellMouseLeave(row, column, cell, event) {
      this.curRowArr = []
    }
  },

  mounted() {
    if (this.provider_uuid) {
      this.getProductList()
    }
    this.$nextTick(() => {
      if (this.$refs.oldTable) this.$refs.oldTable.doLayout() // 解决表格错位
    })
  },
  computed: {
    provider_uuid() {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
    //计算queryKeyWord的value值
    queryKeyWordValue() {
      return this.fieldOptions.find(
        (item) => item.value === this.queryData.queryKeyWord
      ).label[this.$languageType]
    },

    noMore() {
      return this.tableData.length >= this.total
    },

    newRowDisabled() {
      return this.noMore
    },
    shops() {
      let shopList = ['ALL']
      const storedShops = JSON.parse(
        localStorage.getItem(this.config[this.roleType].shopList)
      )
      if (Array.isArray(storedShops) && storedShops.length > 0) {
        shopList = shopList.concat(storedShops)
      }
      return shopList
    },
    tableMaxHeight() {
      // 视窗高度-(头部-搜索框)-(分页-底部)  通用列表自适应视窗高度
      return window.innerHeight - 290 - 90
    }
  },
  watch: {
    'queryData.queryKeyWord': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.queryData.remoteQuerySelect = ''
          this.remoteQueryOptions = []
        }
      },
      deep: true
    }
  },
  created() {
    //增加防抖节流 规避滑动加载短时间内多次触发
    this.loadTableData = throttle(this.loadTableData, 3000) // 例如，每3秒触发一次
  }
}
</script>
<style scoped lang="scss">
::v-deep .high-row-class {
  background: #f5f7fa;
}
</style>
