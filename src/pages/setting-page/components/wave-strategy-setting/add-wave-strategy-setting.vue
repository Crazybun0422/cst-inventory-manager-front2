<!--
* @description  参数1
* @fileName  add-shelves-setting
* @author wjp
* @date 2024-03-11 22:28:35
!-->
<template>
  <div id="add-shelves-setting" class="add-shelves-setting" v-loading="loading">
    <el-dialog
      :title="operateType === 'add' ? '新增波次' : '编辑波次'"
      :visible="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog"
      width="1000px"
    >
      <el-form :model="form" label-position="top" ref="form" :rules="formRules">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item
              :label="$t('message.storage.warehouse')"
              prop="storage_id"
            >
              <el-select
                clearable
                v-model="form.storage_id"
                @change="selectStorage"
                style="width: 100%"
              >
                <el-option
                  v-for="item in warehousingMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="form.name"
                autocomplete="off"
                placeholder="请输入波次名称"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="执行优先级" prop="execution_priority">
              <el-input-number
                v-model="form.execution_priority"
                autocomplete="off"
                :min="1"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品的起始数量" prop="product_quantity_start">
              <el-input-number
                v-model="form.product_quantity_start"
                :min="1"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品的结束数量" prop="product_quantity_end">
              <el-input-number
                v-model="form.product_quantity_end"
                :min="1"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="产品品种的起始数量"
              prop="product_variety_quantity_start"
            >
              <el-input-number
                v-model="form.product_variety_quantity_start"
                :min="1"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="产品品种的结束数量"
              prop="product_variety_quantity_end"
            >
              <el-input-number
                v-model="form.product_variety_quantity_end"
                :min="1"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="每个波次的订单数量" prop="orders_per_wave">
              <el-input-number
                v-model="form.orders_per_wave"
                :min="1"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item
              label="是否按物流服务分组"
              prop="group_by_logistics_service"
            >
              <el-checkbox v-model="form.group_by_logistics_service"
                >是</el-checkbox
              >
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否按SKU分组" prop="group_by_sku">
              <el-checkbox v-model="form.group_by_sku">是</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="是否生成剩余订单"
              prop="generate_remaining_orders"
            >
              <el-checkbox v-model="form.generate_remaining_orders"
                >是</el-checkbox
              >
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单使用的物流服务" prop="logistics_service">
              <el-select
                popper-class="more-tag-data"
                v-model="form.logistics_service"
                clearable
                filterable
                style="width: 220px"
                @focus="getLogisticsChannels"
                :placeholder="$t('message.myAccount.logisticsChannelsSelect')"
              >
                <el-option
                  v-for="item in logistics_channels"
                  :key="item.channel_code"
                  :label="item.channel_name"
                  :value="item.channel_code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="SKU分组的起始数量"
              prop="sku_group_start_quantity"
            >
              <el-input-number
                v-model="form.sku_group_start_quantity"
                :min="1"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item
              :label="$t('message.productManagement.productBarcode')"
              prop="product_barcode"
            >
              <el-input
                v-model="form.product_barcode"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单关联的国家" prop="country">
              <SelectCountry v-model="form.country"></SelectCountry>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单关联的客户" prop="customer">
              <el-select
                popper-class="more-tag-data"
                v-model="form.customer"
                clearable
                filterable
                style="width: 220px"
                @focus="getcustomers"
                placeholder="请选择关联的客户"
              >
                <el-option
                  v-for="item in customers"
                  :key="item.user_id"
                  :label="item.user_code"
                  :value="item.user_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitData">{{
          $t('common.confirm')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { query_all_logistics_channels, query_all_customers } from '@/common/common-func'
import SelectCountry from '@/pages/components/select-country.vue'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    warehousingMap: {
      type: Array,
      default: () => []
    },
    currentData: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    SelectCountry
  },
  data () {
    return {
      sectionMap: [],
      logistics_channels: [],
      remoteLoading: false,
      customers: [],
      customersRemoteLoading: false,
      loading: false,
      dialogFormVisible: false,
      remoteQuerySize: 1000,
      remoteQueryNum: 1,
      form: {
        storage_id: '',
        name: '',
        execution_priority: '',
        orders_per_wave: '',
        group_by_sku: false,
        sku_group_start_quantity: 0,
        group_by_logistics_service: false,
        generate_remaining_orders: false,
        country: '',
        customer: '',
        logistics_service: '',
        product_barcode: '',
        product_quantity_start: 1,
        product_quantity_end: 1,
        product_variety_quantity_start: 1,
        product_variety_quantity_end: 1

      },
      operateType: 'add',
      formRules: {
        storage_id: [
          { required: true, message: this.$t('message.storage.warehouseSelect'), trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入波次名称', trigger: 'blur' }
        ],
        execution_priority: [
          { required: true, message: '请输入执行优先级', trigger: 'blur' }
        ],
        orders_per_wave: [
          { required: false, message: '请输入每个波次的订单数量', trigger: 'blur' }
        ],
        group_by_sku: [
          { required: false, message: '请选择是否按SKU分组', trigger: 'change' }
        ],
        sku_group_start_quantity: [
          { required: false, message: '请输入SKU分组的起始数量', trigger: 'blur' }
        ],
        group_by_logistics_service: [
          { required: false, message: '请选择是否按物流服务分组', trigger: 'change' }
        ],
        generate_remaining_orders: [
          { required: false, message: '请选择是否生成剩余订单', trigger: 'change' }
        ],
        country: [
          { required: false, message: '请输入订单关联的国家', trigger: 'blur' }
        ],
        customer: [
          { required: false, message: '请选择订单关联的客户', trigger: 'change' }
        ],
        logistics_service: [
          { required: false, message: '请选择订单使用的物流服务', trigger: 'change' }
        ],
        product_barcode: [
          { required: false, message: this.$t("message.productManagement.productBarcodePlaceholder"), trigger: 'blur' }
        ],
        product_quantity_start: [
          { required: true, message: '请输入产品的起始数量', trigger: 'blur' }
        ],
        product_quantity_end: [
          { required: true, message: '请输入产品的结束数量', trigger: 'blur' }
        ],
        product_variety_quantity_start: [
          { required: true, message: '请输入产品品种的起始数量', trigger: 'blur' }
        ],
        product_variety_quantity_end: [
          { required: true, message: '请输入产品品种的结束数量', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    getcustomers () {
      this.customersRemoteLoading = true
      let provider_uuid = this.$store.state.user.dsCurrentProviderUuid
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: this.remoteQueryNum,
        page_size: this.remoteQuerySize
      }
      query_all_customers(queryParams, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.customers = res.data.results.map(item => ({
            user_code: item.user_code,
            user_id: item.related_id //TODO： 这里看是否需要转ID
          }))
        }
      }).finally(() => {
        this.customersRemoteLoading = false
      })
    },
    getLogisticsChannels () {
      this.remoteLoading = true
      let provider_uuid = this.$store.state.user.dsCurrentProviderUuid
      let queryParams = {
        provider_uuid: provider_uuid,
        page_number: this.remoteQueryNum,
        page_size: this.remoteQuerySize
      }
      query_all_logistics_channels(queryParams, this.roleType).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.logistics_channels = res.data.results.map(item => ({
            channel_name: item.channel_name,
            channel_code: item.channel_code //TODO： 这里看是否需要转ID
          }))
        }
      }).finally(() => {
        this.remoteLoading = false
      })

    },

    async getWarehousingDefinition () {
      try {
        const res = await getStorageDefinition(this.provider_uuid, this.roleType)
        if (this.$isRequestSuccessful(res.code)) {
          this.warehousingMap = res.data.map(item => ({
            label: item.name,
            value: item.storage_define_uuid
          }));
          res.data.forEach(element => {
            this.warehousingNameMap[element.storage_define_uuid] = element.name
          });
          this.$set(this.searchForm, 'storage_id', this.warehousingMap[0].value)

        }
      }
      catch (error) {
        console.error(error);
      }
    },
    remoteMethod (query) {
      if (this.form.storage_id === '') {
        this.$message.warning(this.$t('message.storage.warehouseSelect'));
        return;
      }
      if (query !== '') {
        this.remoteLoading = true;
        this.$set(this.form, 'section_id', '');
        this.sectionMap = [];
        try { this.querySection({ storage_id: this.form.storage_id, section_name: query }); }
        catch (err) {
          console.error(err);
        }
        finally {
          this.remoteLoading = false;
        }

        // 查询分区
      }

    },

    selectStorage (val) {
      if (val !== '') {
        //选择仓储的话 默认获取10个分区
        this.querySection({ storage_id: val });
      } else {
        // 清除仓储的话 同时清除分区
        this.sectionMap = [];
        this.$set(this.form, 'section_id', '');
      }
    },
    querySection (queryParam) {
      const queryDict = {
        page_number: 1,
        page_size: 10,
      }
      Object.assign(queryParam, queryDict);
      this.$ajax({
        method: 'get',
        url: '/api-prefix/api/customer-settings/query-section-entities',
        params: queryParam,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.sectionMap = res.data.results.map(item => {
            return {
              label: item.section_name,
              value: item.entity_id
            }
          })
          if (this.sectionMap.length > 0) {
            this.$set(this.form, 'section_id', this.sectionMap[0].value)
          } else {
            this.sectionMap = [];
            this.$set(this.form, 'section_id', '');
          }
        }
      }).catch(err => {
        console.error(err);
      })
    },
    closeDialog () {
      this.$refs.form.resetFields();
      this.form = Object.assign({}, undefined)
      this.$emit('close');
    },
    submitData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          let urlPath = '/api-prefix/api/customer-settings/wave-strategy';
          let reqMethod = 'post';
          if (this.operateType === 'edit') {
            reqMethod = 'put'
            urlPath = '/api-prefix/api/customer-settings/wave-strategy'
          }
          this.$ajax({
            method: reqMethod,
            url: urlPath,
            data: this.form,
            roleType: this.roleType
          }).then(res => {
            if (this.$isRequestSuccessful(res.code)) {
              this.$message.success(this.$t('common.operationSuccessful'))
              this.$emit('close', true);
            }
          }).catch(err => {
            console.error(err);
          }).finally(() => {
            this.loading = false;
          })
        }
      })
    }
  },
  computed: {

    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
  },
  mounted () {
    this.getcustomers()
    this.getLogisticsChannels()
  },
  watch: {
    visible: {
      handler (val) {
        this.dialogFormVisible = val;
        if (val) {
          if (this.currentData !== null) {
            this.form = this.currentData
            this.operateType = 'edit';
          } else {
            this.operateType = 'add';
          }
          if (this.warehousingMap.length > 0) {
            this.form.storage_id = this.warehousingMap[0].value;
            this.querySection({ storage_id: this.warehousingMap[0].value });
          }
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang='css'>
</style>