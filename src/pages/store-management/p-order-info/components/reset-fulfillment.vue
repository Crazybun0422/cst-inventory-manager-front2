<template>
  <el-dialog
    :title="$t('common.prompt')"
    :visible.sync="dialogVisible"
    width="30%"
    :modal="false"
    @close="cancelDialog"
  >
    <div v-for="(item, index) in errorData" :key="index" class="error-item">
      <!-- 先显示 orderNames, 然后显示错误信息，分别设置样式 -->
      <p>
        <span class="order-names">[{{ item.orderNames.join(', ') }}]</span>:
        <span class="error-message">{{ item.message }}</span>
      </p>
    </div>

    <!-- 底部操作按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click.stop="resetDialog" type="danger">{{
        $t('common.reset')
      }}</el-button>
      <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    // 父组件传递的错误数据
    errorData: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    mission_id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,  // 控制对话框的显示
    };
  },
  methods: {

    // 取消操作
    cancelDialog () {
      this.dialogVisible = false;
      this.$emit('close')
    },
    // 重置操作（例如，清空错误数据或重置某些状态）
    resetDialog () {
      this.$emit('reset-fulfillment', this.mission_id);
      this.dialogVisible = false;
    }
  },
  watch: {
    visible: {
      handler (val) {
        this.dialogVisible = val;
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.order-names {
  color: #409eff;
  font-weight: bold;
}

.error-message {
  color: #f10c0c;
  font-weight: bold;
}
</style>
