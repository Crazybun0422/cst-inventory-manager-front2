<template>
    <div class="checkout-container">
        <!-- Banner at the top -->
        <div class="checkout-banner">
            <h1>Check Out</h1>
            <p class="greeting">Hello, {{ userData.name || userData.email }}! Many thanks for your support.</p>
        </div>
        <!-- 全局遮罩层：禁用整页交互 -->
        <div v-if="pageDisabled" class="global-overlay">
            <div class="overlay-message">
                Please do not close, the system is processing your payment.
            </div>
        </div>

        <!-- 新增倒计时覆盖层 -->
        <div v-if="showCountdownOverlay" class="countdown-overlay">
            <div class="countdown-message">
                Waiting for backend response... <br />
                <span>{{ countdown }} seconds</span>
            </div>
        </div>

        <!-- Subscription Options -->
        <div class="subscription-options" v-if="!paymentSuccess">
            <div class=" plan-card" :class="{ selected: selectedPlan === 'monthly' }" @click="selectedPlan = 'monthly'">
                <h2>Monthly</h2>
                <p class="plan-price">$8.88 / month</p>
                <p class="plan-desc">Access to all features, billed monthly. Cancel anytime!</p>
            </div>

            <!-- <div class="plan-card" :class="{ selected: selectedPlan === 'quarterly' }" :disabled="true"
                @click="selectedPlan = 'quarterly'">
                <h2>Quarterly</h2>
                <p class="plan-price">$19.99 / quarter</p>
                <p class="plan-desc">Enjoy discounted pricing with quarterly billing. Easy to manage!</p>
            </div> -->

            <div class="plan-card" :class="{ selected: selectedPlan === 'yearly' }" @click="selectedPlan = 'yearly'">
                <h2>Yearly</h2>
                <p class="plan-price">$69.99 / year</p>
                <p class="plan-desc">Best value! Get a full year of service with the lowest price.</p>
            </div>
        </div>

        <!-- PayPal Button (pass selected plan ID as buttonId) -->
        <div class="paypal-button-container">
            <!-- 支付成功后显示提示，并隐藏支付按钮 -->
            <div v-if="paymentSuccess" class="payment-success-msg">
                <p>Congrats, Payment Success!</p>
            </div>
            <PaypalButton v-else :buttonId="selectedPlanId" :accessToken="userData.accessToken" :plan="planId"
                :userId="userData.userId" @disablePage="disablePage" @enablePage="enablePage"
                @paymentSuccess="handlePaymentSuccess" @startCountdown="startCountdown" />

        </div>

        <!-- Footer -->
        <section id="footer">
            <div class="links">
                <a href="/esty-collector-tos" target="_blank">Terms of Service</a>
                <span style="margin-left:5px;margin-right:5px">|</span>
                <a href="/esty-collector-pp" target="_blank">Privacy Policy</a>
            </div>
            <p>&copy; 2025 Continuserv.com, Powered by Continuserv</p>
            <img class="cs_img" src="@/assets/png/cs.png" />
        </section>
    </div>
</template>

<script>
import PaypalButton from '@/pages/components/esty/PayPalButton.vue'; // Adjust the import path

export default {
    components: {
        PaypalButton
    },
    props: {
        planId: {
            type: String,
            required: true
        },

    },

    data() {
        return {
            selectedPlan: this.planId || 'monthly',
            userData: {
                name: 'anonymous', // Default value, will be overwritten if data is passed
                email: '',
                userId: '',
                accessToken: ''
            },
            paymentSuccess: false,
            pageDisabled: false,
            userId: '',
            flag: '',
            countdown: 30,
            timerInterval: null,
            showCountdownOverlay: false,
        };
    },
    computed: {
        selectedPlanId() {
            switch (this.selectedPlan) {
                case 'monthly':
                    //return 'P-5AW36004MK755424FM7IXECY'; // Replace with actual plan ID for monthly
                    //sandbox
                    //return 'P-70X52297C83693904M7MAZ2Q'
                    return 'P-7BS95430LD8091243M7VIIWA';
                // case 'quarterly':
                //     return 'P-123456789012345678901234'; // Replace with actual plan ID for quarterly
                case 'yearly':
                    return 'P-9YY65901JT795720KM7VIRPQ'; // Replace with actual plan ID for yearly
                default:
                    return 'P-7BS95430LD8091243M7VIIWA'; // Default to monthly if no plan selected
            }
        }
    },
    methods: {
        disablePage() {
            this.pageDisabled = true;
        },
        startCountdown() {
            if (this.pageDisabled) {
                this.showCountdownOverlay = true;
                this.countdown = 30;
                this.timerInterval = setInterval(() => {
                    this.countdown--;
                    if (this.countdown <= 0) {
                        clearInterval(this.timerInterval);
                        if (this.pageDisabled) {
                            this.$message.error('Timeout: Please verify if the plugin has been upgraded to Pro.');
                            this.showCountdownOverlay = false;
                        }
                    }
                }, 1000);
            }
        },
        enablePage() {
            this.pageDisabled = false;
            clearInterval(this.timerInterval);
            this.showCountdownOverlay = false;
        },
        handlePaymentSuccess() {
            this.paymentSuccess = true;
        }
    },
    mounted() {
        // Set the userData based on the passed flag
        const flag = this.$route.query.flag;

        if (flag) {
            try {
                // Decode and parse the Base64-encoded user data
                const decodedData = atob(flag);
                this.userData = JSON.parse(decodedData);
                this.userId = decodedData.userId
                console.log('User Data:', this.userData);
                if (this.userData.accessToken) {
                    localStorage.setItem("accessToken", this.userData.accessToken);
                }
            } catch (error) {
                console.error('Error parsing the flag data:', error);
            }
        }
    }
};
</script>

<style scoped>
/* Container Layout */
.checkout-container {
    font-family: myFont, sans-serif;
    padding: 20px;
    text-align: center;
    position: relative;
    min-height: 100vh;
    padding-bottom: 40px;
    /* To leave space for the footer */
}

.global-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.overlay-message {
    position: absolute;
    top: 20px;
    width: 100%;
    text-align: center;
    color: red;
    font-size: 18px;
    z-index: 10000;
}

.payment-success-msg p {
    font-size: 2rem;
    background: linear-gradient(45deg, #ff007f, #ff8c00, #40e0d0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
}

/* Header */
.checkout-banner {
    background: linear-gradient(45deg, #658a61, #c556ad, #15a6fa, #ff7a00);
    color: white;
    text-align: left;
    padding: 30px;
    font-size: 1.3rem;
    margin-bottom: 50px;
    /* Ensure space for the options */
}

.checkout-banner h1 {
    margin: 0;
    font-size: 2rem;
}

.greeting {
    margin-top: 15px;
    font-size: 1.1rem;
    color: white;
}

/* Subscription Options */
.subscription-options {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 50px;
}

.plan-card {
    background-color: #fafafa;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    cursor: pointer;
    width: 200px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.plan-card:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.selected {
    background-color: #e0e0e0;
    border-color: #ff6a00;
}

.plan-card h2 {
    font-size: 24px;
    margin-bottom: 10px;
}

.plan-price {
    font-size: 18px;
    font-weight: bold;
}

.plan-desc {
    font-size: 12px;
    color: #666;
}

/* PayPal Button */
.paypal-button-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

/* Footer */
#footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #f8f8f8;
    padding: 10px 0;
    text-align: center;
}

#footer .links {
    font-size: 12px;
}

#footer .links a {
    color: #007bff;
    text-decoration: none;
}

#footer .links span {
    color: #666;
}

.cs_img {
    width: 24px;
}

.countdown-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    font-size: 1.5rem;
    z-index: 10000;
}

.countdown-message span {
    font-weight: bold;
    color: #ffeb3b;
}
</style>
