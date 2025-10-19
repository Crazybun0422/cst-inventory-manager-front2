<!--
  DS Dashboard using Ant Design
  - Multi-language
  - No Element UI components
  - Cards invert with theme; glow uses brand color
  - Orders trend with day/month toggle
  - Low stock and top sales tables side by side
-->
<template>
  <div class="ds-dashboard">
    <a-spin :spinning="loadingAll">
      <!-- Section 1: KPI Cards -->
      <a-row :gutter="16" class="mb-16">
        <a-col :span="8">
          <a-card :bordered="false" class="metric-card" :class="themeCardClass">
            <div class="metric-content">
              <div class="metric-title">{{ $t('dashboard.daily') }}</div>
              <div class="metric-value">{{ orders.today_total || 0 }}</div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card :bordered="false" class="metric-card" :class="themeCardClass">
            <div class="metric-content">
              <div class="metric-title">{{ $t('dashboard.processing') }}</div>
              <div class="metric-value">{{ orders.processing_total || 0 }}</div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card :bordered="false" class="metric-card" :class="themeCardClass">
            <div class="metric-content">
              <div class="metric-title">{{ $t('dashboard.delivered') }}</div>
              <div class="metric-value">{{ orders.delivered_total || 0 }}</div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- Section 2: Trend Chart with toggle -->
      <a-card class="trend-card mb-16" :bordered="false">
        <template slot="title">{{ $t('dashboard.ordersTrend') }}</template>
        <template slot="extra">
          <a-radio-group size="small" v-model="trendMode" class="segmented-switch">
            <a-radio-button value="day">{{ $t('dashboard.day') }}</a-radio-button>
            <a-radio-button value="month">{{ $t('dashboard.month') }}</a-radio-button>
          </a-radio-group>
        </template>
        <div class="chart-container" ref="chartWrap">
          <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" preserveAspectRatio="xMidYMid meet" class="chart-svg">
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="brandColor" stop-opacity="0.6" />
                <stop offset="100%" :stop-color="brandColor" stop-opacity="0.05" />
              </linearGradient>
            </defs>
            <!-- Axes only (no grid) -->
            <line :x1="chartPad" :y1="chartPad" :x2="chartPad" :y2="chartHeight - chartPad" :stroke="axisColor"
              stroke-width="1" vector-effect="non-scaling-stroke" />
            <line :x1="chartPad" :y1="chartHeight - chartPad" :x2="chartWidth - chartPad" :y2="chartHeight - chartPad"
              :stroke="axisColor" stroke-width="1" vector-effect="non-scaling-stroke" />
            <!-- Y ticks and labels -->
            <g v-for="(t, i) in yTicks" :key="'y-' + i">
              <line :x1="chartPad - 6" :y1="t.y" :x2="chartPad" :y2="t.y" :stroke="axisColor" stroke-width="1"
                vector-effect="non-scaling-stroke" />
              <text :x="chartPad - 8" :y="t.y" :fill="labelColor" text-anchor="end" alignment-baseline="middle"
                class="axis-text">{{ t.label }}</text>
            </g>
            <!-- X ticks and labels -->
            <g v-for="(t, i) in xTicks" :key="'x-' + i">
              <line :x1="t.x" :y1="chartHeight - chartPad" :x2="t.x" :y2="chartHeight - chartPad + 6"
                :stroke="axisColor" stroke-width="1" vector-effect="non-scaling-stroke" />
              <text :x="t.x" :y="chartHeight - chartPad + 12" :fill="labelColor" text-anchor="middle"
                alignment-baseline="hanging" class="axis-text">{{ t.label }}</text>
            </g>
            <polyline :points="chartPoints" :stroke="brandColor" stroke-width="3" fill="none"
              vector-effect="non-scaling-stroke" />
            <polygon v-if="chartAreaPoints" :points="chartAreaPoints" fill="url(#lineGradient)" />
          </svg>
          <div v-if="(trendData || []).length === 0" class="empty-mask">
            <a-empty :description="$t('dashboard.noData')" />
          </div>
        </div>
      </a-card>

      <!-- Section 3: Products tables -->
      <a-row :gutter="16">
        <!-- Low stock -->
        <a-col :span="12">
          <a-card :title="$t('dashboard.lowStockTitle')" :bordered="false">
            <a-table :dataSource="lowStock.items" :columns="lowStockColumns"
              :rowKey="row => row.variant_id || row.product_uuid" :pagination="lowStockPagination" size="small"
              @change="onLowStockPageChange" :locale="{ emptyText: $t('dashboard.noData') }">
              <template slot="image" slot-scope="text, record">
                <a-avatar shape="square" :size="48" :src="record.variant_image_url || record.main_image_url"
                  icon="picture" />
              </template>
            </a-table>
          </a-card>
        </a-col>

        <!-- Top sales -->
        <a-col :span="12">
          <a-card :title="$t('dashboard.salesTitle')" :bordered="false">
            <a-table :dataSource="topSales" :columns="topSalesColumns"
              :rowKey="row => row.variant_id || row.product_uuid" :pagination="false" size="small"
              :locale="{ emptyText: $t('dashboard.noData') }">
              <template slot="image" slot-scope="text, record">
                <a-avatar shape="square" :size="48" :src="record.variant_image_url || record.main_image_url"
                  icon="picture" />
              </template>
              <template slot="sales" slot-scope="text, record, index">
                <span :style="{ color: topSalesColor(index) }">{{ record.quantity }}</span>
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>

</template>

<script>
import { loadHomeData } from '@/common/common-func'
import { dropShipper } from '@/common/commonconfig'
export default {
  name: 'ds-home',
  data() {
    return {
      // existing
      userName: '',
      userRole: '',
      userRelatedId: '',
      avatarBase64: require('@/assets/images/defaultAbstract.png'),

      // dashboard state
      loadingAll: false,
      orders: {
        today_total: 0,
        processing_total: 0,
        delivered_total: 0,
        daily_trend: [],
        monthly_trend: []
      },
      lowStock: {
        total: 0,
        page: 1,
        page_size: 10,
        items: []
      },
      topSales: [],
      trendMode: 'day',
      chartWidth: 600,
      chartHeight: 240,
      chartPad: 40
    }
  },
  computed: {
    isDarkTheme() {
      return this.$store.state.user.theme === 'darkTheme'
    },
    themeCardClass() {
      return this.isDarkTheme ? 'card-dark' : 'card-light'
    },
    brandColor() {
      // from CSS variable, fallback to Ant Design blue
      // include theme as reactive dep so it updates realtime
      const _theme = this.$store.state.user.theme; /* reactive dep */
      void _theme
      const computed = getComputedStyle(document.documentElement)
      return computed.getPropertyValue('--custom-color-primary')?.trim() || '#1890ff'
    },
    axisColor() {
      // Follow theme: dark -> white, light -> black
      const _theme = this.$store.state.user.theme; /* reactive dep */
      void _theme
      const computed = getComputedStyle(document.documentElement)
      const varColor = computed.getPropertyValue('--custom-font-color')?.trim()
      if (varColor) return varColor
      return this.isDarkTheme ? '#ffffff' : '#000000'
    },
    gridColor() { return this.axisColor },
    labelColor() {
      const _theme = this.$store.state.user.theme; /* reactive dep */
      void _theme
      const computed = getComputedStyle(document.documentElement)
      const varColor = computed.getPropertyValue('--custom-font-color')?.trim()
      if (varColor) return varColor
      return this.isDarkTheme ? '#ffffff' : '#000000'
    },
    logoColor() {
      const c = getComputedStyle(document.documentElement).getPropertyValue('--brand-logo-color')?.trim()
      return c && c !== '' ? c : '#59b7dc'
    },
    metricCardStyle() {
      const c = this.logoColor
      // build multi-layer shadow using logo color
      const hexToRgb = (hex) => {
        const h = hex.replace('#', '')
        const bigint = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16)
        return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
      }
      const { r, g, b } = hexToRgb(c)
      const s1 = `0 10px 26px rgba(${r}, ${g}, ${b}, 0.18)`
      const s2 = `0 6px 14px rgba(${r}, ${g}, ${b}, 0.12)`
      const s3 = `0 0 18px rgba(${r}, ${g}, ${b}, 0.12)`
      return { boxShadow: `${s1}, ${s2}, ${s3}` }
    },
    inheritColor() {
      // follow theme font color
      const computed = getComputedStyle(document.documentElement)
      return computed.getPropertyValue('--custom-font-color')?.trim() || 'inherit'
    },
    trendData() {
      return this.trendMode === 'day' ? (this.orders.daily_trend || []) : (this.orders.monthly_trend || [])
    },
    chartPoints() {
      const data = this.trendData
      if (!data || data.length === 0) return ''
      const values = data.map(d => Number(d.count || 0))
      const max = Math.max(...values)
      const min = Math.min(...values)
      const len = data.length
      const w = this.chartWidth
      const h = this.chartHeight
      const pad = this.chartPad
      const range = Math.max(1, max - min)
      const toPoint = (i, v) => {
        const x = len === 1 ? w / 2 : (i / (len - 1)) * (w - pad * 2) + pad
        const y = h - pad - ((v - min) / range) * (h - pad * 2)
        return `${x},${y}`
      }
      return values.map((v, i) => toPoint(i, v)).join(' ')
    },
    chartAreaPoints() {
      const pts = this.chartPoints
      if (!pts) return ''
      const firstX = pts.split(' ')[0]?.split(',')[0] || String(this.chartPad)
      const lastX = pts.split(' ').slice(-1)[0]?.split(',')[0] || String(this.chartWidth - this.chartPad)
      const baseY = this.chartHeight - this.chartPad
      return `${firstX},${baseY} ${pts} ${lastX},${baseY}`
    },
    valuesArray() {
      const data = this.trendData || []
      return data.map(d => Number(d.count || 0))
    },
    niceScale() {
      const v = this.valuesArray
      if (!v.length) return { min: 0, max: 1, step: 1 }
      const min = 0
      const maxRaw = Math.max(...v)
      const span = Math.max(1, maxRaw - min)
      const len = (this.trendData || []).length
      // dynamic target ticks based on data length and range magnitude
      let targetTicks = Math.round(Math.sqrt(Math.max(1, len))) + Math.round(Math.log10(maxRaw + 1))
      targetTicks = Math.min(8, Math.max(3, targetTicks))
      const step0 = span / Math.max(1, targetTicks)
      const mag = Math.pow(10, Math.floor(Math.log10(step0)))
      const err = step0 / mag
      let step
      if (err >= 5) step = 10 * mag
      else if (err >= 2) step = 5 * mag
      else if (err >= 1) step = 2 * mag
      else step = mag
      const niceMin = Math.floor(min / step) * step
      const niceMax = Math.ceil(maxRaw / step) * step
      return { min: niceMin, max: niceMax, step }
    },
    topSalesColorMap() {
      const base = this.logoColor
      const shade = (hex, p) => {
        const h = hex.replace('#', '')
        const bigint = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16)
        let r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255
        const t = p < 0 ? 0 : 255
        const amt = Math.abs(p)
        r = Math.round((t - r) * amt + r)
        g = Math.round((t - g) * amt + g)
        b = Math.round((t - b) * amt + b)
        return `rgb(${r}, ${g}, ${b})`
      }
      return [base, shade(base, 0.2), shade(base, 0.1)]
    },
    yTicks() {
      const { min, max, step } = this.niceScale
      const ticks = []
      const h = this.chartHeight
      const pad = this.chartPad
      const range = Math.max(1, max - min)
      for (let val = min; val <= max + 0.0001; val += step) {
        const y = h - pad - ((val - min) / range) * (h - pad * 2)
        ticks.push({ value: val, label: String(Math.round(val)), y })
      }
      return ticks
    },
    xTicks() {
      const data = this.trendData || []
      const len = data.length
      const w = this.chartWidth
      const pad = this.chartPad
      if (!len) return []
      const format = (d) => {
        if (d.date) {
          const parts = d.date.split('-')
          return `${parts[1]}/${parts[2]}`
        } else if (d.month) {
          const parts = d.month.split('-')
          return parts[1]
        }
        return ''
      }
      const arr = []
      for (let i = 0; i < len; i++) {
        const x = len === 1 ? w / 2 : (i / (len - 1)) * (w - pad * 2) + pad
        arr.push({ index: i, x, label: format(data[i]) })
      }
      return arr
    },
    topSalesColor() {
      return (index) => {
        if (index === 0) return this.topSalesColorMap[0]
        if (index === 1) return this.topSalesColorMap[1]
        if (index === 2) return this.topSalesColorMap[2]
        return this.inheritColor
      }
    },
    lowStockColumns() {
      return [
        { title: this.$t('dashboard.image'), key: 'image', scopedSlots: { customRender: 'image' }, width: 72 },
        { title: this.$t('dashboard.name'), dataIndex: 'name', key: 'name', ellipsis: true },
        { title: this.$t('dashboard.available'), dataIndex: 'available', key: 'available', width: 100 }
      ]
    },
    topSalesColumns() {
      return [
        { title: this.$t('dashboard.image'), key: 'image', scopedSlots: { customRender: 'image' }, width: 72 },
        { title: this.$t('dashboard.name'), dataIndex: 'name', key: 'name', ellipsis: true },
        { title: this.$t('dashboard.sales'), key: 'sales', scopedSlots: { customRender: 'sales' }, width: 100 }
      ]
    },
    lowStockPagination() {
      return {
        total: this.lowStock.total || 0,
        pageSize: this.lowStock.page_size || 10,
        current: this.lowStock.page || 1,
        showSizeChanger: false,
        simple: true
      }
    }
  },
  methods: {
    loadHomeData,
    measureChart() {
      this.$nextTick(() => {
        const el = this.$refs.chartWrap
        if (el) {
          const rect = el.getBoundingClientRect()
          const w = Math.max(200, Math.floor(rect.width))
          const h = Math.max(160, Math.floor(rect.height))
          this.chartWidth = w
          this.chartHeight = h
        }
      })
    },
    async fetchDashboard() {
      this.loadingAll = true
      try {
        const res = await this.$ajax({
          url: '/api-prefix/api/dropshipping/dashboard/statistics',
          method: 'get',
          roleType: dropShipper
        })
        if (this.$isRequestSuccessful(res.code)) {
          const data = res.data || {}
          this.orders = data.orders || this.orders
          const products = data.products || {}
          this.lowStock = products.low_stock || this.lowStock
          this.topSales = products.top_sales || []
        }
      } catch (e) {
        // ignore, interceptor already handles notifications
      } finally {
        this.loadingAll = false
      }
    },
    async onLowStockPageChange(pagination) {
      const page = pagination.current || this.lowStock.page
      const page_size = this.lowStock.page_size
      try {
        const res = await this.$ajax({
          url: '/api-prefix/api/dropshipping/dashboard/low-stock-products',
          method: 'get',
          params: { page, page_size },
          roleType: dropShipper
        })
        if (this.$isRequestSuccessful(res.code)) {
          const data = res.data || {}
          this.lowStock = {
            total: data.total || 0,
            page: data.page || page,
            page_size: data.page_size || page_size,
            items: data.items || []
          }
        }
      } catch (e) { }
    },
    loadAndSaveHomeData() {
      this.loadHomeData()
        .then((resData) => {
          const { user, user_avatar_url, shops, default_settings } = resData
          localStorage.setItem(this.config[this.roleType].userName, user.username)
          localStorage.setItem(this.config[this.roleType].userRole, user.user_role)
          localStorage.setItem(this.config[this.roleType].userRelatedId, user.user_related_id)
          localStorage.setItem(this.config[this.roleType].shopList, JSON.stringify(shops))
          this.$store.dispatch('tagsView/delAllPDSViews')

          const defaultLanguage = default_settings?.defaultLanguage || 'en_us'
          this.$store.dispatch('user/getDefaultLanguage', defaultLanguage)
          this.$i18n.locale = defaultLanguage
          const defaultTheme = default_settings?.defaultTheme || 'defaultTheme'
          this.$store.dispatch('user/changeSetting', { key: 'theme', value: defaultTheme, persist: false })
        })
        .catch(() => { })
    }
  },
  mounted() {
    if (this.$route.query.type && this.$route.query.type === 'p2ds') {
      this.loadAndSaveHomeData()
    }
    this.fetchDashboard()
    this.measureChart()
    window.addEventListener('resize', this.measureChart)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.measureChart)
  }
}
</script>

<style scoped>
.mb-16 {
  margin-bottom: 16px;
}

.ds-dashboard {
  padding: 4px;
}

.metric-card {
  /*transition: transform 0.2s ease, box-shadow 0.2s ease;*/
  /*box-shadow: none;  shadow provided via inline style with logo color */
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  overflow: hidden; /* ensure inner body respects rounded corners */
}

.metric-card:hover {
  transform: translateY(-2px);
}

.card-dark {
  /* dark theme => white card, black text */
  background: #ffffff !important;
  color: #000000 !important;
}
.card-dark ::v-deep .ant-card-body {
  background: #ffffff !important;
  color: #000000 !important;
  border-radius: 12px !important;
}

.card-light {
  /* light theme => black card, white text */
  background: #000000 !important;
  color: #ffffff !important;
}
.card-light ::v-deep .ant-card-body {
  background: #000000 !important;
  color: #ffffff !important;
  border-radius: 12px !important;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-title {
  font-size: 14px;
  opacity: 0.85;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
}

.trend-card {
  border-radius: 12px;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 260px;
}

.chart-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.empty-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.axis-text {
  font-size: 10px;
  opacity: 0.85;
}
/* Antd radio color follows theme variable */
::v-deep .ant-radio-button-wrapper-checked {
  color: var(--custom-color-primary) !important;
  border-color: var(--custom-color-primary) !important;
  box-shadow: -1px 0 0 0 var(--custom-color-primary) !important;
}
::v-deep .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
  color: var(--custom-color-primary) !important;
  border-color: var(--custom-color-primary) !important;
}
::v-deep .ant-radio-button-wrapper-checked::before {
  background-color: var(--custom-color-primary) !important;
}
::v-deep .ant-radio-button-wrapper-checked + .ant-radio-button-wrapper {
  border-left-color: var(--custom-color-primary) !important;
}
</style>
