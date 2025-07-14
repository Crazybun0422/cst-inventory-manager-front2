<!--
* @description  参数1
* @fileName  product-page
* @author wjp
* @date 2023-10-29 22:02:25
!-->
<template>
  <el-dialog
    :title="$t('message.productManagement.productSelect')"
    :visible.sync="modalVisible"
    width="800px"
    :close-on-click-modal="false"
    @close="handlerClose"
    :class="checkboxClass"
    ref="selectProductDialog"
    :lock-scroll="false"
    :append-to-body="true"
  >
    <div id="product-page" class="product-page" v-loading="loading">
      <SearchCard>
        <el-form
          :inline="true"
          :model="queryData"
          class="demo-form-inline"
          ref="queryForm"
        >
          <el-form-item>
            <el-select
              v-model="queryData.queryKeyWord"
              :placeholder="$t('common.pleaseSelect')"
            >
              <el-option
                v-for="item in fieldOptions"
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
              :placeholder="queryKeyWordValue"
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
              v-model="queryData.category"
              :placeholder="$t('common.classification')"
            >
              <el-option
                v-for="(item, key) in productCategoryMap"
                :key="key"
                :label="item[$languageType]"
                :value="key"
              ></el-option>
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
            <el-button icon="el-icon-search" @click="handleSearchProduct">{{
              $t('common.search')
            }}</el-button>
          </el-form-item>
        </el-form>
      </SearchCard>

      <el-table
        ref="singleChoiceTable"
        :data="newTableData"
        v-el-table-infinite-scroll="loadTableData"
        :infinite-scroll-disabled="newRowDisabled"
        :infinite-scroll-distance="5"
        style="overflow: auto"
        height="350px"
        size="small"
        highlight-current-row
        @select-all="handleSelectAll"
        @select="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="main_image_url"
          :label="$t('message.productManagement.productImage')"
          column-key="main_image_url"
          width="120"
        >
          <template slot-scope="scope">
            <AuthImg
              :src="
                scope.row.sub_image_url
                  ? scope.row.sub_image_url
                  : scope.row.main_image_url
              "
              :styleInfo="'width:50px;height:50px;'"
            ></AuthImg>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$languageType == 'zh_cn'"
          :label="$t('message.productManagement.chineseName')"
          show-overflow-tooltip
          width="120"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.chinese_name + '-' + scope.row.sub_chinese_name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :label="$t('message.productManagement.englishName')"
          show-overflow-tooltip
          width="120"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.english_name + '-' + scope.row.sub_english_name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('message.productManagement.productCode')"
          show-overflow-tooltip
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.product_code_sku }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('message.productInfo.price')"
          show-overflow-tooltip
          width="80"
        >
          <template slot-scope="scope">
            {{ currencySymbolMap[scope.row.unit] + scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          :label="$t('message.productManagement.productStock')"
          width="100"
        >
          <template slot-scope="scop">
            <el-tag size="small" v-if="scop.row.stock >= 5000" type="success">
              {{ scop.row.stock }}
            </el-tag>
            <el-tag
              size="small"
              v-else-if="scop.row.stock >= 1000 && scop.row.stock < 5000"
              type="warning"
            >
              {{ scop.row.stock }}
            </el-tag>
            <el-tag size="small" v-else type="danger">
              {{ scop.row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="category"
          :label="$t('common.classification')"
          width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{
              scope.row.category
                ? productCategoryMap[scope.row.category]?.[$languageType]
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          sortable
          :label="$t('common.createTime')"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="product_unit"
          :label="$t('message.productManagement.productUnit')"
          width="120"
        >
          <template slot-scope="scope">
            {{
              scope.row.product_unit
                ? productUnitMap[scope.row.product_unit]?.[$languageType]
                : ''
            }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('message.productManagement.productBarcode')"
          show-overflow-tooltip
          width="130"
        >
          <template slot-scope="scope">
            {{ scope.row.product_barcode }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" width="90">
          <template slot-scope="scope">
            <el-tag
              type="success"
              effect="plain"
              v-if="scope.row.status === 1"
              class="status-tag"
            >
              {{
                scope.row.status
                  ? productStatusMap[scope.row.status][$languageType]
                  : ''
              }}
            </el-tag>
            <el-tag
              type="danger"
              effect="plain"
              v-else-if="scope.row.status === 2"
              class="status-tag"
            >
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
        <el-table-column :label="$t('common.auditStatus')" width="120">
          -
        </el-table-column>
        <el-table-column
          :label="
            $t('message.productManagement.qualityInspectionWeight') + '[KG]'
          "
          width="240"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_weight_kg }}</p>
          </template>
        </el-table-column>
        <el-table-column
          :label="
            $t('message.productManagement.qualityInspectionLength') + '[CM]'
          "
          width="240"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_length_cm }}</p>
          </template>
        </el-table-column>
        <el-table-column
          :label="
            $t('message.productManagement.qualityInspectionWidth') + '[CM]'
          "
          width="240"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_width_cm }}</p>
          </template>
        </el-table-column>
        <el-table-column
          :label="
            $t('message.productManagement.qualityInspectionHeight') + '[CM]'
          "
          width="240"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.quality_inspection_height_cm }}</p>
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="curPage"
        :page-sizes="[10, 50, 100]"
        :page-size="pageSize"
        layout="total,sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination> -->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handlerClose" size="medium">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" @click="selectProduct" size="medium">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import utils from '@/utils/index'
import AuthImg from '@/components/auth-img.vue'
import SearchCard from '@/components/search-card.vue'
import ElTableInfiniteScroll from 'el-table-infinite-scroll'
import {
  productCategoryMap,
  productUnitMap,
  productStatusMap,
  fieldSelectMap,
  currencySymbolMap
} from '@/common/field-maping'
export default {
  name: 'product-page',
  directives: {
    'el-table-infinite-scroll': ElTableInfiniteScroll
  },
  props: {
    visible: { type: Boolean, default: false },
    isSingleChoice: { type: Boolean, default: false } //是否是单选
  },
  data () {
    return {
      currencySymbolMap,
      currentRowKey: null, // 当前选中的行的 key
      // singleChoice: this.isSingleChoice,
      loading: false,
      curPage: 1,
      pageSize: 10,
      variantsTotal: 0,
      total: 0,
      multipleSelection: [],
      remoteLoading: false,
      remoteQueryOptions: [],
      searchProduct: false,
      queryKeyWord: fieldSelectMap[0].value,
      modalVisible: this.visible,
      tableData: [],
      newTableData: [],
      fieldOptions: fieldSelectMap,
      productCategoryMap: productCategoryMap,
      productUnitMap: productUnitMap,
      productStatusMap: productStatusMap,
      objectSpanFlag: false,
      queryData: {
        queryKeyWord: fieldSelectMap[0].value,
        remoteQuerySelect: [],
        category: '',
        date: '',
        storage_name: ''
      },
      scrollLoading: false
    }
  },
  components: {
    SearchCard,
    AuthImg
  },
  methods: {
    loadTableData () {
      if (this.tableData.length >= this.total) {
        return
      }

      this.curPage++
      this.queryProduct(true)
    },
    handleSizeChange (val) {
      this.pageSize = val
      // TODO:这里还没做翻页和调整页面数量的逻辑
    },
    handleCurrentChange (val) {
      this.curPage = val
      // TODO:这里还没做翻页和调整页面数量的逻辑
    },
    remoteQueryMethod (query) {
      // 用来远程获取数据
      if (query !== '') {
        this.remoteLoading = true
        const queryParam = {
          [this.queryData.queryKeyWord]: query
        }
        this.$ajax({
          url: '/api-prefix/api/product/query-product-element',
          method: 'get',
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
    handleSearchProduct () {
      this.queryProduct(false)
    },
    queryProduct (isScroll = false) {
      const queryParam = {}
      // --------------组装查询参数------------
      //组装日期查询
      if (this.queryData.date && this.queryData.date.length > 0) {
        queryParam['start_date'] = this.queryData.date[0]
        queryParam['end_date'] = this.queryData.date[1]
      }
      // 组装查询关键字的key value 如果在远程查询结果中存在需要查询的keyword

      if (this.remoteQueryResult && this.remoteQueryResult.length > 0) {
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
      // 组装分类查询
      if (this.queryData.category) {
        queryParam['category'] = this.queryData.category
      }
      this.getProductList(queryParam, isScroll)
    },
    handlerClose () {
      // 提交后重置为空
      this.multipleSelection = []
      // 清空搜索数据
      this.newTableData = []
      this.tableData = []
      Object.assign(this.queryData, undefined)
      this.$refs.queryForm.resetFields()
      this.$emit('close')
    },
    getRowCount () {
      this.newTableData.forEach((el, index) => {
        el.rowspan = el.product_variants.length
      })
    },
    // 对数据进行格式化  一个变种一行以 变种为维度
    formatProductData (data) {
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
          source: item.source
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
    getProductList (queryParam = {}, isScroll = false) {
      this.loading = true
      if (!isScroll) {
        this.curPage = 1
      } else {
        this.scrollLoading = true
      }
      let queryParamformat = {
        ...queryParam,
        page_size: this.pageSize,
        cur_page: this.curPage
      }
      this.$ajax({
        url: '/api-prefix/api/product/query-product',
        method: 'get',
        params: queryParamformat,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            //这里需要判断如果是滑动加载则需要将数据追加到tableData中 否则重置tableData
            if (isScroll) {
              this.tableData = this.tableData.concat(
                utils.deepClone(res.data.result)
              )
              this.newTableData = this.newTableData.concat(
                this.formatProductData(utils.deepClone(res.data.result))
              )
            } else {
              this.tableData = utils.deepClone(res.data.result)
              this.newTableData = this.formatProductData(
                utils.deepClone(res.data.result)
              )
            }
            this.getRowCount()
            this.total = res.data.total
            this.objectSpanFlag = false
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
          this.scrollLoading = false
          if (isScroll) {
            this.$nextTick(() => {
              this.$refs.singleChoiceTable.clearSelection()
              this.newTableData.forEach((item) => {
                if (
                  this.multipleSelection.some(
                    (selection) => selection.variant_id === item.variant_id
                  )
                ) {
                  this.$refs.singleChoiceTable.toggleRowSelection(item, true)
                }
              })
            })
          }
        })
    },
    handleCurrentChange (val) {
      this.currentRowKey = val ? val.date : null // 假设每行的 date 值是唯一的
    },
    handleSelectionChange (list, row) {
      if (!this.isSingleChoice) {
        this.multipleSelection = list
        return
      }
      if (list.length === 0) {
        this.multipleSelection = []
        return
      }
      this.$refs.singleChoiceTable.clearSelection()
      this.newTableData.forEach((ele) => {
        //这里的数据是从后端拿到后进行分裂处理的 不是直接拿来用的
        if (ele.variant_id === row.variant_id) {
          this.$refs.singleChoiceTable.toggleRowSelection(ele, true)
          this.multipleSelection = [ele]
        }
      })
    },

    selectProduct () {
      if (!this.isSelectProduct) {
        this.$message({
          message: this.$t('message.productManagement.selectAtLeastOneProduct'),
          type: 'warning'
        })
        return
      }
      this.$emit('select-product', this.multipleSelection)
      // 提交后重置为空
      this.multipleSelection = []
      // 清空搜索数据
      Object.assign(this.queryData, undefined)
      this.$refs.queryForm.resetFields()
      this.$emit('close')
    },
    handleSelectAll (selection) {
      if (!this.isSingleChoice) this.multipleSelection = selection
    }
  },
  computed: {
    //TODO:动态实现隐藏全选按钮
    checkboxClass () {
      return {
        'hide-checkbox': this.isSingleChoice,
        'global-modal-class': true
      }
    },
    noMore () {
      return this.tableData.length >= this.total
    },

    newRowDisabled () {
      return this.noMore
    },

    //计算queryKeyWord的value值
    queryKeyWordValue () {
      return this.fieldOptions.find(
        (item) => item.value === this.queryData.queryKeyWord
      ).label[this.$languageType]
    },
    isSelectProduct () {
      return this.multipleSelection.length > 0
    }
  },
  mounted () { },
  watch: {
    visible: {
      handler (newValue) {
        this.modalVisible = newValue
        if (this.modalVisible) {
          this.getProductList()
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang="scss">
.hide-checkbox ::v-deep .has-gutter .el-checkbox__inner {
  display: none !important;
}
</style>
