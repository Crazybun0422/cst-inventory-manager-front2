<template>
  <div class="standard-cards-wrapper" ref="wrapper" :style="wrapperStyle">
    <div class="standard-cards-grid" :style="gridStyle" ref="grid">
      <div v-for="item in items" :key="item.product_uuid" class="standard-card">
        <div class="card-header">
          <el-checkbox :value="isSelected(item)" @change="() => toggleSelect(item)"></el-checkbox>
          <div class="header-actions">
            <a class="icon-btn" :title="$t('common.edit')" @click.prevent="$emit('open-edit', item)">
              <i class="el-icon-edit"></i>
            </a>
            <a class="icon-btn" :title="$t('common.check')" @click.prevent="$emit('open-detail', item)">
              <i class="el-icon-view"></i>
            </a>
            <el-popconfirm :title="$t('common.confirmDelete')" @confirm="$emit('delete-product', item)">
              <a slot="reference" class="icon-btn danger" :title="$t('common.delete')" @click.prevent>
                <i class="el-icon-delete"></i>
              </a>
            </el-popconfirm>
          </div>
        </div>
        <div class="card-image">
          <div class="image-square">
            <AuthImg :src="item.main_image_url || ''" :styleInfo="'width:100%;height:100%;object-fit:cover;'"></AuthImg>
          </div>
        </div>
        <div class="card-body">
          <div class="card-title" :title="titleOf(item)">{{ titleOf(item) }}</div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading-more">
      <i class="el-icon-loading"></i>
    </div>
    <!-- Sentinel for IntersectionObserver-based infinite scroll -->
    <div ref="sentinel" class="sentinel" aria-hidden="true"></div>
  </div>

</template>

<script>
import AuthImg from '@/components/auth-img.vue'

export default {
  name: 'ProductStandardCards',
  components: { AuthImg },
  props: {
    items: { type: Array, default: () => [] },
    selectedProductIds: { type: Array, default: () => [] },
    cardsPerRow: { type: Number, default: 4 },
    loading: { type: Boolean, default: false },
    // 内部滚动开关与高度，确保滚动条显示在内容区域内
    useInnerScroll: { type: Boolean, default: true },
    scrollAreaHeight: { type: [String, Number], default: '80vh' }
  },
  computed: {
    gridStyle() {
      const n = Math.max(1, Math.min(10, Number(this.cardsPerRow) || 1))
      return { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }
    },
    wrapperStyle() {
      if (!this.useInnerScroll) return {}
      const h = typeof this.scrollAreaHeight === 'number' ? `${this.scrollAreaHeight}px` : this.scrollAreaHeight
      return {
        maxHeight: h,
        overflowY: 'auto',
        overscrollBehavior: 'contain'
      }
    }
  },
  mounted() {
    this._onScroll = this.onScroll.bind(this)
    const el = this.useInnerScroll ? this.$refs.wrapper : window
    if (el && el.addEventListener) el.addEventListener('scroll', this._onScroll, { passive: true })
    // Also observe a sentinel for robust infinite scrolling (works with wheel and drag)
    if ('IntersectionObserver' in window) {
      const rootEl = this.useInnerScroll ? this.$refs.wrapper : null
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.$emit('load-more')
        })
      }, { root: rootEl, rootMargin: '400px 0px', threshold: 0 })
      if (this.$refs.sentinel) this._observer.observe(this.$refs.sentinel)
    }
  },
  beforeDestroy() {
    const el = this.useInnerScroll ? this.$refs.wrapper : window
    if (el && el.removeEventListener) el.removeEventListener('scroll', this._onScroll)
    if (this._observer && this.$refs.sentinel) this._observer.unobserve(this.$refs.sentinel)
    if (this._observer) this._observer.disconnect()
  },
  methods: {
    isSelected(item) {
      if (!item || !item.product_uuid) return false
      return this.selectedProductIds.includes(item.product_uuid)
    },
    toggleSelect(item) {
      this.$emit('toggle-select', item)
    },
    titleOf(item) {
      if (!item) return ''
      const lang = this.$languageType || this.$i18n && this.$i18n.locale
      if (lang === 'zh_cn') return item.chinese_name || ''
      return item.english_name || ''
    },
    onScroll() {
      // When user scrolls near bottom, ask parent to load more
      if (this.useInnerScroll) {
        const el = this.$refs.wrapper
        if (!el) return
        const remain = el.scrollHeight - el.scrollTop - el.clientHeight
        if (remain < 300) this.$emit('load-more')
      } else {
        const scrollPos = window.scrollY + window.innerHeight
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
        if (docHeight - scrollPos < 300) this.$emit('load-more')
      }
    },
    needsMoreToFill() {
      // Public method: whether grid height fills viewport/container
      if (this.useInnerScroll) {
        const el = this.$refs.wrapper
        if (!el) return false
        return el.scrollHeight <= el.clientHeight
      } else {
        const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
        return h < window.innerHeight - 80
      }
    }
  }
}
</script>

<style scoped lang="scss">
.standard-cards-wrapper {
  width: 100%;
}

.standard-cards-grid {
  display: grid;
  grid-gap: 12px;
}

.standard-card {
  /*border: 1px solid var(--custom-border-color2, #ebeef5);*/
  border-radius: 8px;
  background: transparent;
  /* make card background transparent */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 220px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px 0 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.header-actions .icon-btn {
  color: var(--custom-color-primary);
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.header-actions .icon-btn i {
  font-size: 16px;
}

.header-actions .icon-btn:hover {
  filter: brightness(1.1);
}

.header-actions .icon-btn.danger {
  color: var(--custom-color-danger, #f56c6c);
}

.header-actions .icon-btn.danger:hover {
  filter: brightness(1.05);
}

.card-image {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.image-square {
  width: 100%;
  /* Keep image area square */
  aspect-ratio: 1 / 1;
}

.card-body {
  padding: 6px 10px 12px 10px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.card-title {
  font-size: 13px;
  line-height: 1.4;
  color: var(--custom-font-color, #303133);
  margin-bottom: 6px;
  min-height: 18px;
}

/* (legacy body actions removed; now using header icon actions) */

.loading-more {
  text-align: center;
  padding: 8px;
  color: var(--custom-font-color2, #909399);
}
</style>
