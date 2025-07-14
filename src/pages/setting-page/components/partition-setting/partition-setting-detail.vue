<!--
* @description  参数1
* @fileName  partition-setting-detail
* @author wjp
* @date 2024-03-12 22:30:28
!-->
<template>
  <div id="partition-setting-detail" class="partition-setting-detail">
    <el-drawer
      :title="$t('message.myAccount.partitionDetails')"
      :visible.sync="descriptionsVisible"
      direction="rtl"
      size="45%"
      :before-close="handleClose"
    >
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item :label="$t('message.storage.warehouse')">{{
          warehousingNameMap[form.storage_id]
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.partitionName')">{{
          form.section_name
        }}</el-descriptions-item>
        <el-descriptions-item
          :label="$t('message.myAccount.abbreviationCode')"
          >{{ form.short_code }}</el-descriptions-item
        >
        <el-descriptions-item :label="$t('message.myAccount.pickingSorting')">{{
          form.picking_order
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.creator')">{{
          form.creator
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.createTime')">{{
          form.created_time
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.updateTime')">{{
          form.modified_time
        }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'partition-setting-detail',
  props: {
    currentData: {
      type: Object,
      default: () => { }
    },
    visible: {
      type: Boolean,
      default: false
    },
    warehousingNameMap: {
      type: Array,
      default: () => []
    },
  },
  components: {

  },
  data () {
    return {
      descriptionsVisible: false,
      form: {}
    }
  },
  methods: {
    handleClose () {
      this.descriptionsVisible = false
      this.$emit('close')
    }
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible (val) {
      if (val) {
        this.descriptionsVisible = val
        this.form = this.currentData
      }
    }

  }
}
</script>
<style scoped lang='css'>
</style>