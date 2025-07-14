<!--
* @description  参数1
* @fileName  contacts-setting
* @author wjp
* @date 2023-12-05 20:42:09
!-->
<template>
  <div id="contacts-setting" class="contacts-setting" v-loading="loading">
    <PageHead :title="$t('message.myAccount.contactSettings')">
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
        <el-form-item prop="queryKey">
          <el-select
            v-model="searchForm.queryKey"
            :placeholder="$t('common.pleaseSelect')"
          >
            <el-option
              v-for="item in contactFieldSelectMap"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
              <!-- <span style="float: left">{{ item.label[$languageType] }}</span> -->
              <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.value
                }}</span> -->
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item >
          <el-input
            v-model="searchForm.queryValue"
            placeholder="请输入关键字"
          ></el-input>
        </el-form-item> -->
        <el-form-item prop="queryValue">
          <el-select
            v-model="searchForm.queryValue"
            filterable
            remote
            reserve-keyword
            :placeholder="$t('common.pleaseInput') + ' ' + searchForm.queryKey"
            :remote-method="remoteQueryMethod"
            :loading="remoteLoading"
            :loading-text="$t('common.loading')"
            clearable
          >
            <el-option
              v-for="item in remoteQueryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="queryContacts">{{
            $t('common.search')
          }}</el-button>
        </el-form-item>
        <el-form-item prop="contact_type">
          <el-radio-group v-model="searchForm.contact_type">
            <el-radio-button
              v-for="contactType in contactTypeMap"
              :key="contactType.value"
              :label="contactType.value"
              >{{ contactType.label[$languageType] }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
    </SearchCard>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="555px"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('message.myAccount.contactName')"
        width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="contact_type"
        :label="$t('message.myAccount.contactType')"
        width="110"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.contact_type === 'sender' ? 'success' : 'warning'"
            close-transition
            class="status-tag"
          >
            {{
              scope.row.contact_type === 'sender'
                ? $t('message.myAccount.sender')
                : $t('message.myAccount.recipient')
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="country"
        :label="$t('message.myAccount.country')"
        width="200"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ getCountryByAbbreviation(scope.row.country) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        :label="$t('common.stateProvince')"
        width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="city"
        :label="$t('common.city')"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('common.fullAddress')"
        width="220"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        :label="$t('common.phone')"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="postal_code"
        :label="$t('common.zipCode')"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column fixed="left" :label="$t('common.operation')" width="160">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">{{
            $t('common.check')
          }}</el-button>
          <el-button
            type="text"
            size="small"
            @click="editContacts(scope.row)"
            >{{ $t('common.edit') }}</el-button
          >

          <el-popconfirm
            :title="$t('message.myAccount.confirmDeleteContact')"
            @confirm="delContacts(scope.row)"
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
    <el-dialog
      :title="
        submitType === 'add'
          ? $t('message.myAccount.addContact')
          : $t('message.myAccount.editContact')
      "
      :visible.sync="contactsVisible"
      @close="closeContactsDialog"
      :close-on-click-modal="false"
      width="35%"
      v-loading="formLoading"
    >
      <el-form
        :model="addContactsForm"
        :rules="addContactsRules"
        ref="addContactsForm"
        class="ContactsForm"
      >
        <el-form-item
          :label="$t('message.myAccount.contactType')"
          :label-width="formLabelWidth"
          prop="contact_type"
        >
          <el-radio-group
            v-model="addContactsForm.contact_type"
            :placeholder="$t('message.myAccount.contactTypeSelect')"
          >
            <el-radio
              v-for="item in contactTypeMap"
              :label="item.value"
              :key="item.value"
              >{{ item.label[$languageType] }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('message.myAccount.contactName')"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="addContactsForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('common.country')"
          :label-width="formLabelWidth"
          prop="country"
        >
          <SelectCountry v-model="addContactsForm.country"></SelectCountry>
        </el-form-item>

        <el-form-item
          :label="$t('common.stateProvince')"
          :label-width="formLabelWidth"
          prop="state"
        >
          <el-input
            v-model="addContactsForm.state"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('common.city')"
          :label-width="formLabelWidth"
          prop="city"
        >
          <el-input
            v-model="addContactsForm.city"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('common.fullAddress')"
          :label-width="formLabelWidth"
          prop="address"
        >
          <el-input
            v-model="addContactsForm.address"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('common.phone')"
          :label-width="formLabelWidth"
          prop="phone"
        >
          <el-input
            v-model="addContactsForm.phone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('common.zipCode')"
          :label-width="formLabelWidth"
          prop="postal_code"
        >
          <el-input
            v-model="addContactsForm.postal_code"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="contactsVisible = false">{{
          $t('common.cancel')
        }}</el-button>
        <el-button type="primary" @click="submitData(submitType)">{{
          $t('common.confirm')
        }}</el-button>
      </div>
    </el-dialog>
    <el-drawer
      :title="$t('message.myAccount.contactDetail')"
      :visible.sync="contactDrawerVisible"
      direction="rtl"
      size="60%"
      class="global-drawer-class"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('message.myAccount.contactType')">{{
          currentData.contact_type
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.contactName')">{{
          currentData.name
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.country')">{{
          currentData.country
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.stateProvince')"
          >{{ currentData.state }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.city')">{{
          currentData.city
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.fullAddress')">{{
          currentData.address
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.phone')">{{
          currentData.phone
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.zipCode')">{{
          currentData.postal_code
        }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import { getCountryByAbbreviation } from '@/common/common-func'
import { contactFieldSelectMap, contactTypeMap } from '@/common/field-maping'
import SelectCountry from '@/pages/components/select-country.vue'
export default {
  name: 'contacts-setting',
  props: {
  },
  components: {
    SearchCard,
    PageHead,
    SelectCountry
  },
  data () {
    return {
      loading: false,
      formLoading: false,
      total: 0,
      remoteQueryOptions: [],
      remoteLoading: false,
      popoverVisible: false,
      contactDrawerVisible: false,
      submitType: 'add',
      formLabelWidth: '130px',
      addContactsForm: {
        name: '',
        contact_type: '',
        country: '',
        state: '',
        city: '',
        address: '',
        phone: '',
        postal_code: ''
      },
      addContactsRules: {
        name: [
          { required: true, message: this.$t('common.pleaseInput') + this.$t('message.myAccount.contactName'), trigger: 'blur' },
        ],
        contact_type: [
          { required: true, message: this.$t('common.pleaseInput') + this.$t('message.myAccount.contactType'), trigger: 'blur' },
        ],
        country: [
          { required: true, message: this.$t('common.pleaseInput') + this.$t('common.country'), trigger: 'blur' },
        ],
        state: [
          { required: true, message: this.$t('common.pleaseInput') + this.$t('common.stateProvince'), trigger: 'blur' },
        ],
        city: [
          { required: true, message: this.$t('common.pleaseInput') + this.$t('common.city'), trigger: 'blur' },
        ],
        address: [
          { required: true, message: this.$t('common.pleaseInput') + this.$t('common.fullAddress'), trigger: 'blur' },
        ],
        phone: [
          { required: true, message: this.$t('common.pleaseInput') + this.$t('common.phone'), trigger: 'blur' },
        ],
        postal_code: [
          { required: true, message: this.$t('common.pleaseInput') + this.$t('common.zipCode'), trigger: 'blur' },
        ],
      },
      currentData: {},
      contactsVisible: false,
      contactFieldSelectMap: contactFieldSelectMap,
      contactTypeMap: contactTypeMap,
      searchForm: {
        queryKey: 'phone',
        queryValue: '',
        contact_type: "sender",
      },
      curPage: 1,
      pageSize: 10,
      tableData: [],
    }
  },

  methods: {
    getCountryByAbbreviation,
    handleSelectedCountry (abbreviation) {

    },
    remoteQueryMethod (query) {
      // 用来远程获取数据
      if (query !== '') {
        this.remoteLoading = true;
        const queryParam = {
          [this.searchForm.queryKey]: query,
          contact_type: this.searchForm.contact_type
        }
        this.$ajax({
          url: '/api-prefix/api/customer-settings/contact_info_list',
          method: "get",
          params: queryParam,
          roleType: this.roleType,
          headers: {
            "Content-Type": 'application/json',
          }
        }).then(res => {
          if (this.$isRequestSuccessful(res.code)) {
            this.remoteLoading = false;
            if (res.data) {
              // 保存查询的结果
              this.remoteQueryResult = res.data
              this.remoteQueryOptions = this.remoteQueryResult.map(item => {
                return {
                  label: item,
                  value: item
                }
              })
              // const flag = this.remoteQueryOptions.some(item => item.label === query)
              // if (!flag) {
              //   this.remoteQueryOptions.unshift({ label: query, value: query })
              // }
              // this.queryData.remoteQuerySelect = query
            } else {
              this.remoteQueryOptions = []
              // this.queryData.remoteQuerySelect = query
              // this.remoteQueryOptions = [{ label: query, value: query }];
            }

          }
        })
      } else {
        this.remoteQueryOptions = [];
      }
    },
    closeContactsDialog () {
      this.contactsVisible = false
      this.addContactsForm = Object.assign({}, undefined);
      this.$refs.addContactsForm.resetFields()
    },
    editContacts (row) {
      this.contactsVisible = true
      // this.currentData = row
      this.submitType = 'edit'
      this.addContactsForm = {
        contact_id: row.contact_id,
        name: row.name,
        contact_type: row.contact_type,
        country: row.country,
        state: row.state,
        city: row.city,
        address: row.address,
        phone: row.phone,
        postal_code: row.postal_code
      }
    },
    delContacts (row) {
      this.popoverVisible = false
      this.$ajax({
        method: 'delete',
        url: '/api-prefix/api/customer-settings/contact_info',
        roleType: this.roleType,
        params: {
          contact_id: row.contact_id,
          contact_type: row.contact_type
        }
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message({
            message: this.$t('common.deleteSuccessful'),
            type: 'success'
          })
          this.queryContacts()
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }

      })
    },
    submitData (submitType) {

      let method = 'post'
      // 校验表单
      this.$refs.addContactsForm.validate(valid => {
        if (valid) {
          this.formLoading = true
          if (submitType === 'edit') {
            method = 'put'
          }
          this.$ajax({
            method: method,
            url: '/api-prefix/api/customer-settings/contact_info',
            roleType: this.roleType,
            data: this.addContactsForm
          }).then(res => {
            if (this.$isRequestSuccessful(res.code)) {
              this.$message({
                message: this.$t("common.operationSuccessful"),
                type: 'success'
              })
              this.addContactsForm = Object.assign({}, undefined);
              this.$refs.addContactsForm.resetFields()
              this.queryContacts()
              this.contactsVisible = false
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          }).catch(error => {
            console.error(error);
          }).finally(() => {
            this.formLoading = false
          })

        }
        else if (!valid) {
          return
        }
      })
    },

    showModal (row) {
      this.contactsVisible = true
      this.submitType = 'add'
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.queryContacts()
    },
    handleCurrentChange (val) {
      this.curPage = val
      this.queryContacts()
    },
    handleClick (row) {
      this.currentData = row
      this.contactDrawerVisible = true
    },
    queryContacts () {
      this.loading = true
      let queryParams = {
        contact_type: this.searchForm.contact_type,
        page_num: this.curPage,
        page_size: this.pageSize
      }
      if (this.searchForm.queryValue) {
        queryParams[this.searchForm.queryKey] = this.searchForm.queryValue
      }
      this.$ajax({
        method: 'get',
        url: '/api-prefix/api/customer-settings/contact_info',
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
    }
  },
  computed: {

  },
  mounted () {
    this.queryContacts()
  },
  watch: {
    "searchForm.contact_type": function (val, oldVal) {
      this.queryContacts()
    },
    "searchForm.queryKey": function (val, oldVal) {
      this.remoteQueryOptions = []
      this.searchForm.queryValue = ''
    },
  }
}
</script>
<style scoped lang='css'>
::v-deep .ContactsForm .el-input__inner {
  width: 350px;
  /* 居中显示 */
}
</style>