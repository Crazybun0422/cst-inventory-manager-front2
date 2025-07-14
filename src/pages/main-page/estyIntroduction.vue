<template>
    <div style="font-family: 'RethinkSans-SemiBold', sans-serif; ;">
        <!-- 顶部导航 -->
        <nav class="navbar">
            <div class="logo">
                <img style="width: 64px;" src="@/assets/png/esty.png" alt="Etsy Logo" />
                <span>{{ $t('product.etsy.name') }}</span>
            </div>
            <div class="nav-links">
                <router-link :to="{ path: '/esty-introduction', hash: '#features' }">
                    {{ $t('nav.features') }}
                </router-link>
                <router-link :to="{ path: '/esty-introduction', hash: '#pricing' }">
                    {{ $t('nav.pricing') }}
                </router-link>
                <router-link :to="{ path: '/esty-introduction', hash: '#faq' }">
                    {{ $t('nav.faq') }}
                </router-link>
            </div>
        </nav>

        <!-- 产品介绍 -->
        <section class="section" id="intro">
            <div class="card card-first">
                <div class="intro">
                    <div class="text">
                        <h1>{{ $t('product.etsy.name') }}</h1>
                        <a-rate :value="5" disabled style="font-size: 24px; color: #faad14;" />
                        <p>{{ $t('intro.description') }}</p>
                        <div class="cta">
                            <a href="https://chromewebstore.google.com/detail/etsy-reviewsimages-collec/mogfgkeipkpinjlhcgmncnbcjaefhlii"
                                class="chrome-button">
                                <img src="@/assets/png/chrome.png" style="width: 32px;" alt="Chrome Icon" />
                                {{ $t('cta.addToChrome') }}
                            </a>
                        </div>
                        <p style="margin-top: 5px;">{{ $t('cta.getStarted') }}</p>

                    </div>
                    <div class="video-container">
                        <iframe width="800" height="480" src="https://www.youtube.com/embed/mBi2vZ9ve5U" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="section" id="features">
            <div class="card">
                <h2>{{ $t('section.features.title') }}</h2>
                <div class="card-container">
                    <div class="card-inner">
                        <ul>
                            <li v-for="(feature, index) in features" :key="index">{{ feature }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing -->
        <section class="section" id="pricing">
            <div class="card">
                <h2>{{ $t('section.pricing.title') }}</h2>
                <p>{{ $t('section.pricing.subtitle') }}</p>
                <div class="card-container">
                    <!-- 包裹 Free 定价卡 -->
                    <div class="pricing-card">
                        <div class="card-inner">
                            <h3>{{ $t('pricing.free.title') }}</h3>
                            <ul>
                                <li v-for="(item, index) in pricing.free" :key="'free-' + index">{{ item }}</li>
                            </ul>
                        </div>
                    </div>
                    <!-- 包裹 Pro 定价卡，增加 gradient 边框 -->
                    <div class="pricing-card recommended">
                        <div class="card-inner">
                            <h3>
                                {{ $t('pricing.pro.title') }}
                                <span>({{ $t('pricing.pro.recommended') }})</span>
                            </h3>
                            <ul>
                                <li v-for="(item, index) in pricing.pro" :key="'pro-' + index">{{ item }}</li>
                            </ul>
                            <p>{{ $t('pricing.pro.price') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section class="section" id="faq">
            <div class="card">
                <h2>{{ $t('section.faq.title') }}</h2>
                <div v-for="(faq, index) in faqItems" :key="index" class="faq-item">
                    <h4>{{ faq.question }}</h4>
                    <p>{{ faq.answer }}</p>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer id="footer">
            <div class="links">
                <a href="/esty-collector-tos" target="_blank">{{ $t('footer.tos') }}</a>
                <span>|</span>
                <a href="/esty-collector-pp" target="_blank">{{ $t('footer.pp') }}</a>
            </div>
            <p>&copy; 2025 Continuserv.com, Powered by Continuserv</p>
            <img class="cs_img" src="@/assets/png/cs.png" />
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            features: [
                this.$t('features.item1'),
                this.$t('features.item2'),
                this.$t('features.item3'),
                this.$t('features.item4'),
                this.$t('features.item5')
            ],
            pricing: {
                free: [
                    this.$t('pricing.free.item1'),
                    this.$t('pricing.free.item2'),
                    this.$t('pricing.free.item3')
                ],
                pro: [
                    this.$t('pricing.pro.item1'),
                    this.$t('pricing.pro.item2'),
                    this.$t('pricing.pro.item3')
                ]
            },
            faqItems: [
                { question: this.$t('faq.q1.title'), answer: this.$t('faq.q1.answer') },
                { question: this.$t('faq.q2.title'), answer: this.$t('faq.q2.answer') },
                { question: this.$t('faq.q3.title'), answer: this.$t('faq.q3.answer') },
                { question: this.$t('faq.q4.title'), answer: this.$t('faq.q4.answer') },
                { question: this.$t('faq.q5.title'), answer: this.$t('faq.q5.answer') },
                { question: this.$t('faq.q6.title'), answer: this.$t('faq.q6.answer') }
            ]
        };
    }
};
</script>

<style scoped>
/* 导航栏 */
.navbar {
    position: fixed;
    width: 100%;
    top: 0;
    background: linear-gradient(45deg, #658a61, #c556ad, #15a6fa, #ff7a00);
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    color: white;
    z-index: 9999;
}

.navbar a {
    color: white;
    margin-left: 20px;
    text-decoration: none;
    font-weight: bold;
}

/* 各 section 使用全宽卡片 */
.card {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 5px 0;
}

.card-first {
    margin-top: 100px;
}


/* 主要页面内容 */
.section {
    padding: 10px 10px 10px;
    font-size: 18px;
}

/* 产品介绍 */
.intro {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.video-container {
    flex: 1;
    padding: 25px;
    text-align: center;
}

.video-container video {
    width: 100%;
    height: auto;
    max-width: 800px;
    min-height: 480px;
}

/* 炫彩 Add to Chrome 按钮 */
.chrome-button {
    display: inline-flex;
    align-items: center;
    background: linear-gradient(45deg, #ff7a00, #ff1493, #15a6fa);
    padding: 10px 10px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: bold;
    color: white;
    text-decoration: none;
    cursor: pointer;
    transition: 0.3s;
}

.chrome-button:hover {
    transform: scale(1.05);
}

/* 通用内部卡片 */
.card-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: stretch;
    /* 强制子项等高 */
}

/* 内部卡片 */
.card-inner {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Pricing 卡片，外层添加渐变边框 */
.pricing-card {
    display: flex;
    flex-direction: column;
    flex: 1;
    max-width: 45%;
    padding: 2px;
    /* 边框宽度 */
    border-radius: 10px;
}

.pricing-card .card-inner {
    flex: 1;
    /* 填满父容器 */
    border-radius: 8px;
    padding: 20px;
}

/* 对于推荐（Pro）卡，可额外增加效果 */
.pricing-card.recommended {
    background: linear-gradient(45deg, #ff7a00, #ff1493, #15a6fa);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
}

/* Footer */
#footer {
    background: #f8f8f8;
    padding: 15px;
    text-align: center;
    font-size: 16px;
}
</style>
