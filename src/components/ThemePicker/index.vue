<template>
  <el-switch
    class="tableScopeSwitch"
    v-model="currentTheme"
    ref="switchButton"
    style="margin: 0px 10px"
    @change="themeChange"
  >
  </el-switch>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRoleType, getRoleTypeForP } from '@/common/common-func'
import { config, dropShipper } from '@/common/commonconfig'
import { updateGlobalSettings, resolvePreferenceProviderUuid } from '@/common/global-user-settings'
import { applyDocumentTheme, normalizeTheme, THEME_DEFAULT } from '@/common/theme'

export default {
  data () {
    return {
      currentTheme: true, // true -> defaultTheme, false -> darkTheme
      themesName: THEME_DEFAULT
    }
  },
  computed: {
    ...mapGetters(['theme'])
  },
  watch: {
    theme: {
      immediate: true,
      handler (val) {
        const normalized = normalizeTheme(val || THEME_DEFAULT)
        this.themesName = normalized
        const boolValue = normalized === 'defaultTheme'
        if (this.currentTheme !== boolValue) {
          this.currentTheme = boolValue
        }
        this.applyTheme(normalized, false)
      }
    }
  },
  methods: {
    async themeChange (val) {
      const nextTheme = val ? 'defaultTheme' : 'darkTheme'
      this.themesName = nextTheme
      this.applyTheme(nextTheme, true)
      this.$emit('change', nextTheme)
      this.$store.dispatch('user/changeSetting', { key: 'theme', value: nextTheme, persist: false })

      const role = this.resolveRoleType()
      const provider_uuid = resolvePreferenceProviderUuid(this.$store, role)
      const updates = {
        default_theme: nextTheme,
        defaultTheme: nextTheme,
        theme: nextTheme,
        ui_theme: nextTheme,
        theme_preference: nextTheme
      }
      try {
        await updateGlobalSettings({ updates, roleType: role, provider_uuid })
      } catch (e) {
        // ignore persistence errors, UI state already updated
      }
    },
    applyTheme (themeName, animate) {
      applyDocumentTheme(themeName || THEME_DEFAULT)
      if (!animate) return
      const refEl = this.$refs.switchButton && this.$refs.switchButton.$el
      if (!refEl) return
      const rect = refEl.getBoundingClientRect()
      const clientX = rect.left + rect.width / 2
      const clientY = rect.top + rect.height / 2
      const radius = Math.hypot(
        Math.max(clientX, window.innerWidth - clientX),
        Math.max(clientY, window.innerHeight - clientY)
      )
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0% at ${clientX}px ${clientY}px)`,
            `circle(${radius}px at ${clientX}px ${clientY}px)`
          ]
        },
        { duration: 500 }
      )
    },
    resolveRoleType () {
      let role = getRoleType(window.location.pathname) || this.$store.state.user.roles || dropShipper
      if (role === config.provider.role) {
        role = getRoleTypeForP() || role
      }
      return role || dropShipper
    }
  }
}
</script>
<style lang="scss" scoped>
// ::v-deep .el-switch__core {
//   width: 80;
//   height: 24px;
// }
::v-deep .el-switch__core:after {
  background-image: var(--cusom-switch-background-svg);
  background-color: transparent; /* 去掉背景色 */
  background-size: cover;
  width: 16px;
  height: 16px;
}
</style>

