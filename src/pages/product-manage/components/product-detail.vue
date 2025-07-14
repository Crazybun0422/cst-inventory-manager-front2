<!--
* @Description: 产品详情
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div>
    <el-drawer
      :title="$t('message.productInfo.productDetail')"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="50%"
      @close="onCloseDrawer"
      class="global-drawer-class"
    >
      <CstFormCard :title="$t('common.basicInformation')" class="mb-24 mt-16">
        <el-descriptions :column="1" size="medium">
          <el-descriptions-item
            :label="$t('message.productManagement.productImage')"
          >
            <AuthImg
              :src="
                currentData?.main_image_url ? currentData?.main_image_url : null
              "
            >
            </AuthImg
          ></el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="2" size="medium" border>
          <el-descriptions-item
            :label="$t('message.productManagement.chineseName')"
          >
            {{ currentData.chinese_name }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.productManagement.englishName')"
          >
            {{ currentData.english_name }}</el-descriptions-item
          >
          <el-descriptions-item :label="$t('common.createTime')" :span="2">
            {{ currentData.create_time }}
          </el-descriptions-item>
          <el-descriptions-item
            :span="2"
            :labelStyle="{ 'min-width': '130px' }"
          >
            <template slot="label">
              <i class="el-icon-tickets"></i>
              {{ $t('message.productManagement.specificDescription') }}
            </template>
            {{ currentData.description }}
          </el-descriptions-item>
        </el-descriptions>
      </CstFormCard>
      <CstFormCard
        :title="$t('common.classification') + (index + 1)"
        class="mb-24"
        v-for="(item, index) in currentData.product_variants"
        :key="item.product_uuid"
      >
        <el-descriptions :column="1" size="medium">
          <el-descriptions-item
            :label="$t('message.productManagement.productImage')"
          >
            <AuthImg :src="item.sub_image_url"> </AuthImg
          ></el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="3" size="medium" border>
          <el-descriptions-item :label="$t('common.status')">
            <el-tag
              type="success"
              effect="plain"
              v-if="item.status === 1"
              class="status-tag"
            >
              {{
                item.status ? productStatusMap[item.status][$languageType] : ''
              }}
            </el-tag>
            <el-tag
              type="danger"
              effect="plain"
              v-else-if="item.status === 2"
              class="status-tag"
            >
              {{
                item.status ? productStatusMap[item.status][$languageType] : ''
              }}
            </el-tag>
            <p type="danger" effect="plain" v-else class="status-tag"></p>
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.productManagement.productCode')"
          >
            {{ item.product_code_sku }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.productManagement.productBarcode')"
          >
            {{ item.product_barcode }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('message.productManagement.price')">
            {{
              item.price ? currencySymbolMap[item.unit] + item.price : ''
            }}</el-descriptions-item
          >
          <el-descriptions-item
            :label="$t('message.productManagement.productStock')"
          >
            <el-tag size="small" v-if="item.stock >= 5000" type="success">
              {{ item.stock }}
            </el-tag>
            <el-tag
              size="small"
              v-else-if="item.stock >= 1000 && item.stock < 5000"
              type="warning"
            >
              {{ item.stock }}
            </el-tag>
            <el-tag size="small" v-else type="danger">
              {{ item.stock }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            :label="
              $t('common.classification') +
              ' ' +
              $t('message.productManagement.chineseName')
            "
          >
            {{ item.sub_chinese_name }}</el-descriptions-item
          >
          <el-descriptions-item :label="$t('message.productManagement.weight')">
            {{ item.quality_inspection_weight_kg }}</el-descriptions-item
          >
          <el-descriptions-item :label="$t('message.productManagement.length')">
            {{ item.quality_inspection_length_cm }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="
              $t('common.classification') +
              ' ' +
              $t('message.productManagement.englishName')
            "
          >
            {{ item.sub_english_name }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.productManagement.width')"
            >{{ item.quality_inspection_width_cm }}</el-descriptions-item
          >
          <el-descriptions-item :label="$t('message.productManagement.height')">
            {{ item.quality_inspection_height_cm }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.productManagement.productSize')"
          >
            {{ item.size }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('message.productManagement.productColor')"
            ><span :style="{ 'background-color': item.color }">{{
              item.color
            }}</span></el-descriptions-item
          >
          <el-descriptions-item :label="$t('message.storage.alarmThreshold')">
            {{ item.alarm_number }}
          </el-descriptions-item>
        </el-descriptions>
      </CstFormCard>
    </el-drawer>
  </div>
</template>
<script>
import CstFormCard from '@/components/cst-form-card/index.vue'
import { productCategoryMap, productUnitMap, productStatusMap, currencySymbolMap } from '@/common/field-maping'
import AuthImg from '@/components/auth-img.vue'
export default {
  props: {
    visible: { type: Boolean, default: false },
    currentData: { type: Object, default: () => { } },
    originalDataArr: { type: Array, default: () => [] }
  },
  components: { CstFormCard, AuthImg },
  data () {
    return {
      currencySymbolMap,
      productCategoryMap: productCategoryMap,
      productUnitMap: productUnitMap,
      productStatusMap: productStatusMap,
      drawerVisible: false
    }
  },
  mounted () {
  },
  methods: {
    onCloseDrawer () {
      this.drawerVisible = false
      this.$emit('close')
    }
  },
  watch: {
    visible: {
      handler (newValue) {
        this.drawerVisible = newValue
      },
      immediate: true
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
