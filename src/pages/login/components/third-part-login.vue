<template>
  <div id="third-part-login" class="third-part-login">
    <div class="third-party-login" v-show="currentPathName !== 'p-login'">
      <!-- 第三方登录 -->
      <div class="third-party-account">
        <el-row :gutter="20">
          <div class="third-party-style">
            <div class="third-party-content" @click="redirectToGoogleLogin" :disabled="isLoading">
              <svg class="icon third-party-account-icon"
                :class="['icon', 'third-party-account-icon', { 'disabled-icon': disabled || isLoading }]"
                aria-hidden="true">
                <use xlink:href="#icon-cst-inventory-google" />
              </svg>
              <span v-if="!isLoading">{{ $t('message.login.signInWithGoogle') }}</span>
              <span v-else>{{ $t('message.login.googleProcessing') }}</span> <!-- 显示加载中的文本 -->
            </div>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'third-part-login',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      redirectUrl: window.location.hostname,
      isLoading: false, // 添加isLoading状态
    }
  },
  methods: {
    redirectToGoogleLogin() {
      this.isLoading = true; // 设置加载状态
      const uri = encodeURIComponent(`https://${this.redirectUrl}/auth/complete/google/`);
      window.location.href = `https://${this.redirectUrl}/auth/login/google/?next=${uri}`;
    }
  },
  computed: {
    currentPathName() {
      return this.$route.name
    }
  },
  mounted() { },
  watch: {}
}
</script>

<style scoped lang="scss">
.third-party-account {
  display: flex;
  justify-content: center;
}

.third-party-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 26px;
  cursor: pointer;
  opacity: 1;
  /* 确保按钮是可见的 */

  svg {
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }

  span {
    color: var(--custom-font-color);
  }
}

.third-party-account-icon {
  margin-right: 8px;
  /* 图标和文字之间的间距 */
}

.third-party-account-icon {
  width: 40px;
  height: 40px;
  transition: opacity 0.3s;
  opacity: 1; // 默认完全不透明

  &:hover {
    cursor: pointer;
  }
}

.disabled-icon {
  opacity: 0.5; // 禁用时降低透明度
  pointer-events: none; // 禁用鼠标事件
  cursor: default;
}
</style>
