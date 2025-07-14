<template>
  <section v-loading="loading" class="p-product-info-detail">
    <el-form :model="productInfo" ref="form" :rules="formRules" label-width="100px" label-position="left">
      <el-form-item label="Title" prop="title">
        <el-input v-model="productInfo.title"></el-input>
      </el-form-item>

      <el-form-item label="Tags" prop="tags">
        <el-input v-model="productInfo.tags"></el-input>
      </el-form-item>
    </el-form>

    <!-- 产品变种 -->
    <el-collapse v-for="(item, index) in edgeList" :key="item.node.id">
      <el-collapse-item :title="item.title || productInfo.title" :name="item.node.id">
        <el-form :model="item.node" :ref="`form-${index}`" :rules="formRules" label-width="100px" label-position="left">
          <el-form-item :label="$t('message.orderInfo.title')" prop="title">
            <el-input v-model="item.node.title"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.orderInfo.sku')" prop="sku">
            <el-input v-model="item.node.sku"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.productInfo.barcode')" prop="barcode">
            <el-input v-model="item.node.barcode"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.productInfo.price')" prop="price">
            <el-input v-model="item.node.price" type="number"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.productInfo.weight')" prop="weight">
            <el-input v-model="item.node.weight" type="number"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.productInfo.weightUnit')" prop="weightUnit">
            <el-input v-model="item.node.weightUnit"></el-input>
          </el-form-item>

          <el-form-item :label="$t('message.productInfo.compareAtPrice')" prop="compareAtPrice">
            <el-input v-model="item.node.compareAtPrice" type="number"></el-input>
          </el-form-item>

          <el-form-item v-if="item.node.image && item.node.image.url" :label="$t('message.productInfo.image')">

            <AuthImg :src="item.node.image.url" :styleInfo="'width:50px;height:50px;'"></AuthImg>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <!-- 图片 -->
    <el-form :model="productInfo" ref="form" :rules="formRules" label-width="100px" label-position="left">
      <!-- 占位，无需单独写css -->
      <el-form-item></el-form-item>

      <el-form-item v-if="productInfo.firstImage && productInfo.firstImage.url"
        :label="$t('message.productInfo.image')">

        <AuthImg :src="productInfo.firstImage.url
          " :styleInfo="'width:50px;height:50px;'"></AuthImg>

      </el-form-item>
    </el-form>
  </section>
</template>

<script>
/**
 * @file 产品信息 - 编辑产品详情
 * @date 2024/03/23
 */

// 组件

// mixins
import formMixin from '@/common/form-mixin'
import AuthImg from '@/components/auth-img.vue'
// 常量

export default {
  name: 'p-product-info-detail',
  mixins: [formMixin],
  props: {
    rowData: {
      // 当前订单的数据
      type: Object,
      default: () => ({})
    }
  },
  components: {
    AuthImg,
  },
  data() {
    return {
      loading: false,
      drawerVisible: false,
      productInfo: {}, // 当前产品详情的数据
      edgeList: [], // 当前产品详情-产品变种的数据
      formRules: {
        // 验证规则
        title: [
          {
            required: true,
            message: this.$t('message.productInfo.formRulesTitle'),
            trigger: 'blur'
          }
        ]
        // tags: [{ message: 'SKU不能为空', trigger: 'input' }],
        // sku: [{ required: true, message: 'SKU不能为空', trigger: 'blur' }],
      }
    }
  },
  computed: {
    shopifyShopUrl() {
      return this.$store.getters.shopifyShopUrl
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      let vm = this
      vm.loading = true

      vm.$ajax({
        url: `/api/shop-manager/product-details`,
        method: 'get',
        roleType: vm.roleType,
        params: {
          shop_url: vm.shopifyShopUrl,
          product_title: vm.rowData.title
        }
      }).then(({ data = {} }) => {
        let product = data.products?.[0] ?? {}

        vm.productInfo = {
          ...product,
          tags: product.tags?.join(', ') ?? '',
          firstImage: product?.images?.edges?.length
            ? product?.images?.edges?.[0]?.node
            : null // 第一条数据的图片
        }

        vm.edgeList = product?.variants?.edges ?? []

        vm.loading = false
      })
    },
    resetForm() {
      // 重置表单逻辑
      this.$_formMixin_resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.p-product-info-detail {
  height: calc(100% - 74px);
  overflow-y: auto;
}
</style>
