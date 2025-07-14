<template>
  <div class="container">
    <el-card v-loading="loading" class="config-card" element-loading-text="执行中...">
      <el-form :model="form" ref="form" label-width="200px" autocomplete="off">
        <el-row :gutter="24">
          <!-- 显示前端和后端版本信息 -->
          <el-col :span="24">
            <el-alert :title="'Frontend Version: ' +
              form.frontend_version +
              ' , Backend Version: ' +
              form.backend_version +
              ', SCService Version: ' +
              form.sc_service_version
              " type="info" show-icon :closable="false" class="version-info-alert"></el-alert>
          </el-col>
          <!-- 使用横线分割 -->
          <el-col :span="24">
            <hr class="use-for-margin" />
          </el-col>
          <el-row :gutter="12">
            <!-- MongoDB 设置区域 -->
            <el-col :span="12" class="config-col">
              <el-card class="config-card-child" shadow="hover">
                <div slot="header">
                  <span>MongoDB Settings</span>
                </div>
                <el-form-item label="MongoDB User">
                  <el-input clearable v-model="form.mongo_user" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="MongoDB Password">
                  <el-input clearable v-model="form.mongo_password" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="MongoDB Address">
                  <el-input clearable v-model="form.mongo_address" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="MongoDB Port">
                  <el-input clearable v-model="form.mongo_port" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="MongoDB Database">
                  <el-input clearable v-model="form.mongo_database" class="narrow-input"></el-input>
                </el-form-item>
              </el-card>
            </el-col>

            <!-- PostgreSQL 设置区域 -->
            <el-col :span="12" class="config-col">
              <el-card class="config-card-child" shadow="hover">
                <div slot="header">
                  <span>PostgreSQL Settings</span>
                </div>
                <el-form-item label="Postgres User">
                  <el-input clearable v-model="form.postgres_user" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="Postgres Password">
                  <el-input clearable v-model="form.postgres_password" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="Postgres Address">
                  <el-input clearable v-model="form.postgres_address" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="Postgres Port">
                  <el-input clearable v-model="form.postgres_port" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="Postgres Database">
                  <el-input clearable v-model="form.postgres_database" class="narrow-input"></el-input>
                </el-form-item>
              </el-card>
            </el-col>

            <!-- RabbitMQ 设置区域 -->
            <el-col :span="12" class="config-col">
              <el-card class="config-card-child" shadow="hover">
                <div slot="header">
                  <span>RabbitMQ Settings</span>
                </div>
                <el-form-item label="RabbitMQ Host">
                  <el-input clearable v-model="form.rabbitmq_host" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="RabbitMQ Port">
                  <el-input clearable v-model="form.rabbitmq_port" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="RabbitMQ User">
                  <el-input clearable v-model="form.rabbitmq_user" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="RabbitMQ Password">
                  <el-input clearable v-model="form.rabbitmq_password" class="narrow-input"></el-input>
                </el-form-item>
              </el-card>
            </el-col>
            <!-- redis 设置区域 -->
            <el-col :span="12" class="config-col">
              <el-card class="config-card-child" shadow="hover">
                <div slot="header">
                  <span>Redis Settings</span>
                </div>
                <el-form-item label="Redis Host">
                  <el-input clearable v-model="form.redis_address" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="Redis Port">
                  <el-input clearable v-model="form.redis_port" class="narrow-input"></el-input>
                </el-form-item>
                <el-form-item label="Redis Password">
                  <el-input clearable v-model="form.redis_password" class="narrow-input"></el-input>
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>

          <el-col :span="12"><el-form-item label="App Service URI">
              <el-input clearable v-model="form.app_service_uri"></el-input> </el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Bagged ID Header">
              <el-input clearable v-model="form.bagged_id_header"></el-input> </el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Code Login Enabled">
              <el-switch v-model="form.code_login_enabled"></el-switch> </el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Delivery List ID Header">
              <el-input clearableable v-model="form.delivery_list_id_header"></el-input> </el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Domain">
              <el-input clearable v-model="form.domain"></el-input> </el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Drop Shipping ID Header">
              <el-input clearable v-model="form.drop_shipping_id_header"></el-input> </el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Initial Password">
              <el-input clearable v-model="form.initial_password"></el-input> </el-form-item></el-col>

          <el-col :span="12"><el-form-item label="Order ID Header">
              <el-input clearable v-model="form.order_id_header"></el-input> </el-form-item></el-col>

          <el-col :span="12"><el-form-item label="Private User">
              <el-input clearable v-model="form.private_user"></el-input> </el-form-item></el-col>

          <el-col :span="12"><el-form-item label="Router Name DS">
              <el-input clearable v-model="form.router_name_ds"></el-input> </el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Router Name Provider">
              <el-input clearable v-model="form.router_name_provider"></el-input> </el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Shop Manager Password">
              <el-input clearable v-model="form.shop_manager_password"></el-input> </el-form-item></el-col>

          <!-- Main Function Dropdown -->
          <el-col :span="12" class="config-col">
            <el-form-item label="Main Function">
              <el-select v-model="form.main_function" placeholder="Select Function">
                <el-option label="Homepage" value="Homepage"></el-option>
                <el-option label="Business ERP" value="Business ERP"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Homepage Icon -->
          <el-col :span="12" class="config-col">
            <el-form-item label="Homepage Icon">
              <el-input clearable v-model="form.homepage_icon" class="narrow-input"></el-input>
            </el-form-item>
          </el-col>

          <!-- Homepage Title -->
          <el-col :span="12" class="config-col">
            <el-form-item label="Homepage Title">
              <el-input clearable v-model="form.homepage_title" class="narrow-input"></el-input>
            </el-form-item>
          </el-col>

          <!-- Homepage Title (English) -->
          <el-col :span="12" class="config-col">
            <el-form-item label="Homepage Title (English)">
              <el-input clearable v-model="form.homepage_title_en" class="narrow-input"></el-input>
            </el-form-item>
          </el-col>

          <!-- Google API Key -->
          <el-col :span="12" class="config-col">
            <el-form-item label="Google API Key">
              <el-input clearable v-model="form.google_api_key" class="narrow-input"></el-input>
            </el-form-item>
          </el-col>

          <!-- Google API Secret -->
          <el-col :span="12" class="config-col">
            <el-form-item label="Google API Secret">
              <el-input clearable v-model="form.google_api_secret" class="narrow-input"></el-input>
            </el-form-item>
          </el-col>
          <!-- Proxy Config -->
          <el-col :span="12" class="config-col">
            <el-form-item label="Proxy Config">
              <el-input clearable v-model="form.proxy_config" class="narrow-input"></el-input>
            </el-form-item>
          </el-col>

          <!-- print("Paypal Client ID:", config.paypal_client_id)
          print("Paypal Secret Key:", config.paypal_secret_key) -->

          <el-col :span="12" class="config-col">
            <el-form-item label="Paypal Client ID">
              <el-input clearable v-model="form.paypal_client_id" class="narrow-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="config-col">
            <el-form-item label="Paypal Secret Key">
              <el-input clearable v-model="form.paypal_secret_key" class="narrow-input"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" class="config-col">
            <el-form-item label="Paypal WebHook ID">
              <el-input clearable v-model="form.paypal_webhook_id" class="narrow-input"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" class="config-col">
            <el-form-item label="Paypal SandBox">
              <el-select v-model="form.paypal_sandbox" placeholder="Select Function">
                <el-option label="Sandbox" value="Sandbox"></el-option>
                <el-option label="Live" value="Live"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 新增 Docker 实例选择下拉框 -->
          <el-col :span="24">
            <!-- <div class="docker-container"> -->
            <el-form-item label="Select Docker Instance">
              <el-select v-model="selectedDockerInstance" placeholder="Please select Docker"
                @change="onDockerInstanceChange">
                <el-option v-for="docker in dockerOptions" :key="docker.container_id" :label="docker.container_name"
                  :value="docker.container_name"></el-option>
              </el-select>

              <el-button type="danger" @click="rebuildDocker" style="margin-left: 10px" :disabled="selectedDockerInstance !== 'scservice' ||
                buildDockerInstanceRunning
                " element-loading-spinner="el-icon-loading">
                <i v-if="buildDockerInstanceRunning" class="el-icon-loading"></i>
                <!-- 显示旋转图标 -->
                Rebuild Docker
              </el-button>

              <el-button type="danger" @click="redeployDocker" :disabled="selectedDockerInstance !== 'scservice'">
                Redeploy Docker
              </el-button>
              <el-button type="danger" @click="restartDocker">Restart Docker</el-button>
            </el-form-item>

            <!-- </div> -->
          </el-col>
          <!-- Supervisor 服务选择下拉框 -->
          <el-col :span="24">
            <el-form-item label="Select Supervisor Service">
              <el-select v-model="selectedSupervisorService" placeholder="Please select Supervisor Service"
                @change="onSupervisorServiceChange">
                <el-option v-for="service in supervisorServices" :key="service.service_name"
                  :label="service.service_name" :value="service.service_name"></el-option>
              </el-select>
              <el-button type="danger" @click="restartSupervisorService" :disabled="!selectedSupervisorService"
                style="margin-left: 10px">
                Restart Service
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Upload Frontend Zip">
              <el-upload class="upload-demo" action="/api/config/upload-frontend-zip"
                :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess" :on-error="handleUploadError"
                :show-file-list="false" :limit="1" accept=".zip">
                <el-button type="primary">Click to Upload</el-button>
              </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="20">
            <el-form-item>
              <div class="button-container">
                <el-button type="primary" @click="submitForm">Update</el-button>
                <el-button @click="resetForm">Reset</el-button>
                <el-button type="warning" @click="pullCode">Pull Code</el-button>
                <!-- 新增的自动滚动日志复选框 -->
                <el-checkbox v-model="autoScroll" class="auto-scroll-checkbox">Auto Scroll Logs</el-checkbox>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- Docker日志显示框 -->
    <el-card class="docker-logs-card" shadow="hover">
      <div class="logs-header">
        <h3>Logs</h3>

        <!-- 字体样式选择器 -->
        <el-select v-model="fontFamily" placeholder="Font Family" class="font-selector">
          <el-option label="Courier New" value="'Courier New', Courier, monospace"></el-option>
          <el-option label="Arial" value="Arial, sans-serif"></el-option>
          <el-option label="Verdana" value="Verdana, sans-serif"></el-option>
        </el-select>

        <!-- 字体大小选择器 -->
        <el-input-number v-model="fontSize" :min="10" :max="30" class="font-size-selector"></el-input-number>

        <!-- 字体颜色选择器 -->
        <el-color-picker v-model="fontColor" class="color-picker"></el-color-picker>
      </div>

      <div class="logs-container" :style="customLogStyle">
        <div v-for="(log, index) in dockerLogs" :key="index">
          <span v-html="highlightLog(log)"></span>
        </div>
      </div>
    </el-card>
    <!-- 弹窗显示内容 -->
    <el-dialog title="Edit Dockerfile" :visible.sync="showDockerDialog" width="50%">
      <el-input type="textarea" v-model="dockerfileContent" rows="20" class="terminal-style" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDockerEdit">取消</el-button>
        <el-button type="primary" @click="confirmDockerEdit">确认</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Edit Deploy Script" :visible.sync="showDeployDialog" width="50%">
      <el-input type="textarea" v-model="deployScriptContent" rows="20" class="terminal-style" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDeployEdit">取消</el-button>
        <el-button type="primary" @click="confirmDeployEdit">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWebSocketUrl } from '@/common/common-func';
export default {
  data() {
    const SOCKET_UUID = '07240baf-787e-4a1c-bb62-6854c6e7f036'
    return {
      fontFamily: "'Courier New', Courier, monospace", // 默认字体样式
      fontSize: 14, // 默认字体大小
      fontColor: '#ffffff', // 默认字体颜色
      dockerLogs: [], // Docker 日志数据
      supervisorLogs: [], // Supervisor 服务日志数据
      autoScroll: true, // 自动滚动控制
      dockerOptions: [], // Docker 实例选项
      supervisorServices: [], // Supervisor 服务列表
      selectedDockerInstance: '', // 选中的 Docker 实例
      buildDockerInstanceRunning: false, // 选中的 Docker 实例
      selectedSupervisorService: '', // 选中的 Supervisor 服务
      SOCKET_UUID,
      websocketUrl: getWebSocketUrl(), // 现有的 WebSocket URL

      showDockerDialog: false,
      showDeployDialog: false,
      dockerfileContent: '',
      deployScriptContent: '',

      form: {
        app_service_uri: '',
        bagged_id_header: '',
        code_login_enabled: true,
        delivery_list_id_header: '',
        domain: '',
        drop_shipping_id_header: '',
        initial_password: '',
        order_id_header: '',
        private_user: '',
        router_name_ds: '',
        router_name_provider: '',
        shop_manager_password: '',
        frontend_version: '', // 新添加的前端版本信息
        backend_version: '', // 新添加的后端版本信息
        sc_service_version: '', // 新添加的 SCService 版本信息
        start_web_socket_uuid: SOCKET_UUID,
        mongo_user: '', // MongoDB 用户
        mongo_password: '', // MongoDB 密码
        mongo_address: '', // MongoDB 地址
        mongo_port: '', // MongoDB 端口
        mongo_database: '', // MongoDB 数据库

        postgres_user: '', // PostgreSQL 用户
        postgres_password: '', // PostgreSQL 密码
        postgres_address: '', // PostgreSQL 地址
        postgres_port: '', // PostgreSQL 端口
        postgres_database: '', // PostgreSQL 数据库

        rabbitmq_host: '', // RabbitMQ 主机
        rabbitmq_port: '', // RabbitMQ 端口
        rabbitmq_user: '', // RabbitMQ 用户
        rabbitmq_password: '', // RabbitMQ 密码

        redis_address: '', // Redis 主机
        redis_password: '', // Redis 密码
        redis_port: '', // Redis 端口
        main_function: 'Homepage',       // 默认值为 "Homepage"
        homepage_icon: '',
        homepage_title: '',
        homepage_title_en: '',
        google_api_key: '',
        google_api_secret: '',
        proxy_config: '',
        paypal_client_id: '',
        paypal_secret_key: '',
        paypal_sandbox: '',
        paypal_webhook_id: '',
      },
      loading: false,
      socket: null
    }
  },
  computed: {
    customLogStyle() {
      return {
        fontFamily: this.fontFamily,
        fontSize: `${this.fontSize}px`,
        color: this.fontColor
      }
    }
  },
  methods: {
    loadConfig() {
      this.loading = true
      this.$ajax({
        url: '/api/config/get',
        method: 'get'
      })
        .then((response) => {
          this.form = response.data
          this.dockerOptions = response.data.docker_instances // 获取 Docker 实例列表
          this.supervisorServices = response.data.supervisor_services // 获取 Supervisor 服务列表
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          console.error('Failed to load config:', error)
        })
    },
    highlightLog(log) {
      // 匹配 ANSI 转义序列的正则表达式
      const ansiRegex = /\x1b\[(\d+)(;\d+)*m/g

      // ANSI 转义序列对应的样式
      const ansiToHtml = {
        30: 'color: black;', // 黑色
        31: 'color: red;', // 红色
        32: 'color: green;', // 绿色
        33: 'color: yellow;', // 黄色
        34: 'color: blue;', // 蓝色
        35: 'color: magenta;', // 洋红色
        36: 'color: cyan;', // 青色
        37: 'color: white;', // 白色
        39: 'color: initial;' // 复位颜色
      }

      // 替换 ANSI 序列为对应的 HTML 样式
      let parsedLog = log
        .replace(ansiRegex, (match, p1) => {
          return `<span style="${ansiToHtml[p1] || ''}">`
        })
        .replace(/\x1b\[0m/g, '</span>') // 复位样式

      // 高亮关键字
      const keywords = [
        'error',
        'fail',
        'warning',
        'critical',
        'exception',
        'fatal'
      ]
      keywords.forEach((keyword) => {
        const regex = new RegExp(`(${keyword})`, 'gi') // 不区分大小写的全局匹配
        parsedLog = parsedLog.replace(
          regex,
          '<span style="color: red; font-weight: bold;">$1</span>'
        )
      })

      return parsedLog // 返回解析和高亮后的日志
    },
    submitForm() {
      this.loading = true
      const formData = { ...this.form }
      const passwordFields = [
        'mongo_password',
        'postgres_password',
        'rabbitmq_password',
        'redis_password',
        'initial_password',
        'shop_manager_password'
      ]

      passwordFields.forEach((field) => {
        if (formData[field]) {
          formData[field] = {
            dv: formData[field],
            password: true
          }
        }
      })
      this.$ajax({
        url: '/api/config/update',
        method: 'put',
        data: this.form
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.$message.info('更新完成服务重启中...')
            this.checkWebSocket()
          } else {
            this.loading = false
          }
        })
        .catch((error) => {
          this.loading = false
          console.error('Update failed:', error)
        })
    },
    setupWebSocket() {
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
        this.socket = new WebSocket(
          this.websocketUrl + '/ws/notifications/' + this.SOCKET_UUID
        )
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data?.str === 'Okay') {
            this.loading = false
            this.$message.success('服务重启完成')
            this.socket.close()
            window.location.reload()
          }
          if (data?.flag) {
            this.buildDockerInstanceRunning = false
          }
          if (data && data.logs_data) {
            this.dockerLogs.push(data.logs_data)
            if (this.autoScroll) {
              this.$nextTick(() => {
                // 使用 querySelector 获取日志容器
                const container = document.querySelector('.logs-container')

                // 检查logContainer的存在
                if (container) {
                  container.scrollTop = container.scrollHeight
                } else {
                  console.error('logContainer未找到!')
                }
              })
            }
          }
        }
      }
    },
    checkWebSocket() {
      if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
        // 如果WebSocket还在连接或已打开，不做操作
      } else {
        // 如果WebSocket已关闭，重新连接
        this.setupWebSocket()
      }
    },
    onDockerInstanceChange() {
      this.logs = [] // 清除旧日志
      this.selectedSupervisorService = '' // 清除 Supervisor 服务选择
      if (!this.selectedDockerInstance) {
        this.$message.error('Please select a Docker instance.')
        return
      }
      // 发起请求获取 Docker 日志
      this.fetchLogs('docker', this.selectedDockerInstance)
    },
    onSupervisorServiceChange() {
      this.logs = [] // 清除旧日志
      this.selectedDockerInstance = '' // 清除 Docker 实例选择
      if (!this.selectedSupervisorService) {
        this.$message.error('Please select a Supervisor service.')
        return
      }
      // 发起请求获取 Supervisor 日志
      this.fetchLogs('supervisor', this.selectedSupervisorService)
    },
    fetchLogs(type, name) {
      this.$ajax({
        url: '/api/config/logs',
        method: 'post',
        data: {
          log_type: type,
          log_name: name,
          auto_scroll: this.autoScroll
        }
      })
        .then((response) => {
          this.logs = response.data.logs
          this.setupWebSocket() // 启用 WebSocket 监听日志更新
          // 启动心跳，每5分钟发送一次
          if (this.heartBeatInterval) {
            clearInterval(this.heartBeatInterval)
          }
          this.heartBeatInterval = setInterval(() => {
            this.sendHeartBeat()
          }, 300000) // 5分钟
        })
        .catch((error) => {
          console.error('Failed to load logs:', error)
        })
    },
    sendHeartBeat() {
      this.$ajax({
        url: '/api/config/heartbeat',
        method: 'post',
        data: {
          log_name: this.selectedDockerInstance?.length
            ? this.selectedDockerInstance
            : this.selectedSupervisorService
        }
      }).catch((error) => {
        console.error('Heartbeat failed:', error)
      })
    },
    pullCode() {
      this.loading = true
      this.$ajax({
        url: '/api/config/code-pull',
        method: 'post'
      })
        .then((res) => {
          if (this.$isRequestSuccessful(res.code)) {
            this.$message.info('代码拉取完成')
          } else {
            this.$message.error('代码拉取失败')
          }
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          console.error('Code pull failed:', error)
        })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.loadConfig()
    },
    rebuildDocker() {
      // 请求后端获取 Dockerfile
      this.$ajax({
        url: '/api/config/get-dockerfile',
        method: 'post',
        data: { dockername: this.selectedDockerInstance }
      })
        .then((response) => {
          if (this.$isRequestSuccessful(response.code)) {
            this.dockerfileContent = response.data.dockerfile_content // 获取的 Dockerfile 内容
            this.showDockerDialog = true // 打开弹窗显示
          }
        })
        .catch((error) => {
          console.error('Failed to load Dockerfile:', error)
        })
    },
    confirmDockerEdit() {
      // 确认修改 Dockerfile 后发送构建请求
      this.$ajax({
        url: '/api/config/build-docker',
        method: 'post',
        data: {
          dockername: this.selectedDockerInstance,
          dockerfile: this.dockerfileContent
        }
      })
        .then((response) => {
          if (this.$isRequestSuccessful(response.code)) {
            this.$message.success('Docker image 启动重建成功')
            this.buildDockerInstanceRunning = true
            this.showDockerDialog = false // 关闭弹窗
          }
        })
        .catch((error) => {
          console.error('Failed to build Docker image:', error)
        })
    },
    cancelDockerEdit() {
      this.showDockerDialog = false // 关闭弹窗
    },
    redeployDocker() {
      // 请求后端获取部署脚本
      this.$ajax({
        url: '/api/config/get-deploy-script',
        method: 'post',
        data: { dockername: this.selectedDockerInstance }
      })
        .then((response) => {
          if (this.$isRequestSuccessful(response.code)) {
            this.deployScriptContent = response.data.deploy_script_content // 获取的部署脚本内容
            this.showDeployDialog = true // 打开弹窗显示
          }
        })
        .catch((error) => {
          console.error('Failed to load deploy script:', error)
        })
    },
    confirmDeployEdit() {
      // 确认修改部署脚本后发送部署请求
      this.$ajax({
        url: '/api/config/deploy-docker',
        method: 'post',
        data: {
          dockername: this.selectedDockerInstance,
          script: this.deployScriptContent
        }
      })
        .then((response) => {
          if (this.$isRequestSuccessful(response.code)) {
            this.$message.success('Docker 部署成功')
            this.showDeployDialog = false // 关闭弹窗
          }
        })
        .catch((error) => {
          console.error('Failed to deploy Docker:', error)
        })
    },
    cancelDeployEdit() {
      this.showDeployDialog = false // 关闭弹窗
    },
    restartDocker() {
      // 直接调用后端的重启接口
      this.$ajax({
        url: '/api/config/restart-docker',
        method: 'post',
        data: { dockername: this.selectedDockerInstance }
      })
        .then((response) => {
          if (this.$isRequestSuccessful(response.code)) {
            this.$message.success('Docker 重启成功')
          }
        })
        .catch((error) => {
          console.error('Failed to restart Docker:', error)
        })
    },
    handleBeforeUpload() {
      // 上传开始时将 loading 设置为 true
      this.loading = true;
    },
    handleUploadSuccess(response) {
      // 上传成功后，设置 loading 为 false
      this.loading = false;
      if (this.$isRequestSuccessful(response.code)) {
        this.$message.success("Upload successful!");
      } else {
        this.$message.error("Upload failed!");
      }
      window.location.reload()
    },
    handleUploadError(error) {
      // 上传失败后，设置 loading 为 false
      this.loading = false;
      this.$message.error("Upload failed!");
      // 处理上传失败的逻辑
    },
    restartSupervisorService() {
      if (!this.selectedSupervisorService) {
        this.$message.error("Please select a Supervisor service.");
        return;
      }
      this.loading = true; // 开始加载状态
      this.$ajax({
        url: '/api/config/restart-supervisor',
        method: 'post',
        data: { service_name: this.selectedSupervisorService }
      })
        .then((response) => {
          this.loading = false;
          if (this.$isRequestSuccessful(response.code)) {
            this.$message.success("Supervisor service restarted successfully.");
          } else {
            this.$message.error("Failed to restart service.");
          }
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error("Error restarting service.");
          console.error('Error restarting supervisor service:', error);
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadConfig()
      this.setupWebSocket()
    })
  }
}
</script>

<style scoped lang="scss">
/* 外层容器设置全屏flex布局 */
/* 外层容器设置全屏flex布局 */
.container {
  display: flex;
  justify-content: flex-start;
  /* 将卡片整体向左移动 */
  align-items: flex-start;
  height: 100vh;
  /* 设置高度为视口高度 */
  padding: 20px;
}

/* 配置卡片 */
.config-card {
  border-radius: 5px;
  width: 900px;
  margin: 0 20px 0 0;
  /* 确保卡片向左移动并留出右侧空白 */
}

/* Docker 日志框样式 */
.docker-logs-card {
  width: 900px;
  /* Docker 日志框占 35% 宽度 */
  border-radius: 5px;
  /* 圆角 */
  margin: 0;
  height: 86vh;
  padding: 15px;
  background-color: #f9f9f9;
  overflow-y: auto;
}

.logs-container {
  max-height: 100%;
  /* 确保日志内容可以溢出 */
  overflow-y: auto;
  /* 内容超出时出现滚动条 */
  background-color: #1e1e1e;
  /* 深色背景 */
  color: #ffffff;
  /* 白色字体 */
  padding: 10px;
  /* 适当的内边距，防止内容贴边 */
  font-family: 'Courier New', Courier, monospace;
  /* 使用等宽字体 */
  font-size: 14px;
  /* 调整字体大小 */
  line-height: 1.5;
  /* 行距 */
  border-radius: 8px;
  /* 添加圆角边框 */
  border: 1px solid #333;
  /* 边框颜色 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  /* 添加轻微阴影 */
  height: 75vh;
  /* 设置一个高度，确保内容溢出时可以滚动 */
  background-clip: padding-box;
  /* 背景裁剪，使背景停留在内边距内 */
  box-sizing: border-box;
  /* 确保内边距和边框计算在内 */
  user-select: text;
  /* 允许用户选择和复制日志内容 */
}

/* 自定义滚动条样式，使其位于圆角内 */
.logs-container::-webkit-scrollbar {
  width: 8px;
  /* 滚动条宽度 */
}

.logs-container::-webkit-scrollbar-thumb {
  background-color: #666;
  /* 滚动条颜色 */
  border-radius: 4px;
  /* 滚动条圆角，和容器圆角保持一致 */
}

.logs-container::-webkit-scrollbar-track {
  background-color: #333;
  /* 滚动条轨道颜色 */
  border-radius: 8px;
  /* 滚动条轨道与容器边框保持一致的圆角 */
}

.logs-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  /* 与日志内容区域间隔开 */
}

.logs-header h3 {
  margin-right: 20px;
  /* "Logs" 标题与选择控件间保持 20px 间距 */
  color: #333;
}

.font-selector,
.font-size-selector,
.color-picker {
  margin-right: 10px;
  /* 选择控件之间的间距 */
}

/* 自定义滚动条样式 */
.logs-container::-webkit-scrollbar {
  width: 8px;
  /* 滚动条宽度 */
}

.logs-container::-webkit-scrollbar-thumb {
  background-color: #666;
  /* 滚动条颜色 */
  border-radius: 4px;
  /* 滚动条圆角 */
}

.logs-container::-webkit-scrollbar-track {
  background-color: #333;
  /* 滚动条轨道颜色 */
}

.button-container {
  display: flex;
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

/* 炫彩版本信息样式 */
.version-info-alert {
  background: linear-gradient(to right,
      #ff6b6b,
      #feca57,
      #ff9f43,
      #1dd1a1,
      #5f27cd);
  color: white;
  font-weight: bold;
  text-align: center;
}

/* 给复选框添加 margin-left */
.auto-scroll-checkbox {
  margin-left: 10px;
}

.use-for-margin {
  margin: 20px, 0, 20px, 0;
}

.docker-container {
  margin-left: 0px;
}

.terminal-style {
  ::v-deep .el-textarea__inner {
    background-color: #1e1e1e;
    /* 深色背景 */
    color: #00ff00;
    /* 绿色字体，模拟命令行风格 */
    font-family: 'Courier New', Courier, monospace;
    /* 等宽字体 */
    font-size: 14px;
    /* 字体大小 */
    padding: 10px;
    /* 内边距 */
    border-radius: 5px;
    /* 圆角边框 */
    border: 1px solid #333;
    /* 边框颜色 */
    line-height: 1.5;
    /* 行高 */
    box-sizing: border-box;
    /* 确保内边距和边框计算在内 */
    white-space: pre;
    /* 保持空格和换行符 */
    overflow-y: auto;
    /* 允许滚动 */
    min-height: 300px;
    /* 设置最小高度 */
  }
}

.terminal-style:focus {
  outline: none;
  /* 移除默认的输入框聚焦样式 */
  border-color: #00ff00;
  /* 在聚焦时显示绿色边框 */
}

.narrow-input {
  width: 100%;
  /* 统一设置输入框宽度 */
}

.config-card-child {
  padding: 15px;
  /* 卡片内容的内边距 */
  border-radius: 5px;
  max-width: 400px;
}

.config-card {
  padding: 15px;
  /* 卡片内容的内边距 */
}
</style>
