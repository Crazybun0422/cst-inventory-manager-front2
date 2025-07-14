<!--
* @description  参数1
* @fileName  cargo-location-detail
* @author wjp
* @date 2024-03-12 22:30:28
!-->
<template>
  <div id="cargo-location-detail" class="cargo-location-detail">
    <el-drawer
      :title="$t('message.myAccount.locationDetails')"
      :visible.sync="descriptionsVisible"
      direction="rtl"
      size="45%"
      :before-close="handleClose"
    >
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item :label="$t('message.storage.warehouse')">{{
          warehousingNameMap[form.storage_id]
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.shelfName')">{{
          form.shelf_name
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.partitionName')">{{
          form.section_name
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.locationNumber')">{{
          form.location_number
        }}</el-descriptions-item>
        <el-descriptions-item
          :label="$t('message.myAccount.storageLocationRemarks')"
          >{{ form.location_note }}</el-descriptions-item
        >
        <el-descriptions-item :label="$t('message.myAccount.locationType')">{{
          showLabel(locationTypeMap, form.location_type)
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.sizeType')">{{
          showLabel(sizeTypeMap, form.size_type)
        }}</el-descriptions-item>
        <el-descriptions-item label="库位产品规格">{{
          showLabel(
            locationProductSpecificationMap,
            form.location_product_specification
          )
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.storage.totalCapacity')">{{
          form.volume_size
        }}</el-descriptions-item>
        <el-descriptions-item label="最大受重 (kg)">{{
          form.max_weight
        }}</el-descriptions-item>
        <el-descriptions-item :label="'ABC' + $t('common.classification')">{{
          showLabel(abcClassificationMap, form.abc_classification)
        }}</el-descriptions-item>
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
import { cargoLocationSettingFieldSelectMap, locationTypeMap, sizeTypeMap, abcClassificationMap, locationProductSpecificationMap } from '@/common/field-maping'
import { listToMap } from '@/common/common-func'
export default {
  name: 'cargo-location-detail',
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
      form: {},
      cargoLocationSettingFieldSelectMap, locationTypeMap, sizeTypeMap, abcClassificationMap, locationProductSpecificationMap
    }
  },
  methods: {
    handleClose () {
      this.descriptionsVisible = false
      this.$emit('close')
    },
    showLabel (selectMap, value) {
      const ret = listToMap(selectMap)
      return ret[value]?.[this.$languageType] || ''
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