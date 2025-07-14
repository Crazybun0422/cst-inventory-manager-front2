<template>
  <div class="p-user-info">
    <!-- 头部 -->
    <pageHead :title="$t('navigate.storeSettings')" />

    <!-- 表格头部操作栏 -->
    <CstTableHead>
      <template slot="top-left"> </template>
    </CstTableHead>

    <!-- 表格 -->
    <el-table
      height="460"
      :data="tableData"
      v-loading="loading"
      @selection-change="$_tableMixin_handleSectionChange"
    >
      <el-table-column :label="$t('common.operation')" width="80">
        <template slot-scope="{ row }">
          <a @click="edit(row)">{{ $t('common.edit') }}</a>
        </template>
      </el-table-column>
      <el-table-column type="index" :label="$t('common.number')" width="80">
      </el-table-column>
      <el-table-column
        prop="ewis_shop_url"
        :label="$t('message.userInfo.shopURL')"
        min-width="150"
      ></el-table-column>

      <el-table-column
        prop="ewis_user_code"
        :label="$t('message.userInfo.userCode')"
      ></el-table-column>

      <el-table-column
        prop="ewis_user_name"
        :label="$t('message.userInfo.userName')"
      ></el-table-column>
    </el-table>

    <!-- 编辑用户信息弹窗 -->
    <el-dialog
      :title="$t('message.userInfo.editUserInfo')"
      width="50%"
      :visible.sync="dialogVisible"
    >
      <EditModal
        ref="editModal"
        v-loading="dialogLoading"
        :form-data="rowData"
        :shop_url="rowData.ewis_shop_url"
      />

      <!-- 底部操作栏 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" :disabled="dialogLoading">{{
          $t('common.cancel')
        }}</el-button>
        <el-button type="primary" @click="submit" :disabled="dialogLoading">{{
          $t('common.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * @file 用户信息
 * @date 2024/03/24
 */

// 组件
import PageHead from '@/components/page-head.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'

// mixins
import tableMixin from '@/common/table-mixin'

// 函数

// 常量
export default {
  name: 'p-user-info',
  components: {
    PageHead,
    CstTableHead,

    EditModal: () =>
      import(/* webpackChunkName: 'EditModal' */ './modal/edit-modal.vue')
  },
  mixins: [tableMixin],
  props: {},
  data () {
    return {
      loading: false,
      tableData: [],
      dialogVisible: false,
      rowData: {},
      dialogLoading: false
    }
  },
  computed: {},
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      let vm = this
      vm.loading = true

      vm.$ajax({
        url: '/api/shop-manager/enum',
        roleType: vm.roleType,
        method: 'get',
        params: {}
      })
        .then(({ data = [] }) => {
          vm.tableData = data
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          vm.loading = false
        })
    },
    edit (row) {
      this.rowData = { ...row }
      this.dialogVisible = true
    },
    async submit () {
      let vm = this
      let isValid = await vm.$refs.editModal?.$_formMixin_isValid?.()

      if (!isValid) {
        return
      }

      vm.dialogLoading = true
      let submitData = vm.$refs.editModal?.getData?.()

      vm.$ajax({
        url: `/api/shop-manager/modify-user-info?shop_url=${vm.rowData.ewis_shop_url}`,
        method: 'put',
        roleType: vm.roleType,
        data: {
          ...submitData
        }
      })
        .then(() => {
          vm.rowData = {}
          vm.dialogVisible = false
          vm.getTableData()
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          vm.dialogLoading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.p-user-info {
  .el-divider--vertical {
    vertical-align: -webkit-baseline-middle;
  }
}
</style>
