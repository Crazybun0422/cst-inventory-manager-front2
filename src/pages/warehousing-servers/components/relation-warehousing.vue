<!--
* @description  关联并创建仓库弹窗
* @fileName  relation-warehousing
* @author wjp
* @date 2023-06-14 22:03:47
!-->
<template>
  <div id="relation-warehousing" class="relation-warehousing">
    <div class="dropShipper-form">
      <el-dialog
        :title="$t('message.storage.associateAndCreateWarehouse')"
        :visible.sync="DsModalVisible"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @closed="handlerClose"
        class="global-modal-class"
      >
        <SelectStoreTable
          ref="SelectStoreTable"
          @addStorageCompleted="addStorageCompleted"
        ></SelectStoreTable>
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
export default {
  name: 'relation-warehousing',
  props: {
    visible: { type: Boolean, default: false }
  },
  watch: {
    visible: {
      handler (newValue) {
        this.DsModalVisible = newValue
        if (newValue) {
          this.$nextTick(() => {
            // 检查 selectStoreTable 是否存在
            if (
              this.$refs.SelectStoreTable &&
              typeof this.$refs.SelectStoreTable.initializeComponent ===
              'function'
            ) {
              this.$refs.SelectStoreTable.initializeComponent()
            } else {
              console.warn(
                'SelectStoreTable 组件或其 initializeComponent 方法不可用'
              )
            }
          })
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      // 弹窗
      DsModalVisible: false,
      currentShopName: ''
    }
  },
  components: {
    SelectStoreTable
  },
  methods: {
    //弹窗
    handlerClose () {
      this.$emit('close')
    },
    onSubmit () {
      this.$refs.SelectStoreTable.$emit('relateStore')
    },
    addStorageCompleted () {
      // 用于恢复状态
      this.$emit('close')
      this.$emit('getData')
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
