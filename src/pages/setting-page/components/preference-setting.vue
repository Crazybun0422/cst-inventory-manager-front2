<template>
  <div id="preference-setting" class="preference-setting">
    <PageHead :title="$t('message.userInfo.preferenceSettings')"> </PageHead>
    <el-form
      label-position="top"
      :model="preferenceSettingForm"
      ref="preferenceSetting"
      label-width="100px"
      class="demo-dynamic"
      v-loading="loading"
    >
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item
            prop="email"
            :label="$t('message.userInfo.defaultLanguage')"
          >
            <el-select
              v-model="preferenceSettingForm.defaultLanguage"
              :placeholder="$t('message.userInfo.pleaseSelectDefaultLanguage')"
            >
              <el-option
                v-for="item in languageOptions"
                :key="item.value"
                :label="item.label[$languageType]"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="email" :label="$t('common.theme')">
            <el-select
              v-model="preferenceSettingForm.defaultTheme"
              :placeholder="$t('common.pleaseDefaultTheme')"
            >
              <el-option
                v-for="item in defaultThemeOptions"
                :key="item.value"
                :label="item.label[$languageType]"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-left: 10px"
              type="primary"
              @click="sePersonalPreferences"
              >{{ $t('common.setting') }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import { languageOptions, defaultThemeOptions } from '@/common/field-maping'
import { loadGlobalSettings, updateGlobalSettings, resolvePreferenceProviderUuid, hasGlobalSettingsToken } from '@/common/global-user-settings'
import { getRoleType, getRoleTypeForP } from '@/common/common-func'
import { config, dropShipper } from '@/common/commonconfig'
import { normalizeTheme, THEME_DEFAULT } from '@/common/theme'
export default {
  name: 'preference-setting',
  components: {
    PageHead
  },
  data () {
    return {
      languageOptions, defaultThemeOptions,
      preferenceSettingForm: {
        defaultLanguage: '',
        defaultTheme: '',
      },
      loading: false
    }
  },
  methods: {
    async sePersonalPreferences () {
      this.loading = true
      try {
        const role = this.resolveRoleType()
        if (!hasGlobalSettingsToken(role)) {
          this.$message.warning(this.$t('common.noPermission') || 'Unauthorized')
          return
        }
        const provider_uuid = resolvePreferenceProviderUuid(this.$store, role)
        const updates = {
          default_language: this.preferenceSettingForm.defaultLanguage,
          defaultLanguage: this.preferenceSettingForm.defaultLanguage,
          language: this.preferenceSettingForm.defaultLanguage,
          ui_language: this.preferenceSettingForm.defaultLanguage,
          default_theme: this.preferenceSettingForm.defaultTheme,
          defaultTheme: this.preferenceSettingForm.defaultTheme,
          theme: this.preferenceSettingForm.defaultTheme,
          ui_theme: this.preferenceSettingForm.defaultTheme,
          theme_preference: this.preferenceSettingForm.defaultTheme
        }
        await updateGlobalSettings({ updates, roleType: role, provider_uuid })
        this.$store.dispatch('user/getDefaultLanguage', this.preferenceSettingForm.defaultLanguage)
        this.$store.dispatch('user/changeSetting', {
          key: 'theme',
          value: this.preferenceSettingForm.defaultTheme,
          persist: false
        })
        this.$i18n.locale = this.preferenceSettingForm.defaultLanguage
        this.$forceUpdate()
        this.$message.success(this.$t('common.operationSuccessful'))
      } catch (error) {
        this.$message.error(error && error.message ? error.message : this.$t('common.operationFailed'))
      } finally {
        this.loading = false
      }
    },
    async getDefaultSetting () {
      this.loading = true
      try {
        const role = this.resolveRoleType()
        if (!hasGlobalSettingsToken(role)) {
          this.loading = false
          return
        }
        const provider_uuid = resolvePreferenceProviderUuid(this.$store, role)
        const settings = await loadGlobalSettings({ roleType: role, provider_uuid }) || {}
        const defaultLanguage = settings.default_language ||
          settings.defaultLanguage ||
          settings.language ||
          settings.ui_language ||
          this.$store.state.user.defaultLanguage ||
          'en_us'
        const defaultThemeRaw = settings.default_theme ||
          settings.defaultTheme ||
          settings.theme ||
          settings.ui_theme ||
          settings.theme_preference ||
          this.$store.state.user.theme ||
          THEME_DEFAULT
        this.preferenceSettingForm.defaultLanguage = defaultLanguage
        this.preferenceSettingForm.defaultTheme = normalizeTheme(defaultThemeRaw)
      } catch (error) {
        this.$message.error(error && error.message ? error.message : this.$t('common.operationFailed'))
      } finally {
        this.loading = false
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
    this.getDefaultSetting()
  },
}
</script>

<style scoped>
</style>
