<template>
  <div class="p-product-info">
    <!-- 头部 -->
    <pageHead :title="$t('navigate.productInfo')" :is-show-shop-select="true" :is-show-sync-products="true"
      :is-show-sync-order="false" @refresh="refresh" />
    <!-- 搜索栏 -->
    <SearchCard>
      <el-form inline :model="submitData">
        <el-form-item>
          <el-select v-model="submitData.queryKeyWord" :placeholder="$t('common.pleaseSelect')">
            <el-option v-for="item in storeManagementFieldSelectMap" :key="item.value"
              :label="item.label[$languageType]" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="submitData.queryValue" :placeholder="$t('common.pleaseInput')" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="refresh" :disabled="loading">{{ $t('common.search')
          }}</el-button>
        </el-form-item>
      </el-form>
    </SearchCard>

    <!-- 表格 -->
    <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="index" :label="$t('common.number')" width="80">
      </el-table-column> -->
      <!-- <el-table-column align="center" type="selection" width="55"> -->
      <!-- </el-table-column> -->

      <el-table-column :label="$t('message.productInfo.image')" width="80">
        <template v-if="row.firstImage && row.firstImage.url" slot-scope="{ row }">
          <AuthImg :src="row.firstImage.url" :styleInfo="'width:50px;height:50px;'"></AuthImg>
        </template>
      </el-table-column>
      <el-table-column prop="title" class="break-word" :label="$t('message.orderInfo.title')"
        min-width="150"></el-table-column>

      <el-table-column prop="sku" :label="$t('message.productInfo.firstSku')">
        <template slot-scope="{ row }">
          {{ row.firstEdge.sku }}
        </template>
      </el-table-column>

      <el-table-column prop="price" :label="$t('message.productInfo.price')" width="80">
        <template slot-scope="{ row }">
          {{ row.firstEdge.price }}
        </template>
      </el-table-column>

      <el-table-column prop="weight" :label="$t('message.productInfo.weight')" width="80">
        <template slot-scope="{ row }">
          {{ row.firstEdge.weight }}
        </template>
      </el-table-column>

      <el-table-column prop="tags" :label="$t('message.productInfo.tags')" :formatter="formatTags"></el-table-column>

      <el-table-column :label="$t('common.operation')">
        <template slot-scope="{ row }">
          <a @click="showDetailDrawer(row)">{{
            $t('message.productInfo.editProductDetail')
          }}</a>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="end" align="bottom">
      <el-col :span="24" :offset="24">
        <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50]"
          @size-change="sizeChange" layout="sizes, slot">
          <!--上一页 -->
          <el-button icon="el-icon-arrow-left" :disabled="!hasPrevPage" @click="$_tableMixin_prevChange"></el-button>

          <!-- 下一页 -->
          <el-button icon="el-icon-arrow-right" :disabled="!hasNextPage" @click="$_tableMixin_nextChange"></el-button>
        </el-pagination>
      </el-col>
    </el-row>

    <!-- 编辑产品详情 -->
    <el-drawer v-if="isShowDetailDrawer" size="50%" :title="$t('message.productInfo.editProductDetail')"
      :visible.sync="isShowDetailDrawer">
      <PProductInfoDetail :row-data="rowData" />

      <!-- 底部操作栏 -->
      <div class="drawer-footer">
        <el-button type="primary" disabled @click="submitForm">{{
          $t('common.save')
        }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
/**
 * @file 产品信息
 * @date 2024/03/23
 */

// 组件
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
// mixins
import tableMixin from '@/common/table-mixin'

// 函数

// 常量
import { DIRECTION } from '@/common/field-maping'
import { removeEmptyStringValues } from '@/common/common-func'
import { storeManagementFieldSelectMap } from '@/common/field-maping'
import AuthImg from '@/components/auth-img.vue'
export default {
  name: 'p-product-info',
  components: {
    PageHead,
    SearchCard,
    PProductInfoDetail: () =>
      import(/* webpackChunkName: 'PProductInfoDetail' */ './detail.vue')
  },
  components: {

    AuthImg,
  },
  mixins: [tableMixin],
  props: {},
  data() {
    return {
      storeManagementFieldSelectMap,
      loading: false,
      tableData: [],
      startCursor: 'null',
      endCursor: 'null',
      isShowDetailDrawer: false,
      rowData: {},
      multipleSelection: [],
      submitData: {
        queryKeyWord: storeManagementFieldSelectMap[0].value,
        queryValue: ''
      }
    }
  },
  computed: {
    shopifyShopUrl() {
      return this.$store.getters.shopifyShopUrl
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    refresh() {
      this.startCursor = null
      this.endCursor = null
      this.getTableData()
    },
    getTableData() {
      let vm = this
      if (!vm.shopifyShopUrl) {
        return
      }
      vm.loading = true

      const queryParams = removeEmptyStringValues({
        shop_url: vm.shopifyShopUrl,
        page_size: vm.pageSize,
        cursor:
          vm.direction === DIRECTION.after ? vm.endCursor : vm.startCursor,
        direction: vm.direction
      })
      if (
        vm.submitData.queryValue !== '' &&
        vm.submitData.queryValue !== undefined
      ) {
        queryParams[vm.submitData.queryKeyWord] = vm.submitData.queryValue
      }
      vm.$ajax({
        url: '/api/shop-manager/products',
        method: 'get',
        roleType: vm.roleType,
        params: queryParams
      })
        .then(({ data = {} }) => {
          let tableData = data.products ?? []

          vm.tableData = tableData.map((row) => {
            return {
              ...row,
              firstEdge: row.variants?.edges?.length
                ? row.variants.edges[0].node
                : null, // 第一条数据的SKU、价格、重量
              firstImage: row.images?.edges?.length
                ? row.images.edges[0].node
                : null // 第一条数据的图片
            }
          })

          vm.startCursor = data.pageInfo.hasPreviousPage
            ? data.pageInfo.startCursor
            : 'null'
          vm.endCursor = data.pageInfo.hasNextPage
            ? data.pageInfo.endCursor
            : 'null'

          // hasPreviousPage为false时禁用上一页，hasNextPage为false时禁用下一页
          vm.hasPrevPage = data.pageInfo.hasPreviousPage
          vm.hasNextPage = data.pageInfo.hasNextPage
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          vm.loading = false
        })
    },
    showDetailDrawer(row) {
      this.rowData = row
      this.isShowDetailDrawer = true
    },
    sizeChange(pageSize) {
      this.startCursor = 'null'
      this.endCursor = 'null'
      this.$_tableMixin_sizeChange(pageSize)
    },
    submitForm(formName) {
      // 提交表单逻辑，例如向后端发送更新请求
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 发送更新请求
        } else {
          return false
        }
      })
    },
    formatTags(row) {
      return row.tags.join(', ')
    }
  }
}
</script>

<style scoped lang="scss">
.p-product-info {
  .drawer-footer {
    position: fixed;
    bottom: 0;
    padding: 20px 0;
    width: 46%;
    background: #fff;
    border-top: 1px solid #dcdfe6;
  }
}

::v-deep .el-table .cell {
  word-break: normal;
}
</style>
