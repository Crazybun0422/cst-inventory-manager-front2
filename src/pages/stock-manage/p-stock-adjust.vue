<template>
  <div class="p-stock-adjust" v-loading="loading">
    <PageHead :title="$t('navigate.stockAdjustment')"></PageHead>
    <el-form :model="form" label-width="120px">
      <el-form-item :label="$t('message.productManagement.productBarcode')">
        <el-input v-model="form.barcode" />
      </el-form-item>
      <el-form-item :label="$t('message.storage.location')">
        <el-input v-model="form.location" />
      </el-form-item>
      <el-form-item :label="$t('message.storage.warehouse')">
        <el-select v-model="form.storage_uuid" filterable clearable>
          <el-option v-for="item in storageOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('message.productManagement.productStock')">
        <el-input-number v-model="form.number" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('common.operation')">
        <el-select v-model="form.operation">
          <el-option value="increase" :label="$t('common.increase')" />
          <el-option value="decrease" :label="$t('common.decrease')" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('message.storage.referenceNo')">
        <el-input v-model="form.reference_number" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">{{ $t('common.confirm') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import { getStorage } from '@/common/common-func'

export default {
  name: 'p-stock-adjust',
  components: { PageHead },
  data() {
    return {
      loading: false,
      form: {
        barcode: '',
        location: '',
        storage_uuid: '',
        number: 0,
        operation: 'increase',
        reference_number: ''
      },
      storageOptions: []
    }
  },
  computed: {
    roleType() {
      return this.$getRoleType(this.$route.path)
    }
  },
  methods: {
    async fetchStorage() {
      const res = await getStorage('', this.roleType)
      if (this.$isRequestSuccessful(res.code)) {
        this.storageOptions = res.data.map(item => ({ label: item.name, value: item.storage_uuid }))
      }
    },
    async submit() {
      this.loading = true
      const res = await this.$ajax({ url: '/api/product-stock/adjust-stock', method: 'post', data: this.form, roleType: this.roleType })
      if (this.$isRequestSuccessful(res.code)) {
        this.$message.success(this.$t('common.operationSuccessful'))
      }
      this.loading = false
    }
  },
  mounted() {
    this.fetchStorage()
  }
}
</script>

<style scoped>
</style>

