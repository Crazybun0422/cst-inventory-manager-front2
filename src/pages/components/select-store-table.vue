<!--
* @Description: 选择门店table弹窗
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div>
    <el-form
      ref="form"
      :model="queryData"
      label-width="120px"
      :rules="rules"
      v-loading="loading"
    >
      <el-form-item :label="$t('message.signUp.provider')" prop="storage_name">
        <el-select
          style="width: 70%"
          v-model="queryData.storage_name"
          filterable
          remote
          clearable
          reserve-keyword
          :placeholder="$t('message.storage.namePlaceholder')"
          :remote-method="remoteMethod"
          :loading="searchLoading"
          @change="onChange"
          @clear="setEmpty"
        >
          <el-option
            v-for="item in options"
            :key="item.uuid"
            :label="item.name_of_provider"
            :value="item.name_of_provider"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="选择仓储定义" v-if="queryData.provider_uuid">
      </el-form-item> -->
      <div class="table-class">
        <div>{{ $t('message.storage.warehouse') }}</div>
        <el-divider></el-divider>
        <el-table
          ref="multipleTable"
          :data="storageList"
          max-height="300px"
          style="width: 100%; margin-bottom: 20px"
          row-key="storage_define_uuid"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @selection-change="selectionChange"
          :class="{ 'disable-select-all': !isAnySelectable }"
          highlight-current-row
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="onSelectable"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('message.storage.name')"
            width="120"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="location"
            align="center"
            :label="$t('common.address')"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="ava_inventory"
            :label="$t('message.storage.inventory')"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tag
                :type="tableRowtag(scope.row)"
                disable-transitions
                class="status-tag"
                >{{ scope.row.ava_inventory }}</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  </div>
</template>
<script>
import storageMixin from '@/common/storage/storage-mixin'
import {
  getStoreDetail,
  getWarehouseRelatedInfo,
  queryProviderList,
  loadHomeData,
  createOrAddProvider
} from '@/common/common-func'
export default {
  props: {},
  components: {},
  mixins: [storageMixin],
  data () {
    return {
      existStorageList: [],
      queryData: {
        storage_name: ''
      },
      tableData: [],
      selectData: [],
      orginOptions: [],
      options: [],
      storageList: [],
      loading: false,
      searchLoading: false,
      currentShopName: '',
      rules: {
        storage_name: [
          {
            required: true,
            message: this.$t('message.signUp.providerSelect'),
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    loadHomeData,
    getStoreDetail,
    queryProviderList,
    createOrAddProvider,
    getWarehouseRelatedInfo,
    checkboxClass () {
      return {
        'hide-checkbox': this.isSingleChoice,
        'global-modal-class': true
      }
    },
    tableRowtag (row) {
      // 根据库存显示不同颜色
      if (row.ava_inventory >= 1000 && row.ava_inventory < 5000) {
        return 'warning'
      } else if (row.ava_inventory > 5000) {
        return 'success'
      }
      return 'danger'
    },
    selectionChange (rows) {
      this.selectData = rows
    },
    onSelectable (row, index) {
      if (this.existStorageList.includes(row.storage_define_uuid)) {
        return false
      }
      if (row.children && row.children.length !== 0) {
        return false
      } else {
        return true
      }
    },
    setEmpty () {
      this.storageList = []
    },
    remoteMethod (value) {
      // 通过搜索框搜索门店名称
      this.searchLoading = true
      if (!value) {
        this.options = this.orginOptions
        this.searchLoading = false
        return
      }
      const queryParams = {
        name_of_provider_reg: value
      }
      this.queryProviderList(queryParams)
        .then((res) => {
          const arr = []
          if (res.data && res.data.length !== 0) {
            res.data.forEach((el) => {
              const obj = {
                name_of_provider: el
              }
              arr.push(obj)
            })
          }
          this.options = arr
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.searchLoading = false
        })
    },
    onChange (name_of_provider) {
      this.currentShopName = name_of_provider
      if (!name_of_provider) {
        return
      }
      this.getStorageDetailAndList(name_of_provider)
    },
    formatStorageList (data) {
      return data.map((item) => {
        return {
          ...item,
          children: item.children ? this.formatStorageList(item.children) : []
        }
      })
    },
    getStorageDetailAndList (name_of_provider) {
      this.loading = true
      this.getStoreDetail(name_of_provider)
        .then(async (res) => {
          if (this.$isRequestSuccessful(res.code)) {
            //  这里获取门店的仓储定义
            const provider_uuid = res.data[0].provider_uuid
            // 获取仓储定义列表展示到 表格
            await this.getAllStorageDefinitionListByPId(provider_uuid)
            this.$set(this.queryData, 'provider_uuid', provider_uuid)
          }
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleHomeData () {
      this.loading = true
      this.loadHomeData()
        .then((resData) => {
          let topProviders = resData.top_providers
          // 调用 getWarehouseRelatedInfo 并处理数据
          this.getWarehouseRelatedInfo()
            .then((warehouseInfo) => {
              if (warehouseInfo && warehouseInfo.length > 0) {
                const formattedWarehouseInfo = warehouseInfo.map((item) => ({
                  name_of_provider: item.name,
                  uuid: item.provider_uuid
                }))
                topProviders = [...formattedWarehouseInfo, ...topProviders]
              }
            })
            .catch((error) => {
              console.error(error)
            })
          this.orginOptions = topProviders
          this.options = topProviders
          if (topProviders.length > 0) {
            this.queryData.storage_name = topProviders[0].name_of_provider
            this.currentShopName = topProviders[0].name_of_provider
            this.getStorageDetailAndList(topProviders[0].name_of_provider)
          }
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    async getAllStorageDefinitionListByPId (provider_uuid) {
      try {
        this.loading = true
        const resData = await this.getStorageDefinitionList(provider_uuid)
        if (Array.isArray(resData) && resData.length > 0) {
          this.storageList = resData
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async querymStorage () {
      // 查询的是已关联的仓库
      const resData = await this.getAssociatedStorageList()
      if (Array.isArray(resData)) {
        this.existStorageList = resData.map((item) => item.storage_uuid)
        // 通知父组件 已关联的仓库状态更新
        this.$emit(
          'updateAssociatedStorageStatus',
          this.existStorageList.length > 0
        )
      }
    },
    relateStore () {
      const selectData = this.selectData
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!selectData || selectData.length === 0) {
            this.$message.warning(
              this.$t('message.storage.createStoreErrorInfo')
            )
            // 未选择时也恢复loading状态
            this.$emit('addStorageCompleted')
            return
          }
          const queryData = this.queryData
          this.currentShopName = queryData.storage_name
          this.relateProvider(queryData, selectData)
        } else {
          // 未过校验时恢复loading状态
          this.$emit('addStorageCompleted')
        }
      })
    },
    relateProvider (queryData, selectData) {
      this.loading = true
      const uuid_of_provider = queryData.provider_uuid
      this.createOrAddProvider({ uuid_of_provider })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code) || res.code === 4004) {
            const newSelectData = selectData.filter(
              (item) =>
                !this.existStorageList.includes(item.storage_define_uuid)
            )
            const reqObj = this.formatAddStorageInfo(newSelectData)
            return this.addStorage(reqObj)
          }
        })
        .catch((error) => {
          console.error('Error in relateProvider:', error)
        })
        .finally(() => {
          this.loading = false
          this.$emit('addStorageCompleted')
        })
    },
    async addStorage (storageData) {
      return await this.dsAddStorageAndReflashStorageList(storageData)
        .then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('common.operationSuccessful')
          })
          this.selectData = []
          return this.querymStorage()
        })
        .catch((error) => {
          console.error('Error in addStorage:', error)
        })
    },
    formatAddStorageInfo (selectData) {
      return {
        storages: selectData.map((item) => ({
          storage_uuid: item.storage_define_uuid,
          ava_number: parseInt(item.ava_inventory),
          name: `${this.currentShopName} (${item.name})`
        }))
      }
    },
    async initializeComponent () {
      this.handleHomeData()
      await this.querymStorage()
    }
  },
  computed: {
    isAnySelectable () {
      return this.storageList.some(
        (row) => !this.existStorageList.includes(row.storage_define_uuid)
      )
    },
    // 标记这个门店是否已经关联过（如果已经关联过则有仓储不可选）
    provideIsCreate () {
      for (let i = 0; i < this.storageList.length; i++) {
        if (
          this.existStorageList.includes(
            this.storageList[i].storage_define_uuid
          )
        ) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    isAnySelectable (value) {
      if (!value) {
        this.$refs.multipleTable.clearSelection()
      }
    }
  },
  mounted () {
    this.$on('relateStore', this.relateStore) // 监听事件并调用方法
  }
}
</script>
<style lang="scss" scoped>
.table-class {
  ::v-deep .el-divider--horizontal {
    margin: 10px 0;
  }
}
.disable-select-all ::v-deep .el-table__header-wrapper .el-checkbox__inner,
.disable-select-all
  ::v-deep
  .el-checkbox__input.is-disabled
  .el-checkbox__inner {
  background-color: #f5f7fa;
  border-color: #dcdfe6;

  cursor: not-allowed;
}
</style>
