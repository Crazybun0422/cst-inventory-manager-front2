<!--
* @Description: 订单产品卡片
* @Author: tj
* @Date: 2023
* @LastEditors: tj
* @LastEditTime: 2023
-->
<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :class="{ 'disabled-table': disabled }"
    >
      <el-table-column
        prop="product_variants"
        :label="$t('message.productManagement.productSku')"
        width="300"
      >
        <template slot-scope="scope">
          <span>{{ scope.row?.product_variants[0]?.product_code_sku }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="english_name"
        :label="$t('message.productManagement.productInfo')"
      >
        <template slot-scope="scope">
          <div class="product-info">
            <AuthImg
              :src="scope.row?.sub_image_url || scope.row?.main_image_url"
              :styleInfo="'width:50px;height:50px;margin-right:8px'"
            ></AuthImg>
            <div>
              <span v-if="$languageType == 'zh_cn'">{{
                scope.row.chinese_name + '-' + scope.row.sub_chinese_name
              }}</span>
              <span v-else>{{
                scope.row.english_name + '-' + scope.row.sub_english_name
              }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="category" :label="$t('common.classification')"> </el-table-column> -->
      <el-table-column
        prop="quantity"
        :label="$t('message.productManagement.quantity')"
      >
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.product_variants[0].quantity"
            :disabled="disabled"
            :min="1"
            :step="1"
            :step-strictly="true"
            :max="scope.row.product_variants[0].alarm_number"
            @change="onChangeQuantity"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('common.operation')"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            @click="delProduct(scope.row)"
            type="text"
            size="small"
            :disabled="disabled"
          >
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="product-image"></div>
    <div class="product-title"></div>
  </div>
</template>
<script>
import AuthImg from '@/components/auth-img.vue'
import utils from '@/utils/index'
export default {
  props: {
    productData: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false }
  },
  components: { AuthImg },
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
  },
  watch: {
    productData: {
      handler () {
        this.tableData = utils.deepClone(this.productData)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    delProduct (item) {
      this.tableData.forEach((el, index) => {
        if (
          el.product_variants[0].product_code_sku ===
          item.product_variants[0].product_code_sku
        ) {
          this.tableData.splice(index, 1)
        }
      })
      this.$emit('updateData', this.tableData)
    },
    onChangeQuantity () {
      this.$emit('updateData', this.tableData)
    }
  }
}
</script>
<style lang="scss" scoped>
.product-info {
  display: flex;
  align-items: center;
}

.disabled-table {
  pointer-events: none; /* 禁止所有交互 */
  opacity: 0.5; /* 表格看起来是禁用状态 */
}
</style>
