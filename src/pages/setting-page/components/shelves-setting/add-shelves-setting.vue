<!--
* @description  参数1
* @fileName  add-shelves-setting
* @author wjp
* @date 2024-03-11 22:28:35
!-->
<template>
  <div id="add-shelves-setting" class="add-shelves-setting" v-loading="loading">
    <el-dialog
      :title="operateType === 'add' ? '新增货架' : '编辑货架'"
      :visible="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog"
      width="500px"
    >
      <el-form
        :model="form"
        :rules="partitionRule"
        label-position="top"
        ref="form"
      >
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
        <el-form-item
          :label="$t('message.myAccount.partition')"
          prop="section_id"
        >
          <el-select
            v-model="form.section_id"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            :loading="remoteLoading"
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
        <el-form-item
          :label="$t('message.myAccount.shelfName')"
          prop="shelf_name"
        >
          <el-input
            v-model="form.shelf_name"
            autocomplete="off"
            style="width: 100%"
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('message.myAccount.abbreviationCode')"
          prop="short_code"
        >
          <el-input
            v-model="form.short_code"
            autocomplete="off"
            style="width: 100%"
          ></el-input>
        </el-form-item>
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
      remoteLoading: false,
      loading: false,
      dialogFormVisible: false,
      form: {
        storage_id: '',
        section_id: '',
        shelf_name: '',
        short_code: '',
        picking_order: ''
      },
      operateType: 'add',
      partitionRule: {
        storage_id: [
          { required: true, message: this.$t('message.storage.warehouseSelect'), trigger: 'change' }
        ],
        section_id: [
          { required: true, message: this.$t('message.myAccount.pleaseSelectPartition'), trigger: 'change' }
        ],
        shelf_name: [
          { required: true, message: this.$t("message.myAccount.pleaseInputShelfName"), trigger: 'blur' }
        ],
        short_code: [
          { required: true, message: this.$t("message.myAccount.pleaseInputAbbreviationCode"), trigger: 'blur' }
        ],
        picking_order: [
          { required: true, message: this.$t('message.myAccount.pleaseInputPickingSorting'), trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
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
          let urlPath = '/api-prefix/api/customer-settings/add-entity-shelf';
          let reqMethod = 'post';
          if (this.operateType === 'edit') {
            reqMethod = 'put'
            urlPath = '/api-prefix/api/customer-settings/modify-entity-shelf'
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
              entity_id: this.currentData.entity_id,
              shelf_name: this.currentData.shelf_name,
              short_code: this.currentData.short_code,
              picking_order: this.currentData.picking_order,
              storage_id: this.currentData.storage_id
            }
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