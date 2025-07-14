<!--
* @description  参数1
* @fileName  logistics-providers
* @author wjp
* @date 2024-01-30 22:38:47
!-->
<template>
  <div id="logistics-providers" class="logistics-providers">
    <el-card class="box-card">
      <el-tabs tab-position="left" style="height: 100%">
        <el-tab-pane :label="$t('message.myAccount.logisticsAPI')" :lazy="true">
          <LogisticsApi></LogisticsApi>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('message.myAccount.logisticsChannels')"
          :lazy="true"
        >
          <LogisticsChannel></LogisticsChannel>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import LogisticsApi from './components/logistics-api.vue'
import LogisticsChannel from './components/logistics-channel.vue'
export default {
  name: 'logistics-providers',
  props: {
  },
  components: {
    LogisticsApi,
    LogisticsChannel

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