<!--
* @description  参数1
* @fileName  home-header
* @author wjp
* @date 2023-05-27 21:38:09
!-->
<template>
  <div id="home-header" class="home-header header">
    <theme-picker @change="themeChange" />
    <div class="user-avatar">
      <div style="font-size: 24px; margin: 0px 10px" v-if="roleType === dropShipper">
        <el-select v-model="current_provider_uuid" @change="selectProviderUuid" size="mini" filterable :placeholder="$t('common.pleaseSelect') +
          ' ' +
          $t('message.orderManagement.warehouse')
          ">
          <el-option v-for="item in remoteQueryOptions" :key="item.value" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </div>
      <div>
        <el-badge :value="notice" class="item bell-style badge-style" :hidden="notice === 0" :max="99">
          <el-button plain class="el-icon-message icon-color common-setting"
            style="font-size: 24px; padding: 0 0px; width: 30px; height: 30px" @click="byButtonToMessages"></el-button>
        </el-badge>
      </div>
      <span style="font-size: 24px; margin: 0px 10px"></span>
      <div>
        <el-badge
          class="item bell-style badge-style"
          :hidden="!hasUnreadAlarms"
          :is-dot="hasUnreadAlarms"
        >
          <el-button plain class="icon-color el-icon-message-solid common-setting"
            style="font-size: 24px; padding: 0 0px; width: 30px; height: 30px" @click="showNoticeDrawer"></el-button>
        </el-badge>
      </div>
      <task-center />
      <div class="language-select">
        <LanguageSelect />
      </div>
      <el-avatar size="large" :src="avatarBase64" style="margin: 0px 10px 0px 20px"></el-avatar>

      <el-dropdown @command="handleCommand">
        <div class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right icon-color" style="font-size: 16px"></i>
        </div>
        <el-dropdown-menu slot="dropdown" style="margin-top: 10px">
          <el-dropdown-item command="setting">
            <a> {{ $t('message.myAccount.personalSettings') }}</a>
          </el-dropdown-item>
          <el-dropdown-item command="addOperator" v-if="roleType == provider">
            <a> {{ $t('message.login.addOperator') }}</a>
          </el-dropdown-item>
          <el-dropdown-item command="ChangePassword">
            <a>
              {{ $t('message.myAccount.changePassword') }}
            </a>
          </el-dropdown-item>
          <el-dropdown-item command="signOut">
            <a>{{ $t('message.myAccount.signOut') }} </a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :title="$t('message.myAccount.changePassword')" :visible.sync="dialogFormVisible" width="400px"
      :close-on-click-modal="false">
      <el-form :model="changePasswordForm" :rules="changePasswordRules" ref="changePasswordForm">
        <el-form-item :label="$t('message.myAccount.oldPassword')" prop="password_before">
          <el-input type="password" v-model="changePasswordForm.password_before" autocomplete="off"
            show-password></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.myAccount.newPassword')" prop="password_current">
          <el-input type="password" v-model="changePasswordForm.password_current" autocomplete="off"
            show-password></el-input>
          <el-progress :percentage="passwordStrength" :format="pwdFormatF" :color="pwdColorF"></el-progress>
        </el-form-item>
        <el-form-item :label="$t('message.myAccount.confirmPassword')" prop="confirmPassword">
          <el-input type="password" v-model="changePasswordForm.confirmPassword" autocomplete="off"
            show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          $t('common.cancel')
        }}</el-button>
        <el-button type="primary" @click="changePasswordFormSubmit" :loading="loading" :disabled="loading">{{
          $t('common.confirm')
        }}</el-button>
      </div>
    </el-dialog>
    <alarm-list
      ref="alarmList"
      :visible="showNotice"
      :role-type="roleType"
      :provider-uuid="providerUuidBySelectStore"
      @close="closeNotice"
      @unread-change="handleAlarmUnreadChange"
    />
    <OperatorSignup :visible.sync="addOperatorFormVisible" @close="handleCloseOperatorSignup" />
  </div>
</template>

<script>
import LanguageSelect from '@/components/language-select.vue'
import ThemePicker from '@/components/ThemePicker/index.vue'
import AlarmList from '@/components/alarm-list.vue'
import { resetRouter } from '@/router/index'
import { mapGetters } from 'vuex'
import { provider, dropShipper } from '@/common/commonconfig'
import {
  get_unread_message_count,
  toLoginPage,
  encryptPassword,
  getWarehouseRelatedInfo,
  getWebSocketUrl,
} from '@/common/common-func'
import OperatorSignup from '@/pages/login/operator-signup.vue'
import bus, { EVENTS } from '@/common/event-bus'
export default {
  name: 'home-header',
  props: {},
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('message.signUp.enterPassword')))
      } else {
        //6-20位包含字符、数字和特殊字符
        // 包含 大小字母 数字 特殊字符
        var ls = 0
        if (this.changePasswordForm.password_current !== '') {
          if (this.changePasswordForm.password_current.match(/([a-z])+/)) {
            ls++
          }
          if (this.changePasswordForm.password_current.match(/([0-9])+/)) {
            ls++
          }
          if (this.changePasswordForm.password_current.match(/([A-Z])+/)) {
            ls++
          }
          if (
            this.changePasswordForm.password_current.match(/([\W])+/) &&
            !this.changePasswordForm.password_current.match(
              /(![\u4E00-\u9FA5])+/
            )
          ) {
            ls++
          }
          if (
            this.changePasswordForm.password_current.length < 6 ||
            this.changePasswordForm.password_current.length > 20
          ) {
            callback(new Error(this.$t('message.signUp.passwordLengthError')))
            ls = 0
          }
          if (
            this.changePasswordForm.password_current.match(/([\u4E00-\u9FA5])+/)
          ) {
            callback(new Error(this.$t('message.signUp.passwordFormatError')))
            ls = 0
          }
          if (ls > 3 && this.changePasswordForm.password_current.length < 12) {
            // 当满足四种类型 但是长度小于12级减少1
            ls--
          }
          if (
            ls >= 3 &&
            this.changePasswordForm.password_current.length >= 12
          ) {
            // 满足三种类型但是长度大于12时等级加1
            ls++
          }
          switch (ls) {
            case 0:
              this.passwordStrength = 0
              callback(
                new Error(this.$t('message.signUp.passwordRequirements'))
              )
              break
            case 1:
              this.passwordStrength = 33
              callback(
                new Error(this.$t('message.signUp.passwordRequirements'))
              )
              break
            case 2:
              this.passwordStrength = 33
              callback(
                new Error(this.$t('message.signUp.passwordRequirements'))
              )
              break
            case 3:
              this.passwordStrength = 66
              break
            case 4:
              this.passwordStrength = 100
              break
            case 5:
              this.passwordStrength = 100
              break
            default:
              this.passwordStrength = 0
              break
          }
        }
        callback()
      }
    }
    return {
      loading: false, // 新增loading
      dropShipper,
      provider,
      remoteQueryOptions: [],
      current_provider_uuid: '',
      isClicked: false,
      notice: 0, // 预留用来记录未读信个数
      alarmUnreadCount: 0,
      showNotice: false,
      passwordStrength: 0, // 用于保存密码强度
      changePasswordForm: {
        password_before: '',
        password_current: '',
        confirmPassword: ''
      },
      changePasswordRules: {
        password_before: [
          {
            required: true,
            message: this.$t('message.myAccount.oldPasswordPlaceholder'),
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: this.$t('message.myAccount.confirmPassword'),
            trigger: ['blur', 'change']
          }
        ],
        password_current: [
          {
            required: true,
            message: this.$t('message.signUp.enterPassword'),
            trigger: ['blur', 'change']
          },
          {
            // validator: (rule, value, callback) => {
            //   if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}/.test(value)) {
            //     callback(new Error(this.$t('message.signUp.formatErrorPassword')));
            //   } else {
            //     callback();
            //   }
            validator: validatePassword,
            trigger: ['blur', 'change']
          }
        ]
      },
      defaultActiveIndex: '1',
      dialogFormVisible: false,
      userName: '',
      addOperatorFormVisible: false,
      avatarBase64: require('../assets/notImg.png'),
      avatarObjectUrl: null,
      websocketId: '',
      websocketUrl: getWebSocketUrl(), // 现有的 WebSocket URL
      websock: null,
      reconnectData: null,
      lockReconnect: false, //避免重复连接，因为onerror之后会立即触发 onclose
      timeout: 10000, //10s一次心跳检测
      timeoutObj: null,
      serverTimeoutObj: null,
      shouldReconnect: true, // 添加一个标志变量控制是否重连
      nameIdMap: {},
    }
  },
  components: {
    LanguageSelect,
    OperatorSignup,
    ThemePicker,
    AlarmList,
    TaskCenter: () => import('@/components/task-center.vue')
  },
  methods: {
    getWarehouseRelatedInfo,
    get_unread_message_count,
    normalizeAvatarSrc(rawValue) {
      if (!rawValue && rawValue !== 0) {
        return { type: 'fallback' }
      }
      const trimmed = String(rawValue).trim()
      if (!trimmed) {
        return { type: 'fallback' }
      }
      if (/^data:image\//i.test(trimmed) || /^(https?:)?\/\//i.test(trimmed)) {
        return { type: 'direct', value: trimmed }
      }
      if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length > 100) {
        return { type: 'direct', value: `data:image/png;base64,${trimmed}` }
      }
      const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
      return { type: 'fetch', value: path }
    },
    async fetchAvatarFromProfile() {
      try {
        const res = await this.$ajax({
          url: '/api-prefix/api/customer-settings/personal_info',
          method: 'GET',
          roleType: this.roleType
        })
        if (this.$isRequestSuccessful(res.code)) {
          const avatarUrl = res.data?.user_avatar_url || ''
          await this.applyAvatarSource(avatarUrl)
          return
        }
      } catch (error) {
        console.error('Failed to fetch personal info', error)
      }
      await this.applyAvatarSource('')
    },
    async applyAvatarSource(rawValue) {
      const normalized = this.normalizeAvatarSrc(rawValue)
      if (this.avatarObjectUrl) {
        URL.revokeObjectURL(this.avatarObjectUrl)
        this.avatarObjectUrl = null
      }
      if (normalized.type === 'direct') {
        this.avatarBase64 = normalized.value
        return
      }
      if (normalized.type === 'fetch') {
        try {
          const blob = await this.$ajax({
            url: `/api-prefix/api/img${normalized.value}`,
            method: 'GET',
            headers: {
              'Content-Type': 'image'
            },
            roleType: this.roleType,
            responseType: 'blob'
          })
          if (blob) {
            const href = URL.createObjectURL(blob)
            this.avatarObjectUrl = href
            this.avatarBase64 = href
            return
          }
        } catch (error) {
          console.error('Failed to load avatar image', error)
        }
      }
      this.avatarBase64 = require('../assets/images/defaultAbstract.png')
    },
    handlePersonalInfoUpdated() {
      this.fetchAvatarFromProfile()
    },
    themeChange(val) {
      this.$store.dispatch('user/changeSetting', {
        key: 'theme',
        value: val,
        persist: false
      })
    },
    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.closeNotice() // 调用关闭面板的方法
      }
    },
    handleAlarmUnreadChange(count) {
      const numeric = Number(count)
      this.alarmUnreadCount = Number.isNaN(numeric) ? 0 : numeric
    },
    refreshAlarmList() {
      const component = this.$refs.alarmList
      if (component && typeof component.refresh === 'function') {
        component.refresh()
      }
    },
    handleCloseOperatorSignup() {
      this.addOperatorFormVisible = false
    },
    selectProviderUuid(value) {
      this.$store.commit('user/SET_DS_CURRENT_PROVIDER_UUID', value)
    },
    querymProvider() {
      this.getWarehouseRelatedInfo().then((resData) => {
        if (resData && resData.length !== 0) {
          this.current_provider_uuid = resData[0].provider_uuid
          this.$store.commit(
            'user/SET_DS_CURRENT_PROVIDER_UUID',
            this.current_provider_uuid
          )
          this.remoteQueryOptions = resData.map((item) => {
            return {
              label: item.name,
              value: item.provider_uuid
            }
          })
          this.nameIdMap = resData.reduce((acc, cur) => {
            acc[cur.provider_uuid] = cur.name
            return acc
          }, {})
          this.$store.commit('user/SET_PROVIDER_ID_MAP', this.nameIdMap)
        }
      })
    },
    handleCommand(command) {
      if (command === 'signOut') {
        this.signOut()
      } else if (command === 'ChangePassword') {
        this.ChangePassword()
      } else if (command === 'setting') {
        this.setting()
      } else if (command === 'addOperator') {
        this.addOperator()
      }
    },
    showNoticeDrawer(event) {
      this.showNotice = !this.showNotice
      // event.target.blur()
    },
    closeNotice() {
      this.showNotice = false
    },
    handleMouseLeave() {
      this.isClicked = true
    },
    byButtonToMessages(event) {
      event.target.blur()

      if (this.roleType === this.config.dropShipper.role) {
        this.$router.push({ name: 'ds-mail' })
        return
      } else if (this.config.pRoleList.includes(this.roleType)) {
        this.$router.push({ name: 'p-mail' })
        return
      } else {
        this.$message.error(this.$t('common.noLoginInformation'))
        this.$router.push(toLoginPage(this.roleType))
        return
      }
    },
    toMessages(pathType) {
      if (this.roleType === dropShipper) {
        if (pathType === 'mail') {
          this.$router.push('/ds/mail')
        } else if (pathType === 'download') {
          this.$router.push('/ds/order')
        } else if (pathType === 'sourcing') {
          this.$router.push('/ds/sourcing')
        }

        return
      } else if (this.config.pRoleList.includes(this.roleType)) {
        if (pathType === 'mail') {
          this.$router.push('/p/mail')
        } else if (pathType === 'sourcing') {
          this.$router.push('/p/sourcing')
        }
        // else if(pathType === 'download'){}
        return
      } else {
        this.$message.error(this.$t('common.noLoginInformation'))
        this.$router.push(toLoginPage(this.roleType))
        return
      }
    },
    changePasswordFormSubmit() {
      if (
        this.changePasswordForm.password_current !==
        this.changePasswordForm.confirmPassword
      ) {
        this.$message.error('两次密码不一致')
        return
      }
      if (this.loading) return; // 防止按钮重复点击
      this.loading = true;
      const username = localStorage.getItem(this.config[this.roleType].userName) || ''
      if (!username) {
        this.$message.error(this.$t('common.noLoginInformation'))
        this.$router.push(this.config[this.roleType].loginPath)
      }

      this.$refs.changePasswordForm.validate((valid) => {
        if (valid) {
          this.$ajax({
            url: '/api-prefix/get-aes-key-login/',
            method: 'get',
            params: {
              username: username
            }
          }).then((response) => {
            if (this.$isRequestSuccessful(response.code)) {
              const aesKey = response.data.aes_key
              const encryptedPasswordBefore = encryptPassword(
                aesKey,
                this.changePasswordForm.password_before
              )
              const encryptedPasswordCurrent = encryptPassword(
                aesKey,
                this.changePasswordForm.password_current
              )
              this.$ajax({
                url: '/api-prefix/api/customer-settings/credential_info',
                method: 'put',
                data: {
                  password_before: encryptedPasswordBefore,
                  password_current: encryptedPasswordCurrent
                },
                roleType: this.roleType
              }).then((res) => {
                if (this.$isRequestSuccessful(res.code)) {
                  this.$message.success(this.$t('common.operationSuccessful'))

                  this.dialogFormVisible = false
                  this.changePasswordForm = Object.assign(
                    {},
                    this.changePasswordForm,
                    {
                      password_before: '',
                      password_current: ''
                    }
                  )
                  this.$refs['changePasswordForm'].resetFields()
                  // 暂停1秒后跳转到登录页面
                  setTimeout(() => {
                    this.$router.push(toLoginPage(this.roleType))
                  }, 1000)
                } else {
                  this.$message.error(res.msg[this.$languageType])
                }
              })
            }
          })
        }
      })
    },

    // 动态显示指定内容
    pwdFormatF() {
      return this.passwordStrength == 33
        ? this.$t('message.signUp.passwordStrengthWeak')
        : this.passwordStrength == 66
          ? this.$t('message.signUp.passwordStrengthMedium')
          : this.passwordStrength == 100
            ? this.$t('message.signUp.passwordStrengthStrong')
            : this.$t('message.signUp.passwordStrengthDefault')
    },
    // 动态改变颜色
    pwdColorF() {
      return this.passwordStrength == 33
        ? '#FF5340'
        : this.passwordStrength == 66
          ? '#FFB640'
          : this.passwordStrength == 100
            ? '#25DC1B'
            : '#FF5340'
    },
    ChangePassword() {
      this.dialogFormVisible = true
    },
    addOperator() {
      this.addOperatorFormVisible = true
    },
    handleSelect(key, keyPath) {
    },
    setting() {
      if (this.config.roles.includes(this.roleType)) {
        this.$router.push(this.config[this.roleType].settingsPath)
      } else {
        this.$message.error(this.$t('common.noLoginInformation'))
        this.$router.push(toLoginPage(this.roleType))
        return
      }
    },
    closeWebSocket() {
      if (this.websock) {
        this.shouldReconnect = false // 设置标志变量为 false，表示不需要重连
        this.websock.close()
        this.websock = null
      }
    },
    signOut() {
      //TODO: 退出登录 目前只是清除了浏览器token  服务端没有清除
      localStorage.removeItem(this.config[this.roleType].accessToken)
      localStorage.removeItem(this.config[this.roleType].csrfToken)
      this.$store.dispatch('user/delRoles') // 退出登录时，清除vuex角色信息
      resetRouter()
      this.closeWebSocket()
      this.$router.push(toLoginPage(this.roleType))
    },
    //-----------------------------------------websocket相关-----------------------------------------
    //初始化weosocket
    initWebSocket() {
      this.websock = new WebSocket(
        this.websocketUrl + '/ws/notifications/' + this.websocketId
      )
      this.websock.onopen = this.websocketonopen //连接成功
      this.websock.onmessage = this.websocketonmessage //广播成功
      this.websock.onerror = this.websocketonerror //连接断开，失败
      this.websock.onclose = this.websocketclose //连接关闭
    },
    //连接成功
    websocketonopen() {
      //this.heatBeat();
    },
    //连接失败
    websocketonerror() {
      if (this.shouldReconnect) {
        this.reconnect()
      }
    },
    websocketclose() {
      if (this.shouldReconnect) {
        this.reconnect()
      }
    },
    //数据接收
    websocketonmessage(event) {
      //this.heatBeat();      //收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送

      let msgData = {}
      try { msgData = JSON.parse(event.data) } catch (e) { msgData = {} }
      // Forward sourcing notifications to global bus for pages to react
      if (msgData && (msgData.type === EVENTS.SOURCING_NOTIFICATION || msgData.event === EVENTS.SOURCING_NOTIFICATION || (msgData.sourcing_id && msgData.status))) {
        bus.$emit(EVENTS.SOURCING_NOTIFICATION, msgData)
      }
      if (msgData.message == 're-link signal') {
        this.reconnect()
      } else {
        //  收到信息 更新刷新邮箱状态
        // this.$store.dispatch('user/triggerEmailRefresh');
        // this.$notify({
        //   title: '您有一封新邮件',
        //   message: this.$createElement('i', { style: 'color: teal' }, msgData.message),
        //   duration: 0,
        //   offset: 100,
        //   type: "success"
        // });
        this.suportNotify(msgData)
      }
    },
    //数据发送
    // websocketsend (data) {
    //   this.websock.send(JSON.stringify(data));
    // },
    reconnect() {
      if (this.lockReconnect) {
        //这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
        return
      }
      this.lockReconnect = true
      this.reconnectData && clearTimeout(this.reconnectData)
      this.reconnectData = setTimeout(() => {
        this.initWebSocket()
        this.lockReconnect = false
      }, 5000)
    },

    fetchUnreadMessageCount() {
      let params = {}
      if (this.config.pRoleList.includes(this.roleType)) {
        params['provider_uuid'] = this.providerUuidBySelectStore
      }
      this.get_unread_message_count(params)
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.notice = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //判断浏览器是否支持浏览器消息弹窗
    suportNotify(msgData) {
      this.showMess(msgData)
    },
    // 唤起浏览器弹框 前提浏览器得允许弹框通知显示
    // TODO: 这里有个问题 由于门店选择提到了页头  所以websocket通知跳转得对应门店id才行不然看不到信件
    showMess(msgData) {
      let title = ''
      let msgContent = ''
      let pathType = ''
      let iconUrl = (document.querySelector('link[rel="icon"]') || {}).href || '/favicon.ico'

      // 1) Sourcing 实时通知
      if (
        msgData && (
          msgData.type === 'sourcing_notification' ||
          msgData.event === 'sourcing_notification' ||
          (msgData.sourcing_id && msgData.status)
        )
      ) {
        const zh = { submitted: '已提交', sourcing: '选品中', pending_confirmation: '待确认', completed: '已完成' }
        const en = { submitted: 'Submitted', sourcing: 'Sourcing', pending_confirmation: 'Pending confirmation', completed: 'Completed' }
        const dict = (this.$i18n && this.$i18n.locale === 'zh_cn') ? zh : en
        const label = dict[msgData.status] || msgData.status
        title = this.$t('navigate.sourcing')
        msgContent = `${this.$t('sourcing.sourcingId') || 'ID'}: ${msgData.sourcing_id || ''} · ${label}`
        pathType = 'sourcing'

        // 2) 邮件
      } else if (msgData.message) {
        title = this.$t('message.myAccount.emailNotification')
        msgContent = this.resolveLocalizedText(msgData.message)
        pathType = 'mail'
        //  收到信息 更新刷新邮箱状态
        this.$store.dispatch('user/triggerEmailRefresh')

        // 3) 文件导出
      } else if (msgData.filename) {
        title = this.$t('message.myAccount.fileExportNotification')
        msgContent = this.resolveLocalizedText(msgData.filename)
        pathType = 'download'
        this.$store.dispatch('user/triggerDownloadRefresh')

        // 4) 告警/系统通知
      } else if (msgData.event_name || msgData.title || msgData.content) {
        title = this.$t('message.myAccount.alarmNotification')
        msgContent =
          this.resolveLocalizedText(msgData.content) ||
          this.resolveLocalizedText(msgData.event_name) ||
          this.resolveLocalizedText(msgData.title) ||
          ''
        pathType = 'alarm'
      }

      if (pathType === 'alarm') {
        this.refreshAlarmList()
      }

      setTimeout(
        function () {
          //如果支持window.Notification 并且 许可不是拒绝状态
          if (window.Notification && Notification.permission !== 'denied') {
            //Notification.requestPermission这是一个静态方法，作用就是让浏览器出现是否允许通知的提示
            Notification.requestPermission(
              function (status) {
                if (status === 'granted') {
                  var m = new Notification(title, {
                    body: msgContent || window.location.host, // 消息体内容
                    icon: iconUrl // 图标 URL
                  })
                    //点击当前消息内容
                    ; (m.onclick = () => {
                      //点击当前消息提示框后，跳转到当前页面
                      // this.$router.push({ path: '/Reception/chatpage' })
                      this.toMessages(pathType)
                      window.focus()
                    }),
                      //点击关闭消息提示框
                      (m.onclose = function () {
                        m.close()
                      })
                } else {
                  this.$notify({
                    title: title,
                    message: this.$createElement(
                      'i',
                      {
                        style: 'color: teal; cursor: pointer;', // 添加鼠标指针样式以改善用户体验
                        on: {
                          click: () => {
                            this.toMessages(pathType)
                            window.focus()
                          }
                        }
                      },
                      msgContent
                    ),
                    duration: 0,
                    offset: 100,
                    type: 'success'
                  })
                }
              }.bind(this)
            )
          } else {
            this.$notify({
              title: title,
              message: this.$createElement(
                'i',
                {
                  style: 'color: teal; cursor: pointer;', // 添加鼠标指针样式以改善用户体验
                  on: {
                    click: () => {
                      this.toMessages(pathType)
                      window.focus()
                    }
                  }
                },
                msgContent
              ),
              duration: 0,
              offset: 100,
              type: 'success'
            })
          }
        }.bind(this),
        1000
      )
    },
    resolveLocalizedText(source) {
      if (source === undefined || source === null) return ''
      if (typeof source === 'string') return source
      if (typeof source === 'number' || typeof source === 'boolean') return String(source)
      if (Array.isArray(source)) {
        return source
          .map((item) => this.resolveLocalizedText(item))
          .filter(Boolean)
          .join(' ')
      }
      if (typeof source === 'object') {
        const rawLang = (this.$languageType || (this.$i18n && this.$i18n.locale) || '').toLowerCase()
        const langCandidates = []
        const pushCandidate = (lang) => {
          if (lang && !langCandidates.includes(lang)) langCandidates.push(lang)
        }
        pushCandidate(rawLang)
        if (rawLang.includes('-')) pushCandidate(rawLang.replace('-', '_'))
        if (rawLang.includes('_')) pushCandidate(rawLang.split('_')[0])
        const locale = (this.$i18n && this.$i18n.locale && this.$i18n.locale.toLowerCase()) || ''
        if (locale && locale !== rawLang) {
          pushCandidate(locale)
          if (locale.includes('-')) pushCandidate(locale.replace('-', '_'))
          if (locale.includes('_')) pushCandidate(locale.split('_')[0])
        }
        pushCandidate('en_us')
        pushCandidate('en')
        pushCandidate('zh_cn')
        pushCandidate('zh')
        for (const key of langCandidates) {
          if (!key) continue
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            const resolved = this.resolveLocalizedText(source[key])
            if (resolved) return resolved
          }
        }
        const firstKey = Object.keys(source).find((key) => source[key] !== undefined && source[key] !== null)
        if (firstKey) return this.resolveLocalizedText(source[firstKey])
        try {
          return JSON.stringify(source)
        } catch (_) {
          return ''
        }
      }
      return ''
    }
  },
  mounted() {
    // 监听websocket
    this.querymProvider()
    if (this.roleType === dropShipper) {
      this.fetchUnreadMessageCount()
      this.websocketId = localStorage.getItem(
        this.config[this.roleType].userRelatedId
      )
      this.initWebSocket()
      this.refreshAlarmList()
    }
    this.userName = localStorage.getItem(this.config[this.roleType].userName)
    this.fetchAvatarFromProfile()
    window.addEventListener('personal-info-updated', this.handlePersonalInfoUpdated)
    document.addEventListener('click', this.handleOutsideClick)
  },
  computed: {
    ...mapGetters(['shouldRefreshEmails']),
    hasUnreadAlarms() {
      const count = Number(this.alarmUnreadCount)
      return !Number.isNaN(count) && count > 0
    }
  },
  watch: {
    shouldRefreshEmails(newValue) {
      if (newValue) {
        // 执行刷新逻辑
        this.fetchUnreadMessageCount()
        // 重置刷新触发器
        // this.$store.dispatch('user/resetEmailRefreshTrigger');
      }
    },
    providerUuidBySelectStore(newValue) {
      if (!newValue) return
      // P 端不再干预全局通知 WS，避免触发二次连接；仅更新计数/告警
      if (this.config.pRoleList.includes(this.roleType)) {
        this.fetchUnreadMessageCount()
        this.refreshAlarmList()
        try {
          const mod = require('@/common/ws-notify').default
          // if (mod && mod.ws && mod.ws.close) { mod.ws.close() }
          if (mod && mod.start) { mod.start() }
        } catch (e) { /* ignore */ }
      }
    }
  },
  beforeDestroy() {
    if (this.avatarObjectUrl) {
      URL.revokeObjectURL(this.avatarObjectUrl)
      this.avatarObjectUrl = null
    }
    document.removeEventListener('click', this.handleOutsideClick)
    window.removeEventListener('personal-info-updated', this.handlePersonalInfoUpdated)
    if (this.socket) {
      this.socket.close()
    }
  }
}
</script>
<style scoped lang="scss">
.user-avatar {
  display: flex;
  align-items: center;
  margin-right: 10px;
  height: 60px;
  line-height: 60px;
}

.cst-logo {
  margin-left: 10px;
  height: 60px;
  display: flex;
  align-items: center;
}

.header-menu-options {
  margin: 0 auto;
}

.el-menu-demo {
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: end;
  width: 100%;
  margin: 0 auto;
}

.icon-color {
  color: var(--custom-icon-color);
  cursor: pointer;
}

::v-deep .bell-style {
  line-height: 5px;
}

.user-avatar .common-setting {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: var(--custom-background-color);
  border-color: var(--custom-background-color);
  padding: 0 0;
  transition: box-shadow 0.3s ease;
}

.user-avatar .common-setting:hover {
  /* box-shadow: 0 0 5px rgba(0, 0, 0); */
  background-color: #eff4ff;
  cursor: pointer;
}

.language-select {
  margin-left: 16px;
}

.change-password-form {
  width: 50%;
  margin: 0;
  /* 如有需要，可清除内置的 margin 以确保对齐 */
}

::v-deep .el-pagination {
  height: 30px;
}


.el-dialog .el-form-item {
  margin-bottom: 20px;
  /* 给每个表单项添加合适的下边距 */
}

.el-dialog .el-input {
  width: 100%;
  /* 确保输入框宽度为100%，填充父容器 */
}

.el-dialog .el-progress {
  margin-top: 10px;
  /* 给进度条添加一定的间距 */
}
</style>
