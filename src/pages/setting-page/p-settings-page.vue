<!--
* @description  参数1
* @fileName  p-settings-page
* @author wjp
* @date 2023-12-03 19:20:38
!-->
<template>
  <div id="p-settings-page" class="p-settings-page">
    <el-card class="box-card">
      <el-tabs tab-position="left" style="height: 100%">
        <el-tab-pane :label="$t('message.myAccount.baseSetting')" :lazy="true">
          <BaseSetting class="settingStyle"></BaseSetting
        ></el-tab-pane>
        <el-tab-pane
          :label="$t('message.userInfo.preferenceSettings')"
          :lazy="true"
        >
          <PreferenceSetting class="settingStyle"></PreferenceSetting
        ></el-tab-pane>
        <el-tab-pane
          :label="$t('message.myAccount.securitySettings')"
          :lazy="true"
        >
          <SecuritySetting class="settingStyle"></SecuritySetting>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('message.myAccount.authenticationSettings')"
          :lazy="true"
          ><VerificationSetting class="settingStyle"></VerificationSetting
        ></el-tab-pane>
        <el-tab-pane
          :label="$t('message.myAccount.contactSettings')"
          :lazy="true"
        >
          <ContactsSetting class="settingStyle"></ContactsSetting
        ></el-tab-pane>
        <el-tab-pane
          :label="$t('message.myAccount.productLabelSetting')"
          :lazy="true"
        >
          <ProductTagSetting class="settingStyle"></ProductTagSetting
        ></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import BaseSetting from './components/base-setting.vue'
import SecuritySetting from '@/pages/setting-page/components/security-setting.vue'
import VerificationSetting from './components/verification-setting.vue'
import ContactsSetting from './components/contacts-setting.vue'
import PreferenceSetting from './components/preference-setting.vue'
import ProductTagSetting from './components/product-tag-setting.vue'
export default {
  name: 'p-settings-page',
  components: {
    ProductTagSetting,
    BaseSetting,
    SecuritySetting,
    VerificationSetting,
    ContactsSetting,
    PreferenceSetting
  },
  props: {
  },
  data () {
    return {
      selectTab: 'base-setting',
    }
  },
  methods: {

  },
  computed: {

  },
  mounted () {
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
.span-title {
  font-size: 16px;
  font-weight: 600;
  margin-left: 20px !important;
}
.settingStyle {
  margin-left: 20px !important;
}
::v-deep .head-title {
  color: var(--custom-font-color);
}
</style>