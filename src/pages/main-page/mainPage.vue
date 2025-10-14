<template>
    <div class="company-homepage">
        <!-- Banner -->
        <div class="banner">
            <!-- 语言切换按钮 -->
            <div class="lang-switch">
                <a-switch :checked="currentLang === 'en_us'" @change="toggleLanguage" checkedChildren="EN"
                    unCheckedChildren="中" />
            </div>
            <div class="logo">
                <h1>{{ $t('logoText') }}</h1>
                <img src="@/assets/png/logo.png" alt="Continuserv Logo" class="logo-image" />
            </div>
            <p class="slogan">{{ $t('slogan') }}</p>
        </div>

        <!-- Product Section -->
        <div class="product-section">
            <h2 class="products-title">{{ $t('ourProducts') }}</h2>
            <div v-for="(product, index) in products" :key="index" class="product-card">
                <h3 class="product-name">{{ $t(product.nameKey) }}</h3>
                <div class="product-layout">
                    <div class="product-info">
                        <p class="product-description">{{ $t(product.descriptionKey) }}</p>
                        <div class="product-features">
                            <ul>
                                <li v-for="(featureKey, i) in product.featuresKeys" :key="i">
                                    {{ $t(featureKey) }}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="product-images">
                        <div class="image-carousel-container">
                            <button class="prev" @click="prevImage(index)">&#10094;</button>
                            <div class="image-carousel">
                                <transition :name="transitionName" mode="out-in">
                                    <img :src="product.images[currentImage[index]]" :key="currentImage[index]"
                                        alt="Product Image" class="product-image" />
                                </transition>
                            </div>
                            <button class="next" @click="nextImage(index)">&#10095;</button>
                            <!-- 导航点 -->
                            <div class="carousel-dots">
                                <span v-for="(img, dotIndex) in product.images" :key="dotIndex" class="dot"
                                    :class="{ active: currentImage[index] === dotIndex }"
                                    @click="setImage(index, dotIndex)"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="subscribe-section">
                    <p class="subscribe-text">{{ $t('subscribeText') }}</p>
                    <button class="subscribe-button"  @click="handleSubscribe(product.productId)"">{{ $t('subscribeButton') }}</button>
                </div>
            </div>
        </div>

        <div class="footer">
            <template v-if="isERP">
                <span class="brand">{{ brandName }}</span>
                <span class="separator">|</span>
                <a :href="policyPath" @click.prevent="$router.push(policyPath)">{{$t('footer.pp')}}</a>
            </template>
            <template v-else>
                <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备2023017609号-1</a>
            </template>
        </div>
    </div>
</template>

<script>
// import { Switch } from 'ant-design-vue';
import { config } from '@/common/commonconfig'

export default {
    name: "CompanyHomepage",
    // components: {
    //     ASwitch: Switch
    // },
    data() {
        return {
            slideDirection: 'next',
            currentImage: [],
            products: [
                {
                    nameKey: "product.etsy.name",
                    descriptionKey: "product.etsy.description",
                    productId:0,
                    featuresKeys: [
                        "product.etsy.features.reviewCollection",
                        "product.etsy.features.imageCollection",
                        "product.etsy.features.userFriendly",
                        "product.etsy.features.timeSaving"
                    ],
                    images: [
                        '2fe00284a2de123219afbea3a4f835a.png',
                        'ae78d40e8d0fcd5b8ead100f6e3dbb7.png',
                        'b6c33b390c2286b6037b120f038f19a.png'
                    ].map(filename =>
                        `${window.location.protocol}//${window.location.hostname}/api/img/${filename}`
                    )
                }
            ]
        };
    },
    computed: {
        currentLang() {
            this.$store.state.init
            return this.$i18n.locale;
        },
        isERP() {
            return this.$store.state.init?.mainFunction === 'Business ERP'
        },
        brandName() {
            return this.$i18n.locale === 'en_us' ? this.$store.state.init?.titleEnus : this.$store.state.init?.titleZhcn
        },
        policyPath() {
            return config.privatePolicy
        },
        transitionName() {
            return this.slideDirection === 'next' ? 'slide-next' : 'slide-prev';
        }
    },
    methods: {
        handleSubscribe(productId) {
            if (productId === 0) {
                // Redirect to the configuration page for Etsy Reviews/Images Collector
                this.$router.push(config.estyIntroduction);
                console.log("Subscribing.")
            }
        },
        toggleLanguage(checked) {
            this.$i18n.locale = checked ? 'en_us' : 'zh_cn';
        },
        prevImage(index) {
            this.slideDirection = 'prev';
            let newIndex = (this.currentImage[index] - 1 + this.products[index].images.length) % this.products[index].images.length;
            this.$set(this.currentImage, index, newIndex);
        },
        nextImage(index) {
            this.slideDirection = 'next';
            let newIndex = (this.currentImage[index] + 1) % this.products[index].images.length;
            this.$set(this.currentImage, index, newIndex);
        },
        setImage(productIndex, dotIndex) {
            this.$set(this.currentImage, productIndex, dotIndex);
        }
    },
    mounted() {
        this.products.forEach(() => {
            this.currentImage.push(0);
        });
    }
};
</script>

<style scoped>
/* 通用 */
.company-homepage {
    font-family: 'RethinkSans-SemiBold', sans-serif;
    position: relative;
    padding-bottom: 50px;
}

/* Banner Section */
.banner {
    background: linear-gradient(45deg, #658a61, #c556ad, #15a6fa, #ff7a00);
    color: white;
    padding: 20px 0;
    position: relative;
}

.logo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 10px;
}

.logo h1 {
    font-size: 1.8rem;
    margin-top: 10px;
}

.slogan {
    font-size: 1rem;
    margin-left: 10px;
    font-style: italic;
}

/* 语言切换开关 */
.lang-switch {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
}

/* logo 图片 */
.logo-image {
    width: 30px;
    height: 30px;
    margin-left: 15px;
    margin-bottom: 5px;
    animation: rotate 5s infinite linear;
    user-select: none;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Product Section */
.product-section {
    padding: 40px 20px;
    background-color: #f7f7f7;
}

.products-title {
    font-size: 2rem;
    margin-bottom: 20px;
    font-weight: bold;
    background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
}

/* 产品卡片 */
.product-card {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

.product-name {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
}

/* 产品布局 */
.product-layout {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

/* 产品信息 */
.product-info {
    flex: 1;
    padding-right: 20px;
}

.product-description {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
    margin-bottom: 15px;
}

.product-features ul {
    list-style-type: disc;
    padding-left: 20px;
    font-size: 1.1rem;
    margin-top: 10px;
}

/* 产品图片 */
.product-images {
    flex: 1;
    text-align: center;
}

.image-carousel-container {
    position: relative;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    height: 420px;
}

.image-carousel {
    position: relative;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    height: 400px;
    overflow: hidden;
}

/* 过渡动画 */
.slide-next-enter-active,
.slide-next-leave-active {
    transition: transform 0.5s ease;
    position: absolute;
    width: 100%;
}

.slide-next-enter {
    transform: translateX(-100%);
}

.slide-next-leave-to {
    transform: translateX(100%);
}

.slide-prev-enter-active,
.slide-prev-leave-active {
    transition: transform 0.5s ease;
    position: absolute;
    width: 100%;
}

.slide-prev-enter {
    transform: translateX(100%);
}

.slide-prev-leave-to {
    transform: translateX(-100%);
}

/* 导航点 */
.carousel-dots {
    text-align: center;
    margin-top: 10px;
}

.dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 5px;
    background-color: #ccc;
    border-radius: 50%;
    cursor: pointer;
}

.dot.active {
    background-color: #ff7a00;
}

/* 产品图片样式 */
.product-image {
    width: 100%;
    height: auto;
    display: block;
    margin-top: 15px;
    cursor: pointer;
}

/* 轮播按钮（限定在 image-carousel-container 内） */
.image-carousel-container button {
    background-color: rgba(0, 0, 0, 0);
    color: rgba(0, 0, 0, 0.1);
    border: none;
    padding: 10px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
}

.image-carousel-container button.prev {
    left: -50px;
}

.image-carousel-container button.next {
    right: -50px;
}

.image-carousel-container button:hover {
    color: rgba(0, 0, 0, 0.5);
}

/* 订阅部分 */
.subscribe-section {
    display: block;
    background-color: #658a61;
    color: white;
    padding: 20px;
    text-align: center;
    margin-top: 20px;
    border-radius: 4px;
}

.subscribe-text {
    display: block;
    margin-bottom: 20px;
    font-size: 1rem;
    line-height: 1.6;
}

.subscribe-button {
    background-color: #ff7a00;
    color: white;
    padding: 15px 30px;
    border: none;
    font-size: 1rem;
    cursor: pointer;
}

.subscribe-button:hover {
    background-color: #ff5500;
}

/* Footer */
.footer {
    text-align: center;
    position: relative;
    margin-top: 50px;
    bottom: 10px;
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer a {
    color: #999;
    text-decoration: none;
}

.footer a:hover {
    text-decoration: underline;
}

.footer .separator {
    margin: 0 6px;
}
</style>
