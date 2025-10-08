<template>
  <div class="sourcing-page">
    <div class="page-bg">
      <WorldMagnifierBackground :lang="$languageType" :fixed="false" :gradient-stops="['#A67C52', '#FFD700', '#FF4500']"
        accent="#FFD700" />
    </div>
    <PageHead :title="$t('navigate.sourcing')" />

    <div class="sourcing-hero">
      <div class="hero-card">
        <div class="hero-title">{{ $t('sourcing.heroTitle') }}</div>

        <!-- Info banner -->
        <div class="info-banner">
          <div class="info-title">{{ $t('sourcing.insertLinkTitle') }}</div>
          <div class="info-desc">
            {{ $t('sourcing.acceptableLinksIntro') }}
            <a class="info-link" href="https://www.aliexpress.com/" target="_blank" rel="noopener">{{
              $t('sourcing.aliexpress') }}</a>
            ,
            <a class="info-link" href="https://www.alibaba.com/" target="_blank" rel="noopener">{{
              $t('sourcing.alibaba') }}</a>
            ,
            <a class="info-link" href="https://www.amazon.com/" target="_blank" rel="noopener">{{ $t('sourcing.amazon')
            }}</a>
            .
          </div>
        </div>

        <!-- URL input with system-styled submit button -->
        <el-form :model="urlForm" :rules="urlRules" ref="urlFormRef" class="url-form"
          @submit.native.prevent="submitUrl">
          <div class="url-row">
            <el-input v-model="urlForm.source_url" :placeholder="$t('sourcing.insertUrlPlaceholder')" clearable
              prefix-icon="el-icon-search" class="url-input" />
            <el-button class="url-submit" type="primary" :loading="submittingUrl" @click="submitUrl">{{
              $t('common.submit') }}</el-button>
          </div>
        </el-form>

        <div class="hero-links">
          <a @click.prevent="openMore">{{ $t('common.more') }}</a>
          <span class="divider">|</span>
          <a @click.prevent="openHistory">{{ $t('common.history') }}</a>
        </div>
      </div>
    </div>

    <!-- More Modal -->
    <el-dialog :title="$t('sourcing.moreOptions')" :visible.sync="moreVisible" width="900px"
      class="global-modal-class global-modal-center">
      <div v-if="moreStep === 'options'" class="more-options more-buttons">
        <el-button class="more-action-btn" type="primary" @click="chooseMore('image')">
          <span class="btn-title">{{ $t('sourcing.inputImageDescPrice') }}</span>
          <span class="btn-desc">{{ $t('sourcing.inputImageDescPriceDesc') }}</span>
        </el-button>
        <el-button class="more-action-btn" @click="chooseMore('product')">
          <span class="btn-title">{{ $t('sourcing.existingProducts') }}</span>
          <span class="btn-desc">{{ $t('sourcing.existingProductsDesc') }}</span>
        </el-button>
      </div>
      <div v-else-if="moreStep === 'image'">
        <el-form :model="imageForm" :rules="imageRules" ref="imageFormRef" label-position="top">
          <el-form-item :label="$t('dashboard.image')" prop="image">
            <ImageUpload :imageUrl="imageForm.image" @change="onImageUploadChange" />
          </el-form-item>
          <el-form-item :label="$t('common.describe')" prop="description">
            <el-input type="textarea" v-model="imageForm.description"
              :placeholder="$t('sourcing.descriptionPlaceholder')" :rows="3" />
          </el-form-item>
          <el-form-item :label="$t('sourcing.expectedPrice')" prop="quote">
            <el-input v-model="imageForm.quote" :placeholder="$t('sourcing.pricePlaceholder')" clearable>
              <template slot="prepend">{{ currencySymbol }}</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('sourcing.purchaseReason')">
            <el-input v-model="imageForm.purchase_reason" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-actions">
          <el-button @click="backMore">{{ $t('common.back') }}</el-button>
          <el-button type="primary" :loading="submittingImage" @click="submitImage">{{ $t('common.submit')
          }}</el-button>
        </div>
      </div>
      <div v-else-if="moreStep === 'product'">
        <!-- search bar -->
        <el-form :inline="true" :model="productQuery" class="mb-24">
          <el-form-item>
            <el-input v-model="productQuery.name"
              :placeholder="$languageType === 'zh_cn' ? $t('message.productManagement.chineseName') : $t('message.productManagement.englishName')"
              clearable style="width:220px" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="productQuery.sku" :placeholder="$t('message.productManagement.productSku')" clearable
              style="width:220px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadProductList(1)">{{ $t('common.search') }}</el-button>
            <el-button @click="resetProductQuery">{{ $t('common.reset') }}</el-button>
          </el-form-item>
        </el-form>

        <!-- product table -->
        <el-table :data="productTable.items" size="small" v-loading="productLoading"
          @selection-change="onProductSelectionChange" style="width:100%">
          <el-table-column type="selection" width="50" />
          <el-table-column :label="$t('dashboard.image')" width="80">
            <template slot-scope="scope">
              <AuthImg :src="scope.row.sub_image_url ? scope.row.sub_image_url : scope.row.main_image_url"
                :styleInfo="'width:48px;height:48px;'" />
            </template>
          </el-table-column>
          <el-table-column
            :label="$languageType === 'zh_cn' ? $t('message.productManagement.chineseName') : $t('message.productManagement.englishName')"
            min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="$languageType === 'zh_cn'">{{ (scope.row.chinese_name || '') + (scope.row.sub_chinese_name ?
                '-' + scope.row.sub_chinese_name : '') }}</span>
              <span v-else>{{ (scope.row.english_name || '') + (scope.row.sub_english_name ? ' - ' +
                scope.row.sub_english_name : '') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('message.productManagement.productSku')" min-width="260">
            <template slot-scope="scope">
              <span class="sku-cell">{{(scope.row.product_variants || []).map(v => v.product_code_sku).join(', ')
              }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-16" style="text-align:right">
          <el-pagination background layout="prev, pager, next, jumper" :page-size="productTable.page_size"
            :current-page.sync="productTable.page_number" :total="productTable.total"
            @current-change="loadProductList" />
        </div>
        <div class="dialog-actions">
          <el-button @click="backMore">{{ $t('common.back') }}</el-button>
          <el-button type="primary" :loading="submittingProduct" @click="submitProduct">{{ $t('common.submit')
          }}</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- History Modal -->
    <el-dialog :title="$t('sourcing.historyTitle')" :visible.sync="historyVisible" width="900px"
      class="global-modal-class global-modal-center">
      <el-form inline :model="historyQuery" label-width="100px" class="mb-24">
        <el-form-item :label="$t('common.status')">
          <el-select v-model="historyQuery.status" clearable :placeholder="$t('common.pleaseSelect')"
            style="width:180px">
            <el-option v-for="s in statusList" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="loadHistory(1)">{{ $t('common.search') }}</el-button>
        <el-button @click="resetHistory">{{ $t('common.reset') }}</el-button>
      </el-form>

      <el-table :data="history.items" stripe size="small" v-loading="historyLoading">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="his-item-list">
              <div class="his-item" v-for="(it, idx) in (scope.row.items || [])" :key="it.item_id || idx">
                <div class="his-item__preview">
                  <AuthImg v-if="it.source_type === 'image' && it.image" :src="it.image"
                    :styleInfo="'width:56px;height:56px;border-radius:6px;'" />
                  <i v-else-if="it.source_type === 'url'" class="el-icon-link his-item__icon"></i>
                  <i v-else class="el-icon-goods his-item__icon"></i>
                </div>
                <div class="his-item__meta">
                  <div class="his-item__line">
                    <el-tag size="mini" type="info" effect="dark">{{ it.source_type }}</el-tag>
                    <a v-if="it.source_type === 'url'" class="his-item__link" :href="it.source_url" target="_blank"
                      rel="noopener">{{ it.source_url }}</a>
                    <span v-else-if="it.source_type === 'product'" class="his-item__text">{{ it.product_id }}</span>
                    <span v-else-if="it.source_type === 'image'" class="his-item__text">{{ it.description }}</span>
                  </div>
                  <div class="his-item__sub">
                    <span v-if="it.quote">{{ $t('sourcing.expectedPrice') }}: {{ currencySymbol }} {{ it.quote }}</span>
                    <span v-if="it.feedback_quote" style="margin-left:12px">{{ $t('sourcing.feedbackQuote') }}: {{
                      currencySymbol }} {{ it.feedback_quote }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" width="160">
          <template slot-scope="scope">{{ statusLabel(scope.row.status) }}</template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('common.createTime')" />
        <el-table-column :label="$t('sourcing.itemsCount')" width="120">
          <template slot-scope="scope">{{ (scope.row.items || []).length }}</template>
        </el-table-column>
      </el-table>
      <div class="mt-16" style="text-align:right">
        <el-pagination background layout="prev, pager, next, jumper" :page-size="history.page_size"
          :current-page.sync="history.page_number" :total="history.total" @current-change="loadHistory" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import WorldMagnifierBackground from '@/components/world-magnifier-background.vue'
import ImageUpload from '@/pages/product-manage/components/image-upload.vue'
import AuthImg from '@/components/auth-img.vue'
export default {
  name: 'DsSourcing',
  components: { PageHead, ImageUpload, AuthImg, WorldMagnifierBackground },
  data() {
    return {
      submittingUrl: false,
      submittingImage: false,
      submittingProduct: false,
      urlForm: { source_url: '' },
      urlRules: { source_url: [{ required: true, message: this.$t('sourcing.urlRequired'), trigger: 'blur' }] },
      moreVisible: false,
      moreStep: 'options',
      imageForm: { image: '', description: '', quote: '', purchase_reason: this.$t('sourcing.lowestPrice') },
      imageRules: {
        image: [{ required: true, message: this.$t('sourcing.imageRequired'), trigger: 'change' }],
        description: [{ required: true, message: this.$t('sourcing.descRequired'), trigger: 'blur' }],
        quote: [{ required: true, message: this.$t('sourcing.priceRequired'), trigger: 'blur' }]
      },
      productForm: { product_ids: [] },
      productRules: { product_ids: [{ required: true, message: this.$t('sourcing.productIdRequired'), trigger: 'change' }] },
      productOptions: [],
      productLoading: false,
      productQuery: { name: '', sku: '' },
      productTable: { items: [], total: 0, page_number: 1, page_size: 10 },
      selectedProductIds: [],
      historyVisible: false,
      historyLoading: false,
      historyQuery: { status: '' },
      history: { items: [], total: 0, page_number: 1, page_size: 10 }
    }
  },
  computed: {
    statusList() {
      const zh = { submitted: '已提交', sourcing: '选品中', pending_confirmation: '待确认', completed: '已完成' }
      const en = { submitted: 'Submitted', sourcing: 'Sourcing', pending_confirmation: 'Pending confirmation', completed: 'Completed' }
      const dict = this.$languageType === 'zh_cn' ? zh : en
      return [
        { value: 'submitted', label: dict.submitted },
        { value: 'sourcing', label: dict.sourcing },
        { value: 'pending_confirmation', label: dict.pending_confirmation },
        { value: 'completed', label: dict.completed }
      ]
    },
    currencySymbol() { return '$' }
  },
  methods: {
    statusLabel(s) { const map = this.statusList.reduce((a, c) => (a[c.value] = c.label, a), {}); return map[s] || s },
    onImageUploadChange(list) { this.imageForm.image = (list && list.length > 0) ? list[0].file_url : '' },
    formatProductLabel(p) {
      const cn = p.chinese_name || '', en = p.english_name || ''
      const skuCount = (p.product_variants || []).length
      const name = this.$languageType === 'zh_cn' ? (cn || en) : (en || cn)
      return skuCount ? `${name} (${skuCount})` : name
    },
    formatProductValue(p) { return p.product_uuid || p.product_id || p.system_number },
    async searchProducts(query) {
      if (!query) { this.productOptions = []; return }
      this.productLoading = true
      try {
        const key = this.$languageType === 'zh_cn' ? 'chinese_name_reg' : 'english_name_reg'
        const params = { [key]: query, cur_page: 1, page_size: 10 }
        const res = await this.$ajax({ url: '/api-prefix/api/product/query-product', method: 'get', params, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) { this.productOptions = (res.data?.result) || [] }
      } finally { this.productLoading = false }
    },
    submitUrl() {
      this.$refs.urlFormRef.validate(async valid => {
        if (!valid) return
        this.submittingUrl = true
        try {
          const payload = { status: 'submitted', purchase_reason: this.$t('sourcing.lowestPrice'), items: [{ source_type: 'url', source_url: this.urlForm.source_url }] }
          const res = await this.$ajax({ url: '/api/sourcing', method: 'post', data: payload, roleType: this.roleType })
          if (this.$isRequestSuccessful(res.code)) { this.$message.success(this.$t('common.operationSuccessful')); this.urlForm.source_url = '' }
        } finally { this.submittingUrl = false }
      })
    },
    openMore() { this.moreVisible = true; this.moreStep = 'options' },
    chooseMore(step) { this.moreStep = step; if (step === 'image') this.imageForm.purchase_reason = this.$t('sourcing.lowestPrice'); if (step === 'product') { this.selectedProductIds = []; this.loadProductList(1) } },
    onProductSelectionChange(selection) { this.selectedProductIds = (selection || []).map(row => this.formatProductValue(row)) },
    resetProductQuery() { this.productQuery = { name: '', sku: '' }; this.loadProductList(1) },
    async loadProductList(page) {
      this.productLoading = true
      try {
        const key = this.$languageType === 'zh_cn' ? 'chinese_name_reg' : 'english_name_reg'
        const params = { cur_page: page || this.productTable.page_number, page_size: this.productTable.page_size }
        if (this.productQuery.name) params[key] = this.productQuery.name
        if (this.productQuery.sku) params['product_variants.product_code_sku_reg'] = this.productQuery.sku
        const res = await this.$ajax({ url: '/api-prefix/api/product/query-product', method: 'get', params, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) {
          const data = res.data || { result: [], total: 0, cur_page: 1, page_size: 10 }
          this.productTable.items = data.result || []
          this.productTable.total = data.total || 0
          this.productTable.page_number = data.cur_page || 1
          this.productTable.page_size = data.page_size || params.page_size
        } else { this.productTable.items = []; this.productTable.total = 0 }
      } finally { this.productLoading = false }
    },
    backMore() { this.moreStep = 'options' },
    async submitImage() {
      this.$refs.imageFormRef.validate(async valid => {
        if (!valid) return
        this.submittingImage = true
        try {
          const payload = { status: 'submitted', purchase_reason: this.imageForm.purchase_reason, items: [{ source_type: 'image', image: this.imageForm.image, description: this.imageForm.description, quote: this.imageForm.quote }] }
          const res = await this.$ajax({ url: '/api/sourcing', method: 'post', data: payload, roleType: this.roleType })
          if (this.$isRequestSuccessful(res.code)) { this.$message.success(this.$t('common.operationSuccessful')); this.moreVisible = false; this.imageForm = { image: '', description: '', quote: '', purchase_reason: '' } }
        } finally { this.submittingImage = false }
      })
    },
    async submitProduct() {
      if (!this.selectedProductIds.length) { this.$message.warning(this.$t('message.productManagement.productSelect')); return }
      this.submittingProduct = true
      try {
        const payload = { status: 'submitted', purchase_reason: this.$t('sourcing.lowestPrice'), items: (this.selectedProductIds || []).map(id => ({ source_type: 'product', product_id: id })) }
        const res = await this.$ajax({ url: '/api/sourcing', method: 'post', data: payload, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) { this.$message.success(this.$t('common.operationSuccessful')); this.moreVisible = false; this.selectedProductIds = [] }
      } finally { this.submittingProduct = false }
    },
    openHistory() { this.historyVisible = true; this.loadHistory(1) },
    resetHistory() { this.historyQuery = { status: '' }; this.loadHistory(1) },
    async loadHistory(page) {
      this.historyLoading = true
      try {
        const params = { page_number: page || this.history.page_number, page_size: this.history.page_size }
        if (this.historyQuery.status) params.status = this.historyQuery.status
        const res = await this.$ajax({ url: '/api/sourcing', method: 'get', params, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) { const data = res.data || { items: [], total: 0, page_number: 1, page_size: 10 }; this.history = data }
      } finally { this.historyLoading = false }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

}

.sourcing-hero {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 0 24px;
  min-height: 90vh;
  /* fill this area */
  overflow: hidden;
  border-radius: 10px !important;

}

.hero-card {
  width: 720px;
  background: var(--custom-background-color);
  border: 1px solid var(--custom-border-color);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  padding: 20px;
  position: relative;
  z-index: 2;
}

.hero-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -16px;
  /* bleed into page padding */
  right: -16px;
  /* bleed into page padding */
  z-index: 1;
  pointer-events: none;
}

.hero-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  /*color: var(--custom-font-color);*/
}

.info-banner {
  background: rgba(246, 210, 120, 0.35);
  border: 1px solid rgba(246, 210, 120, 0.6);
  color: var(--custom-font-color);
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 14px;

  .info-title {
    font-weight: 700;
    margin-bottom: 6px;
  }

  .info-desc {
    color: var(--custom-font-color2);
  }

  .info-link {
    color: var(--custom-color-primary);
  }
}

.url-form {
  margin-top: 12px;
}

.url-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.url-submit {
  height: 44px;
}

.url-input {
  .el-input__inner {
    height: 44px;
    border-radius: 5px;
  }
}

.hero-links {
  margin-top: 8px;
  text-align: right;

  .divider {
    margin: 0 8px;
    color: var(--custom-font-color2);
  }

  a {
    color: var(--custom-color-primary);
  }
}

.more-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
}

.more-buttons {
  align-items: stretch;
}

.more-action-btn {
  height: 96px;
  width: 100%;
  text-align: left;
  border-radius: 10px;
  padding: 12px 16px;
  transition: all .15s ease;
}

.more-action-btn .btn-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.more-action-btn .btn-desc {
  display: block;
  color: var(--custom-font-color2);
}

.more-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.more-action-btn:active {
  transform: translateY(0);
}

.option-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.option-desc {
  color: var(--custom-font-color2);
}

.dialog-actions {
  text-align: right;
}

.sku-cell {
  white-space: normal;
  word-break: break-word;
}

/* Make the page header title white on this page to ensure contrast over the map */
::v-deep .head-title {
  color: #ffffff !important;
  margin-left: 10px;
}

.his-item-list {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 8px;
}

.his-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
}

.his-item__preview {
  width: 64px;
  display: flex;
  justify-content: center;
}

.his-item__icon {
  font-size: 28px;
  color: var(--custom-color-primary);
}

.his-item__meta {
  flex: 1;
}

.his-item__line {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 4px;
}

.his-item__link {
  color: var(--custom-color-primary);
  max-width: 520px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.his-item__text {
  color: var(--custom-font-color);
}

.his-item__sub {
  color: var(--custom-font-color2);
  font-size: 12px;
}
</style>
