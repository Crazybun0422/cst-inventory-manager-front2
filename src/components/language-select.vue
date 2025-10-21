<template>
  <div>
    <el-select
      v-model="languageType"
      @change="changeLanguage"
      :disabled="disabled"
    >
      <el-option
        v-for="item in languageOptions"
        :key="item.value"
        :label="item.label[$languageType]"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { languageOptions } from '@/common/field-maping'
import { updateGlobalSettings, resolvePreferenceProviderUuid, hasGlobalSettingsToken } from '@/common/global-user-settings'
import { getRoleType, getRoleTypeForP } from '@/common/common-func'
import { config, dropShipper } from '@/common/commonconfig'

export default {
  name: 'LanguageSelect',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      languageOptions,
      languageType: ''
    }
  },
  computed: {
    defaultLanguage () {
      return this.$store.state.user.defaultLanguage
    }
  },
  methods: {
    async changeLanguage (newValue) {
      this.languageType = newValue
      this.$store.dispatch('user/getDefaultLanguage', newValue)
      this.$i18n.locale = newValue
      this.$forceUpdate()

      const role = this.resolveRoleType()
      if (hasGlobalSettingsToken(role)) {
        const provider_uuid = resolvePreferenceProviderUuid(this.$store, role)
        const updates = {
          default_language: newValue,
          defaultLanguage: newValue,
          language: newValue,
          ui_language: newValue
        }
        try {
          await updateGlobalSettings({ updates, roleType: role, provider_uuid })
        } catch (e) {
          // persistence errors are non-blocking for UI
        }
      }
    },
    resolveRoleType () {
      let role = getRoleType(window.location.pathname) || this.$store.state.user.roles || dropShipper
      if (role === config.provider.role) {
        role = getRoleTypeForP() || role
      }
      return role || dropShipper
    }
  },
  mounted () {
    this.languageType = this.defaultLanguage
  },
  watch: {
    defaultLanguage (newLang) {
      this.languageType = newLang
    }
  }
}
</script>

