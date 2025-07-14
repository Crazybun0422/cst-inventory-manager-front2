<!--
* @description  参数1
* @fileName  ds-webhook-log
* @author wjp
* @date 2023-12-26 20:33:10
!-->
<template>
  <div id="ds-webhook-log" class="ds-webhook-log" v-loading="loading">
    <PageHead :title="$t('message.webhook.webhookSubscribedlog')">
      <template slot="head-right">
        <el-button @click="search" icon="el-icon-refresh"></el-button>
        <!-- <el-button type="primary" @click="addWebhookSubscribe"
          >新增Webhook订阅</el-button
        > -->
      </template>
    </PageHead>
    <SearchCard>
      <el-form
        :inline="true"
        :model="queryWebhoolLogForm"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-select
            v-model="queryWebhoolLogForm.subscription_name"
            filterable
            reserve-keyword
            clearable
            remote
            :loading="remoteLoading"
            :remote-method="remoteQueryMethod"
            :placeholder="$t('common.pleaseInput')"
            :loading-text="$t('common.loading')"
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
          <el-date-picker
            v-model="queryWebhoolLogForm.date"
            type="daterange"
            :range-separator="$t('common.to')"
            :start-placeholder="$t('common.startTime')"
            :end-placeholder="$t('common.endTime')"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="search">{{
            $t('common.search')
          }}</el-button>
        </el-form-item>
      </el-form>
    </SearchCard>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="555px"
      @selection-change="handleSelectionChange"
      :header-cell-style="{
        'background-color': '#f5f7fa',
        color: '#909399',
        'font-weight': 'bold'
      }"
    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column
        prop="subscribe_name"
        :label="$t('message.webhook.callbackeName')"
        ><template slot-scope="scope"
          ><el-button type="text" @click="showWebhook(scope.row)">
            {{ scope.row.subscribe_name }}</el-button
          >
        </template></el-table-column
      >
      <el-table-column
        prop="status"
        :label="$t('message.webhook.callbackResult')"
      >
        <template slot-scope="scope"
          ><el-tag
            v-if="scope.row.status == 'failed'"
            type="danger"
            class="status-tag"
          >
            <!-- {{ scope.row.status }} -->
            {{ $t('message.webhook.webhookLogFailedStatus') }}</el-tag
          >
          <el-tag
            v-else-if="scope.row.status == 'success'"
            type="success"
            class="status-tag"
          >
            <!-- {{ scope.row.status }} -->
            {{ $t('message.webhook.webhookLogSuccessStatus') }}
          </el-tag>
          <el-tag v-else class="status-tag">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operation" :label="$t('common.operationType')">
        <template slot-scope="scope">{{
          webhooksTypeMap[scope.row.callback_data.operation]
            ? webhooksTypeMap[scope.row.callback_data.operation][$languageType]
            : ''
        }}</template>
      </el-table-column>
      <el-table-column
        prop="duration"
        :label="$t('message.webhook.callbackTime')"
        ><template slot-scope="scope">{{ scope.row.duration }}ms</template>
      </el-table-column>
      <el-table-column
        prop="timestamp"
        :label="$t('message.webhook.recordingTime')"
      >
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryWebhoolLogForm.page_number"
        :page-sizes="[10, 50, 100]"
        :page-size="queryWebhoolLogForm.page_size"
        layout="total,sizes, prev, pager, next"
        :total="total"
        background
      >
      </el-pagination
    ></el-row>
    <el-drawer
      :visible.sync="webhookLogDrawerVisible"
      direction="rtl"
      size="50%"
      class="global-drawer-class"
    >
      <template slot="title"
        ><div>
          <i
            class="el-icon-circle-check success-status"
            v-if="formattedData.status == 'success'"
          ></i>
          <i class="el-icon-circle-close failed-status" v-else></i>
          {{ $t('message.webhook.logDetails') }}
        </div>
      </template>
      <el-descriptions class="margin-top" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-postcard"></i>
            {{ $t('message.webhook.callbackeName') }}
          </template>
          <span>{{ formattedData.subscribe_name }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-date"></i>
            {{ $t('message.webhook.recordingTime') }}
          </template>
          <span>{{ formattedData.timestamp }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-timer"></i>
            {{ $t('message.webhook.timeConsuming') }}
          </template>
          <span>{{ formattedData.duration }}ms</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="formattedData.error !== ''" span="3">
          <template slot="label">
            <i class="el-icon-document-delete"></i>
            {{ $t('message.webhook.errorInfo') }}
          </template>
          <span>{{ formattedData.error }}</span>
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-s-operation"></i>
            {{ $t('message.webhook.operationType') }}
          </template>
          <span>{{
            webhooksTypeMap[formattedData.operation]
              ? webhooksTypeMap[formattedData.operation][$languageType]
              : ''
          }}</span>
        </el-descriptions-item>

        <el-descriptions-item span="3"
          ><template slot="label">
            <i class="el-icon-document"></i>
            {{ $t('message.webhook.callbackArguments') }}
          </template>
          <json-viewer
            :value="formattedData.callback_data"
            :expand-depth="6"
            copyable
            boxed
            sort
          ></json-viewer>
        </el-descriptions-item>
        <el-descriptions-item span="3"
          ><template slot="label">
            <i class="el-icon-document"></i>
            {{ $t('message.webhook.responseResults') }}
          </template>
          <json-viewer
            :value="formattedData.response_data"
            :expand-depth="6"
            copyable
            boxed
            sort
          ></json-viewer>
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script>

import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import { webhooksTypeMapKeyValue } from '@/common/field-maping'
export default {
  name: 'ds-webhook-log',
  props: {
  },
  components: {
    PageHead, SearchCard
  },
  data () {
    return {
      total: 0,
      loading: false,
      remoteQueryOptions: [],
      webhooksTypeMap: webhooksTypeMapKeyValue,
      remoteLoading: false,
      querySubscriptionNameForm: { subscription_name: "", date: [] },
      queryWebhoolLogForm: {
        subscription_name: '',
        start_date: '',
        end_date: '',
        page_number: 1,
        page_size: 10
      },
      tableData: [],
      webhookLogDrawerVisible: false,
      webhookLogInfo: {},
      formattedData: {
        operation: '',
        callback_data: {}, // 初始化为空对象
        response_data: {}
      },
    }
  },
  methods: {
    async getWebhookInfo (log_id) {
      const res = await this.$ajax({
        method: 'get',
        url: '/api-prefix/api/webhook-subscribe/view-log',
        params: { log_id: log_id }
      })
      if (this.$isRequestSuccessful(res.code)) {
        this.webhookLogInfo = res.data
        this.formattedData = this.formattedDataFunc()
      } else if (res.code == 12004) {
        // 这里代表没有相关的日志
      } else {
        this.$message({
          message: res.msg[this.$languageType],
          type: 'error'
        })
      }
    },
    async search () {
      let queryParam = {
        page_number: this.queryWebhoolLogForm.page_number,
        page_size: this.queryWebhoolLogForm.page_size
      }
      if (this.queryWebhoolLogForm.date && this.queryWebhoolLogForm.date.length > 0) {
        queryParam.start_date = this.queryWebhoolLogForm.date[0]
        queryParam.end_date = this.queryWebhoolLogForm.date[1]
      }
      if (this.queryWebhoolLogForm.subscription_name) {
        queryParam.subscription_name = this.queryWebhoolLogForm.subscription_name
      }
      try {
        this.loading = true;
        const res = await this.$ajax({
          method: 'get',
          url: '/api-prefix/api/webhook-subscribe/list-logs',
          params: queryParam
        })
        if (this.$isRequestSuccessful(res.code)) {
          this.tableData = res.data.logs;
          this.total = res.data.total;
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          });
        }
      }
      catch (e) {
        this.$message({
          message: e,
          type: 'error'
        });
      }
      finally {
        this.loading = false;
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.queryWebhoolLogForm.page_size = val
      this.search()
    },
    handleCurrentChange (val) {
      this.queryWebhoolLogForm.page_number = val
      this.search()
    },

    async remoteQueryMethod (query) {
      this.remoteLoading = true;
      try {
        const res = await this.$ajax({
          method: 'get',
          url: '/api-prefix/api/webhook-subscribe/query-specific',
          params: { subscription_name: query }
        })
        if (this.$isRequestSuccessful(res.code)) {

          let rawData = res.data
          this.remoteQueryOptions = rawData.map(item => ({ key: item, value: item }));
        }
        else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          });
        }
        this.remoteLoading = false;
      } catch (e) {
        this.remoteLoading = false;
      }

    },
    async showWebhook (row) {
      let log_id = row.log_id
      await this.getWebhookInfo(log_id)
      this.webhookLogDrawerVisible = true
    },
    formattedDataFunc () {
      if (this.webhookLogInfo && this.webhookLogInfo.callback_data) {
        let dataCopy = JSON.parse(JSON.stringify(this.webhookLogInfo));
        dataCopy.operation = dataCopy.callback_data.operation
        delete dataCopy.callback_data.operation
        // 将特定字段转换为Markdown格式
        dataCopy.callback_data = dataCopy.callback_data
        dataCopy.response_data = this.webhookLogInfo.response_data
        return dataCopy
      }
      else {
        return { callback_data: {}, response_data: {}, operation: '' };
      }
    }
  },
  computed: {

  },
  mounted () {
    this.search()
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
.success-status {
  /* display: inline-block; */
  color: #85ce61;
}
.failed-status {
  /* display: inline-block; */
  color: #f78989;
}
::v-deep .first-descriptions,
.el-descriptions {
  color: #85ce61;
}
</style>