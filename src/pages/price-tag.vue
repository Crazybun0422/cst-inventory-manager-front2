<template>
  <div class="pricing">
    <WorldFlightBackground :lang="$i18n.locale" :flight-count="4" :feather-density="24" :feather-scale="1.15" />

    <div class="content">
      <h1 class="title gradient-text">Pricing</h1>
      <p class="subtitle">Transparent, predictable fulfillment fees — scale with confidence.</p>

      <div class="cards">
        <div class="pricing-card">
          <div class="amount">$3</div>
          <div class="headline">Single‑item parcel</div>
          <div class="desc">Best for sample orders and lean testing. No hidden fees.</div>
        </div>
        <div class="pricing-card">
          <div class="amount">$5</div>
          <div class="headline">2–3 items per order</div>
          <div class="desc">Optimized picking and packing for small bundles.</div>
        </div>
        <div class="pricing-card">
          <div class="amount">$8</div>
          <div class="headline">Special‑care contents</div>
          <div class="desc">Orders with battery, magnet, liquid, etc. Compliance‑ready handling.</div>
        </div>
      </div>

      <div class="notes">Custom or high‑volume programs available — contact us for enterprise terms.</div>
    </div>

    <div class="footer">
      <template v-if="isERP">
        <span class="brand">{{ brandName }}</span>
        <span class="separator">|</span>
        <a :href="policyPath" @click.prevent="$router.push(policyPath)">Privacy Policy</a>
        <span class="separator">|</span>
        <a :href="priceTagPath" @click.prevent="$router.push(priceTagPath)">Price Tag</a>
      </template>
      <template v-else>
        <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备2023017609号-1</a>
      </template>
    </div>
  </div>

</template>

<script>
import WorldFlightBackground from '@/components/world-flight-background.vue'

export default {
  name: 'price-tag',
  components: { WorldFlightBackground },
  computed: {
    isERP() {
      return this.$store.state.init?.mainFunction === 'Business ERP'
    },
    brandName() {
      return this.$i18n.locale === 'en_us' ? this.$store.state.init?.titleEnus : this.$store.state.init?.titleZhcn
    },
    policyPath() {
      return this.config.privatePolicy
    },
    priceTagPath() {
      return this.config.priceTag
    },
  }
}
</script>

<style scoped lang="scss">
.pricing {
  position: relative;
  width: 100%;
  height: 100vh;
  background: transparent;
  color: #eaeaea;
}

.content {
  position: absolute;
  top: 14vh;
  left: 50%;
  transform: translateX(-50%);
  width: min(1040px, 92vw);
  z-index: 2;
  text-align: center;
  /* Frosted glass panel to increase contrast with map background */
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow:
    0 10px 26px rgba(255, 215, 0, 0.14),
    0 6px 14px rgba(255, 69, 0, 0.10),
    0 0 18px rgba(166, 124, 82, 0.10);
}

.title {
  margin: 0 0 6px 0;
  font-size: 36px;
  letter-spacing: 0.5px;
}

.subtitle {
  margin: 0 0 18px 0;
  color: #cfcfcf;
}

.gradient-text {
  background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 16px;
}

.pricing-card {
  background: #0f0f12;
  border-radius: 14px;
  padding: 18px 18px 16px 18px;
  box-shadow:
    0 10px 26px rgba(255, 215, 0, 0.14),
    0 6px 14px rgba(255, 69, 0, 0.10),
    0 0 18px rgba(166, 124, 82, 0.10);
  text-align: left;
}

.pricing-card .amount {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #FFE18A;
}

.pricing-card .headline {
  font-size: 18px;
  margin-bottom: 4px;
}

.pricing-card .desc {
  color: #bdbdbd;
  font-size: 14px;
}

.notes {
  margin-top: 16px;
  color: #bcbcbc;
}

.footer {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;

  a {
    color: #999;
    text-decoration: none;
    font-size: 16px;
  }

  a:hover {
    text-decoration: underline;
  }

  .separator {
    margin: 0 8px;
  }
}

@media (max-width: 860px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
