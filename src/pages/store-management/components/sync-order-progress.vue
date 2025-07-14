<template>
  <div id="sync-order-progress" class="sync-order-progress">
    <el-row type="flex" justify="center">
      <div class="progress-container">
        <el-progress v-show="progressVisible" :type="progressType" :percentage="percentage" :color="colors"
          :status="progressStatus" :text-inside="true" :stroke-width="progressType === 'line' ? 20 : 6"
          :style="{ width: progressType === 'line' ? '200px' : 'auto' }"></el-progress>
        <div>
          <!-- 按钮同行显示 -->
          <el-button plain type="success" size="mini" @click="startSyncOrderOverride" v-show="!startButtonDisabled">
            <i v-if="startButtonDisabled" class="el-icon-loading"></i>
            <i v-else class="icon-cst-inventory-kaishi"></i>
            {{ $t('message.storeSettings.startSyncOrder') }}
          </el-button>
          <el-button plain icon="icon-cst-inventory-tingzhi" type="danger" size="mini" @click="stopSyncOrderOverride"
            v-show="!stopButtonDisabled">
            {{ $t('message.storeSettings.stopSyncOrder') }}
          </el-button>
        </div>
      </div>
    </el-row>
  </div>
</template>


<script>
import { startSyncOrder, getSyncOrderStatus, stopSyncOrder, getWebSocketUrl } from '@/common/common-func'
export default {
  name: 'sync-order-progress',
  props: {
    shop_url: {
      type: String,
      default: ''
    },
    progressType: {
      type: String,
      default: 'line'  // 可以是 'circle' 或 'line'
    },
    orderNames: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      percentage: 0,
      startButtonDisabled: false,
      stopButtonDisabled: true,
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
    stopSyncOrder,
    startSyncOrder,
    getSyncOrderStatus,
    stopSyncOrderOverride() {
      if (!this.mission_id) {
        console.error('mission_id is empty');
        return;
      }
      this.stopButtonDisabled = true;
      this.stopSyncOrder({ mission_id: this.mission_id }).then(res => {
        this.startButtonDisabled = false;
        this.$message.warning(this.$t('message.storeSettings.stopSyncOrder'))
        this.progressVisible = false;
        this.percentage = 0
        this.ws.close();
      }).catch(err => {
        console.error('Error stopping sync products:', err);
        this.stopButtonDisabled = false;
        this.startButtonDisabled = true;
        this.progressVisible = false;
      });
    },
    startSyncOrderOverride() {
      this.startButtonDisabled = true;
      this.stopButtonDisabled = false;
      this.progressVisible = true;
      this.$message.warning(this.$t('message.storeSettings.startSyncOrderMessage'))
      const shop_url = this.shop_url === '' ? {} : {
        shop_url: this.shop_url
      }
      const orderList = this.orderNames ? this.orderNames : []
      this.startSyncOrder(shop_url, orderList).then(res => {
        this.triggerSyncFromParent();
      }).catch(err => {
        console.error('Error starting sync products:', err);
        this.startButtonDisabled = false;
        this.stopButtonDisabled = true;
        this.progressVisible = false
      });
    },
    triggerSyncFromParent() {
      // 查询同步状态如果存在任务则直接websocket展示进度
      this.getSyncOrderStatus({ provider_uuid: this.provider_uuid }).then(res => {
        if (res?.data && res.data?.mission_id) {
          this.startButtonDisabled = true;
          this.stopButtonDisabled = false;
          this.progressVisible = true;
          this.setupWebSocket(res.data.mission_id);
        } else {
          this.startSyncOrderOverride();
        }
      }).catch(err => {
        console.error('Error querying sync status:', err);
        this.startButtonDisabled = false;
        this.stopButtonDisabled = true;
        this.progressVisible = false;
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
            this.startButtonDisabled = false;
            this.stopButtonDisabled = true;
            this.progressVisible = false;
            this.ws.close();
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
      this.ws.onclose = (error) => {
        console.error('WebSocket connection closed:', error);
      };
    },
  },
  mounted() {
  },
  computed: {
    provider_uuid() {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },

  }
}
</script>

<style scoped lang='css'>
.sync-order-progress {
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
