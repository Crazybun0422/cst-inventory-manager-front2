<!--
* @description  Shopify one-step onboarding dialog
* @fileName  third-part-key-information
* @author wjp
* @date 2024-08-30 22:17:18
!-->
<template>
  <div id="third-part-key-information" class="third-part-key-information">
    <WorldFlightBackground :lang="$i18n.locale" :flight-count="4" :feather-density="24" :feather-scale="1.15" />
    <div class="brand-logo">
      <img src="@/assets/logo-no-background.svg" alt="logo" />
      <div class="brand-logo-text">Wing Dropship</div>
    </div>
    <div class="lang-switch">
      <a-switch size="small" :checked="isEnglish" @change="toggleLanguage" checkedChildren="EN" unCheckedChildren="中" />
    </div>
    <el-dialog :visible.sync="dialogVisible" width="720px" top="8vh" :show-close="false" :close-on-press-escape="false"
      :close-on-click-modal="false" :modal="false" v-loading="loading">
      <AutoOnboardingSteps />
    </el-dialog>
  </div>
</template>

<script>
import AutoOnboardingSteps from '@/pages/login/components/auto-onboarding-steps.vue'
import WorldFlightBackground from '@/components/world-flight-background.vue'
import { setLanguge } from '@/common/language'
export default {
  name: 'third-part-key-information',
  components: {
    AutoOnboardingSteps,
    WorldFlightBackground
  },
  data() {
    return {
      dialogVisible: true,
      loading: false,
    }
  },
  computed: {
    isEnglish() { return this.$i18n.locale === 'en_us' },
  },
  methods: {
    toggleLanguage(checked) {
      const lang = checked ? 'en_us' : 'zh_cn'
      this.$i18n.locale = lang
      setLanguge(lang)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
}

::v-deep .el-dialog__header {
  display: none;
}

::v-deep .el-dialog__body {
  padding: 0;
  background: transparent;
}

.brand-logo {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 4000;

  img {
    width: 150px;
    height: 150px;
    display: block;
    margin-top: -24px;
    margin-left: 30px;
  }
}

.brand-logo-text {
  position: absolute;
  top: 120px;
  left: 8px;
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  line-height: 1;
}

.lang-switch {
  position: fixed;
  top: 24px;
  right: 96px;
  z-index: 4000;
}
</style>
<!--
* @description  Shopify one-step onboarding dialog
* @fileName  third-part-key-information
* @author wjp
* @date 2024-08-30 22:17:18
!-->
<template>
  <div id="third-part-key-information" class="third-part-key-information">
    <WorldFlightBackground :lang="$i18n.locale" :flight-count="4" :feather-density="24" :feather-scale="1.15" />
    <div class="brand-logo">
      <img src="@/assets/logo-no-background.svg" alt="logo" />
      <div class="brand-logo-text">Wing Dropship</div>
    </div>
    <div class="lang-switch">
      <a-switch size="small" :checked="isEnglish" @change="toggleLanguage" checkedChildren="EN" unCheckedChildren="中" />
    </div>
    <el-dialog :visible.sync="dialogVisible" width="720px" top="8vh" :show-close="false" :close-on-press-escape="false"
      :close-on-click-modal="false" :modal="false" v-loading="loading">
      <AutoOnboardingSteps />
    </el-dialog>
  </div>
</template>

<script>
import AutoOnboardingSteps from '@/pages/login/components/auto-onboarding-steps.vue'
import WorldFlightBackground from '@/components/world-flight-background.vue'
import { setLanguge } from '@/common/language'
export default {
  name: 'third-part-key-information',
  components: {
    AutoOnboardingSteps,
    WorldFlightBackground
  },
  data() {
    return {
      dialogVisible: true,
      loading: false,
    }
  },
  computed: {
    isEnglish() { return this.$i18n.locale === 'en_us' },
  },
  methods: {
    toggleLanguage(checked) {
      const lang = checked ? 'en_us' : 'zh_cn'
      this.$i18n.locale = lang
      setLanguge(lang)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
}

::v-deep .el-dialog__header {
  display: none;
}

::v-deep .el-dialog__body {
  padding: 0;
  background: transparent;
}

.brand-logo {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 4000;

  img {
    width: 150px;
    height: 150px;
    display: block;
  }
}

.brand-logo-text {
  position: absolute;
  top: 120px;
  left: 8px;
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  line-height: 1;
}

.lang-switch {
  position: fixed;
  top: 24px;
  right: 96px;
  z-index: 4000;
}
</style>
