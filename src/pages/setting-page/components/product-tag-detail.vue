<!--
* @description  参数1
* @fileName  product-tag-detail
* @author wjp
* @date 2024-01-24 20:53:27
!-->
<template>
  <div id="product-tag-detail" class="product-tag-detail">
    <el-drawer
      :title="$t('message.myAccount.productLabel')"
      :visible.sync="productTagVisible"
      direction="rtl"
      size="40%"
      class="global-drawer-class"
      @close="closeProductTagDetail"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="$t('message.myAccount.config_name')">{{
          currentData.config_name
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.width_cm')"
          >{{ currentData.width_cm }}cm</el-descriptions-item
        >
        <el-descriptions-item :label="$t('message.myAccount.height_cm')"
          >{{ currentData.height_cm }}cm</el-descriptions-item
        >
        <el-descriptions-item :label="$t('message.myAccount.img_type')"
          >{{
            currentData.img_type ? $t('common.qrCode') : $t('common.barcode')
          }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.is_center')"
          >{{ currentData.is_center ? $t('common.yes') : $t('common.no') }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('message.myAccount.has_english_title')"
          >{{
            currentData.has_english_title ? $t('common.yes') : $t('common.no')
          }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'product-tag-detail',
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
  },
  components: {

  },
  data () {
    return {
      productTagVisible: false,
    }
  },
  methods: {
    closeProductTagDetail () {
      this.productTagVisible = false;
      this.$emit('close');
    }
  },
  computed: {

  },
  mounted () {

  },
  watch: {
    visible (val) {
      if (val) {
        this.productTagVisible = val;
      }
    }
  }
}
</script>
<style scoped lang='css'>
</style>