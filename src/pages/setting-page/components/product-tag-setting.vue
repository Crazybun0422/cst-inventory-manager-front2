<!--
* @description  参数1
* @fileName  product-tag-setting
* @author wjp
* @date 2023-12-05 20:42:09
!-->
<template>
  <div id="product-tag-setting" class="product-tag-setting" v-loading="loading">
    <PageHead :title="$t('message.myAccount.productLabelSetting')">
      <template slot="head-right">
        <el-button type="primary" icon="el-icon-plus" @click="showModal(null)">
          {{ $t('common.add') }}
        </el-button>
      </template>
    </PageHead>
    <SearchCard>
      <el-form
        :model="searchForm"
        ref="searchForm"
        label-width="140px"
        label-position="top"
        :inline="true"
      >
        <!-- <el-form-item >
          <el-input
            v-model="searchForm.queryValue"
            placeholder="请输入关键字"
          ></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-input
            v-model="searchForm.queryValue"
            :placeholder="$t('message.myAccount.productLabelEnter')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="queryProductTag">{{
            $t('common.search')
          }}</el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead
      ><template slot="top-right">
        <el-button
          type="danger"
          @click="deleteProductTag"
          :disabled="!hasSelection"
          >{{ $t('common.deleteInBulk') }}</el-button
        >
      </template></CstTableHead
    >
    <el-table
      :data="tableData"
      style="width: 100%"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column
        prop="config_name"
        :label="$t('message.myAccount.config_name')"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="width_cm"
        :label="$t('message.myAccount.width_cm')"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="height_cm"
        :label="$t('message.myAccount.height_cm')"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="img_type"
        :label="$t('message.myAccount.img_type')"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.img_type ? $t('common.qrCode') : $t('common.barcode') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="is_center"
        :label="$t('message.myAccount.is_center')"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.is_center ? $t('common.yes') : $t('common.no') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="has_english_title"
        :label="$t('message.myAccount.has_english_title')"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.has_english_title ? $t('common.yes') : $t('common.no') }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="left"
        :label="$t('common.operation')"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">{{
            $t('common.check')
          }}</el-button>
          <el-button
            type="text"
            size="small"
            @click="editProductTagDialog(scope.row)"
            >{{ $t('common.edit') }}</el-button
          >

          <el-popconfirm
            :title="$t('message.myAccount.confirmDeleteContact')"
            @confirm="handleDelProductTag(scope.row)"
          >
            <span slot="reference">
              <el-button
                icon="el-icon-delete"
                type="text"
                style="margin-left: 10px"
              >
                {{ $t('common.delete') }}
              </el-button>
            </span>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="curPage"
        :page-sizes="[10, 50, 100]"
        :page-size="pageSize"
        layout="total,sizes, prev, pager, next"
        :total="total"
        background
      >
      </el-pagination>
    </el-row>
    <!-- 新增和编辑表单 -->

    <ProductTagDialog
      :visible.sync="productTagVisible"
      :currentData="currentData"
      :submitType="submitType"
      @close="closeProductTagDialog"
      @ok="submitProductTagDialog"
    >
    </ProductTagDialog>
    <ProductTagDetail
      :currentData="currentData"
      :visible="productTagDrawerVisible"
      @close="closeProductTagDetail"
    ></ProductTagDetail>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import ProductTagDialog from '@/pages/setting-page/components/product-tag-dialog.vue'
import ProductTagDetail from '@/pages/setting-page/components/product-tag-detail.vue'
import { contactFieldSelectMap, contactTypeMap } from '@/common/field-maping'
export default {
  name: 'product-tag-setting',
  props: {
  },
  components: {
    ProductTagDialog,
    SearchCard,
    PageHead,
    CstTableHead,
    ProductTagDetail

  },
  data () {
    return {
      loading: false,
      formLoading: false,
      total: 0,
      providerOptions: [],
      remoteLoading: false,
      popoverVisible: false,
      productTagDrawerVisible: false,
      submitType: 'add',
      formLabelWidth: '130px',
      currentData: {},
      productTagVisible: false,
      contactFieldSelectMap: contactFieldSelectMap,
      contactTypeMap: contactTypeMap,
      searchForm: {

      },
      curPage: 1,
      pageSize: 10,
      tableData: [],
      multipleSelection: []
    }
  },

  methods: {
    deleteProductTag () {
      let format_ids = this.multipleSelection.map(item => item.format_id)
      if (format_ids && format_ids.length === 0) {
        this.$message({
          message: this.$t('common.selectDeleteData'),
          type: 'warning'
        });
        return
      }
      this.delProductTag(format_ids)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    queryProductTag () {
      this.loading = true
      let queryParams = {
        // provider的userRelatedId就是provider_uuid

        page_num: this.curPage,
        page_size: this.pageSize,
      }
      let provider_uuid = localStorage.getItem('shop_provider_uuid');
      if (!provider_uuid) {
        this.$message.error(this.$t('message.myAccount.noShop'));
        this.$router.push({ name: 'p-login' })
      }
      queryParams['provider_uuid'] = provider_uuid;
      if (this.searchForm.queryValue) {
        queryParams.config_name = this.searchForm.queryValue
      }
      this.$ajax({
        method: 'get',
        url: '/api-prefix/api/customer-settings/print-label-info-list',
        params: queryParams,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.results
          this.total = res.data.total
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        console.error(error);
      }).finally(() => {
        this.loading = false
      })
    },
    closeProductTagDialog () {
      this.productTagVisible = false
    },
    closeProductTagDetail () {
      this.productTagDrawerVisible = false
    },
    editProductTagDialog (row) {
      this.productTagVisible = true
      // this.currentData = row
      this.submitType = 'edit'
      this.currentData = row
    },
    handleDelProductTag (row) {
      let format_ids = [row.format_id]
      this.delProductTag(format_ids)
    },
    delProductTag (format_ids) {

      this.$ajax({
        method: 'delete',
        url: '/api-prefix/api/customer-settings/print-label-info',
        roleType: this.roleType,
        data: {
          format_ids: format_ids,
        }
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message({
            message: this.$t('common.deleteSuccessful'),
            type: 'success'
          })
          this.queryProductTag()
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }

      })
    },
    submitProductTagDialog () {
      this.productTagVisible = false
      this.queryProductTag()
    },
    showModal (row) {
      this.productTagVisible = true
      this.submitType = 'add'
    },
    handleSizeChange (val) {
      this.pageSize = val
      // TODO:这里还没做翻页和调整页面数量的逻辑
      this.queryProductTag()
    },
    handleCurrentChange (val) {
      this.curPage = val
      // TODO:这里还没做翻页和调整页面数量的逻辑
      this.queryProductTag()
    },
    handleClick (row) {
      this.currentData = row
      this.productTagDrawerVisible = true
    },
  },
  computed: {
    hasSelection () {
      return this.multipleSelection.length > 0
    },

  },
  mounted () {
    this.queryProductTag()
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
::v-deep .ContactsForm .el-input__inner {
  width: 350px;
  /* 居中显示 */
}
</style>