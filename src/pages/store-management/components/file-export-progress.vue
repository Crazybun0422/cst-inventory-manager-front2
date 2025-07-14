<template>
  <div id="file-export-progress" class="file-export-progress">
    <el-dialog :title="$t('common.fileExportProgress')" :visible.sync="dialogVisible" width="30%"
      :before-close="handleClose" v-loading="loading">

      <!-- 文件条目展示 -->
      <div v-if="!fileName" class="file-entry-info">
        <span>{{ $t('common.exportedEntries') }}: {{ currentEntryCount }}</span>
      </div>

      <!-- 文件下载按钮 -->
      <div v-if="fileName" class="file-download-center">
        <el-button type="primary" @click="downloadFile({ name: fileName })">
          {{ $t('common.download') }}
        </el-button>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="stopExport">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="toExport" :disabled="exportButtonDisabled">
          {{ $t('common.reset') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWebSocketUrl } from '@/common/common-func';

export default {
  name: 'file-export-progress',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    current_file_id: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      websocketUrl: getWebSocketUrl(),
      websock: null,
      reconnectData: null,
      lockReconnect: false,
      shouldReconnect: true,
      currentEntryCount: 0,  // 当前导出的条目数
      fileName: '',
      exportButtonDisabled: true
    };
  },
  methods: {
    // 获取文件导出状态
    async get_file_export_status() {

      const provider_uuid = localStorage.getItem('shop_provider_uuid');
      try {
        const res = await this.$ajax.get('/api/shop-manager/query-export-mission', {
          params: { provider_uuid: provider_uuid },
          roleType: this.roleType
        });
        console.log(res)
        if (this.$isRequestSuccessful(res.code) && res.data?.filename) {
          this.fileName = res.data.filename;
          this.exportButtonDisabled = false;
          this.dialogVisible = true;
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 启动文件导出
    toExport() {
      this.$emit('export', this.fileName);
    },

    // 自定义进度条颜色（在这种情况不再使用）
    customColorMethod(percentage) {
      return '#909399';  // 这里不再使用进度条的颜色
    },

    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
      this.$emit('close');
    },

    // 停止导出
    stopExport() {
      this.$emit('stop');
    },

    // 初始化WebSocket连接
    initWebSocket(current_file_id) {
      this.websock = new WebSocket(this.websocketUrl + '/ws/common_progress/' + current_file_id);
      this.websock.onopen = this.websocketonopen;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },

    // WebSocket连接成功
    websocketonopen() {
      // 可以做心跳检测
    },

    // WebSocket连接失败
    websocketonerror() {
      if (this.shouldReconnect) {
        this.reconnect();
      }
    },

    // WebSocket接收到消息
    websocketonmessage(event) {
      if (event === undefined || event.data === undefined || event.data === '') {
        return;
      }
      let msgData = JSON.parse(event.data);
      // 更新当前已导出的条目数
      this.currentEntryCount = msgData.processedEntries;
    },

    // WebSocket连接关闭
    websocketclose() {
      if (this.shouldReconnect) {
        this.reconnect();
      }
    },

    // 关闭WebSocket连接
    closeWebSocket() {
      if (this.websock) {
        this.shouldReconnect = false;
        this.websock.close();
        this.websock = null;
      }
    },

    // 重连WebSocket
    reconnect() {
      if (this.lockReconnect) {
        return;
      }
      this.lockReconnect = true;
      this.reconnectData && clearTimeout(this.reconnectData);
      this.reconnectData = setTimeout(() => {
        this.initWebSocket(this.current_file_id);
        this.lockReconnect = false;
      }, 5000);
    },

    // 下载文件
    async downloadFile(file) {
      try {
        this.loading = true;
        const fileName = file.name;
        const res = await this.$ajax({
          url: '/api-prefix/api/get-file-independently/',
          method: 'get',
          responseType: 'blob',
          params: { filename: fileName }
        });
        const blob = new Blob([res], { type: "application/vnd.ms-excel" });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.get_file_export_status();
  },
  watch: {
    visible(val) {
      if (val) {
        this.dialogVisible = val;
      }
    },
    current_file_id(val) {
      if (val) {
        this.initWebSocket(val);
      }
    }
  }
};
</script>

<style scoped lang='css'>
::v-deep .el-dialog__footer {
  text-align: center;
  margin: 0 auto;
}

.file-entry-info {
  text-align: center;
  margin: 20px 0;
}

.file-download-center {
  text-align: center;
  padding: 20px;
}
</style>
