<!--
* @description  参数1
* @fileName  putaway-form
* @author wjp
* @date 2024-03-30 21:50:48
!-->
<template>
  <div id="putaway-form" class="putaway-form">
    <el-dialog
      :title="$t('message.storage.putaway')"
      :visible.sync="modalVisible"
      width="1000px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card style="height: 450px">
            <div slot="header" class="clearfix">
              <span>{{ $t('message.storage.information') }}</span>
            </div>
            <el-descriptions
              class="margin-top-20 font-style"
              :column="1"
              direction="vertical"
            >
              <el-descriptions-item :label="$t('message.storage.warehouse')">
                <span>{{
                  storageMap[form.storage_uuid]
                }}</span></el-descriptions-item
              >
              <el-descriptions-item :label="$t('message.storage.systemNumber')">
                <span>{{ form.system_number }}</span></el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.productManagement.productBarcode')"
              >
                <span>{{ form.barcode }}</span></el-descriptions-item
              >
              <el-descriptions-item
                :label="$t('message.storage.pendingListing')"
              >
                <span>{{ waitPutawayCount }}</span></el-descriptions-item
              >
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="height: 450px">
            <div slot="header" class="clearfix">
              <span>{{ $t('message.storage.onTheShelves') }}</span>
            </div>
            <div class="button-block">
              <el-button
                @click="selectLocationEntities"
                icon="el-icon-check"
                type="primary"
                plain
                >{{ $t('message.storage.selectStorageLocation') }}</el-button
              >
              <el-button
                @click="recommendLocationEntities"
                icon="el-icon-star-on"
                type="success"
                disabled
                plain
                >{{
                  $t('message.storage.recommendedStorageLocation')
                }}</el-button
              >
            </div>
            <el-form
              :model="form"
              :rules="formRules"
              v-loading="loading"
              ref="form"
              label-position="left"
              label-width="auto"
            >
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item
                    :label="$t('message.myAccount.cargoLocation')"
                    prop="location_name"
                  >
                    <el-input
                      v-model="form.location_name"
                      autocomplete="off"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('message.storage.putawayNumber')"
                    prop="number"
                  >
                    <el-input-number
                      v-model="form.number"
                      :min="0"
                      :max="waitPutawayCount"
                      autocomplete="off"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    :label="$t('message.storage.batch')"
                    prop="batch"
                  >
                    <el-input
                      v-model="form.batch"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('message.storage.dateOfManufacture')"
                    prop="production_date"
                  >
                    <el-date-picker
                      v-model="form.production_date"
                      align="right"
                      type="date"
                      :placeholder="$t('common.datePlaseholder')"
                      style="width: 100%"
                      :picker-options="productionDatePickerOptions"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('message.storage.expirationDate')"
                    prop="expiration_date"
                  >
                    <el-date-picker
                      v-model="form.expiration_date"
                      align="right"
                      type="date"
                      :placeholder="$t('common.datePlaseholder')"
                      style="width: 100%"
                      :picker-options="expirationDatePickerOptions"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <el-button type="primary" @click="submitData">
                  {{ $t('common.save') }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      :title="$t('message.storage.selectStorageLocation')"
      :visible.sync="selectLocationEntitiesVisible"
      width="1000px"
      @close="closeSelectLocationEntitiesDialog"
    >
      <SearchCard>
        <el-form
          :inline="true"
          :model="selectLocationEntitiesqueryData"
          class="demo-form-inline"
          :rules="selectLocationEntitiesqueryRules"
        >
          <el-row>
            <el-form-item
              :label="$t('message.storage.warehouse')"
              prop="storage_uuid"
            >
              <el-select
                v-model="selectLocationEntitiesqueryData.storage_uuid"
                :disabled="true"
                width="200px"
              >
                <el-option
                  :key="selectLocationEntitiesqueryData.storage_uuid"
                  :label="
                    storageMap[selectLocationEntitiesqueryData.storage_uuid]
                  "
                  :value="selectLocationEntitiesqueryData.storage_uuid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('message.productManagement.productBarcode')"
              prop="barcode"
            >
              <el-input
                :disabled="true"
                v-model="selectLocationEntitiesqueryData.barcode"
                :placeholder="
                  $t('message.productManagement.productBarcodePlaceholder')
                "
                style="width: 197px"
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              :label="$t('message.myAccount.partition')"
              prop="entitySection"
            >
              <el-select
                v-model="selectLocationEntitiesqueryData.entitySection"
                width="200px"
                remote
                filterable
                @change="changeEntitySection"
                @visible-change="handleEntitySectionVisibleChange"
                :remote-method="entitySectionRemoteMethod"
                :loading="entitySectionLoading"
              >
                <el-option
                  v-for="item in entitySectionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('message.myAccount.shelves')"
              prop="entityShelf"
            >
              <el-select
                v-model="selectLocationEntitiesqueryData.entityShelf"
                :disabled="!selectLocationEntitiesqueryData.entitySection"
                width="200px"
                remote
                filterable
                :remote-method="entityShelfRemoteMethod"
                :loading="entityShelfLoading"
                @change="changeEntityShelf"
              >
                <el-option
                  v-for="item in entityShelfOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('message.myAccount.cargoLocation')"
              prop="entityLocation"
            >
              <el-select
                v-model="selectLocationEntitiesqueryData.entityLocation"
                :disabled="!selectLocationEntitiesqueryData.entityShelf"
                width="200px"
                remote
                filterable
                :remote-method="entityLocationRemoteMethod"
                :loading="entityLocationLoading"
              >
                <el-option
                  v-for="item in entityLocationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </SearchCard>
      <CstTableHead>
        <template slot="top-left">
          <el-button type="primary" @click="queryLocationEntities(0)">
            {{ $t('message.storage.queryAllStorageLocations') }}
          </el-button>
          <el-button type="primary" @click="queryLocationEntities(2)">
            {{
              $t(
                'message.storage.theStorageLocationWhereTheProductShelfIsLocated'
              )
            }}
          </el-button>
          <el-button type="primary" @click="queryLocationEntities(1)">
            {{ $t('message.storage.theProductDoesNotHaveAShelfLocation') }}
          </el-button>
        </template>
      </CstTableHead>
      <el-table :data="locationEntitiesData" style="width: 100%" show-header>
        <el-table-column
          :label="$t('common.operation')"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="confirmLocationEntity(scope.row)"
              type="primary"
              plain
              size="small"
            >
              {{ $t('common.confirm') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('message.storage.warehouse')"
          width="180"
        >
          <template slot-scope="scope">
            {{ storageMap[scope.row.storage_id] }}</template
          ></el-table-column
        >
        <el-table-column
          prop="location_number"
          :label="$t('message.myAccount.locationNumber')"
          width="140"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="max_weight"
          align="center"
          :label="$t('message.storage.maximumWeight')"
        ></el-table-column>
        <el-table-column
          prop="volume_size"
          align="center"
          :label="$t('message.storage.totalCapacity')"
        ></el-table-column>
        <el-table-column
          prop="location_note"
          align="center"
          :label="$t('message.myAccount.storageLocationRemarks')"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import CstTableHead from '@/components/cst-table-head/index.vue'
import SearchCard from '@/components/search-card.vue'
import { qualifiedQuantityTotal, unqualifiedQuantityTotal, putawayTotal, removeEmptyStringValues } from '@/common/common-func'
export default {
  name: 'putaway-form',
  props: {
    value: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    storageMap: { type: Object, default: () => { } }
  },
  components: {
    CstTableHead,
    SearchCard
  },
  data () {
    return {
      locationEntitiesData: [],
      waitPutawayCount: 0,
      qualifiedQuantityTotal, unqualifiedQuantityTotal, putawayTotal,
      entitySectionLoading: false,
      entityShelfLoading: false,
      entityLocationLoading: false,
      entitySectionOptions: [],
      entityShelfOptions: [],
      entityLocationOptions: [],
      selectLocationEntitiesqueryData: {
      },
      selectLocationEntitiesqueryRules: {
        storage_uuid: [
          { required: false, message: this.$t('message.storage.warehouseSelect'), trigger: 'blur' }
        ],
        barcode: [
          { required: false, message: this.$t('message.productManagement.productBarcodePlaceholder'), trigger: 'blur' }
        ],
        entitySection: [
          { required: false, message: this.$t('message.myAccount.pleaseSelectPartition'), trigger: 'blur' }
        ],
        entityShelf: [
          { required: false, message: this.$t('message.myAccount.shelves'), trigger: 'blur' }
        ],
        entityLocation: [
          { required: false, message: this.$t('message.myAccount.pleaseSelectCargoLocation'), trigger: 'blur' }
        ]
      },
      modalVisible: false,
      selectLocationEntitiesVisible: false,
      form: {
        storage_uuid: '',
        system_number: '',
        barcode: '',
        location_name: '',
        location_id: '',
        number: 0,
        batch: '',
        production_date: '',
        expiration_date: ''
      },
      loading: false,
      formRules: {
        location_name: [
          { required: true, message: this.$t('message.myAccount.pleaseSelectCargoLocation'), trigger: 'blur' }
        ],
        number: [
          { required: true, message: this.$t('message.storage.putawayNumberPlaceholder'), trigger: 'blur' }
        ],
        batch: [
          { required: true, message: this.$t('message.storage.batchPlaceholder'), trigger: 'blur' }
        ],
        production_date: [
          { required: true, message: this.$t('message.storage.dateOfManufacturePlaceholder'), trigger: 'blur' }
        ],
        expiration_date: [
          { required: true, message: this.$t('message.storage.expirationDatePlaceholder'), trigger: 'blur' }
        ]
      },
      productionDatePickerOptions: {
        // disabledDate (time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [{
          text: this.$t('date.today'),
          onClick (picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: this.$t('date.aWeekAgo'),
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }, {
          text: this.$t('date.threeWeeksAgo'),
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 21);
            picker.$emit('pick', date);
          }
        },
        {
          text: this.$t('date.aMonthAgo'),
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', date);
          }
        },
        {
          text: this.$t('date.threeMonthsAgo'),
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', date);
          }
        },
        {
          text: this.$t('date.sixMonthsAgo'),
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 180);
            picker.$emit('pick', date);
          }
        },
        {
          text: this.$t('date.aYearAgo'),
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', date);
          }
        }
        ]
      },
      expirationDatePickerOptions: {
        // disabledDate (time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [{
          text: this.$t('date.today'),
          onClick (picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: this.$t('date.halfAYearLater'),
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 180);
            picker.$emit('pick', date);
          }
        }, {
          text: this.$t('date.aYearLater'),
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365);
            picker.$emit('pick', date);
          }
        },
        {
          text: this.$t('date.twoYearsLater'),
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365 * 2);
            picker.$emit('pick', date);
          }
        },
        {
          text: this.$t('date.threeYearsLater'),
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365 * 3);
            picker.$emit('pick', date);
          }
        }
        ]
      },
    }
  },
  methods: {
    removeEmptyStringValues,
    confirmLocationEntity (row) {
      this.form.location_name = row.location_number
      this.form.location_id = row.location_id
      this.selectLocationEntitiesVisible = false
      this.locationEntitiesData = []
    },
    selectionChange (rows) {
      this.selectData = rows
    },
    changeEntitySection (value) {
      this.$set(this.selectLocationEntitiesqueryData, 'entitySection', value)
      this.entityShelfOptions = []
      this.entityLocationOptions = []
      this.$set(this.selectLocationEntitiesqueryData, 'entityShelf', undefined)
      this.$set(this.selectLocationEntitiesqueryData, 'entityLocation', undefined)
      this.entityShelfRemoteMethod('')
    },
    changeEntityShelf (value) {
      this.$set(this.selectLocationEntitiesqueryData, 'entityShelf', value)
      this.entityLocationRemoteMethod('')
    },
    queryLocationEntities (type) {
      let queryParams = {
        storage_id: this.form.storage_uuid,
        barcode: this.form.barcode,
        query_type: type
      }
      if (this.selectLocationEntitiesqueryData.entitySection) {
        queryParams.section_id = this.selectLocationEntitiesqueryData.entitySection

      }
      if (this.selectLocationEntitiesqueryData.entityShelf) {
        queryParams.shelf_id = this.selectLocationEntitiesqueryData.entityShelf
      }
      if (this.selectLocationEntitiesqueryData.entityLocation) {
        queryParams.location_id = this.selectLocationEntitiesqueryData.entityLocation
      }
      queryParams = this.removeEmptyStringValues(queryParams)
      this.$ajax({
        method: 'get',
        url: '/api-prefix/api/storage-m/query-location',
        params: queryParams,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.locationEntitiesData = res.data
        }
      }).catch(error => {
        console.error('error: ', error)
      })
    },
    entitySectionRemoteMethod (query) {
      this.entitySectionLoading = true
      if (!this.form.storage_uuid) {
        this.entitySectionLoading = false
        return
      }
      let queryParams = {
        page_number: 1,
        page_size: 100,
        storage_id: this.form.storage_uuid
      }
      if (query) {
        queryParams.short_code = query
      }
      this.entitySectionOptions = []
      this.$ajax(
        {
          method: 'get',
          url: '/api-prefix/api/customer-settings/query-section-entities',
          params: queryParams,
          roleType: this.roleType
        }
      ).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.entitySectionOptions = res.data.results.map(item => {
            return {
              label: item.short_code,
              value: item.entity_id
            }
          })
        }
      }).catch(error => {
        console.error('error: ', error)
      }).finally(() => {
        this.entitySectionLoading = false
      })
    },
    handleEntitySectionVisibleChange (visible) {
      if (visible) {
        this.entitySectionRemoteMethod('')
      }
    },

    entityShelfRemoteMethod (query) {
      this.entityShelfLoading = true
      let queryParams = {
        page_number: 1,
        page_size: 100,
        // short_code: this.selectLocationEntitiesqueryData.entitySection,
        section_id: this.selectLocationEntitiesqueryData.entitySection,
        storage_id: this.form.storage_uuid
      }
      if (!this.form.storage_uuid) {
        this.entityShelfLoading = false
        return
      }
      if (query) {
        queryParams.short_code = query
      }
      this.$ajax({
        method: 'get',
        url: '/api-prefix/api/customer-settings/query-shelf-entities',
        params: queryParams,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.entityShelfOptions = res.data.results.map(item => {
            return {
              label: item.short_code,
              value: item.entity_id
            }
          })
        }
      }).catch(error => {
        console.error('error: ', error)
      }).finally(() => {
        this.entityShelfLoading = false
      })
    },
    entityLocationRemoteMethod (query) {
      this.entityLocationLoading = true
      let queryParams = {
        page_number: 1,
        page_size: 100,
        section_id: this.selectLocationEntitiesqueryData.entitySection,
        shelf_id: this.selectLocationEntitiesqueryData.entityShelf,
        storage_id: this.form.storage_uuid
      }
      if (query) {
        queryParams.location_number = query
      }
      this.$ajax({
        method: 'get',
        url: '/api-prefix/api/customer-settings/query-location-entities',
        params: queryParams,
        roleType: this.roleType
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.entityLocationOptions = res.data.results.map(item => {
            return {
              label: item.location_number,
              value: item.entity_id
            }
          })
        }
      }).catch(error => {
        console.error('error: ', error)
      }).finally(() => {
        this.entityLocationLoading = false
      }
      )
    }
    ,
    closeSelectLocationEntitiesDialog () {
      this.selectLocationEntitiesqueryData = Object.assign({}, this.selectLocationEntitiesqueryData, undefined)
      this.entitySectionOptions = []
      // this.entityShelfOptions = []
      this.entityLocationOptions = []
      this.selectLocationEntitiesVisible = false
    },
    recommendLocationEntities () { },
    selectLocationEntities () {
      this.selectLocationEntitiesVisible = true
      this.selectLocationEntitiesqueryData = {
        storage_uuid: this.form.storage_uuid,
        barcode: this.form.barcode
      }
    },
    submitData () {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const res = await this.$ajax({
              method: 'put',
              url: '/api-prefix/api/storage-m/putaway-one',
              data: this.form,
              roleType: this.roleType
            })
            if (this.$isRequestSuccessful(res.code)) {
              this.$message.success(this.$t('common.operationSuccessful'))
            }
          }
          catch (error) {
            console.error('error: ', error)
          }
          finally {
            this.loading = false
            this.$emit('close')
          }
        }
      })
    },
    closeDialog () {
      this.selectLocationEntitiesqueryData = Object.assign({}, this.selectLocationEntitiesqueryData, undefined)
      this.$emit('close')
    }
  },
  computed: {


    saveLocationEntitiesVisible () {
      if (!this.selectLocationEntitiesqueryData.entityLocation) {
        return true
      }
      return false
    }
  },
  mounted () {
    this.entitySectionRemoteMethod('')
  },
  watch: {
    value: {
      handler (newValue) {
        this.modalVisible = newValue
        if (newValue) {
          this.form = {
            storage_uuid: this.currentData.storage_uuid,
            system_number: this.currentData.system_number,
            barcode: this.currentData?.product_detail?.barcode,
            location_name: '',
            location_id: '',
            number: 0,
            batch: '',
            production_date: '',
            expiration_date: ''
          }
          // 查询全部货位
          this.queryLocationEntities(0)
          this.waitPutawayCount = this.qualifiedQuantityTotal(this.currentData.quality_check) - this.putawayTotal(this.currentData.putaway)
        }
      },
      immediate: true
    },
  }
}
</script>
<style scoped lang='css'>
.font-style span {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}
.button-block {
  margin-bottom: 10px;
}
</style>