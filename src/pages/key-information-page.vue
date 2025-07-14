<!--
* @description  参数1
* @fileName  key-information-page
* @author wjp
* @date 2023-06-14 22:03:47
!-->
<template>
  <div id="key-information-page" class="key-information-page">
    <div class="dropShipper-form" v-show="roleType === config.dropShipper.role">
      <el-dialog
        :title="$t('message.storage.associateAndCreateWarehouse')"
        :visible.sync="DsModalVisible"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @closed="handleDialogClosed"
        class="global-modal-class"
      >
        <SelectStoreTable
          ref="SelectStoreTable"
          @addStorageCompleted="addStorageCompleted"
          @updateAssociatedStorageStatus="updateAssociatedStorageStatus"
        ></SelectStoreTable>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="handlerClose"
            :disabled="relateStoreLoading"
            size="medium"
          >
            {{ $t('common.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="onSubmit"
            :disabled="relateStoreLoading"
            size="medium"
          >
            {{ $t('common.confirm') }}
          </el-button>
          <el-button
            icon="el-icon-s-home"
            v-if="this.hasAssociatedStorage"
            size="medium"
            type="success"
            @click="toHome"
            :disabled="relateStoreLoading"
            >{{ $t('common.toHome') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
    <div class="provider-form" v-show="config.pRoleList.includes(roleType)">
      <el-dialog
        :title="$t('message.storage.createAStore')"
        :visible.sync="ProModalVisible"
        width="800px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @closed="handleDialogClosed"
        class="global-modal-class"
      >
        <AddStore ref="AddStore"></AddStore>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handlerClose" size="medium">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="onSubmit" size="medium">
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import SelectStoreTable from '@/pages/components/select-store-table.vue'
import AddStore from '@/pages/components/add-store.vue'
import { dsAddStorage, createOrAddProvider } from '@/common/common-func'
import { config } from '@/common/commonconfig.js'
export default {
  name: 'key-information-page',
  props: {},
  data () {
    return {
      // 弹窗
      config,
      ProModalVisible: false,
      DsModalVisible: false,
      currentShopName: '',
      hasAssociatedStorage: false,
      relateStoreLoading: false
    }
  },
  components: {
    SelectStoreTable,
    AddStore
  },
  computed: {
    homePath () {
      return this.config[this.roleType].homePath
    }
  },
  methods: {
    dsAddStorage,
    createOrAddProvider,
    addStorageCompleted () {
      this.relateStoreLoading = false
    },
    toHome () {
      this.$router.push(this.config[this.roleType].homePath)
    },
    //弹窗
    updateAssociatedStorageStatus (status) {
      this.hasAssociatedStorage = status
    },
    handlerClose () {
      this.ProModalVisible = false
      this.DsModalVisible = false
      this.$router.push(this.config[this.roleType].loginPath)
    },
    onSubmit () {
      if (this.roleType === this.config.dropShipper.role) {
        // 触发组件的关联函数
        this.relateStoreLoading = true
        this.$refs.SelectStoreTable.$emit('relateStore')
      } else if (this.config.pRoleList.includes(this.roleType)) {
        // 当角色为Provider时进入这里的逻辑
        this.$refs.AddStore.$refs.form.validate((valid) => {
          if (valid) {
            const storeData = this.$refs.AddStore.formLabelAlign
            this.addProviderShop(storeData)
          }
        })
      }
    },
    // 添加更新仓储
    addStorage (storageData) {
      this.dsAddStorage(storageData)
        .then((res) => {
          this.DsModalVisible = false
          this.$router.push(this.homePath)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    relateProvider (queryData, selectData) {
      // TODO: 此方法在 relation-warehousing.vue 重复使用  可以优化
      // 获取门店是否已关联的标记
      let provideIsCreate = this.$refs.SelectStoreTable.provideIsCreate
      if (!provideIsCreate) {
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
          .catch((error) => { })
      } else {
        // 如果已标记则直接新增
        const reqObj = this.formatAddStorageInfo(selectData)
        this.addStorage(reqObj)
      }
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
    addProviderShop (storeData) {
      const mapFromData = new FormData()
      mapFromData.append('name_of_provider', storeData.name_of_provider)
      mapFromData.append('logo_of_provider', storeData.logo_of_provider)
      this.createOrAddProvider(mapFromData)
        .then((res) => {
          //  创建门店
          // 关联成功后再创建
          // 跳转到首页
          this.ProModalVisible = false
          this.$router.replace(this.homePath)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    handleDialogClosed () {
      // 在这里执行对话框关闭后的逻辑
      this.ProModalVisible = false
      this.DsModalVisible = false
      this.$router.push(this.config[this.roleType].loginPath)
    }
  },
  mounted () {
    if (this.config.pRoleList.includes(this.roleType)) {
      this.ProModalVisible = true
    } else if (this.roleType === this.config.dropShipper.role) {
      this.DsModalVisible = true
      // 触发关联仓储组件的初始化
      this.$nextTick(() => {
        // 检查 selectStoreTable 是否存在
        if (
          this.$refs.SelectStoreTable &&
          typeof this.$refs.SelectStoreTable.initializeComponent === 'function'
        ) {
          this.$refs.SelectStoreTable.initializeComponent()
        } else {
          console.warn(
            'SelectStoreTable 组件或其 initializeComponent 方法不可用'
          )
        }
      })
    } else {
      this.toHome()
    }
  }
}
</script>
<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}
::v-deep .el-dialog__body {
  min-height: 180px;
  padding: 30px 20px 0;
}
</style>
