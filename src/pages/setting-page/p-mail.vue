<!--
* @description  参数1
* @fileName  p-mail
* @author wjp
* @date 2023-12-10 20:39:05
!-->
<template>
  <div id="p-mail" class="p-mail" v-loading="loading">
    <PageHead :title="$t('message.myAccount.mail')">
      <template slot="head-right">
        <el-button type="primary" @click="sendMailDialog">{{
          $t('message.myAccount.writeLetters')
        }}</el-button>
      </template>
    </PageHead>
    <SearchCard>
      <el-form :inline="true" :model="queryMailForm" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="queryType"
            :placeholder="$t('common.pleaseSelect')"
          >
            <el-option
              v-for="item in queryTypeOptions"
              :key="item.value"
              :label="item.label[$languageType]"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="queryMailForm.user_code"
            filterable
            reserve-keyword
            remote
            :loading="remoteLoading"
            :remote-method="remoteQueryMethod"
            :placeholder="$t('common.pleaseInput')"
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
          <el-date-picker
            v-model="queryMailForm.date"
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
          <el-button icon="el-icon-search" @click="getMail">{{
            $t('common.search')
          }}</el-button>
        </el-form-item>
        <!-- 增加个单选按钮 分别是 已发送 已接收 -->
        <el-form-item>
          <el-radio-group v-model="queryMailForm.type" @input="changeType">
            <el-radio-button label="sender">{{
              $t('message.myAccount.sendingMailbox')
            }}</el-radio-button>
            <el-radio-button label="recipient">{{
              $t('message.myAccount.receivingMailbox')
            }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item>
          <el-radio-group
            v-model="queryMailForm.is_deleted"
            @input="changeDeleted"
          >
            <el-radio-button :label="1">已删除</el-radio-button>
            <el-radio-button :label="0">未删除</el-radio-button>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item>
          <el-checkbox
            v-model="onlyUnread"
            v-if="queryMailForm.type === 'recipient'"
            @change="changeRead"
            >{{ $t('message.myAccount.viewOnlyUnread') }}</el-checkbox
          >
        </el-form-item>
      </el-form>
    </SearchCard>
    <CstTableHead>
      <template slot="top-left">
        <!-- 一键已读 -->
      </template>
      <template slot="top-right">
        <el-button
          type="primary"
          @click="markMail([])"
          :disabled="!hasSelection"
          v-if="queryMailForm.type === 'recipient'"
          >{{ $t('message.myAccount.markRead') }}</el-button
        >
        <el-button
          type="danger"
          @click="deleteMail"
          :disabled="!hasSelection"
          >{{ $t('common.deleteInBulk') }}</el-button
        >
      </template>
    </CstTableHead>
    <el-table
      :data="messageTableData"
      style="width: 100%"
      height="530px"
      size="small"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="title"
        :label="$t('message.myAccount.topic')"
      ></el-table-column>
      <el-table-column
        prop="recipient"
        :label="$t('message.myAccount.recipient')"
      >
      </el-table-column>
      <el-table-column prop="sender" :label="$t('message.myAccount.sender')">
      </el-table-column>
      <el-table-column prop="time" :label="$t('common.date')"></el-table-column>
      <el-table-column
        prop="is_read"
        :label="$t('common.status')"
        v-if="queryMailForm.type === 'recipient' && dataLoadingStatus"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.is_read ? 'success' : 'danger'"
            class="status-tag"
            >{{
              scope.row.is_read
                ? $t('message.myAccount.Read')
                : $t('message.myAccount.Unread')
            }}</el-tag
          >
        </template>
      </el-table-column>
      <!-- <el-table-column label="operate" width="200" prop="operate">
        <template slot-scope="scope">
          <el-button
            v-if="queryMailForm.type === 'recipient'"
            style="margin-right: 12px"
            @click="reply(scope.row)"
            type="text"
            size="small"
          >
            回复
          </el-button>
          <el-button
            v-else
            style="margin-right: 12px"
            @click="reply(scope.row, true)"
            type="text"
            size="small"
          >
            再次编辑发送
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <SendMail
      :sendMailDialogVisible="sendMailDialogVisible"
      :recipient="remoteQueryOptions"
      @markMailRead="markMail"
      @close="closeSendMailDialog"
      :messagaeSession="messagaeSession"
      :nameIdMap="nameIdMap"
    >
    </SendMail>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryMailForm.page_number"
        :page-sizes="[10, 50, 100]"
        :page-size="queryMailForm.page_size"
        layout="total,sizes, prev, pager, next"
        :total="total"
        background
      >
      </el-pagination
    ></el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PageHead from '@/components/page-head.vue'
import SearchCard from '@/components/search-card.vue'
import { getCustomerList } from "@/pages/setting-page/commonFunc/common-func"
import SendMail from '@/pages/setting-page/components/send-mail.vue'
import CstTableHead from '@/components/cst-table-head/index.vue'
import { queryTypeOptions } from '@/common/field-maping'
export default {
  name: 'p-mail',
  props: {

  },
  components: {
    PageHead, SearchCard, CstTableHead, SendMail
  },
  data () {

    return {
      total: 0,
      loading: false,
      dataLoadingStatus: true,
      messagaeSession: {},
      messageTableData: [
      ],
      queryTypeOptions,
      queryType: 'user_code',
      queryMailForm: {

        user_code: '',
        status: '',
        start_date: '',
        end_date: '',
        page_number: 1,
        page_size: 10,
        type: "recipient",
        is_deleted: 0,
      },
      remoteLoading: false,
      remoteQueryOptions: [],
      sendMailDialogVisible: false,
      multipleSelection: [],
      nameIdMap: {},
      onlyUnread: true
    }

  },

  methods: {
    handleRowClick (row, column, event) {
      // reply 后面的布尔值参数 主要用于给发送邮件组件确定收件人的
      // 如果是true 代表是再次回复 会把当前的收件人作为发件人
      // 如果是false 代表是回复 会把当前的发件人作为收件人
      if (this.queryMailForm.type === 'sender') {
        this.reply(row, true)
      } else {
        this.reply(row)
      }

    },
    handleSizeChange (val) {
      this.queryMailForm.page_size = val
      this.getMail()
    },
    handleCurrentChange (val) {
      this.queryMailForm.page_number = val
      this.getMail()
    },
    changeRead (val) {
      this.getMail()
    },
    changeDeleted (val) {
      this.queryMailForm.is_deleted = val
      this.getMail()
    },
    changeType (val) {
      this.queryMailForm.type = val
      this.getMail()
    },
    async markMail (message_ids = []) {
      this.loading = true
      if (message_ids.length === 0) {
        message_ids = this.multipleSelection.map(obj => obj.message_id);
      }
      try {
        const res = await this.$ajax({
          method: 'put',
          url: '/api-prefix/api/customer/mark-read',
          data: {
            message_ids: message_ids
          }
        })
        if (this.$isRequestSuccessful(res.code)) {
          this.$store.dispatch('user/triggerEmailRefresh');
          this.getMail()
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          });
        }
      }

      catch (e) {
        this.$message({
          message: e.msg[this.$languageType],
          type: 'error'
        });
      }
      finally {
        this.loading = false
      }
    },
    reply (row, isAgainSend) {
      //TODO: 回复 自动填写这个邮件的发件人 并且不可修改
      this.messagaeSession = row
      this.messagaeSession['isAgainSend'] = isAgainSend
      this.sendMailDialogVisible = true;
    },
    deleteMail () {
      this.$ajax({
        method: 'put',
        url: '/api-prefix/api/customer/mark-deleted',
        data: {
          session_ids: this.multipleSelection.map(item => item.session_id)
        }
      }).then(res => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message({
            message: this.$t('common.deleteSuccessful'),
            type: 'success'
          });
          this.getMail()
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          });
        }
        this.loading = false
      });
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    sendMailDialog () {
      this.sendMailDialogVisible = true;
      this.messagaeSession = {}
    },
    closeSendMailDialog (isSubmit) {
      this.sendMailDialogVisible = false;
      if (isSubmit) {
        this.getMail()
      }
    },

    async remoteQueryMethod (query) {
      this.remoteLoading = true;
      try {
        const res = await getCustomerList(this.queryType, query, this.roleType)
        if (this.$isRequestSuccessful(res.code)) {
          let rawData = res.data;
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
    async getMail () {
      this.loading = true
      this.dataLoadingStatus = false
      let curUserRelatedId = localStorage.getItem('shop_provider_uuid')
      let curUserName = localStorage.getItem('userName')
      // 如果 curUserRelatedId 或者curUserName 不存在 或者为空 返回登录
      if (!curUserRelatedId || !curUserName) {
        this.$message({
          message: this.$t('common.pleaseLogInFirst'),
          type: 'error'
        })
        this.loading = false
        this.$router.push(this.config[this.roleType].loginPath)
        return
      }
      this.queryMailForm["provider_uuid"] = curUserRelatedId
      // this.nameIdMap[curUserRelatedId] = curUserName
      if (this.queryMailForm.date) {
        this.queryMailForm.start_date = this.queryMailForm.date[0]
        this.queryMailForm.end_date = this.queryMailForm.date[1]
      }
      // 删除值为空的属性
      for (let key in this.queryMailForm) {
        if (!this.queryMailForm[key]) {
          delete this.queryMailForm[key]
        }
      }
      // 深拷贝this.queryMailForm 
      let queryDict = JSON.parse(JSON.stringify(this.queryMailForm))
      if (this.onlyUnread && this.queryMailForm.type === 'recipient') {
        // 如果为True 代表勾选了仅查下看未读
        queryDict.is_read = '0'
      }
      if (!this.onlyUnread || this.queryMailForm.type === 'sender') {
        delete queryDict.is_read
      }
      try {
        const res = await this.$ajax({
          method: 'get',
          url: '/api-prefix/api/customer/get-messages',
          params: queryDict,
          roleType: this.roleType
        })

        if (this.$isRequestSuccessful(res.code)) {
          this.messageTableData = Object.values(res.data?.sessions).map(item => {
            // 使用映射来替换 recipient，如果映射中不存在该 recipient，则保留原值
            // const recipientName = this.nameIdMap[item.recipient] || item.recipient;
            // const senderName = this.nameIdMap[item.sender] || item.sender;
            return {
              ...item,
              recipientId: item.recipient,
              senderId: item.sender,
              recipient: item.recipient_name,
              sender: item.sender_name
            };
          });
          this.total = res.data?.total
          this.dataLoadingStatus = true
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          })
        }
      }
      catch (error) {
        console.error(error)

      }
      finally {
        this.loading = false
      }

    },
  },
  computed: {
    // 是否有勾选
    hasSelection () {
      return this.multipleSelection.length > 0
    },
    ...mapGetters(["shouldRefreshEmails"]),

  },
  async mounted () {
    // await this.remoteQueryMethod();
    this.getMail()
  },
  watch: {
    shouldRefreshEmails (newValue) {
      if (newValue) {
        // 重新获取邮件
        this.getMail();
        // 重置刷新触发器
        this.$store.dispatch('user/resetEmailRefreshTrigger');
      }
    }
  }
}
</script>
<style scoped lang='css'></style>