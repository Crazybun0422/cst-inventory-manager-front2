<!--
* @description  参数1
* @fileName  product-table
* @author wjp
* @date 2024-08-18 17:22:11
!-->
<template>
  <div id="product-table" class="product-table">
    <el-table :data="tableData" style="width: 100%" border size="small">
      <el-table-column
        prop="chinese_name"
        :label="$t('message.productManagement.chineseName')"
      >
      </el-table-column>
      <el-table-column
        prop="product_code_sku"
        :label="$t('message.productManagement.productSku')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row?.product_variants[0]?.product_code_sku }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        :label="$t('message.productManagement.quantity')"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{ scope.row?.product_variants[0]?.quantity }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import utils from '@/utils/index'
import { initProductData } from '@/common/common-func'
export default {
  name: 'product-table',
  props: {
    currentData: { type: Object, default: () => { } },
  },
  components: {

  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    initProductData
  },
  computed: {
    provider_uuid () {
      return this.$store.state.shopProviderUuid.shopInfo.provider_uuid
    },
  },
  mounted () {
    this.initProductData(this.currentData.products).then(res => {
      this.tableData = utils.deepClone(res)
    })
  },
  watch: {

  }
}
</script>
<style scoped lang='css'>
</style>