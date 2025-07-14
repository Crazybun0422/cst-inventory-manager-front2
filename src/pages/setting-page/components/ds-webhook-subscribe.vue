<!--
* @description  参数1
* @fileName  ds-webhook-subscribe
* @author wjp
* @date 2023-12-26 20:33:16
!-->
<template>
  <div
    id="ds-webhook-subscribe"
    class="ds-webhook-subscribe"
    v-loading="loading"
  >
    <PageHead :title="$t('message.webhook.webhookSubscribed')">
      <template slot="head-right">
        <el-button @click="search" icon="el-icon-refresh"></el-button>
        <el-button type="primary" @click="addWebhookSubscribe">{{
          $t('message.webhook.addWebhook')
        }}</el-button>
      </template>
    </PageHead>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="620px"
      @selection-change="handleSelectionChange"
      :header-cell-style="{
        'background-color': '#f5f7fa',
        color: '#909399',
        'font-weight': 'bold'
      }"
    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column
        :label="$t('common.operation')"
        width="200"
        prop="operate"
      >
        <template slot-scope="scope">
          <a @click="editWebhook(scope.row)"> {{ $t('common.edit') }}</a>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm
            icon="el-icon-info"
            icon-color="red"
            :title="$t('common.confirmDelete')"
            @confirm="handleSingleDelete(scope.row)"
          >
            <a slot="reference">{{ $t('common.delete') }}</a>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column
        prop="subscription_name"
        :label="$t('message.webhook.webhookName')"
        ><template slot-scope="scope"
          ><el-button type="text" @click="showWebhook(scope.row)">
            {{ scope.row.subscription_name }}</el-button
          >
        </template></el-table-column
      >
      <el-table-column
        prop="callback_url"
        :label="$t('message.webhook.webhookUrl')"
      >
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryWebhoolForm.page_number"
        :page-sizes="[10, 50, 100]"
        :page-size="queryWebhoolForm.page_size"
        layout="total,sizes, prev, pager, next"
        :total="total"
        background
      >
      </el-pagination>
    </el-row>
    <AddWebhook
      :dialogVisible="addWebhookSubscribeDialogVisible"
      :cuurentWebhook="cuurentWebhook"
      @close="closeWebhookDialog"
      @ok="handleOk"
    ></AddWebhook>
    <el-drawer
      :visible.sync="webhookDrawerVisible"
      direction="rtl"
      size="50%"
      :title="$t('message.webhook.webhookDetail')"
      class="global-drawer-class"
    >
      <el-descriptions :column="2" direction="vertical" border>
        <el-descriptions-item :label="$t('message.webhook.webhookName')">{{
          cuurentWebhook.subscription_name
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.webhook.webhookUrl')">{{
          cuurentWebhook.callback_url
        }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" direction="vertical" border>
        <el-descriptions-item>
          <template slot="label">{{
            $t('message.webhook.webhookType')
          }}</template>
          <el-row :gutter="24">
            <el-col
              :span="6"
              style="margin-bottom: 10px"
              v-for="sub_type in cuurentWebhook.subscription_type"
              :key="sub_type"
              ><el-tag class="status-tag">
                {{ webhooksTypeMapKeyValue[sub_type][$languageType] }}</el-tag
              >
            </el-col></el-row
          >
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.authInfo')">
          {{ cuurentWebhook.authorization }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import AddWebhook from './add-webhook.vue'
import { webhooksTypeMapKeyValue } from '@/common/field-maping'
import CstTableHead from '@/components/cst-table-head/index.vue'
import utils from '@/utils'
export default {
  name: 'ds-webhook-subscribe',
  props: {
  },
  components: {
    PageHead, SearchCard, CstTableHead, AddWebhook
  },
  data () {
    return {
      total: 0,
      multipleSelection: [],
      loading: false,
      remoteLoading: false,
      queryWebhoolForm: {
        page_number: 1,
        page_size: 10
      },
      cuurentWebhook: {},
      remoteQueryOptions: [],
      addWebhookSubscribeDialogVisible: false,
      tableData: [],
      webhookDrawerVisible: false,
      webhooksTypeMapKeyValue: webhooksTypeMapKeyValue
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    showWebhook (row) {
      this.cuurentWebhook = utils.deepClone(row);
      this.webhookDrawerVisible = true;
    },
    editWebhook (row) {
      this.cuurentWebhook = utils.deepClone(row);
      this.addWebhookSubscribeDialogVisible = true;
    },
    handleSingleDelete (row) {
      this.deleteWebhook([row.subscription_id])
    },
    handleMultiDelete () {
      let subscription_ids = this.multipleSelection.map(item => item.subscription_id)
      if (subscription_ids && subscription_ids.length === 0) {
        this.$message({
          message: this.$t('common.selectDeleteData'),
          type: 'warning'
        });
        return
      }
      this.deleteWebhook(subscription_ids)
    },
    async deleteWebhook (subscription_ids) {
      this.loading = true;
      try {
        const res = await this.$ajax({
          url: '/api-prefix/api/webhook-subscribe/delete',
          method: 'delete',
          data: { subscription_ids }
        });
        if (this.$isRequestSuccessful(res.code)) {
          this.$message({
            message: this.$t('common.deleteSuccessful'),
            type: 'success'
          });
          this.getWebhookSubscribeList()
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          });
        }
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading = false;
      }
    },
    handleSizeChange (val) {
      this.queryWebhoolForm.page_size = val
      this.getWebhookSubscribeList()
    },
    handleCurrentChange (val) {
      this.queryWebhoolForm.page_number = val
      this.getWebhookSubscribeList()
    },
    closeWebhookDialog () {
      this.addWebhookSubscribeDialogVisible = false;
    },
    handleOk () {
      this.cuurentWebhook = {};
      this.addWebhookSubscribeDialogVisible = false;
      this.getWebhookSubscribeList()
    },
    addWebhookSubscribe () {
      this.cuurentWebhook = {};
      this.addWebhookSubscribeDialogVisible = true;
    },
    search () {
      this.getWebhookSubscribeList()
    },

    async remoteQueryMethod (query) {
      this.remoteLoading = true;
      try {
        const res = this.$ajax({
          url: '/api-prefix/api/webhook-subscribe/query-specific',
          method: 'get',
          params: {
            webhookName: query
          }
        });
        if (this.$isRequestSuccessful(res.code)) {
          let rawData = res.data?.results;
          this.remoteQueryOptions = Object.keys(rawData).map(key => ({
            label: key,
            value: rawData[key]
          }));
        } else {
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
    async getWebhookSubscribeList (query = {}) {
      let queryParam = {
        page_number: this.queryWebhoolForm.page_number,
        page_size: this.queryWebhoolForm.page_size
      };
      try {
        this.loading = true;
        const res = await this.$ajax({
          url: '/api-prefix/api/webhook-subscribe/list',
          method: 'get',
          params: queryParam
        });
        if (this.$isRequestSuccessful(res.code)) {
          if (res.data.subscriptions && res.data.subscriptions.length !== 0) {
            this.tableData = res.data?.subscriptions;
          } else {
            this.tableData = []
          }

          this.total = res.data?.total;
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          });
        }
      } catch (e) {
        this.$message({
          message: e,
          type: 'error'
        });
      }
      finally {
        this.loading = false;
      }

    }
  },
  computed: {

  },
  mounted () {
    this.getWebhookSubscribeList()
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>