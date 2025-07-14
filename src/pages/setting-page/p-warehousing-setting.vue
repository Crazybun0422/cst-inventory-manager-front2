<!--
* @description  参数1
* @fileName  p-warehousing-setting
* @author wjp
* @date 2024-03-08 20:43:13
!-->
<template>
  <div id="p-warehousing-setting" class="p-warehousing-setting">
    <el-card class="box-card">
      <el-tabs tab-position="left" style="height: 100%">
        <!-- <el-tab-pane
          :label="$t('message.myAccount.warehousingSetting')"
          :lazy="true"
        >
          <WarehousingSetting></WarehousingSetting>
        </el-tab-pane> -->
        <el-tab-pane :label="$t('message.myAccount.partition')" :lazy="true">
          <PartitonSetting></PartitonSetting>
        </el-tab-pane>
        <el-tab-pane :label="$t('message.myAccount.shelves')" :lazy="true">
          <ShelvesSetting></ShelvesSetting>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('message.myAccount.cargoLocation')"
          :lazy="true"
        >
          <CargoLocationSetting></CargoLocationSetting>
        </el-tab-pane>
        <!-- 没有包材的接口 -->
        <!-- <el-tab-pane
          :label="$t('message.myAccount.packagingMaterials')"
          :lazy="true"
        >
          <PackagingMaterialsSetting></PackagingMaterialsSetting>
        </el-tab-pane> -->
        <el-tab-pane :label="$t('message.myAccount.waveStrategy')" :lazy="true">
          <WaveStrategySetting></WaveStrategySetting>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>

import WarehousingSetting from './components/warehousing-setting.vue'
import PartitonSetting from './components/partiton-setting.vue'
import ShelvesSetting from './components/shelves-setting.vue'
import CargoLocationSetting from './components/cargo-location-setting.vue'
import PackagingMaterialsSetting from './components/packaging-materials-setting.vue'
import WaveStrategySetting from './components/wave-strategy-setting.vue'
export default {
  name: 'p-warehousing-setting',
  props: {
  },
  components: {
    WarehousingSetting,
    PartitonSetting,
    ShelvesSetting,
    CargoLocationSetting,
    PackagingMaterialsSetting,
    WaveStrategySetting
  },
  data () {
    return {

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
<style scoped lang='scss'>
::v-deep .head-title {
  color: var(--custom-font-color);
}
</style>