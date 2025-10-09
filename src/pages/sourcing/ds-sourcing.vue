<template>
  <div class="sourcing-page">
    <div class="page-bg">
      <WorldMagnifierBackground :lang="$i18n.locale" :fixed="false" :gradient-stops="['#A67C52', '#FFD700', '#FF4500']"
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

        <!-- URL input with system-styled submit button (Ant Design Vue) -->
        <a-form-model :model="urlForm" :rules="urlRules" ref="urlFormRef" class="url-form"
          @submit.native.prevent="submitUrl">
          <div class="url-row">
            <a-form-model-item prop="source_url" class="url-item">
              <a-input v-model="urlForm.source_url" :placeholder="$t('sourcing.insertUrlPlaceholder')" :allowClear="true"
                class="url-input">
                <a-icon slot="prefix" type="search" />
              </a-input>
            </a-form-model-item>
            <a-button class="url-submit" type="primary" :loading="submittingUrl" @click="submitUrl">{{
              $t('common.submit') }}</a-button>
          </div>
        </a-form-model>

        <div class="hero-links">
          <a @click.prevent="openMore">{{ $t('common.more') }}</a>
          <span class="divider">|</span>
          <a @click.prevent="openHistory">{{ $t('common.history') }}</a>
        </div>
      </div>
    </div>

    <!-- More Modal (Ant Design Vue) -->
    <a-modal :title="$t('sourcing.moreOptions')" :visible="moreVisible" width="1040px"
      class="global-modal-class global-modal-center" :footer="null" @cancel="moreVisible=false">
      <div v-if="moreStep === 'options'" class="more-options more-buttons">
        <a-button class="more-action-btn" type="primary" @click="chooseMore('image')">
          <span class="btn-title">{{ $t('sourcing.inputImageDescPrice') }}</span>
          <span class="btn-desc">{{ $t('sourcing.inputImageDescPriceDesc') }}</span>
        </a-button>
        <a-button class="more-action-btn" @click="chooseMore('product')">
          <span class="btn-title">{{ $t('sourcing.existingProducts') }}</span>
          <span class="btn-desc">{{ $t('sourcing.existingProductsDesc') }}</span>
        </a-button>
      </div>
      <div v-else-if="moreStep === 'image'">
        <a-form-model :model="imageForm" :rules="imageRules" ref="imageFormRef" label-align="left" layout="vertical">
          <a-form-model-item :label="$t('dashboard.image')" prop="image">
            <a-upload name="files" :action="'/api-prefix/api/upload/'" list-type="picture-card"
              :headers="getGlobalHeaders(roleType)" :file-list="imageFileList"
              :showUploadList="{ showPreviewIcon: true, showRemoveIcon: true }"
              :multiple="false" @change="handleAntUploadChange" @preview="handleAntPreview">
              <a-icon type="plus" />
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
              <img :src="previewImage" alt="preview" style="width: 100%" />
            </a-modal>
          </a-form-model-item>
          <a-form-model-item :label="$t('common.describe')" prop="description">
            <a-input type="textarea" v-model="imageForm.description"
              :placeholder="$t('sourcing.descriptionPlaceholder')" :rows="3" />
          </a-form-model-item>
          <a-form-model-item :label="$t('sourcing.expectedPrice')" prop="quote">
            <a-input v-model="imageForm.quote" :placeholder="$t('sourcing.pricePlaceholder')" :allowClear="true">
              <span slot="addonBefore">{{ currencySymbol }}</span>
            </a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('sourcing.purchaseReason')">
            <a-input v-model="imageForm.purchase_reason" :disabled="true"></a-input>
          </a-form-model-item>
        </a-form-model>
        <div class="dialog-actions">
          <a-button @click="backMore">{{ $t('common.back') }}</a-button>
          <a-button type="primary" :loading="submittingImage" @click="submitImage">{{ $t('common.submit')
          }}</a-button>
        </div>
      </div>
      <div v-else-if="moreStep === 'product'">
        <!-- search bar (Ant Design Vue) -->
        <a-form-model layout="inline" :model="productQuery" class="mb-24 modal-inline-form">
          <a-form-model-item>
            <a-input v-model="productQuery.name" :allowClear="true"
              :placeholder="langType === 'zh_cn' ? $t('message.productManagement.chineseName') : $t('message.productManagement.englishName')"
              style="width:220px" />
          </a-form-model-item>
          <a-form-model-item>
            <a-input v-model="productQuery.sku" :placeholder="$t('message.productManagement.productSku')" :allowClear="true" style="width:220px" />
          </a-form-model-item>
          <a-form-model-item class="form-actions-inline">
            <a-button type="primary" @click="loadProductList(1)">{{ $t('common.search') }}</a-button>
            <a-button @click="resetProductQuery">{{ $t('common.reset') }}</a-button>
          </a-form-model-item>
        </a-form-model>

        <!-- product table (Ant Design Vue) -->
        <a-table :data-source="productTable.items" :loading="productLoading" :rowKey="formatProductValue"
          :row-selection="productRowSelection" :pagination="false" size="small" :scroll="{ x: true }">
          <a-table-column :title="$t('dashboard.image')" key="image" width="90">
            <template slot-scope="text, record">
              <AuthImg :src="record.sub_image_url ? record.sub_image_url : record.main_image_url"
                :styleInfo="'width:48px;height:48px;'" />
            </template>
          </a-table-column>
          <a-table-column :title="langType === 'zh_cn' ? $t('message.productManagement.chineseName') : $t('message.productManagement.englishName')"
            key="name" :ellipsis="true">
            <template slot-scope="text, record">
              <span v-if="langType === 'zh_cn'">{{ (record.chinese_name || '') + (record.sub_chinese_name ? '-' + record.sub_chinese_name : '') }}</span>
              <span v-else>{{ (record.english_name || '') + (record.sub_english_name ? ' - ' + record.sub_english_name : '') }}</span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('message.productManagement.productSku')" key="sku" :ellipsis="false">
            <template slot-scope="text, record">
              <span class="sku-cell">{{ (record.product_variants || []).map(v => v.product_code_sku).join(', ') }}</span>
            </template>
          </a-table-column>
        </a-table>
        <div class="mt-16" style="text-align:right">
          <a-pagination show-quick-jumper :pageSize="productTable.page_size" :current="productTable.page_number"
            :total="productTable.total" @change="loadProductList" />
        </div>
        <div class="dialog-actions">
          <a-button @click="backMore">{{ $t('common.back') }}</a-button>
          <a-button type="primary" :loading="submittingProduct" @click="submitProduct">{{ $t('common.submit')
          }}</a-button>
        </div>
      </div>
    </a-modal>

    <!-- History Modal (Ant Design Vue) -->
    <a-modal :title="$t('sourcing.historyTitle')" :visible="historyVisible" width="1040px" :footer="null"
      class="global-modal-class global-modal-center" @cancel="historyVisible=false">
      <a-form-model layout="inline" :model="historyQuery" class="mb-24 modal-inline-form">
        <a-form-model-item>
          <a-input v-model="historyQuery.keyword" :allowClear="true" :placeholder="$t('common.pleaseEnterAKeyword')" style="width:260px" />
        </a-form-model-item>
        <a-form-model-item :label="$t('common.status')">
          <a-select v-model="historyQuery.status" :allowClear="true" :placeholder="$t('common.pleaseSelect')"
            style="width:180px">
            <a-select-option v-for="s in statusList" :key="s.value" :value="s.value">{{ s.label }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="form-actions-inline">
          <a-button @click="resetHistory">{{ $t('common.reset') }}</a-button>
        </a-form-model-item>
      </a-form-model>

      <a-table :data-source="history.items" :loading="historyLoading" :pagination="false" size="small">
        <template slot="expandedRowRender" slot-scope="record">
          <div class="his-item-list">
            <div class="his-item" v-for="(it, idx) in (record.items || [])" :key="it.item_id || idx">
              <div class="his-item__preview">
                <AuthImg v-if="it.source_type === 'image' && it.image" :src="it.image"
                  :styleInfo="'width:56px;height:56px;border-radius:6px;'" />
                <a-icon v-else-if="it.source_type === 'url'" type="link" class="his-item__icon" />
                <a-icon v-else type="shopping" class="his-item__icon" />
              </div>
              <div class="his-item__meta">
                <div class="his-item__line">
                  <a-tag color="blue" size="small">{{ it.source_type }}</a-tag>
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
        <a-table-column key="status" width="220">
          <span slot="title">
            <span>{{ $t('common.status') }}</span>
            <a-tooltip placement="top" overlayClassName="status-tips-pop">
              <template slot="title">
                <div class="status-tips-list">
                  <div><a-tag color="geekblue" size="small">{{ statusLabel('submitted') }}</a-tag> — {{ $t('sourcing.statusTips.submitted') }}</div>
                  <div><a-tag color="gold" size="small">{{ statusLabel('sourcing') }}</a-tag> — {{ $t('sourcing.statusTips.sourcing') }}</div>
                  <div><a-tag color="purple" size="small">{{ statusLabel('pending_confirmation') }}</a-tag> — {{ $t('sourcing.statusTips.pending_confirmation') }}</div>
                  <div><a-tag color="green" size="small">{{ statusLabel('completed') }}</a-tag> — {{ $t('sourcing.statusTips.completed') }}</div>
                </div>
              </template>
              <a-icon type="info-circle" style="margin-left:6px; color: var(--custom-font-color2)" />
            </a-tooltip>
          </span>
          <template slot-scope="text, record">
            <a-tag :color="statusColor(record.status)">{{ statusLabel(record.status) }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column :title="$t('common.createTime')" dataIndex="created_at" key="created_at" />
        <a-table-column :title="$t('sourcing.itemsCount')" key="items">
          <template slot-scope="text, record">{{ (record.items || []).length }}</template>
        </a-table-column>
        <a-table-column :title="$t('common.operation')" key="op" width="160">
          <template slot-scope="text, record">
            <a-button v-if="record.status==='pending_confirmation'" type="primary" size="small" @click="confirmHistory(record)">{{ $t('common.confirm') }}</a-button>
          </template>
        </a-table-column>
      </a-table>
      <div class="mt-16" style="text-align:right">
        <a-pagination show-quick-jumper :pageSize="history.page_size" :current="history.page_number"
          :total="history.total" @change="loadHistory" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import WorldMagnifierBackground from '@/components/world-magnifier-background.vue'
import AuthImg from '@/components/auth-img.vue'
import { message } from 'ant-design-vue'
import { getGlobalHeaders } from '@/common/common-func'
import bus, { EVENTS } from '@/common/event-bus'
export default {
  name: 'DsSourcing',
  components: { PageHead, AuthImg, WorldMagnifierBackground },
  data() {
    return {
      submittingUrl: false,
      submittingImage: false,
      submittingProduct: false,
      urlForm: { source_url: '' },
      urlRules: {
        source_url: [
          { required: true, message: this.$t('sourcing.urlRequired'), trigger: ['blur', 'change'] },
          { validator: this.validateSourceUrl, trigger: ['blur', 'change'] }
        ]
      },
      moreVisible: false,
      moreStep: 'options',
      imageForm: { image: '', description: '', quote: '', purchase_reason: this.$t('sourcing.lowestPrice') },
      imageFileList: [],
      previewVisible: false,
      previewImage: '',
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
      historyQuery: { status: '', keyword: '' },
      history: { items: [], total: 0, page_number: 1, page_size: 10 },
      _historyDebounce: null
    }
  },
  computed: {
    langType() { return this.$i18n.locale },
    statusList() {
      const zh = { submitted: '已提交', sourcing: '选品中', pending_confirmation: '待确认', completed: '已完成' }
      const en = { submitted: 'Submitted', sourcing: 'Sourcing', pending_confirmation: 'Pending confirmation', completed: 'Completed' }
      const dict = this.langType === 'zh_cn' ? zh : en
      return [
        { value: 'submitted', label: dict.submitted },
        { value: 'sourcing', label: dict.sourcing },
        { value: 'pending_confirmation', label: dict.pending_confirmation },
        { value: 'completed', label: dict.completed }
      ]
    },
    currencySymbol() { return '$' },
    productRowSelection() {
      return { selectedRowKeys: this.selectedProductIds, onChange: this.onProductSelectionChangeKeys }
    }
  },
  created() {
    // refresh history dialog when open and receiving WS notification
    this._unsub = () => { if (this.historyVisible) this.loadHistory(this.history.page_number) }
    bus.$on(EVENTS.SOURCING_NOTIFICATION, this._unsub)
  },
  beforeDestroy() { bus.$off(EVENTS.SOURCING_NOTIFICATION, this._unsub) },
  watch: {
    historyQuery: {
      handler() { this.scheduleHistorySearch() },
      deep: true
    }
  },
  methods: {
    validateSourceUrl(rule, value, callback) {
      if (!value) { callback(); return }
      // Must start with http/https and contain a valid domain like a.b.com with optional port and path
      const re = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d{2,5})?(?:[/?#].*)?$/
      if (re.test(value)) { callback() }
      else { callback(new Error(this.$t('sourcing.urlInvalid'))) }
    },
    statusLabel(s) { const map = this.statusList.reduce((a, c) => (a[c.value] = c.label, a), {}); return map[s] || s },
    statusColor(s) {
      // use AntD preset colors for clarity; can theme-map later if needed
      const map = {
        submitted: 'geekblue',
        sourcing: 'gold',
        pending_confirmation: 'purple',
        completed: 'green'
      }
      return map[s] || 'default'
    },
    getGlobalHeaders,
    handleAntUploadChange({ file, fileList }) {
      this.imageFileList = fileList.slice(-1)
      const f = this.imageFileList[0]
      if (f && f.response && f.response.data && f.response.data[0] && !f.response.data[0].code) {
        const url = (f.response.data[0].file_url || '').replace(/^\//, '')
        this.imageForm.image = url
      } else if (f && f.url) {
        this.imageForm.image = f.url
      }
    },
    handleAntPreview(file) {
      this.previewImage = (file.url || (file.response && file.response.data && file.response.data[0] && file.response.data[0].file_url) || '').replace(/^\//, '')
      this.previewVisible = true
    },
    formatProductLabel(p) {
      const cn = p.chinese_name || '', en = p.english_name || ''
      const skuCount = (p.product_variants || []).length
      const name = this.langType === 'zh_cn' ? (cn || en) : (en || cn)
      return skuCount ? `${name} (${skuCount})` : name
    },
    formatProductValue(p) { return p.product_uuid || p.product_id || p.system_number },
    async searchProducts(query) {
      if (!query) { this.productOptions = []; return }
      this.productLoading = true
      try {
        const key = this.langType === 'zh_cn' ? 'chinese_name_reg' : 'english_name_reg'
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
          if (this.$isRequestSuccessful(res.code)) { message.success(this.$t('common.operationSuccessful')); this.urlForm.source_url = '' }
        } finally { this.submittingUrl = false }
      })
    },
    openMore() { this.moreVisible = true; this.moreStep = 'options' },
    chooseMore(step) { this.moreStep = step; if (step === 'image') this.imageForm.purchase_reason = this.$t('sourcing.lowestPrice'); if (step === 'product') { this.selectedProductIds = []; this.loadProductList(1) } },
    onProductSelectionChangeKeys(selectedRowKeys, selectedRows) { this.selectedProductIds = selectedRowKeys },
    resetProductQuery() { this.productQuery = { name: '', sku: '' }; this.loadProductList(1) },
    async loadProductList(page) {
      this.productLoading = true
      try {
        const key = this.langType === 'zh_cn' ? 'chinese_name_reg' : 'english_name_reg'
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
          if (this.$isRequestSuccessful(res.code)) { message.success(this.$t('common.operationSuccessful')); this.moreVisible = false; this.imageForm = { image: '', description: '', quote: '', purchase_reason: '' } }
        } finally { this.submittingImage = false }
      })
    },
    async submitProduct() {
      if (!this.selectedProductIds.length) { message.warning(this.$t('message.productManagement.productSelect')); return }
      this.submittingProduct = true
      try {
        const payload = { status: 'submitted', purchase_reason: this.$t('sourcing.lowestPrice'), items: (this.selectedProductIds || []).map(id => ({ source_type: 'product', product_id: id })) }
        const res = await this.$ajax({ url: '/api/sourcing', method: 'post', data: payload, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) { message.success(this.$t('common.operationSuccessful')); this.moreVisible = false; this.selectedProductIds = [] }
      } finally { this.submittingProduct = false }
    },
    openHistory() { this.historyVisible = true; this.loadHistory(1) },
    resetHistory() { this.historyQuery = { status: '', keyword: '' }; this.loadHistory(1) },
    scheduleHistorySearch() {
      if (!this.historyVisible) return
      clearTimeout(this._historyDebounce)
      this._historyDebounce = setTimeout(() => this.loadHistory(1), 400)
    },
    async loadHistory(page) {
      this.historyLoading = true
      try {
        const params = { page_number: page || this.history.page_number, page_size: this.history.page_size }
        if (this.historyQuery.status) params.status = this.historyQuery.status
        if (this.historyQuery.keyword) params.keyword = this.historyQuery.keyword
        const res = await this.$ajax({ url: '/api/sourcing', method: 'get', params, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) { const data = res.data || { items: [], total: 0, page_number: 1, page_size: 10 }; this.history = data }
      } finally { this.historyLoading = false }
    },
    async confirmHistory(row) {
      try {
        const res = await this.$ajax({ url: `/api/sourcing/${row.sourcing_id}`, method: 'put', data: { status: 'completed' }, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) { message.success(this.$t('common.operationSuccessful')); this.loadHistory() }
      } catch (e) { /* ignore */ }
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
  /* 让按钮与输入框顶对齐，出现错误提示时也不下沉 */
  align-items: flex-start;
}

.url-item {
  flex: 1;
  margin-bottom: 0; /* keep row height compact */
}

.url-submit {
  height: 44px;
  align-self: flex-start;
}

.url-input {
  /* Ant Design input inner */
  ::v-deep .ant-input {
    height: 44px;
    border-radius: 5px;
  }
}

/* 表单校验提示与输入框保持更舒适的间距 */
::v-deep .url-item .ant-form-explain {
  margin-top: 6px;
  line-height: 1.3;
}

/* inline forms actions alignment */
.form-actions-inline {
  ::v-deep .ant-form-item-control {
    display: inline-flex;
    gap: 8px;
    align-items: center;
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
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.sku-cell {
  white-space: normal;
  word-break: break-word;
}

/* spacing for inline forms in modals */
.modal-inline-form {
  margin-bottom: 12px;
}
.modal-inline-form ::v-deep .ant-form-item {
  margin-right: 16px;
  margin-bottom: 12px;
}
.modal-inline-form ::v-deep .ant-btn + .ant-btn {
  margin-left: 8px;
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

.status-tips {
  max-width: 520px;
}
.status-tips b { color: var(--custom-font-color); }
</style>
