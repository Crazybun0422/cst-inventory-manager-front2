<!--
* @Description: 产品(弃用)
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div>
    <PageHead title="产品">
      <template slot="head-right">
        <el-button type="primary" icon="el-icon-plus" @click="showModal(null)">
          新增产品
        </el-button>
      </template>
    </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryData" class="demo-form-inline">
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
            :placeholder="'请输入' + queryKeyWordValue"
            :remote-method="remoteQueryMethod"
            :loading="remoteLoading"
            loading-text="加载中"
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
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="queryProduct">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-radio-group
            v-model="objectSpanFlag"
            size="small"
            @input="onChangeFlag"
          >
            <el-radio-button :label="false">经典列表</el-radio-button>
            <el-radio-button :label="true">新列表</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </SearchCard>
    <el-table
      :data="newTableData"
      style="width: 100%"
      border
      :span-method="objectSpanMethod"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="main_image_url"
        label="产品图片"
        column-key="main_image_url"
        width="80"
      >
        <template slot-scope="scope">
          <AuthImg
            :src="scope.row.main_image_url"
            :styleInfo="'width:50px;height:50px;'"
          ></AuthImg>
        </template>
      </el-table-column>
      <el-table-column
        prop="chinese_name"
        :label="$t('message.productManagement.chineseName')"
        show-overflow-tooltip
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="english_name"
        :label="$t('message.productManagement.englishName')"
        show-overflow-tooltip
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="category"
        :label="$t('common.classification')"
        width="80"
      >
        <template slot-scope="scope">
          {{
            scope.row.category
              ? productCategoryMap[scope.row.category][$languageType]
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
      <el-table-column prop="product_unit" label="产品单位" width="80">
        <template slot-scope="scope">
          {{
            scope.row.product_unit
              ? productUnitMap[scope.row.product_unit][$languageType]
              : ''
          }}
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
        :label="$t('message.productManagement.productBarcode')"
        show-overflow-tooltip
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.product_barcode }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.status')" width="80">
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
                ? productStatusMap[scope.row.status][$languageType]
                : ''
            }}
          </el-tag>
          <el-tag type="danger" effect="plain" v-else class="status-tag">
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="80"> 暂无 </el-table-column>
      <el-table-column label="质检重量[KG]">
        <template slot-scope="scope">
          <p>{{ scope.row.quality_inspection_weight_kg }}</p>
        </template>
      </el-table-column>
      <el-table-column label="质检长[CM]">
        <template slot-scope="scope">
          <p>{{ scope.row.quality_inspection_length_cm }}</p>
        </template>
      </el-table-column>
      <el-table-column label="质检宽[CM]">
        <template slot-scope="scope">
          <p>{{ scope.row.quality_inspection_width_cm }}</p>
        </template>
      </el-table-column>
      <el-table-column label="质检高[CM]">
        <template slot-scope="scope">
          <p>{{ scope.row.quality_inspection_height_cm }}</p>
        </template>
      </el-table-column>
      <el-table-column label="operate" fixed="left" width="100" prop="operate">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">
            {{ $t('common.check') }}
          </el-button>
          <el-button type="text" size="small" @click="showModal(scope.row)">
            {{ $t('common.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增,修改产品 -->
    <EditProduct
      :visible="productVisible"
      :currentData="currentData"
      :originalDataArr="tableData"
      @close="onCloseModal"
      @confirm="onConfirm"
    ></EditProduct>
    <!-- 产品详情 -->
    <ProductDetail
      :visible="detailVisible"
      :currentData="currentData"
      :originalDataArr="tableData"
      @close="onCloseDrawer"
    ></ProductDetail>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="curPage"
      :page-sizes="[10, 50, 100]"
      :page-size="pageSize"
      layout="total,sizes, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import AuthImg from '@/components/auth-img.vue'
import EditProduct from '@/pages/product-manage/components/edit-product.vue'
import ProductDetail from '@/pages/product-manage/components/product-detail.vue'
import { productCategoryMap, productUnitMap, productStatusMap, fieldSelectMap } from '@/common/field-maping'
import utils from '@/utils/index'
export default {
  name: 'product',
  components: { EditProduct, PageHead, ProductDetail, SearchCard, AuthImg },
  data () {
    return {
      queryKeyWord: fieldSelectMap[0].value,
      remoteQuerySelect: [],
      remoteLoading: false,
      remoteQueryOptions: [],
      remoteQueryResult: [],
      fieldOptions: fieldSelectMap,
      productCategoryMap: productCategoryMap,
      productUnitMap: productUnitMap,
      productStatusMap: productStatusMap,
      objectSpanFlag: false,
      tableData: [
      ],
      newTableData: [],
      curPage: 1,
      pageSize: 50,
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
        storage_name: ''
      },
    }
  },
  methods: {
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
    showModal (row) {
      this.productVisible = true
      this.currentData = row
    },
    onCloseModal () {
      this.productVisible = false
      this.currentData = {}
    },
    onConfirm () {
      this.productVisible = false
      this.objectSpanFlag = false
      this.getProductList()
    },
    onChangeFlag () {
      this.newTableData = this.formatProductData(this.tableData)

      // 如果合并显示总数 如何不合并显示变种数
      this.total = this.newTableData.length
    },
    // 对数据进行格式化  一个变种一行以 变种为维度
    formatProductData (data) {
      const formattedData = [];
      data.forEach(item => {
        const parentData = {
          "product_uuid": item.product_uuid,
          "chinese_name": item.chinese_name,
          "english_name": item.english_name,
          "category": item.category,
          "description": item.description,
          "product_unit": item.product_unit,
          "create_time": item.create_time,
          "main_image_url": item.main_image_url,
          "related_drop_shipper_id": item.related_drop_shipper_id,
          "source": item.source
        };
        item.product_variants.forEach((variant, index) => {
          if (index === 0) {
            variant.rowspan = item.rowspan
          } else {
            variant.rowspan = null
          }
          const newVariant = {
            ...parentData,
            ...variant
          };
          if (this.objectSpanFlag) {
            // 如果合并 每一条都是全部变种信息
            newVariant.product_variants = item.product_variants
          } else {
            //如果不合并 每个变种都只有单个变种信息
            newVariant.product_variants = [variant]
          }
          formattedData.push(newVariant);
        });
      });
      return formattedData
    },
    getProductList (queryParam = {}) {
      queryParam = {
        ...queryParam,
        page_size: this.pageSize,
        cur_page: this.curPage
      }
      this.$ajax({
        url: '/api-prefix/api/product/query-product',
        method: "get",
        params: queryParam = {
          ...queryParam,
          page_size: this.pageSize,
          cur_page: this.curPage
        },
        headers: {
          "Content-Type": 'application/json',
        }
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = utils.deepClone(res.data.result)
          this.getRowCount()
          this.newTableData = this.formatProductData(res.data.result)
          // TODO: Total逻辑还不全对 分裂和合并的数量不正确
          this.total = res.data.total
          this.objectSpanFlag = false
        }
      })
    },
    handleSizeChange (val) {

      this.pageSize = val
      // TODO:这里还没做翻页和调整页面数量的逻辑
    },
    handleCurrentChange (val) {
      this.curPage = val
      // TODO:这里还没做翻页和调整页面数量的逻辑
    },
    // 标记需要合并的行
    getRowCount () {
      this.tableData.forEach((el, index) => {
        el.rowspan = el.product_variants.length
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (!this.objectSpanFlag) {
        return
      }
      if (columnIndex === 0 || column.property === 'operate' || column.property === 'main_image_url' || column.property === 'chinese_name' || column.property === 'english_name' || column.property === 'category' || column.property === 'create_time') {
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
    remoteQueryMethod (query) {
      // 用来远程获取数据
      if (query !== '') {
        this.remoteLoading = true;
        const queryParam = {
          [this.queryData.queryKeyWord]: query,
        }
        this.$ajax({
          url: '/api-prefix/api/product/query-product-element',
          method: "get",
          params: queryParam,
          headers: {
            "Content-Type": 'application/json',
          }
        }).then(res => {
          if (this.$isRequestSuccessful(res.code)) {
            this.remoteLoading = false;
            if (res.data[this.queryData.queryKeyWord]) {
              // 保存查询的结果
              this.remoteQueryResult = res.data[this.queryData.queryKeyWord]
              this.remoteQueryOptions = this.remoteQueryResult.map(item => {
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
        this.remoteQueryOptions = [];
      }
    },
    queryProduct () {
      const queryParam = {
      }
      // --------------组装查询参数------------
      //组装日期查询
      if (this.queryData.date.length > 0) {
        queryParam['start_date'] = this.queryData.date[0]
        queryParam['end_date'] = this.queryData.date[1]
      }
      // 组装查询关键字的key value 如果在远程查询结果中存在需要查询的keyword
      if (this.remoteQueryResult.length > 0) {
        if (this.remoteQueryResult.some(value => value === this.queryData.remoteQuerySelect)) {
          queryParam[this.queryData.queryKeyWord] = this.queryData.remoteQuerySelect
        } else {
          queryParam[this.queryData.queryKeyWord + '_reg'] = this.queryData.remoteQuerySelect
        }
      }
      else {
        queryParam[this.queryData.queryKeyWord] = this.queryData.remoteQuerySelect
      }
      this.getProductList(queryParam)
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

  },

  mounted () {
    this.getProductList()
  },
  computed: {
    //计算queryKeyWord的value值
    queryKeyWordValue () {
      return this.fieldOptions.find(item => item.value === this.queryData.queryKeyWord).label[this.$languageType]
    }
  }
}
</script>
