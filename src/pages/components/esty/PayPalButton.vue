<template>
    <div class="paypal-button-container">
        <div ref="paypalButton"></div>
        <!-- Overlay to disable interaction and show spinner -->
        <div v-if="loading" class="overlay">
            <div class="spinner"></div>
        </div>
    </div>
</template>

<script>
import { getWebSocketUrl } from '@/common/common-func';
export default {
    props: {
        buttonId: {
            type: String,
            required: true
        },
        accessToken: {
            type: String,
            required: true
        },
        plan: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            loading: true,
            subscriptionId: null,
            websocketUrl: getWebSocketUrl(), // 现有的 WebSocket URL
            socket: null,
        };
    },
    mounted() {
        // Dynamically load the PayPal SDK
        const script = document.createElement('script');
        // "https://www.paypal.com/sdk/js?client-id=AbNQpLEz5idSZXeTAEtJS1B1rVSDT7lgoS9LkuVlmonCwBd50Ic_w8x-jRtvQoMzRFSJKnNwuGR1iCdS&vault=true&intent=subscription" 
        script.src = "https://www.paypal.com/sdk/js?client-id=AQrF7tTrGs8ZjgRsHZMCdpDSL8rnpfGGghKquB2qY2aNfAy73BHiGpW4ak7n2FeXllzII-gCb-d19F-s&vault=true&intent=subscription"
        // "https://www.paypal.com/sdk/js?client-id=Aa2sCIgTeGvCB2piNPu9kpygbdDwGKWyTaNmtoqAfCF6m7ee3D7b4PGB_MQcVqQ5XSx1fTgj1yWTleJu&vault=true&intent=subscription";
        script.async = true;
        script.onload = () => {
            this.loadPaypalButton();
        };
        document.body.appendChild(script);
    },
    methods: {
        InitWebSocket(uuid) {
            if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
                this.socket = new WebSocket(
                    this.websocketUrl + '/ws/notifications/' + uuid
                )
                this.socket.onmessage = (event) => {
                    const data = JSON.parse(event.data)
                    if (data?.success === 'true') {
                        this.loading = false
                        this.$message.success('Payment completed!')
                        this.$emit('enablePage');
                        this.$emit('paymentSuccess')
                        this.socket.close()
                    }
                }
            }
        },
        generateUUID() {
            if (crypto.randomUUID) {
                return crypto.randomUUID();
            } else {
                // 备用方案：使用 Math.random 生成符合 RFC4122 版本4 格式的 UUID
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
        },
        createSubscriptionMapping(subscriptionId, uuid) {
            const url = '/api/google-plugin/create-subscription-mapping';
            const data = new URLSearchParams();
            data.append('subscription_id', subscriptionId);
            data.append('uuid', uuid);
            return this.$ajax({
                method: 'POST',
                url,
                data
            })
                .then(res => {
                    if (this.$isRequestSuccessful(res.code)) {
                        return res.data;
                    } else {
                        throw new Error('Failed to create subscription mapping');
                    }
                });
        },
        cancelSubscription() {
            if (!this.subscriptionId) {
                console.error('No subscription ID available to cancel');
                return Promise.reject('No subscription ID available');
            }

            const url = '/api/google-plugin/cancel-subscription';
            return this.$ajax({
                method: 'POST',
                url,
                data: {}  // No data needed as backend will get subscription from user record
            })
                .then(res => {
                    if (this.$isRequestSuccessful(res.code)) {
                        this.subscriptionId = null;
                        return res.data;
                    } else {
                        throw new Error('Failed to cancel subscription');
                    }
                });
        },
        loadPaypalButton() {
            if (window.paypal && this.$refs.paypalButton) {
                window.paypal.Buttons({
                    style: {
                        shape: 'rect',
                        color: 'blue',
                        layout: 'vertical',
                        label: 'subscribe'
                    },
                    // 当用户点击支付按钮时，禁用当前页
                    onClick: (data, actions) => {
                        this.$emit('disablePage');
                        return actions.resolve();
                    },
                    createSubscription: async (data, actions) => {
                        const result = await actions.subscription.create({
                            plan_id: this.buttonId,
                        });

                        this.subscriptionId = result;
                        this.createSubscriptionMapping(result);
                        this.InitWebSocket(this.userId)
                        //这里创建订阅
                        return result
                    },
                    // 支付成功回调
                    onApprove: (data, actions) => {
                        this.$emit('startCountdown'); // 通知父页面启动倒计时
                        console.log(data);
                    },
                    // 用户取消支付回调
                    onCancel: (data) => {
                        console.log('Payment cancelled', data);

                        // If user created subscription but cancelled payment, try to cancel subscription to prevent future charges
                        if (this.subscriptionId) {
                            this.cancelSubscription()
                                .then(() => console.log('Subscription cancelled successfully'))
                                .catch(err => console.error('Failed to cancel subscription:', err));
                        }

                        this.$emit('enablePage');
                    }
                })
                    .render(this.$refs.paypalButton)
                    .then(() => {
                        this.loading = false;
                    });
            }
        }
    }
};
</script>

<style scoped>
.paypal-button-container {
    position: relative;
    min-height: 120px;
    /* Ensure the container has sufficient height */
    display: flex;
    justify-content: center;
    align-items: center;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: all;
    /* Disable interactions on the underlying area */
}

.spinner {
    width: 50px;
    height: 50px;
    border: 6px solid #ccc;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
