<!--
* @description  参数1
* @fileName  add-cargo-location
* @author wjp
* @date 2024-03-11 22:28:35
!-->
<template>
  <div id="add-cargo-location" class="add-cargo-location" v-loading="loading">
    <el-dialog
      :title="
        operateType === 'add'
          ? $t('message.myAccount.addShelvesSetting')
          : $t('message.myAccount.editShelvesSetting')
      "
      :visible="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog"
      width="500px"
    >
      <el-form
        :model="form"
        :rules="partitionRule"
        label-position="left"
        ref="form"
      >
        <el-form-item label="默认选择" prop="is_default">
          <el-radio-group v-model="form.is_default">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
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
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.partition')"
              prop="section_id"
            >
              <el-select
                v-model="form.section_id"
                filterable
                remote
                reserve-keyword
                :remote-method="sectionRemoteMethod"
                :loading="sectionRemoteLoading"
                placeholder="请输入关键词"
                style="width: 100%"
              >
                <el-option
                  v-for="item in sectionMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货架" prop="shelf_id">
              <el-select
                v-model="form.shelf_id"
                filterable
                remote
                reserve-keyword
                :remote-method="shelfRemoteMethod"
                :loading="shelfRemoteLoading"
                placeholder="请输入关键词"
                style="width: 100%"
              >
                <el-option
                  v-for="item in shelfMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.locationNumber')"
              prop="location_number"
            >
              <el-input
                v-model="form.location_number"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货位备注" prop="location_note">
              <el-input
                v-model="form.location_note"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.storage.totalCapacity')"
              prop="volume_size"
            >
              <el-input-number
                :min="0"
                :step="0.01"
                v-model="form.volume_size"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大受重[kg]" prop="max_weight">
              <el-input-number
                :min="0"
                :step="0.01"
                v-model="form.max_weight"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货位类型" prop="location_type">
              <el-select v-model="form.location_type" style="width: 100%">
                <el-option
                  v-for="item in locationTypeMap"
                  :key="item.value"
                  :label="item.label[$languageType]"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.sizeType')"
              prop="size_type"
            >
              <el-select v-model="form.size_type" style="width: 100%">
                <el-option
                  v-for="item in sizeTypeMap"
                  :key="item.value"
                  :label="item.label[$languageType]"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="'ABC' + $t('common.classification')"
              prop="abc_classification"
            >
              <el-select v-model="form.abc_classification" style="width: 100%">
                <el-option
                  v-for="item in abcClassificationMap"
                  :key="item.value"
                  :label="item.label[$languageType]"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="货位产品规格"
              prop="location_product_specification"
            >
              <el-select
                v-model="form.location_product_specification"
                style="width: 100%"
              >
                <el-option
                  v-for="item in locationProductSpecificationMap"
                  :key="item.value"
                  :label="item.label[$languageType]"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('message.myAccount.pickingSorting')"
              prop="picking_order"
            >
              <el-input-number
                v-model="form.picking_order"
                :min="101"
                style="width: 100%"
              ></el-input-number>
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
import { locationTypeMap, sizeTypeMap, abcClassificationMap, locationProductSpecificationMap } from '@/common/field-maping'
import instance from '@/api/ajax'
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

  },
  data () {
    return {
      sectionMap: [],
      shelfMap: [],
      locationTypeMap, sizeTypeMap, abcClassificationMap, locationProductSpecificationMap,
      sectionRemoteLoading: false,
      shelfRemoteLoading: false,
      loading: false,
      dialogFormVisible: false,
      form: {
        storage_id: '',
        section_id: '',
        shelf_id: '',
        location_number: '',
        location_note: '',
        volume_size: '',
        max_weight: 0,
        location_type: 0,
        size_type: 0,
        abc_classification: 0,
        location_product_specification: 0,
        picking_order: '',
        is_default: false
      },
      operateType: 'add',
      partitionRule: {
        is_default: [
          { required: true, message: '请选择是否默认', trigger: 'change' }
        ],
        storage_id: [
          { required: true, message: this.$t('message.storage.warehouseSelect'), trigger: 'change' }
        ],
        section_id: [
          { required: true, message: this.$t('message.myAccount.pleaseSelectPartition'), trigger: 'change' }
        ],
        shelf_id: [
          { required: true, message: this.$t('message.myAccount.shelves'), trigger: 'change' }
        ],
        // shelf_name: [
        //   { required: true, message: this.$t("message.myAccount.pleaseInputShelfName"), trigger: 'blur' }
        // ],
        location_number: [
          { required: true, message: '请输入货位号', trigger: 'blur' }
        ],
        location_note: [
          { required: true, message: '请输入货位备注', trigger: 'blur' }
        ],
        location_type: [
          { required: true, message: '请选择货位类型', trigger: 'change' }
        ],
        size_type: [
          { required: true, message: this.$t('message.myAccount.locationTypeSelect'), trigger: 'change' }
        ],
        abc_classification: [
          { required: true, message: '请选择ABC分类', trigger: 'change' }
        ],
        location_product_specification: [
          { required: true, message: '请选择货位产品规格', trigger: 'change' }
        ],
        volume_size: [
          { required: true, message: '请输入体积大小', trigger: 'blur' }
        ],
        max_weight: [
          { required: true, message: '请输入最大受重', trigger: 'blur' }
        ],
        picking_order: [
          { required: true, message: this.$t('message.myAccount.pleaseInputPickingSorting'), trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    sectionRemoteMethod (query) {
      if (this.form.storage_id === '') {
        this.$message.warning(this.$t('message.storage.warehouseSelect'));
        return;
      }
      if (query !== '') {
        this.sectionRemoteLoading = true;
        this.$set(this.form, 'section_id', '');
        this.sectionMap = [];
        try { this.querySection({ storage_id: this.form.storage_id, section_name: query }); }
        catch (err) {
          console.error(err);
        }
        finally {
          this.sectionRemoteLoading = false;
        }

        // 查询分区
      }
    },
    shelfRemoteMethod (query) {
      if (this.form.section_id === '') {
        this.$message.warning('请先选择货位');
        return;
      }
      if (query !== '') {
        this.shelfRemoteLoading = true;
        this.$set(this.form, 'shelf_id', '');
        this.shelfMap = [];
        try { this.queryShelf({ storage_id: this.form.storage_id, shelf_name: query }); }
        catch (err) {
          console.error(err);
        }
        finally {
          this.shelfRemoteLoading = false;
        }

        // 查询货架
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
    queryShelf (queryParam) {
      const queryDict = {
        page_number: 1,
        page_size: 10,
      }
      Object.assign(queryParam, queryDict);
      this.$ajax({
        method: 'get',
        url: '/api-prefix/api/customer-settings/query-shelf-entities',
        params: queryParam,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.shelfMap = res.data.results.map(item => {
            return {
              label: item.shelf_name,
              value: item.entity_id
            }
          })
          if (this.shelfMap.length > 0) {
            this.$set(this.form, 'shelf_id', this.shelfMap[0].value)
          } else {
            this.shelfMap = [];
            this.$set(this.form, 'shelf_id', '');
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
          let urlPath = '/api-prefix/api/customer-settings/add-entity-location';
          let reqMethod = 'post';
          if (this.operateType === 'edit') {
            reqMethod = 'put'
            urlPath = '/api-prefix/api/customer-settings/modify-location-entity'
          }
          this.$ajax({
            method: reqMethod,
            url: urlPath,
            data: this.form,
            roleType: this.roleType
          }).then(res => {
            if (this.$isRequestSuccessful(res.code)) {
              this.$message.success(this.$t('common.operationSuccessful'))
              this.$emit('close');
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

  },
  mounted () {

  },
  watch: {
    visible: {
      handler (val) {
        this.dialogFormVisible = val;
        if (val) {
          if (this.currentData !== null) {
            this.form = {
              ...this.currentData
            }
            //this.sectionMap = [{ label: this.currentData.section_name, value: this.currentData.section_id }];
            //this.shelfMap = [{ label: this.currentData.shelf_name, value: this.currentData.shelf_id }];
            this.operateType = 'edit';
          } else {
            this.operateType = 'add';
          }
          if (this.warehousingMap.length > 0) {
            this.form.storage_id = this.warehousingMap[0].value;
            this.querySection({ storage_id: this.warehousingMap[0].value });
            this.queryShelf({ storage_id: this.warehousingMap[0].value });
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