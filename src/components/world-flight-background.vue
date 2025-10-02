<template>
  <div class="wf-bg" :class="{ fixed }">
    <canvas ref="bg" class="canvas" id="bg"></canvas>
    <canvas ref="rt" class="canvas" id="rt"></canvas>
    <canvas ref="fx" class="canvas" id="fx"></canvas>
  </div>
</template>

<script>
export default {
  name: 'WorldFlightBackground',
  props: {
    lang: { type: String, default: 'en_us' },
    fixed: { type: Boolean, default: true },
    mapSrc: { type: String, default: require('../assets/world-dark-4k.webp') },
    boxSrc: { type: String, default: require('../assets/d.png') },
    flightCount: { type: Number, default: 4 },
    featherDensity: { type: Number, default: 16 },
    featherScale: { type: Number, default: 1.0 }
  },
  data() {
    return {
      DPR: Math.max(1, window.devicePixelRatio || 1),
      mapImg: null,
      boxImg: null,
      cover: { s: 1, offX: 0, offY: 0, iw: 4096, ih: 2048 },
      cities: [],
      flights: [],
      routesDirty: true,
      flightsNeedRouteRecalc: true,
      rafId: null,
      resizeHandler: null,
    }
  },
  computed: {
    citiesBase() {
      // English list
      return [
        { en: 'Beijing', zh: '北京', lat: 39.90, lon: 116.40, tz: 'Asia/Shanghai' },
        { en: 'Tokyo', zh: '东京', lat: 35.68, lon: 139.69, tz: 'Asia/Tokyo' },
        { en: 'Seoul', zh: '首尔', lat: 37.57, lon: 126.98, tz: 'Asia/Seoul' },
        { en: 'Singapore', zh: '新加坡', lat: 1.29, lon: 103.85, tz: 'Asia/Singapore' },
        { en: 'Bangkok', zh: '曼谷', lat: 13.75, lon: 100.50, tz: 'Asia/Bangkok' },
        { en: 'Delhi', zh: '德里', lat: 28.61, lon: 77.20, tz: 'Asia/Kolkata' },
        { en: 'Dubai', zh: '迪拜', lat: 25.20, lon: 55.27, tz: 'Asia/Dubai' },
        { en: 'Riyadh', zh: '利雅得', lat: 24.63, lon: 46.72, tz: 'Asia/Riyadh' },
        { en: 'Istanbul', zh: '伊斯坦布尔', lat: 41.01, lon: 28.97, tz: 'Europe/Istanbul' },
        { en: 'Moscow', zh: '莫斯科', lat: 55.75, lon: 37.62, tz: 'Europe/Moscow' },
        { en: 'London', zh: '伦敦', lat: 51.50, lon: -0.12, tz: 'Europe/London' },
        { en: 'Paris', zh: '巴黎', lat: 48.85, lon: 2.35, tz: 'Europe/Paris' },
        { en: 'Berlin', zh: '柏林', lat: 52.52, lon: 13.40, tz: 'Europe/Berlin' },
        { en: 'Madrid', zh: '马德里', lat: 40.42, lon: -3.70, tz: 'Europe/Madrid' },
        { en: 'Rome', zh: '罗马', lat: 41.90, lon: 12.50, tz: 'Europe/Rome' },
        { en: 'Cairo', zh: '开罗', lat: 30.04, lon: 31.24, tz: 'Africa/Cairo' },
        { en: 'Nairobi', zh: '内罗毕', lat: -1.29, lon: 36.82, tz: 'Africa/Nairobi' },
        { en: 'Johannesburg', zh: '约翰内斯堡', lat: -26.20, lon: 28.04, tz: 'Africa/Johannesburg' },
        { en: 'Los Angeles', zh: '洛杉矶', lat: 34.05, lon: -118.25, tz: 'America/Los_Angeles' },
        { en: 'New York', zh: '纽约', lat: 40.71, lon: -74.00, tz: 'America/New_York' },
        { en: 'Washington DC', zh: '华盛顿', lat: 38.90, lon: -77.04, tz: 'America/New_York' },
        { en: 'Mexico City', zh: '墨西哥城', lat: 19.43, lon: -99.13, tz: 'America/Mexico_City' },
        { en: 'Rio de Janeiro', zh: '里约热内卢', lat: -22.91, lon: -43.17, tz: 'America/Sao_Paulo' },
        { en: 'São Paulo', zh: '圣保罗', lat: -23.55, lon: -46.64, tz: 'America/Sao_Paulo' },
        { en: 'Buenos Aires', zh: '布宜诺斯艾利斯', lat: -34.61, lon: -58.38, tz: 'America/Argentina/Buenos_Aires' },
        { en: 'Sydney', zh: '悉尼', lat: -33.87, lon: 151.21, tz: 'Australia/Sydney' },
        { en: 'Wellington', zh: '惠灵顿', lat: -41.29, lon: 174.78, tz: 'Pacific/Auckland' },
      ];
    },
  },
  watch: {
    lang: {
      immediate: true,
      handler() {
        // Rebuild city list for new language
        this.cities = this.citiesBase.map(c => ({
          n: this.lang === 'zh_cn' ? c.zh : c.en,
          lat: c.lat, lon: c.lon, tz: c.tz, p: { x: 0, y: 0 }, t: '--:--'
        }));
        this._reprojectCities();
      }
    }
  },
  mounted() {
    // Canvas refs
    this.bg = this.$refs.bg;
    this.rt = this.$refs.rt;
    this.fx = this.$refs.fx;
    this.bgCtx = this.bg.getContext('2d');
    this.rtCtx = this.rt.getContext('2d');
    this.fxCtx = this.fx.getContext('2d', { alpha: true });

    this._resizeCanvases();

    // Load images
    this.mapImg = new Image();
    this.mapImg.src = this.mapSrc;
    this.mapImg.decoding = 'async';
    this.mapImg.onload = () => { this._drawMapOnce(); this._reprojectAll(); };

    this.boxImg = new Image();
    this.boxImg.src = this.boxSrc;
    this.boxImg.decoding = 'async';

    // Flights
    this._initFlights();

    // Timers
    this._updateCityTimes();
    this.timeTimer = setInterval(this._updateCityTimes, 1000);

    // Events
    this.resizeHandler = () => {
      this._resizeCanvases();
      this._drawMapOnce();
      this._reprojectAll();
    };
    window.addEventListener('resize', this.resizeHandler);

    // Loop
    const loop = (now = 0) => {
      const W = this.fx.width / this.DPR, H = this.fx.height / this.DPR;
      this.fxCtx.clearRect(0, 0, W, H);
      if (this.routesDirty) this._drawAllRoutes();
      this.flights.forEach(f => { f.update(); f.drawPlane(this.fxCtx, now); });
      this._drawCityLabels(this.fxCtx);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  },
  beforeDestroy() {
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.timeTimer) clearInterval(this.timeTimer);
  },
  methods: {
    _resizeCanvases() {
      const W = window.innerWidth, H = window.innerHeight;
      [this.bg, this.rt, this.fx].forEach(c => {
        c.style.width = W + 'px';
        c.style.height = H + 'px';
        c.width = Math.round(W * this.DPR);
        c.height = Math.round(H * this.DPR);
      });
      [this.bgCtx, this.rtCtx, this.fxCtx].forEach(ctx => ctx.setTransform(this.DPR, 0, 0, this.DPR, 0, 0));
    },
    _computeCover() {
      const W = this.bg.width / this.DPR, H = this.bg.height / this.DPR;
      const iw = this.mapImg.naturalWidth || 4096;
      const ih = this.mapImg.naturalHeight || 2048;
      const s = Math.max(W / iw, H / ih);
      const offX = (W - iw * s) / 2;
      const offY = (H - ih * s) / 2;
      this.cover = { s, offX, offY, iw, ih };
    },
    _drawMapOnce() {
      if (!this.mapImg || !this.mapImg.complete) return;
      this._computeCover();
      const W = this.bg.width / this.DPR, H = this.bg.height / this.DPR;
      this.bgCtx.clearRect(0, 0, W, H);
      this.bgCtx.fillStyle = '#0b0a0a';
      this.bgCtx.fillRect(0, 0, W, H);
      const { s, offX, offY, iw, ih } = this.cover;
      this.bgCtx.drawImage(this.mapImg, offX, offY, iw * s, ih * s);
      const grad = this.bgCtx.createRadialGradient(W * 0.5, H * 0.58, 0, W * 0.5, H * 0.58, Math.max(W, H) * 0.65);
      grad.addColorStop(0, 'rgba(255,160,70,0.08)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      this.bgCtx.fillStyle = grad;
      this.bgCtx.fillRect(0, 0, W, H);
    },
    _project(lon, lat) {
      const xImg = (lon + 180) / 360 * this.cover.iw;
      const yImg = (90 - lat) / 180 * this.cover.ih;
      return { x: this.cover.offX + xImg * this.cover.s, y: this.cover.offY + yImg * this.cover.s };
    },
    _reprojectCities() {
      this.cities.forEach(c => { c.p = this._project(c.lon, c.lat); });
    },
    _updateCityTimes() {
      const now = new Date();
      for (const c of this.cities) {
        try {
          c.t = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: c.tz }).format(now);
        } catch (e) {
          c.t = '--:--';
        }
      }
    },
    _initFlights() {
      const SPEED_MIN = 0.0016, SPEED_MAX = 0.0032;
      const BOX_SIZE = 32;
      const density = Math.max(6, Math.min(36, Number(this.featherDensity) || 16));
      const featherScale = Math.max(0.5, Math.min(2.0, Number(this.featherScale) || 1.0));

      const bezier = (A, B, curviness = 0.5) => {
        const mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
        const vx = B.x - A.x, vy = B.y - A.y;
        const d = Math.hypot(vx, vy) || 1;
        const nx = -vy / d, ny = vx / d;
        const arc = Math.min(300, d * curviness);
        const C = { x: mid.x + nx * arc, y: mid.y + ny * arc };
        return { A, B, C };
      };
      const pointOnQuad = (A, B, C, t) => {
        const x = (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * C.x + t * t * B.x;
        const y = (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * C.y + t * t * B.y;
        const dx = 2 * (1 - t) * (C.x - A.x) + 2 * t * (B.x - C.x);
        const dy = 2 * (1 - t) * (C.y - A.y) + 2 * t * (B.y - C.y);
        return { x, y, ang: Math.atan2(dy, dx) };
      };
      const drawWing = (ctx, side = 1, phase = 0) => {
        // Simple three-line wing without feathers
        ctx.save();
        ctx.strokeStyle = '#FFC86A';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        const flap = Math.sin(phase) * 5;
        for (let i = 0; i < 3; i++) {
          const base = 18 + i * 10;
          const up = (-6 - i * 5) + flap * 0.6;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(side * base * 0.45, up, side * base, up + 8);
          ctx.stroke();
        }
        ctx.restore();
      };

      const self = this;
      function Flight() {
        this.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
        this.t = 0;
        this.phaseOffset = Math.random() * Math.PI * 2;
        this.curviness = 0.35 + Math.random() * 0.35;
        this.route = null;
        this.pickRoute();
      }
      Flight.prototype.pickRoute = function () {
        this.ca = self.cities[(Math.random() * self.cities.length) | 0];
        do { this.cb = self.cities[(Math.random() * self.cities.length) | 0]; } while (this.cb === this.ca);
        this.route = null;
        self.flightsNeedRouteRecalc = true;
        self.routesDirty = true;
        this.t = 0;
      };
      Flight.prototype.ensureRoute = function () {
        const A = self._project(this.ca.lon, this.ca.lat);
        const B = self._project(this.cb.lon, this.cb.lat);
        this.route = bezier(A, B, this.curviness);
      };
      Flight.prototype.reproject = function () { this.route = null; };
      Flight.prototype.update = function () { this.t += this.speed; if (this.t >= 1) this.pickRoute(); };
      Flight.prototype.drawPlane = function (ctx, now) {
        if (!this.route) this.ensureRoute();
        const { A, B, C } = this.route;
        const p = pointOnQuad(A, B, C, this.t);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.ang);
        const phase = now * 0.010 + this.phaseOffset;
        ctx.save(); ctx.translate(-BOX_SIZE / 2, 0); drawWing(ctx, -1, phase); ctx.restore();
        ctx.save(); ctx.translate(BOX_SIZE / 2, 0); drawWing(ctx, 1, phase); ctx.restore();
        if (self.boxImg && self.boxImg.complete) {
          ctx.drawImage(self.boxImg, -BOX_SIZE / 2, -BOX_SIZE / 2, BOX_SIZE, BOX_SIZE);
        } else {
          ctx.strokeStyle = '#FFC86A';
          ctx.lineWidth = 2; ctx.strokeRect(-BOX_SIZE / 2, -BOX_SIZE / 2, BOX_SIZE, BOX_SIZE);
        }
        ctx.restore();
      };

      const count = Math.max(1, Math.min(8, Number(this.flightCount) || 4));
      this.flights = Array.from({ length: count }, () => new Flight());
    },
    _reprojectAll() {
      this._reprojectCities();
      if (Array.isArray(this.flights)) this.flights.forEach(f => f.reproject());
      this.flightsNeedRouteRecalc = true; this.routesDirty = true;
    },
    _drawAllRoutes() {
      const W = this.rt.width / this.DPR, H = this.rt.height / this.DPR;
      this.rtCtx.clearRect(0, 0, W, H);
      if (this.flightsNeedRouteRecalc) {
        this.flights.forEach(f => f.ensureRoute());
        this.flightsNeedRouteRecalc = false;
      }
      this.rtCtx.strokeStyle = 'rgba(255,175,90,0.35)';
      this.rtCtx.lineWidth = 1.4;
      for (const f of this.flights) {
        const { A, B, C } = f.route;
        this.rtCtx.beginPath(); this.rtCtx.moveTo(A.x, A.y);
        this.rtCtx.quadraticCurveTo(C.x, C.y, B.x, B.y); this.rtCtx.stroke();
        this.rtCtx.fillStyle = 'rgba(255,175,90,0.35)';
        this.rtCtx.beginPath(); this.rtCtx.arc(A.x, A.y, 2, 0, Math.PI * 2); this.rtCtx.fill();
        this.rtCtx.beginPath(); this.rtCtx.arc(B.x, B.y, 2, 0, Math.PI * 2); this.rtCtx.fill();
      }
      this.routesDirty = false;
    },
    _drawCityLabels(ctx) {
      ctx.font = '12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      ctx.textBaseline = 'middle';
      for (const c of this.cities) {
        const { x, y } = c.p || { x: 0, y: 0 };
        ctx.fillStyle = '#FFD36A';
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
        const text = `${c.n}  ${c.t}`;
        const padX = 6, padY = 3, h = 18;
        const metrics = ctx.measureText(text);
        const w = metrics.width + padX * 2;
        const bx = x + 6, by = y - h / 2;
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        this._roundRect(ctx, bx, by, w, h, 8); ctx.fill();
        ctx.fillStyle = 'rgba(240,240,240,0.95)';
        ctx.fillText(text, bx + padX, y);
        ctx.restore();
      }
    },
    _roundRect(ctx, x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    },
  }
}
</script>

<style scoped>
.wf-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  /* keep behind page content */
  pointer-events: none;
  /* allow interactions to pass through */
}

.wf-bg.fixed {
  position: fixed;
}

.canvas {
  position: absolute;
  inset: 0;
  display: block;
}

#bg {
  z-index: 1;
}

#rt {
  z-index: 2;
}

#fx {
  z-index: 3;
}
</style>
