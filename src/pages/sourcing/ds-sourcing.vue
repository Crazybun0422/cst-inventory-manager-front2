<template>
  <div class="sourcing-page">
    <div class="page-bg">
      <WorldMagnifierBackground :lang="$i18n.locale" :fixed="false" :gradient-stops="['#A67C52', '#FFD700', '#FF4500']"
        accent="#FFD700" />
    </div>
    <PageHead :title="$t('navigate.sourcing')" />

    <div class="sourcing-hero">
      <!-- Inline Support Items Banner (inside hero area, above card) -->
      <div class="support-inline">
        <div class="support-banner" ref="supportBanner">
          <div class="scroller" ref="scrollerWrap" @mouseenter="pauseScroll = true" @mouseleave="pauseScroll = false">
            <div class="scroller-track" ref="scrollerTrack" :class="{ paused: pauseScroll }"
              :style="{ '--block-width': (marqueeBlockWidth || 0) + 'px' }">
              <section v-for="(it, idx) in duplicatedSupportItems" :key="'inline' + idx"
                :class="['banner-item', { 'is-tiktok': /tiktok/i.test(it.name) }]">
                <a :href="it.url" target="_blank" rel="noopener">
                  <img :src="it.img" :alt="it.name" />
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>

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
            <span> {{ $t('sourcing.etcSuffix') }} </span>
          </div>
        </div>

        <!-- URL input with system-styled submit button (Ant Design Vue) -->
        <a-form-model :model="urlForm" :rules="urlRules" ref="urlFormRef" class="url-form"
          @submit.native.prevent="submitUrl">
          <div class="url-row">
            <a-form-model-item prop="source_url" class="url-item">
              <a-input v-model="urlForm.source_url" :placeholder="$t('sourcing.insertUrlPlaceholder')"
                :allowClear="true" class="url-input">
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
      class="global-modal-class global-modal-center" :footer="null" @cancel="moreVisible = false">
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
              :showUploadList="{ showPreviewIcon: true, showRemoveIcon: true }" :multiple="false"
              @change="handleAntUploadChange" @preview="handleAntPreview">
              <a-icon type="plus" />
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
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
      <div v-else-if="moreStep === 'product'" class="product-step">
        <!-- search bar (Ant Design Vue) -->
        <a-form-model layout="inline" :model="productQuery" class="mb-24 modal-inline-form product-search-form">
          <a-form-model-item>
            <a-input v-model="productQuery.name" :allowClear="true"
              :placeholder="langType === 'zh_cn' ? $t('message.productManagement.chineseName') : $t('message.productManagement.englishName')"
              style="width:220px" />
          </a-form-model-item>
          <a-form-model-item>
            <a-input v-model="productQuery.sku" :placeholder="$t('message.productManagement.productSku')"
              :allowClear="true" style="width:220px" />
          </a-form-model-item>
          <a-form-model-item class="form-actions-inline">
            <a-button type="primary" @click="loadProductList(1)">{{ $t('common.search') }}</a-button>
            <a-button @click="resetProductQuery">{{ $t('common.reset') }}</a-button>
          </a-form-model-item>
        </a-form-model>

        <!-- product table (Ant Design Vue) -->
        <div class="product-table-wrapper">
          <a-table class="product-table" :data-source="productTable.items" :loading="productLoading"
            :rowKey="formatProductValue" :pagination="false" size="small" :scroll="productTableScroll"
            :expandedRowKeys="productExpandedKeys" @expand="handleProductExpand">
            <a-table-column key="select" width="50" align="center">
              <template slot-scope="text, record">
                <a-checkbox :disabled="!hasSelectableVariants(record)" :indeterminate="isProductIndeterminate(record)"
                  :checked="isProductFullySelected(record)"
                  @change="onToggleProduct(record, $event.target.checked)" />
              </template>
            </a-table-column>
            <a-table-column :title="$t('dashboard.image')" key="image" width="90">
              <template slot-scope="text, record">
                <AuthImg :src="record.sub_image_url ? record.sub_image_url : record.main_image_url"
                  :styleInfo="'width:48px;height:48px;'" />
              </template>
            </a-table-column>
            <a-table-column
              :title="langType === 'zh_cn' ? $t('message.productManagement.chineseName') : $t('message.productManagement.englishName')"
              key="name" :ellipsis="true">
              <template slot-scope="text, record">
                <span>{{ formatProductTitle(record) }}</span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('message.productManagement.productSku')" key="sku">
              <template slot-scope="text, record">
                <span class="sku-cell">{{ (record.product_variants || []).map(v => v.product_code_sku).join(', ') }}</span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('message.productManagement.price')" key="price" width="120">
              <template slot-scope="text, record">
                <span>{{ formatProductPrice(record) }}</span>
              </template>
            </a-table-column>
            <template slot="expandedRowRender" slot-scope="record">
              <a-table class="variant-table" :data-source="getProductVariants(record)" :rowKey="variantRowKey"
                :pagination="false" size="small">
                <a-table-column key="select" width="50" align="center">
                  <template slot-scope="text, variant">
                    <a-checkbox :checked="isVariantSelected(record, variant)"
                      @change="onToggleVariant(record, variant, $event.target.checked)" />
                  </template>
                </a-table-column>
                <a-table-column :title="$t('dashboard.image')" key="image" width="90">
                  <template slot-scope="text, variant">
                    <AuthImg :src="variantImage(record, variant)" :styleInfo="'width:48px;height:48px;'" />
                  </template>
                </a-table-column>
                <a-table-column
                  :title="langType === 'zh_cn' ? $t('message.productManagement.chineseName') : $t('message.productManagement.englishName')"
                  key="name" :ellipsis="true">
                  <template slot-scope="text, variant">
                    <span>{{ formatVariantTitle(record, variant) }}</span>
                  </template>
                </a-table-column>
                <a-table-column :title="$t('message.productManagement.productSku')" key="sku">
                  <template slot-scope="text, variant">
                    <span>{{ variant.product_code_sku }}</span>
                  </template>
                </a-table-column>
                <a-table-column :title="$t('message.productManagement.price')" key="price" width="120">
                  <template slot-scope="text, variant">
                    <span>{{ formatVariantPrice(variant) }}</span>
                  </template>
                </a-table-column>
              </a-table>
            </template>
          </a-table>
        </div>
        <div class="product-footer">
          <div class="product-pagination">
            <a-pagination show-quick-jumper :pageSize="productTable.page_size" :current="productTable.page_number"
              :total="productTable.total" @change="loadProductList" />
          </div>
          <div class="dialog-actions product-actions">
            <a-button @click="backMore">{{ $t('common.back') }}</a-button>
            <a-button type="primary" :disabled="!totalSelectedVariants" :loading="submittingProduct"
              @click="submitProduct">{{ $t('common.submit')
              }}</a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- History Modal (Ant Design Vue) -->
    <a-modal :title="$t('sourcing.historyTitle')" :visible="historyVisible" width="1040px" :footer="null"
      class="global-modal-class global-modal-center" @cancel="historyVisible = false">
      <a-form-model layout="inline" :model="historyQuery" class="mb-24 modal-inline-form">
        <a-form-model-item>
          <a-input v-model="historyQuery.keyword" :allowClear="true" :placeholder="$t('sourcing.partUrlPlaceholder')"
            style="width:260px" />
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

      <a-table :data-source="history.items" :loading="historyLoading" :pagination="false" size="small"
        :rowKey="historyRowKey" :expandedRowKeys="historyExpandedKeys" @expand="handleHistoryExpand">
        <template slot="expandedRowRender" slot-scope="record">
          <div class="his-item-list">
            <div class="his-item" v-for="(it, idx) in (record.items || [])" :key="it.item_id || idx">
              <div class="his-item__preview">
                <template v-if="it.source_type === 'product'">
                  <a-spin v-if="isHistoryVariantLoading(it)" size="small" />
                  <AuthImg v-else-if="getHistoryVariantImage(it)" :src="getHistoryVariantImage(it)"
                    :styleInfo="'width:56px;height:56px;border-radius:6px;'" />
                  <a-icon v-else type="shopping" class="his-item__icon" />
                </template>
                <AuthImg v-else-if="it.source_type === 'image' && it.image" :src="it.image"
                  :styleInfo="'width:56px;height:56px;border-radius:6px;'" />
                <a-icon v-else-if="it.source_type === 'url'" type="link" class="his-item__icon" />
                <a-icon v-else type="shopping" class="his-item__icon" />
              </div>
              <div class="his-item__meta">
                <div class="his-item__line">
                  <a-tag color="blue" size="small">{{ it.source_type }}</a-tag>
                  <a v-if="it.source_type === 'url'" class="his-item__link" :href="it.source_url" target="_blank"
                    rel="noopener">{{ it.source_url }}</a>
                  <template v-else-if="it.source_type === 'product'">
                    <span v-if="getHistoryVariantTitle(it)" class="his-item__text">{{ getHistoryVariantTitle(it) }}</span>
                    <span v-else-if="isHistoryVariantLoading(it)" class="his-item__text">{{ $t('common.loading') }}</span>
                    <span v-else-if="isHistoryVariantError(it)" class="his-item__text">{{ $t('sourcing.variantInfoUnavailable') }}</span>
                    <span v-else class="his-item__text">{{ it.product_id }}</span>
                  </template>
                  <span v-else-if="it.source_type === 'image'" class="his-item__text">{{ it.description }}</span>
                </div>
                <template v-if="it.source_type === 'product'">
                  <div class="his-item__sub product-sub">
                    <span v-if="getHistoryVariantSku(it)">
                      {{ $t('message.productManagement.productSku') }}: {{ getHistoryVariantSku(it) }}
                    </span>
                    <span v-if="getHistoryVariantPrice(it)">
                      {{ $t('message.productManagement.price') }}: {{ getHistoryVariantPrice(it) }}
                    </span>
                  </div>
                </template>
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
                  <div><a-tag color="geekblue" size="small">{{ statusLabel('submitted') }}</a-tag> — {{
                    $t('sourcing.statusTips.submitted') }}</div>
                  <div><a-tag color="gold" size="small">{{ statusLabel('sourcing') }}</a-tag> — {{
                    $t('sourcing.statusTips.sourcing') }}</div>
                  <div><a-tag color="purple" size="small">{{ statusLabel('pending_confirmation') }}</a-tag> — {{
                    $t('sourcing.statusTips.pending_confirmation') }}</div>
                  <div><a-tag color="green" size="small">{{ statusLabel('completed') }}</a-tag> — {{
                    $t('sourcing.statusTips.completed') }}</div>
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
            <a-button v-if="record.status === 'pending_confirmation'" type="primary" size="small"
              @click="confirmHistory(record)">{{ $t('common.confirm') }}</a-button>
          </template>
        </a-table-column>
      </a-table>
      <div class="mt-16" style="text-align:right">
        <a-pagination show-quick-jumper :showSizeChanger="true" :pageSizeOptions="['10', '20', '50', '100']"
          :pageSize="history.page_size" :current="history.page_number" :total="history.total" @change="loadHistory"
          @showSizeChange="onHistorySizeChange" />
      </div>
    </a-modal>

    <!-- Removed Support Items Modal; now inline above -->
  </div>
</template>

<script>
import PageHead from '@/components/page-head.vue'
import WorldMagnifierBackground from '@/components/world-magnifier-background.vue'
import AuthImg from '@/components/auth-img.vue'
import { message, Modal } from 'ant-design-vue'
import { getGlobalHeaders } from '@/common/common-func'
import bus, { EVENTS } from '@/common/event-bus'
import { currencySymbolMap } from '@/common/field-maping'
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
      selectedVariantsMap: {},
      productExpandedKeys: [],
      productTableScrollY: 360,
      historyVisible: false,
      historyLoading: false,
      historyQuery: { status: '', keyword: '' },
      history: { items: [], total: 0, page_number: 1, page_size: 10 },
      historyExpandedKeys: [],
      historyVariantInfo: {},
      historyVariantLoading: {},
      _historyDebounce: null,
      // inline support banner state
      pauseScroll: false,
      supportItems: [],
      marqueeBlock: [],
      bannerHeight: 100,
      scrollerGap: 24,
      marqueeBlockWidth: 0,
      currencySymbolMap
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
    productTableScroll() {
      return { x: 'max-content', y: this.productTableScrollY }
    },
    duplicatedSupportItems() {
      // two identical blocks to enable seamless looping at -50%
      const block = this.marqueeBlock.length ? this.marqueeBlock : this.supportItems
      return [...block, ...block]
    },
    totalSelectedVariants() {
      const map = this.selectedVariantsMap || {}
      return Object.values(map).reduce((sum, list) => {
        if (Array.isArray(list)) return sum + list.length
        return sum
      }, 0)
    }
  },
  created() {
    // refresh history dialog when open and receiving WS notification
    this._unsub = () => { if (this.historyVisible) this.loadHistory(this.history.page_number) }
    bus.$on(EVENTS.SOURCING_NOTIFICATION, this._unsub)
    // preload support items
    this.loadSupportItems()
    // Check if there are sourcing records awaiting confirmation and gently prompt
    this.$nextTick(() => {
      try { this.checkPendingConfirmations() } catch (_) { }
    })
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.buildMarquee)
    }
  },
  beforeDestroy() {
    bus.$off(EVENTS.SOURCING_NOTIFICATION, this._unsub)
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.buildMarquee)
    }
  },
  watch: {
    historyQuery: {
      handler() { this.scheduleHistorySearch() },
      deep: true
    },
    supportItems() {
      this.$nextTick(() => this.buildMarquee())
    }
  },
  methods: {
    // Escape regex special characters for backend literal matching
    escapeRegexLiteral(str) { return str ? String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '' },
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
    formatProductTitle(product) {
      if (!product) return ''
      const primary = this.langType === 'zh_cn'
        ? (product.chinese_name || '')
        : (product.english_name || '')
      const secondary = this.langType === 'zh_cn'
        ? (product.english_name || '')
        : (product.chinese_name || '')
      return primary || secondary || ''
    },
    formatProductValue(p) { return p.product_uuid || p.product_id || p.system_number },
    productKey(product) {
      const raw = this.formatProductValue(product)
      if (raw === undefined || raw === null) return ''
      return String(raw)
    },
    getProductVariants(product) {
      if (product && Array.isArray(product.product_variants)) return product.product_variants
      return []
    },
    hasSelectableVariants(product) {
      return this.getProductVariants(product).some(v => !!this.getVariantId(v))
    },
    getVariantId(variant) {
      if (!variant) return ''
      return String(variant.variant_id || variant.product_uuid || variant.id || '')
    },
    variantRowKey(variant, index) {
      const id = this.getVariantId(variant)
      if (id) return id
      if (variant && variant.product_code_sku) return `sku-${variant.product_code_sku}`
      return `idx-${index}`
    },
    getSelectedVariantIdsByKey(productKey) {
      if (!productKey) return []
      const map = this.selectedVariantsMap || {}
      const list = map[productKey]
      return Array.isArray(list) ? list : []
    },
    isVariantSelected(product, variant) {
      const key = this.productKey(product)
      const vid = this.getVariantId(variant)
      if (!key || !vid) return false
      return this.getSelectedVariantIdsByKey(key).includes(vid)
    },
    setSelectedVariants(productKey, variants) {
      const ids = Array.isArray(variants) ? variants.filter(Boolean) : []
      if (ids.length) this.$set(this.selectedVariantsMap, productKey, ids)
      else this.$delete(this.selectedVariantsMap, productKey)
    },
    onToggleProduct(product, checked) {
      const key = this.productKey(product)
      if (!key) return
      if (checked) {
        const ids = this.getProductVariants(product).map(v => this.getVariantId(v)).filter(Boolean)
        this.setSelectedVariants(key, ids)
      } else {
        this.setSelectedVariants(key, [])
      }
    },
    onToggleVariant(product, variant, checked) {
      const key = this.productKey(product)
      const vid = this.getVariantId(variant)
      if (!key || !vid) return
      const current = new Set(this.getSelectedVariantIdsByKey(key))
      if (checked) current.add(vid)
      else current.delete(vid)
      this.setSelectedVariants(key, Array.from(current))
    },
    isProductFullySelected(product) {
      const key = this.productKey(product)
      if (!key) return false
      const all = this.getProductVariants(product).map(v => this.getVariantId(v)).filter(Boolean)
      if (!all.length) return false
      const selected = this.getSelectedVariantIdsByKey(key)
      return all.every(id => selected.includes(id))
    },
    isProductIndeterminate(product) {
      const key = this.productKey(product)
      if (!key) return false
      const all = this.getProductVariants(product).map(v => this.getVariantId(v)).filter(Boolean)
      if (!all.length) return false
      const selected = this.getSelectedVariantIdsByKey(key)
      return selected.length > 0 && selected.length < all.length
    },
    handleProductExpand(expanded, record) {
      const key = this.productKey(record)
      const keys = new Set(this.productExpandedKeys || [])
      if (expanded) keys.add(key)
      else keys.delete(key)
      this.productExpandedKeys = Array.from(keys)
    },
    historyRowKey(record) {
      if (!record) return ''
      return record.sourcing_id || record.id || record._id || ''
    },
    historyVariantKey(item) {
      if (!item) return ''
      if (item.item_id) return `item-${item.item_id}`
      const pid = item.product_id || ''
      const vid = item.variant_id || ''
      if (!pid && !vid) return ''
      return `pv-${pid}__${vid}`
    },
    getHistoryVariantMeta(item) {
      const key = this.historyVariantKey(item)
      if (!key) return null
      return this.historyVariantInfo[key] || null
    },
    isHistoryVariantLoading(item) {
      const key = this.historyVariantKey(item)
      if (!key) return false
      return !!this.historyVariantLoading[key]
    },
    isHistoryVariantError(item) {
      const meta = this.getHistoryVariantMeta(item)
      return !!(meta && meta.error)
    },
    getHistoryVariantImage(item) {
      const meta = this.getHistoryVariantMeta(item)
      if (!meta) return ''
      return this.variantImage(meta.product, meta.variant)
    },
    getHistoryVariantTitle(item) {
      const meta = this.getHistoryVariantMeta(item)
      if (!meta) return ''
      if (meta.error) return ''
      if (meta.product && meta.variant) return this.formatVariantTitle(meta.product, meta.variant)
      if (meta.product) return this.formatProductTitle(meta.product)
      return ''
    },
    getHistoryVariantSku(item) {
      const meta = this.getHistoryVariantMeta(item)
      return meta && meta.variant ? (meta.variant.product_code_sku || '') : ''
    },
    getHistoryVariantPrice(item) {
      const meta = this.getHistoryVariantMeta(item)
      if (!meta || !meta.variant) return ''
      return this.formatVariantPrice(meta.variant)
    },
    async ensureHistoryVariantInfo(item) {
      const key = this.historyVariantKey(item)
      if (!key || this.historyVariantInfo[key] || this.historyVariantLoading[key]) return
      this.$set(this.historyVariantLoading, key, true)
      try {
        if (!item.product_id || !item.variant_id) {
          this.$set(this.historyVariantInfo, key, { product: null, variant: null })
          return
        }
        const params = { product_id: item.product_id, variant_id: item.variant_id }
        const res = await this.$ajax({ url: '/api/product/product-variant-info', method: 'get', params, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) {
          const data = res.data || {}
          const product = data.product || null
          let variant = data.variant || null
          if (!variant && product && Array.isArray(product.product_variants)) {
            variant = product.product_variants[0] || null
          }
          if (product && variant) {
            if (!Array.isArray(product.product_variants) || !product.product_variants.length) {
              product.product_variants = [variant]
            }
          }
          this.$set(this.historyVariantInfo, key, { product, variant })
        } else {
          this.$set(this.historyVariantInfo, key, { product: null, variant: null, error: true })
        }
      } catch (error) {
        this.$set(this.historyVariantInfo, key, { product: null, variant: null, error: true })
      } finally {
        this.$delete(this.historyVariantLoading, key)
      }
    },
    async preloadHistoryVariantInfo(record) {
      const items = (record.items || []).filter(item => item.source_type === 'product')
      if (!items.length) return
      await Promise.all(items.map(item => this.ensureHistoryVariantInfo(item)))
    },
    handleHistoryExpand(expanded, record) {
      const key = this.historyRowKey(record)
      const next = new Set(this.historyExpandedKeys || [])
      if (expanded && key) {
        next.add(key)
        this.preloadHistoryVariantInfo(record)
      } else if (!expanded && key) {
        next.delete(key)
      }
      this.historyExpandedKeys = Array.from(next)
    },
    formatVariantTitle(product, variant) {
      const primaryName = this.langType === 'zh_cn'
        ? (product.chinese_name || product.english_name || '')
        : (product.english_name || product.chinese_name || '')
      const subName = this.langType === 'zh_cn'
        ? (variant.sub_chinese_name || variant.sub_english_name || '')
        : (variant.sub_english_name || variant.sub_chinese_name || '')
      return subName ? `${primaryName} - ${subName}` : primaryName
    },
    variantImage(product, variant) {
      return variant?.sub_image_url || product?.main_image_url || ''
    },
    formatVariantPrice(variant) {
      const unit = variant.unit || ''
      const price = variant.price
      if (price === undefined || price === null || price === '') return ''
      const symbol = this.currencySymbolMap?.[unit] || this.currencySymbol
      return `${symbol}${price}`
    },
    formatProductPrice(product) {
      const price = this.extractProductQuote(product)
      if (price === '') return ''
      return `${this.currencySymbol}${price}`
    },
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
    async submitUrl() {
      this.$refs.urlFormRef.validate(async valid => {
        if (!valid) return
        this.submittingUrl = true
        try {
          const url = (this.urlForm.source_url || '').trim()
          const existed = await this.checkExistingUrl(url)
          const doSubmit = async () => {
            const payload = { status: 'submitted', purchase_reason: this.$t('sourcing.lowestPrice'), items: [{ source_type: 'url', source_url: url }] }
            const res = await this.$ajax({ url: '/api/sourcing', method: 'post', data: payload, roleType: this.roleType })
            if (this.$isRequestSuccessful(res.code)) {
              this.urlForm.source_url = ''
              this.showSubmitSuccess(url)
            }
          }
          if (existed && existed.length) {
            const h = this.$createElement
            const link = h('a', {
              attrs: { href: 'javascript:void(0)' },
              style: { color: 'var(--custom-color-primary)', cursor: 'pointer', textDecoration: 'underline' },
              on: { click: () => { this.openHistory(url); Modal.destroyAll() } }
            }, this.$t('sourcing.viewExistingRecords'))
            const content = h('div', [
              h('div', this.$t('sourcing.urlExistsMessage')),
              h('div', { style: { marginTop: '6px' } }, [link])
            ])
            Modal.confirm({
              title: this.$t('sourcing.urlExistsTitle'),
              content,
              okText: this.$t('common.confirm'),
              cancelText: this.$t('common.cancel'),
              onOk: doSubmit
            })
          } else {
            await doSubmit()
          }
        } finally { this.submittingUrl = false }
      })
    },
    showSubmitSuccess(keyword) {
      const h = this.$createElement
      const link = h('a', {
        attrs: { href: 'javascript:void(0)' },
        style: { color: 'var(--custom-color-primary)', cursor: 'pointer', textDecoration: 'underline' },
        on: { click: () => { this.openHistory(typeof keyword === 'string' ? keyword : ''); Modal.destroyAll() } }
      }, this.$t('sourcing.openHistory'))
      const content = h('div', [
        h('div', this.$t('sourcing.submitSuccessMsg')),
        h('div', { style: { marginTop: '6px' } }, [link])
      ])
      Modal.success({ title: this.$t('sourcing.submitSuccessTitle'), content })
    },
    async checkExistingUrl(url) {
      if (!url) return []
      try {
        const params = { page_number: 1, page_size: 10, keyword: this.escapeRegexLiteral(url) }
        const res = await this.$ajax({ url: '/api/sourcing', method: 'get', params, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) {
          const data = res.data || { items: [] }
          return data.items || []
        }
      } catch (e) { /* ignore */ }
      return []
    },
    openMore() { this.moreVisible = true; this.moreStep = 'options' },
    chooseMore(step) {
      this.moreStep = step
      if (step === 'image') {
        this.imageForm.purchase_reason = this.$t('sourcing.lowestPrice')
      }
      if (step === 'product') {
        this.selectedVariantsMap = {}
        this.productExpandedKeys = []
        this.loadProductList(1)
      }
    },
    extractProductQuote(product) {
      if (!product) return ''
      const candidates = []
      if (this.isValidPrice(product.price)) candidates.push(Number(product.price))
      if (Array.isArray(product.product_variants)) {
        product.product_variants.forEach(variant => {
          if (variant && this.isValidPrice(variant.price)) candidates.push(Number(variant.price))
        })
      }
      if (!candidates.length) return ''
      return Math.min(...candidates)
    },
    isValidPrice(val) {
      if (val === null || val === undefined) return false
      if (typeof val === 'string' && val.trim() === '') return false
      const num = Number(val)
      return Number.isFinite(num)
    },
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
      if (!this.totalSelectedVariants) {
        message.warning(this.$t('message.productManagement.productSelect'))
        return
      }
      const items = []
      Object.entries(this.selectedVariantsMap || {}).forEach(([productId, variantIds]) => {
        if (!Array.isArray(variantIds)) return
        variantIds.forEach(variantId => {
          const pid = String(productId || '').trim()
          const vid = String(variantId || '').trim()
          if (!pid || !vid) return
          items.push({ source_type: 'product', product_id: pid, variant_id: vid })
        })
      })
      if (!items.length) {
        message.warning(this.$t('message.productManagement.productSelect'))
        return
      }
      this.submittingProduct = true
      try {
        const payload = { status: 'submitted', purchase_reason: this.$t('sourcing.lowestPrice'), items }
        const res = await this.$ajax({ url: '/api/sourcing', method: 'post', data: payload, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) {
          message.success(this.$t('common.operationSuccessful'))
          this.moreVisible = false
          this.selectedVariantsMap = {}
          this.productExpandedKeys = []
        }
      } finally { this.submittingProduct = false }
    },
    openHistory(keyword) {
      // Guard against Vue event object being passed implicitly
      const kw = (typeof keyword === 'string') ? keyword : ''
      this.historyVisible = true
      if (kw) { this.historyQuery.keyword = kw }
      // Use debounced search to avoid duplicate requests
      this.$nextTick(() => this.scheduleHistorySearch && this.scheduleHistorySearch())
    },
    openHistoryWithStatus(status) {
      this.historyQuery.status = status || ''
      // 直接打开并加载，避免 debounce 造成的偶发不触发
      this.historyVisible = true
      this.$nextTick(() => this.loadHistory(1))
    },
    async checkPendingConfirmations() {
      try {
        const params = { status: 'pending_confirmation', page_number: 1, page_size: 1 }
        const res = await this.$ajax({ url: '/api/sourcing', method: 'get', params, roleType: this.roleType })
        const total = (res && res.data && (res.data.total || res.data.count)) || 0
        if (this.$isRequestSuccessful(res.code) && total > 0) {
          const isZh = this.$i18n && this.$i18n.locale === 'zh_cn'
          const title = isZh ? '已有报价待确认' : 'Quotes awaiting your confirmation'
          const message = isZh
            ? `您有 ${total} 条选品已出价待您确认，请及时查看并确认以推进处理。`
            : `You have ${total} sourcing request(s) with quotes ready. Please review and confirm to proceed.`
          const linkText = isZh ? '立即查看' : 'Review now'
          const content = this.$createElement('div', { style: 'font-size:13px; color: var(--custom-font-color2);' }, [
            message,
            this.$createElement('a', {
              style: 'margin-left:8px; color: var(--custom-color-primary);',
              on: { click: () => { this.openHistoryWithStatus('pending_confirmation'); Modal.destroyAll() } }
            }, linkText)
          ])
          const okText = (this.$t && this.$t('common.confirm')) || (isZh ? '确认' : 'OK')
          Modal.info({ title, content, okText })
        }
      } catch (_) { /* ignore */ }
    },
    resetHistory() {
      this.historyQuery = { status: '', keyword: '' }
      // 交由防抖调度，避免重复请求
      this.$nextTick(() => this.scheduleHistorySearch && this.scheduleHistorySearch())
    },
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
        if (this.historyQuery.keyword) {
          params.keyword = this.escapeRegexLiteral(this.historyQuery.keyword)
        }
        const res = await this.$ajax({ url: '/api/sourcing', method: 'get', params, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) {
          const data = res.data || { items: [], total: 0, page_number: 1, page_size: 10 }
          this.history = data
          this.historyExpandedKeys = []
          this.historyVariantInfo = {}
          this.historyVariantLoading = {}
        }
      } finally { this.historyLoading = false }
    },
    onHistorySizeChange(current, size) {
      this.history.page_size = size
      this.loadHistory(1)
    },
    async confirmHistory(row) {
      try {
        const res = await this.$ajax({ url: `/api/sourcing/${row.sourcing_id}`, method: 'put', data: { status: 'completed' }, roleType: this.roleType })
        if (this.$isRequestSuccessful(res.code)) { message.success(this.$t('common.operationSuccessful')); this.loadHistory() }
      } catch (e) { /* ignore */ }
    },
    loadSupportItems() {
      try {
        // Dynamically import all images from pf_logs
        const ctx = require.context('@/assets/pf_logs', false, /\.(png|jpe?g|svg|webp)$/)
        const map = {
          aliexpress: 'https://www.aliexpress.com/',
          alibaba: 'https://www.alibaba.com/',
          amazon: 'https://www.amazon.com/',
          temu: 'https://www.temu.com/',
          tiktok: 'https://www.tiktok.com/',
          etsy: 'https://www.etsy.com/',
          esty: 'https://www.etsy.com/',
          shopify: 'https://www.shopify.com/'
        }
        const items = ctx.keys().map(k => {
          const filename = k.replace('./', '')
          const name = filename.replace(/\.(png|jpe?g|svg|webp)$/i, '')
          const key = name.toLowerCase()
          return { name, img: ctx(k), url: map[key] || `https://www.${key}.com/` }
        })
        this.supportItems = items
      } catch (e) {
        // ignore if context missing
        this.supportItems = []
      }
    },
    async buildMarquee() {
      this.$nextTick(async () => {
        const wrap = this.$refs.supportBanner
        if (!wrap || !(this.supportItems || []).length) return
        const wrapWidth = wrap.clientWidth || 0
        const measure = (src) => new Promise(resolve => {
          const img = new Image()
          img.onload = () => {
            const h = img.height || 1
            const w = img.width || 1
            const scaled = w * (this.bannerHeight / h)
            resolve(scaled)
          }
          img.onerror = () => resolve(180)
          img.src = src
        })
        const widths = await Promise.all(this.supportItems.map(it => measure(it.img)))
        const baseWidth = widths.reduce((a, w) => a + w, 0) + this.scrollerGap * Math.max(this.supportItems.length - 1, 0)
        let times = 1
        if (baseWidth < wrapWidth) times = Math.ceil(wrapWidth / baseWidth) + 1
        const block = []
        for (let i = 0; i < times; i++) block.push(...this.supportItems)
        this.marqueeBlock = block
        const blockWidth = times * baseWidth + this.scrollerGap * (times - 1)
        this.marqueeBlockWidth = Math.ceil(blockWidth)
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.sourcing-page {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  /* clip background/map on all corners */
}

.page-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

}

.sourcing-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  /* stack card + banner vertically */
  align-items: center;
  justify-content: flex-start;
  padding: 28px 0 20px;
  min-height: clamp(480px, calc(100vh - 120px), 980px);
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
  margin-bottom: 0;
  /* keep row height compact */
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

/* Use theme lavender for focus/hover outline on the non-primary option */
::v-deep .more-action-btn.ant-btn:not(.ant-btn-primary) {
  border-color: var(--custom-border-color2) !important;
}
::v-deep .more-action-btn.ant-btn:not(.ant-btn-primary):hover,
::v-deep .more-action-btn.ant-btn:not(.ant-btn-primary):focus {
  border-color: var(--outer-background-color, #c6c7f8) !important;
  box-shadow: 0 0 0 2px rgba(198, 199, 248, 0.45) !important;
  color: var(--outer-background-color, #c6c7f8) !important;
  text-decoration: none !important;
}
::v-deep .more-action-btn.ant-btn:not(.ant-btn-primary):active {
  color: var(--outer-background-color, #c6c7f8) !important;
  border-color: var(--outer-background-color, #c6c7f8) !important;
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

.product-step {
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

.product-search-form {
  margin-bottom: 12px;
}

.product-table-wrapper {
  flex: 1 1 auto;
  min-height: 360px;
  overflow: hidden;
}

.product-footer {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.product-pagination {
  flex: 1;
  text-align: right;
}

.variant-table {
  margin-left: 48px;
}

.variant-table ::v-deep .ant-table-thead>tr>th,
.variant-table ::v-deep .ant-table-tbody>tr>td {
  padding-top: 8px;
  padding-bottom: 8px;
}

.product-actions {
  margin-top: 0;
}

.global-modal-class ::v-deep .ant-select-selection__clear,
.global-modal-class ::v-deep .ant-select-clear {
  background-color: var(--custom-background-color) !important;
  color: var(--custom-font-color2) !important;
  border-radius: 4px;
  opacity: 1;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.global-modal-class ::v-deep .ant-select-selection__clear:hover,
.global-modal-class ::v-deep .ant-select-clear:hover {
  color: var(--custom-font-color) !important;
  background-color: var(--custom-background-color) !important;
}

/* spacing for inline forms in modals */
.modal-inline-form {
  margin-bottom: 12px;
}

.modal-inline-form ::v-deep .ant-form-item {
  margin-right: 16px;
  margin-bottom: 12px;
}

.modal-inline-form ::v-deep .ant-btn+.ant-btn {
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

.product-sub {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.status-tips {
  min-width: 1024px !important;
}

.status-tips b {
  color: var(--custom-font-color);
}

/* Inline Support banner */
.support-inline {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0;
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
}

.support-inline .support-banner {
  width: 100%;
  /* match sourcing area width */
}

.support-inline .scroller {
  overflow: hidden;
  width: 100%;
  border-radius: 8px;
}

.support-inline .scroller-track {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 6px 6px;
  animation: support-scroll 24s linear infinite;
}

.support-inline .scroller-track.paused {
  animation-play-state: paused;
}

.support-inline .banner-item {
  flex: 0 0 auto;
  height: 100px;
  display: flex;
  align-items: center;
}

.support-inline .banner-item img {
  height: 100px;
  /* show full image with fixed height */
  width: auto;
  /* keep aspect ratio */
  object-fit: contain;
  /* ensure no cropping */
  display: block;
}

/* TikTok (抖音) with translucent white background */
.support-inline .banner-item.is-tiktok img {
  background: rgba(255, 255, 255, 0.65);
  border-radius: 8px;
  padding: 6px;
}

@keyframes support-scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(calc(-1 * var(--block-width, 0px)));
  }
}

/* (Modal version removed) */
</style>
