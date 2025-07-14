<!--
* @description  参数1
* @fileName  warehousingForm
* @author wjp
* @date 2023-06-01 21:35:50
!-->
<template>
  <div id="warehousingForm" class="warehousingForm">
    <el-dialog
      :title="
        operationType === 'add'
          ? $t('message.storage.createAStore')
          : $t('message.storage.editStore')
      "
      :visible.sync="warehousingFormVisible"
      :close-on-click-modal="false"
      width="800px"
      @close="handlerClose"
      class="global-modal-class"
    >
      <div v-loading="addWarehousingLoading">
        <el-form
          :model="warehousingForm"
          ref="addwarehousingForm"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item :label="$t('message.storage.name')" prop="name">
            <el-input
              clearable
              v-model.trim="warehousingForm.name"
              :placeholder="$t('message.storage.pleaseEnterWarehouse')"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('message.storage.inventory')"
            prop="ava_inventory"
          >
            <el-input-number
              style="width: 50%"
              clearable
              v-model="warehousingForm.ava_inventory"
              :placeholder="$t('message.storage.pleaseEnterInventory')"
              :step-strictly="true"
              :step="1"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            :label="$t('message.storage.warehousingCode')"
            prop="code"
          >
            <el-input
              clearable
              v-model.trim="warehousingForm.code"
              :placeholder="$t('message.storage.pleaseEnterWarehouseCode')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.storage.location')" prop="location">
            <el-input
              clearable
              v-model.trim="warehousingForm.location"
              :placeholder="$t('message.storage.pleaseLocation')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handlerClose" size="medium">{{
            $t('common.cancel')
          }}</el-button>
          <el-button type="primary" @click="onSubmit" size="medium">{{
            operationType === 'add'
              ? $t('message.storage.createAStore')
              : $t('message.storage.editStore')
          }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStorageDefinition } from '@/common/common-func'
export default {
  name: 'warehousingForm',
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    provider_uuid: { type: String }
  },
  data () {
    return {
      operationType: 'add',
      addWarehousingLoading: false,
      warehousingForm: {
        name: '',
        code: '',
        location: '',
        ava_inventory: ''
      },
      warehousingFormVisible: false,
      rules: {
        name: [
          {
            required: true,
            message: this.$t('message.storage.pleaseEnterWarehouse'),
            trigger: ['blur', 'change']
          }
        ],
        ava_inventory: [
          {
            required: true,
            message: this.$t('message.storage.pleaseEnterInventory'),
            trigger: ['blur', 'change']
          }
        ],
        code: [
          {
            required: true,
            message: this.$t('message.storage.pleaseEnterWarehouseCode'),
            trigger: ['blur', 'change']
          }
        ],
        location: [
          {
            required: true,
            message: this.$t('message.storage.pleaseLocation'),
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  components: {},
  methods: {
    onSubmit () {
      this.$refs.addwarehousingForm.validate((valid) => {
        if (valid) {
          if (this.operationType === 'add') {
            this.addWarehousing()
          } else {
            this.editWarehousing()
          }
        } else {
          return false
        }
      })
    },
    addWarehousing () {
      // 新增仓储
      // provider_uuid 后续需要从localstorage获取
      // const provider_uuid = "f0a30bfa-08b9-4955-9789-35f270b2ec13"
      const requestData = {
        ...this.warehousingForm,
        provider_uuid: this.provider_uuid
      }
      this.addWarehousingLoading = true
      this.$ajax({
        url: '/api-prefix/api/storage/create-storage-definition',
        method: 'POST',
        data: requestData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(async (res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.addWarehousingLoading = false
            this.warehousingFormVisible = false
            // 清空内容
            this.warehousingForm = {
              name: '',
              code: '',
              location: '',
              ava_inventory: ''
            }
            this.$message.success(
              this.$t('message.storage.addWarehousingSuccess')
            )
            // 成功了需要 get更新仓储数据
            await this.getWarehousing()
          } else if (res.code === 6005) {
            // 6005 代表重复了
            //数据格式 res.data => [{location:'dsadsa'},{name:"sdsadsa"},{code:'sddadsa'}]
            const repeatKeys = res.data.map((obj) => Object.keys(obj))
            const repeatMsg = repeatKeys
              .map((key) => this.$t(`message.storage.${key}`))
              .join(',')
            this.$message.error(`${repeatMsg} is duplicated.`)
            this.addWarehousingLoading = false
          }
        })
        .catch((error) => {
          this.addWarehousingLoading = false
          console.error(error)
        })
    },
    editWarehousing () {
      const requestData = { ...this.warehousingForm }
      this.addWarehousingLoading = true
      this.$ajax({
        url: '/api-prefix/api/storage/modify-storage-definition',
        method: 'POST',
        data: requestData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(async (res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.addWarehousingLoading = false
            this.warehousingFormVisible = false
            // 清空内容
            this.warehousingForm = {
              name: '',
              code: '',
              location: '',
              ava_inventory: ''
            }
            this.$message.success(
              this.$t('message.storage.addWarehousingSuccess')
            )
            // 成功了需要 get更新仓储数据
            await this.getWarehousing()
          } else if (res.code === 6005) {
            // 6005 代表重复了
            //数据格式 res.data => [{location:'dsadsa'},{name:"sdsadsa"},{code:'sddadsa'}]
            const repeatKeys = res.data.map((obj) => Object.keys(obj))
            const repeatMsg = repeatKeys
              .map((key) => this.$t(`message.storage.${key}`))
              .join(',')
            this.$message.error(`${repeatMsg} is duplicated.`)
            this.addWarehousingLoading = false
          }
        })
        .catch((error) => {
          this.addWarehousingLoading = false
          console.error(error)
        })
    },
    handlerClose () {
      // 新增和编辑共用表单 需要清空校验
      this.warehousingForm = Object.assign({}, undefined)
      this.$refs.addwarehousingForm.resetFields()
      this.$emit('close')
    },
    async getWarehousing () {
      try {
        const res = await getStorageDefinition(this.provider_uuid)
        if (this.$isRequestSuccessful(res.code)) {
          const whDataList = res.data.map((item) => ({
            code: item.code,
            name: item.name,
            location: item.location,
            ava_inventory: item.ava_inventory,
            storage_define_uuid: item.storage_define_uuid
          }))
          // this.warehousingInfoList = whDataList
          this.$emit('getData', whDataList)
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  computed: {},
  mounted () { },
  watch: {
    visible: {
      handler (newValue) {
        this.warehousingFormVisible = newValue
        if (this.currentData.storage_define_uuid) {
          this.operationType = 'edit'
          this.warehousingForm = JSON.parse(JSON.stringify(this.currentData))
        } else {
          this.operationType = 'add'
          this.warehousingForm = {}
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
