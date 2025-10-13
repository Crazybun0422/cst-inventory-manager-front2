<template>
  <div class="standard-cards-wrapper">
    <div class="standard-cards-grid" :style="gridStyle" ref="grid">
      <div v-for="item in items" :key="item.product_uuid" class="standard-card">
        <div class="card-header">
          <el-checkbox :value="isSelected(item)" @change="() => toggleSelect(item)"></el-checkbox>
        </div>
        <div class="card-image">
          <AuthImg :src="item.main_image_url || ''" :styleInfo="'width:100%;height:100%;object-fit:cover;'"></AuthImg>
        </div>
        <div class="card-body">
          <div class="card-title" :title="titleOf(item)">{{ titleOf(item) }}</div>
          <div class="card-actions">
            <a @click.prevent="() => $emit('open-edit', item)">{{ $t('common.edit') }}</a>
            <a @click.prevent="() => $emit('open-detail', item)">{{ $t('common.check') }}</a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading-more">
      <i class="el-icon-loading"></i>
    </div>
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
    loading: { type: Boolean, default: false }
  },
  computed: {
    gridStyle () {
      const n = Math.max(1, Math.min(10, Number(this.cardsPerRow) || 1))
      return { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }
    }
  },
  mounted () {
    this._onScroll = this.onScroll.bind(this)
    window.addEventListener('scroll', this._onScroll, { passive: true })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this._onScroll)
  },
  methods: {
    isSelected (item) {
      if (!item || !item.product_uuid) return false
      return this.selectedProductIds.includes(item.product_uuid)
    },
    toggleSelect (item) {
      this.$emit('toggle-select', item)
    },
    titleOf (item) {
      if (!item) return ''
      const lang = this.$languageType || this.$i18n && this.$i18n.locale
      if (lang === 'zh_cn') return item.chinese_name || ''
      return item.english_name || ''
    },
    onScroll () {
      // When user scrolls near bottom, ask parent to load more
      const scrollPos = window.scrollY + window.innerHeight
      const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      if (docHeight - scrollPos < 300) this.$emit('load-more')
    },
    needsMoreToFill () {
      // Public method: whether grid height fills viewport
      const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      return h < window.innerHeight - 80
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
  border: 1px solid var(--custom-border-color2, #ebeef5);
  border-radius: 8px;
  background: var(--custom-background-color6, #fff);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 220px;
}
.card-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 6px 8px 0 8px;
}
.card-image {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  height: 140px;
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
.card-actions {
  margin-top: auto;
  display: flex;
  gap: 12px;
}
.card-actions a {
  color: var(--custom-primary-color, #409EFF);
  cursor: pointer;
}
.loading-more {
  text-align: center;
  padding: 8px;
  color: var(--custom-font-color2, #909399);
}
</style>

