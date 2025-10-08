<template>
  <div class="wm-bg" :class="{ fixed }">
    <canvas ref="bg" class="canvas"></canvas>
    <canvas ref="fx" class="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'WorldMagnifierBackground',
  props: {
    fixed: { type: Boolean, default: true },
    lang: { type: String, default: 'en_us' },
    mapSrc: { type: String, default: require('@/assets/world-dark-4k.webp') },
    magnifyScale: { type: Number, default: 1.15 },
    orbitMin: { type: Number, default: 18 },
    orbitMax: { type: Number, default: 34 },
    accent: { type: String, default: '' },
    gradientStops: { type: Array, default: () => [] }, // e.g. ['#A67C52','#FFD700','#FF4500']
  },
  data() {
    return {
      DPR: Math.max(1, window.devicePixelRatio || 1),
      mapImg: null,
      mapReady: false,
      cover: { s: 1, offX: 0, offY: 0, iw: 4096, ih: 2048 },
      bg: null, bgCtx: null,
      fx: null, fxCtx: null,
      rafId: null,
      resizeHandler: null,
      accentColor: '#2d7fff',
      // cities
      cities: [],
      current: { x: 0, y: 0 },
      targetCityIndex: 0,
      phase: 'move', // move | orbit
      t: 0,
      orbitR: 24,
      orbitStartAng: 0,
      orbitsLeft: 0,
    }
  },
  computed: {
    citiesBase() {
      // A curated set of capitals and major cities
      return [
        { en: 'Beijing', zh: '北京', lat: 39.90, lon: 116.40 },
        { en: 'Tokyo', zh: '东京', lat: 35.68, lon: 139.69 },
        { en: 'Seoul', zh: '首尔', lat: 37.57, lon: 126.98 },
        { en: 'Singapore', zh: '新加坡', lat: 1.29, lon: 103.85 },
        { en: 'Bangkok', zh: '曼谷', lat: 13.75, lon: 100.50 },
        { en: 'Delhi', zh: '德里', lat: 28.61, lon: 77.20 },
        { en: 'Dubai', zh: '迪拜', lat: 25.20, lon: 55.27 },
        { en: 'Riyadh', zh: '利雅得', lat: 24.63, lon: 46.72 },
        { en: 'Istanbul', zh: '伊斯坦布尔', lat: 41.01, lon: 28.97 },
        { en: 'Moscow', zh: '莫斯科', lat: 55.75, lon: 37.62 },
        { en: 'London', zh: '伦敦', lat: 51.50, lon: -0.12 },
        { en: 'Paris', zh: '巴黎', lat: 48.85, lon: 2.35 },
        { en: 'Berlin', zh: '柏林', lat: 52.52, lon: 13.40 },
        { en: 'Madrid', zh: '马德里', lat: 40.42, lon: -3.70 },
        { en: 'Rome', zh: '罗马', lat: 41.90, lon: 12.50 },
        { en: 'Cairo', zh: '开罗', lat: 30.04, lon: 31.24 },
        { en: 'Nairobi', zh: '内罗毕', lat: -1.29, lon: 36.82 },
        { en: 'Johannesburg', zh: '约翰内斯堡', lat: -26.20, lon: 28.04 },
        { en: 'Los Angeles', zh: '洛杉矶', lat: 34.05, lon: -118.25 },
        { en: 'New York', zh: '纽约', lat: 40.71, lon: -74.00 },
        { en: 'Washington', zh: '华盛顿', lat: 38.90, lon: -77.04 },
        { en: 'Mexico City', zh: '墨西哥城', lat: 19.43, lon: -99.13 },
        { en: 'Rio de Janeiro', zh: '里约热内卢', lat: -22.91, lon: -43.17 },
        { en: 'São Paulo', zh: '圣保罗', lat: -23.55, lon: -46.64 },
        { en: 'Buenos Aires', zh: '布宜诺斯艾利斯', lat: -34.61, lon: -58.38 },
        { en: 'Sydney', zh: '悉尼', lat: -33.87, lon: 151.21 },
        { en: 'Auckland', zh: '奥克兰', lat: -36.85, lon: 174.76 },
      ]
    }
  },
  watch: {
    lang: {
      immediate: true,
      handler() {
        this.cities = this.citiesBase.map(c => ({ n: this.lang === 'zh_cn' ? c.zh : c.en, lat: c.lat, lon: c.lon, p: { x: 0, y: 0 } }))
        this._reprojectCities()
      }
    }
  },
  mounted() {
    // canvases
    this.bg = this.$refs.bg
    this.fx = this.$refs.fx
    this.bgCtx = this.bg.getContext('2d')
    this.fxCtx = this.fx.getContext('2d')

    this._resize()
    this.resizeHandler = () => this._resize()
    window.addEventListener('resize', this.resizeHandler)

    // accent from CSS var
    try {
      let base = this.accent
      if (!base) {
        const style = getComputedStyle(document.documentElement)
        base = style.getPropertyValue('--custom-color-primary').trim()
      }
      this.accentColor = base || this.accentColor
    } catch (e) {}

    // load map
    this.mapImg = new Image()
    this.mapImg.src = this.mapSrc
    this.mapImg.decoding = 'async'
    this.mapImg.onload = () => {
      this.mapReady = true
      this._drawMap()
      this._reprojectCities()
      // set initial focus
      const idx = Math.floor(Math.random() * this.cities.length)
      this.targetCityIndex = idx
      this.current = { ...this.cities[idx].p }
      this.phase = 'orbit'
      this.t = 0
      this.orbitR = this._rand(this.orbitMin, this.orbitMax)
      this.orbitStartAng = Math.random() * Math.PI * 2
      this.orbitsLeft = 1 + Math.floor(Math.random() * 2) // 1-2 loops
    }

    this._loop()
  },
  beforeDestroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    _rand(a, b) { return a + Math.random() * (b - a) },
    _resize() {
      const rect = this.$el.getBoundingClientRect()
      const W = Math.max(1, rect.width), H = Math.max(1, rect.height)
      ;[this.bg, this.fx].forEach(c => {
        c.style.width = W + 'px'; c.style.height = H + 'px'
        c.width = Math.round(W * this.DPR); c.height = Math.round(H * this.DPR)
      })
      ;[this.bgCtx, this.fxCtx].forEach(ctx => ctx.setTransform(this.DPR, 0, 0, this.DPR, 0, 0))
      if (this.mapReady) { this._drawMap(); this._reprojectCities() }
    },
    _computeCover() {
      const W = this.bg.width / this.DPR, H = this.bg.height / this.DPR
      const iw = this.mapImg.naturalWidth || 4096
      const ih = this.mapImg.naturalHeight || 2048
      const s = Math.max(W / iw, H / ih)
      const offX = (W - iw * s) / 2
      const offY = (H - ih * s) / 2
      this.cover = { s, offX, offY, iw, ih }
    },
    _drawMap() {
      if (!this.mapReady) return
      this._computeCover()
      const W = this.bg.width / this.DPR, H = this.bg.height / this.DPR
      this.bgCtx.clearRect(0, 0, W, H)
      // base fill to deepen blacks
      this.bgCtx.fillStyle = '#0a0a0a'
      this.bgCtx.fillRect(0, 0, W, H)
      const { s, offX, offY, iw, ih } = this.cover
      this.bgCtx.drawImage(this.mapImg, offX, offY, iw * s, ih * s)
    },
    _project(lon, lat) {
      const xImg = (lon + 180) / 360 * this.cover.iw
      const yImg = (90 - lat) / 180 * this.cover.ih
      return { x: this.cover.offX + xImg * this.cover.s, y: this.cover.offY + yImg * this.cover.s }
    },
    _reprojectCities() {
      if (!this.mapReady) return
      this.cities.forEach(c => { c.p = this._project(c.lon, c.lat) })
    },
    _pickNextCity() {
      if (this.cities.length < 2) return 0
      let idx = this.targetCityIndex
      while (idx === this.targetCityIndex) idx = Math.floor(Math.random() * this.cities.length)
      return idx
    },
    _easeInOut(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t },
    _makeGradient(ctx, x, y, r) {
      if (!this.gradientStops || this.gradientStops.length === 0) return null
      const g = ctx.createLinearGradient(x - r, y, x + r, y)
      const n = this.gradientStops.length
      const step = 1 / Math.max(1, n - 1)
      this.gradientStops.forEach((c, i) => g.addColorStop(i * step, c))
      return g
    },
    _drawMarkers(ctx) {
      ctx.save()
      // Use gradient across canvas; fallback to accent color
      const grad = this._makeGradient(ctx, this.fx.width / (2*this.DPR), this.fx.height / (2*this.DPR), 120) || this.accentColor
      ctx.fillStyle = grad || this.accentColor
      ctx.strokeStyle = 'rgba(0,0,0,0.45)'
      ctx.lineWidth = 2
      for (const c of this.cities) {
        ctx.beginPath()
        ctx.arc(c.p.x, c.p.y, 2.2, 0, Math.PI*2)
        ctx.fill()
      }
      ctx.restore()
    },
    _drawMagnifier(ctx, x, y, t) {
      // lens circle and subtle handle
      const accent = this.accentColor
      const lensR = 24
      ctx.save()
      // inner magnified content using clipped scaled map
      if (this.mapReady) {
        ctx.save()
        ctx.beginPath(); ctx.arc(x, y, lensR, 0, Math.PI*2); ctx.clip()
        const k = this.magnifyScale
        const px = (x - this.cover.offX) / this.cover.s
        const py = (y - this.cover.offY) / this.cover.s
        const offX2 = x - px * this.cover.s * k
        const offY2 = y - py * this.cover.s * k
        ctx.drawImage(this.mapImg, offX2, offY2, this.cover.iw * this.cover.s * k, this.cover.ih * this.cover.s * k)
        ctx.restore()
      }
      // lens stroke + glow
      const strokeGrad = this._makeGradient(ctx, x, y, lensR) || accent
      ctx.beginPath(); ctx.arc(x, y, lensR, 0, Math.PI*2)
      ctx.strokeStyle = strokeGrad; ctx.lineWidth = 2; ctx.stroke()
      ctx.beginPath(); ctx.arc(x, y, lensR+6, 0, Math.PI*2)
      ctx.strokeStyle = this._alpha('#000', 0.25); ctx.lineWidth = 1; ctx.stroke()
      // handle at 45°
      const ang = Math.PI/4
      ctx.beginPath()
      ctx.moveTo(x + Math.cos(ang)*lensR*0.7, y + Math.sin(ang)*lensR*0.7)
      ctx.lineTo(x + Math.cos(ang)*(lensR+16), y + Math.sin(ang)*(lensR+16))
      ctx.strokeStyle = strokeGrad; ctx.lineWidth = 3; ctx.stroke()
      ctx.restore()
    },
    _alpha(hexOrRgb, a) {
      // best-effort alpha overlay from CSS color; fall back to accent with fixed alpha
      if (/^#/.test(hexOrRgb) && (hexOrRgb.length === 7 || hexOrRgb.length === 4)) {
        const hex = hexOrRgb.length === 4 ? ('#' + [...hexOrRgb.slice(1)].map(ch => ch+ch).join('')) : hexOrRgb
        const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
        return `rgba(${r},${g},${b},${a})`
      }
      return hexOrRgb
    },
    _loop() {
      const step = () => {
        const W = this.fx.width / this.DPR, H = this.fx.height / this.DPR
        this.fxCtx.clearRect(0, 0, W, H)
        // city markers
        this._drawMarkers(this.fxCtx)

        if (!this.mapReady || !this.cities.length) { this.rafId = requestAnimationFrame(step); return }

        const target = this.cities[this.targetCityIndex].p
        if (this.phase === 'move') {
          this.t += 0.012
          const tt = Math.min(1, this.t)
          const et = this._easeInOut(tt)
          this.current.x = this.current.x + (target.x - this.current.x) * et
          this.current.y = this.current.y + (target.y - this.current.y) * et
          if (tt >= 1) {
            this.phase = 'orbit'; this.t = 0
            this.orbitR = this._rand(this.orbitMin, this.orbitMax)
            this.orbitStartAng = Math.random() * Math.PI*2
            this.orbitsLeft = 1 + Math.floor(Math.random()*2)
          }
        } else if (this.phase === 'orbit') {
          this.t += 0.02
          const ang = this.orbitStartAng + this.t * Math.PI * 2
          const x = target.x + Math.cos(ang) * this.orbitR
          const y = target.y + Math.sin(ang) * this.orbitR
          this.current.x = x; this.current.y = y
          if (this.t >= 1) {
            this.t = 0; this.orbitsLeft -= 1
            if (this.orbitsLeft <= 0) {
              this.phase = 'move'
              this.targetCityIndex = this._pickNextCity()
            }
          }
        }

        // draw magnifier
        this._drawMagnifier(this.fxCtx, this.current.x, this.current.y, this.t)

        this.rafId = requestAnimationFrame(step)
      }
      this.rafId = requestAnimationFrame(step)
    }
  }
}
</script>

<style scoped>
.wm-bg { position: relative; width: 100%; height: 100%; pointer-events: none; }
.wm-bg.fixed { position: fixed; left: 0; top: 0; z-index: 0; }
.canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
</style>
