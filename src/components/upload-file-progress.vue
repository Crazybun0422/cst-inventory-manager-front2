<template>
  <div id="sync-products-progress" class="sync-products-progress">
    <el-row type="flex" justify="center" class="inline-progress">
      <div class="progress-container">
        <el-progress :percentage="percentage" :type="progressType" :color="colors" :status="progressStatus"
          :text-inside="inlineProgress" :stroke-width="progressType === 'line' ? 10 : 6"
          :style="{ width: progressType === 'line' ? '500px' : 'auto' }"></el-progress>
        <div>
          <el-button plain icon="icon-cst-inventory-tingzhi" type="danger" size="mini" @click="stopUpload"
            :disabled="progressStatus === 'success'">
            {{ $t('common.stopUpload') }}
          </el-button>
          <!-- <el-button
          plain
          icon="el-icon-refresh-right"
          type="warning"
          size="mini"
          @click="resetUpload"
        >
          {{ $t('common.reset') }}
        </el-button> -->
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import { stopSyncOrder, resetSyncOrder, getWebSocketUrl } from '@/common/common-func'
export default {
  name: 'upload-file-progress',
  props: {
    progressType: {
      type: String,
      default: 'line'
    }, inlineProgress: {
      type: Boolean,
      default: false  // 默认不与按钮同行显示
    },
    mission_id: {
      type: String,
      required: ''
    },
  },
  data() {
    return {
      percentage: 0,
      progressStatus: null,
      websocketUrl: getWebSocketUrl(),
      colors: [
        { color: '#c0392b', percentage: 20 },
        { color: '#d35400', percentage: 40 },
        { color: '#e67e22', percentage: 60 },
        { color: '#27ae60', percentage: 80 },
        { color: '#2ecc71', percentage: 100 }
      ],
      ws: null

    }
  },
  methods: {
    stopSyncOrder,
    resetSyncOrder,
    stopUpload() {
      this.stopSyncOrder({ mission_id: this.mission_id }).then(() => {
        this.progressStatus = 'exception';
        this.ws.close();
      }).catch((error) => {
        console.error('stopSyncOrder error:', error);
      });
    },
    resetUpload() {
      this.resetSyncOrder({ mission_id: this.mission_id }).then(() => {
        this.progressStatus = null;
        this.percentage = 0;
        this.setupWebSocket(this.mission_id);
      }).catch((error) => {
        console.error('resetSyncOrder error:', error);
      });
    },
    setupWebSocket(mission_id) {
      if (this.ws) {
        this.ws.close();
      }
      const wsUrl = `${this.websocketUrl}/ws/common_progress/${mission_id}`;
      this.ws = new WebSocket(wsUrl);
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.progress) {
          this.$emit("satrt-upload")
          this.percentage = data.progress;
          if (data.progress === 100) {
            this.progressStatus = 'success';
            this.ws.close();
            // 发送完成信号到父组件
            // this.$emit('options-completed', { mission_id: this.mission_id });
            this.$emit('fulfill-status-info', this.mission_id)
          } else {
            this.progressStatus = null;
          }
        }
      };
      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
      this.ws.onclose = () => {
        console.error('WebSocket connection closed');
      };
    },
  },
  watch: {
    mission_id(val) {
      if (val !== '' && val !== undefined) {
        this.setupWebSocket(val);
      }

    }
  }
}
</script>

<style scoped>
.sync-products-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-row {
  margin-top: 20px;
}

.button-row .el-button {
  margin: 0 10px;
}

.progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  /* 添加间距 */
}
</style>