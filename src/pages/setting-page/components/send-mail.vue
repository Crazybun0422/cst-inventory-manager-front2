<!--
* @description  参数1
* @fileName  sendMail
* @author wjp
* @date 2023-12-11 20:11:33
!-->
<template>
  <div id="sendMail" class="sendMail">
    <el-dialog
      :title="
        isReply
          ? $t('message.myAccount.reply')
          : $t('message.myAccount.writeLetters')
      "
      :visible.sync="sendMailVisible"
      width="90%"
      style="margin-top: 10px"
      @close="closeSendMailDialog"
      :close-on-click-modal="false"
      v-loading="loading"
    >
      <el-form
        label-position="right"
        label-width="100px"
        :model="sendMailForm"
        ref="sendMailForm"
        :rules="sendMailRule"
        label-suffix=":"
      >
        <!-- 这是 ds的发送字段 -->
        <el-form-item
          :label="$t('message.myAccount.recipient')"
          prop="recipient"
          v-if="roleType === config.dropShipper.role"
        >
          <el-select
            v-model="sendMailForm.recipient"
            filterable
            reserve-keyword
            :disabled="isReply"
            :placeholder="$t('common.pleaseSelect')"
            :loading-text="$t('common.loading')"
            clearable
          >
            <el-option
              v-for="item in recipientList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 这是p的发送字段 -->
        <el-form-item
          :label="$t('message.myAccount.recipient')"
          prop="recipient"
          v-else
        >
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
            v-model="sendMailForm.recipient"
            filterable
            reserve-keyword
            remote
            :loading="remoteLoading"
            :disabled="isReply"
            :remote-method="remoteQueryMethod"
            :placeholder="$t('common.pleaseSelect')"
            :loading-text="$t('common.loading')"
            clearable
          >
            <el-option
              v-for="item in recipientList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('message.myAccount.topic')" prop="title">
          <el-input v-model="sendMailForm.title"></el-input>
        </el-form-item>

        <el-form-item prop="content">
          <vue-editor
            v-model="sendMailForm.content"
            :class="{ newMessage: isReply }"
          >
          </vue-editor>
          <vue-editor
            v-model="historyMailContent"
            :disabled="true"
            class="historyMessage"
            v-if="isReply"
          >
          </vue-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSendMailDialog">{{
          $t('common.cancel')
        }}</el-button>
        <el-button type="primary" @click="sendMail">{{
          $t('message.myAccount.send')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { toLoginPage } from '@/common/common-func'
import { getCustomerList } from '@/pages/setting-page/commonFunc/common-func'
import { config } from '@/common/commonconfig'
import { queryTypeOptions } from '@/common/field-maping'
export default {
  name: 'sendMail',
  components: {
    VueEditor
  },
  props: {
    sendMailDialogVisible: {
      type: Boolean,
      default: false
    },
    recipient: {
      type: Array,
      default: () => []
    },
    messagaeSession: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      config,
      queryTypeOptions,
      queryType: 'user_code',
      remoteLoading: false,
      loading: false,
      isReply: false,
      sendMailLoading: true,
      sendMailVisible: false,
      historyMailContent: '',
      recipientList: [],
      sendMailRule: {
        recipient: [
          {
            required: true,
            message: this.$t('message.myAccount.selectRecipient'),
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            message: this.$t('message.myAccount.pleaseEnterTheTopic'),
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: this.$t('message.myAccount.pleaseEnterContent'),
            trigger: 'blur'
          }
        ]
      },
      sendMailForm: {
        session_id: '',
        sender: '',
        recipient: '',
        title: '',
        content: '',
        previous_id: ''
      },
      formatContent: ''
    }
  },

  methods: {
    async remoteQueryMethod (query) {
      this.remoteLoading = true
      try {
        const res = await getCustomerList(this.queryType, query, this.roleType)
        if (this.$isRequestSuccessful(res.code)) {
          let rawData = res.data
          this.recipientList = [
            {
              label: 'ALL',
              value: 'ALL'
            },
            ...Object.keys(rawData).map((key) => ({
              label: key,
              value: rawData[key]
            }))
          ]
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          })
        }
        this.remoteLoading = false
      } catch (e) {
        this.remoteLoading = false
      }
    },
    markMailRead (message_id) {
      this.$emit('markMailRead', [message_id])
    },
    formatMessage (messages) {
      messages.sort((a, b) => new Date(b.time) - new Date(a.time))
      // 排序后最上面那个为最新的消息 最为上一条消息的id
      this.sendMailForm.previous_id = messages[0].message_id
      const formattedMessages = messages.map((message) => {
        return `<p class="inner-class" ><span style="display: inline-block; background-color: #5F8FFF; padding: 2px 6px; border-radius: 17px; font-weight: bold;">${message.sender_name
          } </span> ${this.$t(
            'common.in'
          )} <span style="font-style: italic; margin-right: 10px;">${message.time
          }</span>${this.$t('common.writeTo')} :
            ${message.content}</p>`
      })
      // console.log('formattedMessages: ', formattedMessages);
      // 将组装好的字符串数组合并为一个字符串
      return formattedMessages.join('\n')
    },
    closeSendMailDialog (isSubmit = false) {
      this.sendMailForm = Object.assign({}, undefined)
      this.$refs.sendMailForm.resetFields()
      this.recipientList = []
      this.$emit('close', isSubmit)
    },
    async sendMail () {
      this.loading = true
      let sendId = localStorage.getItem(
        this.config[this.roleType].userRelatedId
      )
      // 如果 sendId 不存在 或者为空 返回登录
      if (!sendId) {
        this.$message({
          message: this.$t('common.pleaseLogInFirst'),
          type: 'error'
        })
        this.loading = false
        const loginPath = toLoginPage(this.roleType)
        this.$router.push(loginPath)
        return
      }
      this.sendMailLoading = true
      // 获取当前角色

      this.sendMailForm.sender = this.config.pRoleList.includes(this.roleType)
        ? localStorage.getItem('shop_provider_uuid')
        : localStorage.getItem('userRelatedId')
      if (this.messagaeSession.recipientId === 'ALL') {
        this.sendMailForm.session_id = ''
        this.sendMailForm.previous_id = ''
      }
      try {
        const res = await this.$ajax({
          method: 'post',
          url: '/api-prefix/api/customer/send-message',
          data: this.sendMailForm,
          roleType: this.roleType
        })
        if (this.$isRequestSuccessful(res.code)) {
          this.$message({
            message: this.$t('common.operationSuccessful'),
            type: 'success'
          })
          this.sendMailForm = Object.assign({}, undefined)
          this.$refs.sendMailForm.resetFields()
          this.closeSendMailDialog(true)
        } else {
          this.$message({
            message: res.msg[this.$languageType],
            type: 'error'
          })
        }
      } catch (error) {
      } finally {
        this.loading = false
        this.sendMailLoading = false
      }
    },
    async getHistoryMail () {
      this.loading = true
      const res = await this.$ajax({
        method: 'get',
        url: '/api-prefix/api/customer/get-specific-message',
        params: {
          session_id: this.sendMailForm.session_id
        },
        roleType: this.roleType
      })
      if (this.$isRequestSuccessful(res.code)) {
        if (res.data) {
          this.historyMailContent = this.formatMessage(
            res.data[this.sendMailForm.session_id]
          )
        }
      } else {
        this.$message({
          message: res.msg[this.$languageType],
          type: 'error'
        })
      }
      this.loading = false
    }
  },
  computed: {},
  mounted () { },
  watch: {
    // 监听sendMailDialogVisible
    sendMailDialogVisible: {
      handler (value) {
        //判断是 再次编辑发送还是回复 用于判断回复的时候的收件人 当是回复时 收件人为发送人
        if (value) {
          if (Object.keys(this.messagaeSession).includes('isAgainSend')) {
            this.isReply = true
            if (this.messagaeSession.isAgainSend) {
              this.sendMailForm.recipient = this.messagaeSession.recipientId
              this.sendMailForm.session_id = this.messagaeSession.session_id
            } else {
              this.sendMailForm.recipient = this.messagaeSession.senderId
              this.sendMailForm.session_id = this.messagaeSession.session_id
              // 点击回复代表已读 发送标记已读请求 如果已经是已读状态则不需要请求
              if (this.messagaeSession.is_read === 0) {
                this.markMailRead(this.messagaeSession.message_id)
              }
            }
            this.recipientList = [
              {
                label: this.messagaeSession.sender_name,
                value: this.messagaeSession.senderId
              }
            ]
            this.getHistoryMail()
          } else {
            this.isReply = false
          }
          // 判断是否为Provider角色 如果是则添加ALL选项 并且放在最前面
          if (this.config.pRoleList.includes(this.roleType)) {
            this.recipientList = [
              {
                label: 'ALL',
                value: 'ALL'
              },
              ...this.recipientList,
              ...this.recipient
            ]
          } else {
            this.recipientList = [...this.recipient, ...this.recipientList]
          }
        }
        this.sendMailForm.recipient = this.recipientList[0]?.value
        this.sendMailVisible = value
      },
      immediate: true
    }
    // recipient: {
    //   handler (value) {
    //     console.log('recipient: ', value);
    //     this.recipientList = value

    //   },
    //   immediate: true
    // }
  }
}
</script>
<style scoped lang="scss">
::v-deep .quillWrapper.newMessage .ql-toolbar.ql-snow + .ql-container.ql-snow {
  border-bottom: none;
}
::v-deep .quillWrapper.historyMessage .ql-toolbar.ql-snow {
  display: none;
  border-top: none;
}
::v-deep .quillWrapper.historyMessage {
  border-top: 1px solid var(--custom-border-color);
  background-color: var(--custom-background-color);
  color: var(--custom-font-color);
}
::v-deep .ql-editor {
  height: 280px !important;
}
::v-deep .el-dialog {
  margin-top: 30px !important;
}

::v-deep .ql-editor {
  img {
    max-width: 250px !important;
    height: auto;
  }
}
</style>
