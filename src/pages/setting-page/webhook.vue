<!--
* @description  参数1
* @fileName  webhook
* @author wjp
* @date 2023-12-28 23:08:22
!-->
<template>
  <div id="webhook" class="webhook">
    <el-card class="box-card">
      <el-tabs tab-position="left" style="height: 100%">
        <el-tab-pane
          :label="$t('message.webhook.subscribe')"
          class="webhookStyle"
          :lazy="true"
        >
          <WebhookSubscribe></WebhookSubscribe
        ></el-tab-pane>
        <el-tab-pane
          :label="$t('message.webhook.callbackeLog')"
          class="webhookStyle"
          :lazy="true"
          ><WebhookLog></WebhookLog
        ></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import WebhookSubscribe from './components/ds-webhook-subscribe.vue'
import WebhookLog from './components/ds-webhook-log.vue'
export default {
  name: 'webhook',
  props: {
  },
  components: {
    WebhookSubscribe, WebhookLog
  },
  data () {
    return {
      selectTab: 'webhook-subscribe',
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
.webhookStyle {
  margin-left: 20px !important;
}
::v-deep .head-title {
  color: var(--custom-font-color);
}
</style>