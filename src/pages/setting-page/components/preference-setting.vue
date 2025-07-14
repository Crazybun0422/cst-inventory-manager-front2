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
import { setDefaultParams, loadHomeData } from '@/common/common-func'
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
    setDefaultParams,
    loadHomeData,
    sePersonalPreferences () {
      this.loading = true
      this.setDefaultParams(this.preferenceSettingForm).then((res) => {
        if (this.$isRequestSuccessful(res.code)) {
          this.$message.success(res.msg[this.preferenceSettingForm.defaultLanguage])
          this.$store.dispatch('user/getDefaultLanguage', this.preferenceSettingForm.defaultLanguage)
          this.$store.dispatch('user/changeSetting', {
            key: 'theme',
            value: this.preferenceSettingForm.defaultTheme
          })
          localStorage.setItem('theme', this.preferenceSettingForm.defaultTheme)
          this.$i18n.locale = this.preferenceSettingForm.defaultLanguage;
          this.$forceUpdate()
        }
      }).catch((error) => {
        this.$message.error(error)
      }).finally(() => {
        this.loading = false
      })
    },
    getDefaultSetting () {
      this.loadHomeData().then((resData) => {
        this.preferenceSettingForm.defaultLanguage = resData?.default_settings?.defaultLanguage
        this.preferenceSettingForm.defaultTheme = resData?.default_settings?.defaultTheme
      }).catch((error) => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getDefaultSetting()
  },
}
</script>

<style scoped>
</style>