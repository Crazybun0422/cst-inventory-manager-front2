<template>
  <div id="sync-products-progress" class="sync-products-progress">
    <el-row type="flex" justify="center" :class="{ 'inline-progress': inlineProgress }">
      <div class="progress-container">
        <el-button :style="{
          background: `linear-gradient(to right, #4a90e2 ${percentage}%, #e0e0e0 ${percentage}%)`,
          color: '#ffffff',
          width: '160px',
          height: '30px',
          borderRadius: '2px',
          textAlign: 'center' /* 确保字体居中 */,
          lineHeight: '36px' /* 设置行高与按钮高度一致，确保文字垂直居中 */,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center' /* 垂直和水平居中 */
        }" type="success" @click="toggleSyncProducts" :disabled="loading">
          <i v-if="loading" class="el-icon-loading"></i>
          <i v-else-if="!isSyncing" class="icon-cst-inventory-kaishi"></i>
          <i v-else class="icon-cst-inventory-tingzhi"></i>
          {{
            isSyncing
              ? $t('message.storeSettings.stopSyncProducts')
              : $t('message.storeSettings.startSyncProducts')
          }}
        </el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import { startSyncProducts, getSyncStatus, stopSyncProducts, getWebSocketUrl } from '@/common/common-func'
export default {
  name: 'sync-products-progress',
  props: {
    shop_url: {
      type: String,
      default: ''
    },
    progressType: {
      type: String,
      default: 'circle'  // 可以是 'circle' 或 'line'
    },
    inlineProgress: {
      type: Boolean,
      default: false  // 默认不与按钮同行显示
    }
  },
  data() {
    return {
      percentage: 0,
      loading: false,
      isSyncing: false,
      progressVisible: false,
      progressStatus: null,
      websocketUrl: getWebSocketUrl(),
      mission_id: '',
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
    startSyncProducts,
    getSyncStatus,
    stopSyncProducts,
    toggleSyncProducts() {
      if (this.isSyncing) {
        this.stopSyncProductsOverride();
      } else {
        this.startSyncProductsOverride();
      }
    },
    startSyncProductsOverride() {
      this.loading = true;
      this.$message.warning('[' + this.shop_url + ']: ' + this.$t('message.storeSettings.startSyncProductsMessage'));
      this.startSyncProducts({ shop_url: this.shop_url }).then(res => {
        this.loading = false;
        if (res?.data && res.data?.mission_id) {
          this.mission_id = res.data.mission_id;
          this.setupWebSocket(res.data.mission_id);
          this.isSyncing = true;
          this.progressVisible = true;
        }
      }).catch(err => {
        console.error('Error starting sync products:', err);
        this.loading = false;
      });
    },
    stopSyncProductsOverride() {
      if (!this.mission_id) {
        console.error('mission_id is empty');
        return;
      }
      this.loading = true;
      this.stopSyncProducts({ shop_url: this.shop_url, mission_id: this.mission_id }).then(res => {
        this.loading = false;
        this.isSyncing = false;
        this.$message.warning(this.$t('message.storeSettings.stopSyncProducts'));
        this.progressVisible = false;
        this.percentage = 0;
        if (this.ws) {
          this.ws.close();
        }
      }).catch(err => {
        console.error(err);
        this.loading = false;
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
          this.percentage = data.progress;
          if (data.progress === 100) {
            this.progressStatus = 'success';
            this.isSyncing = false;
            this.progressVisible = false;
            this.percentage = 0;
            if (this.ws) {
              this.ws.close();
            }
            // 发送完成信号到父组件
            this.$emit('sync-completed', { mission_id: this.mission_id });
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
    restoreSyncStatus() {
      this.getSyncStatus({ shop_url: this.shop_url }).then(res => {
        if (res?.data && res.data.mission_id) {
          this.mission_id = res.data.mission_id;
          this.setupWebSocket(this.mission_id);
          this.isSyncing = true;
          this.progressVisible = true;
          // this.$message.success(this.$t('message.storeSettings.restoreSyncStatus'));
        }
      }).catch(err => {
        console.error('Error restoring sync status:', err);
      });
    }
  },
  mounted() {
    this.restoreSyncStatus();
  }
}
</script>

<style scoped lang='css'>
.sync-products-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  /* 添加间距 */
}

.el-button {
  transition: background 0.3s ease-in-out;
}
</style>