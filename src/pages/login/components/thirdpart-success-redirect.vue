<template>
    <div id="thirdpart-success-redirect">
        <el-spinner v-if="isLoggingIn" />
        <div v-else class="content-container">
            <p class="success-text">{{ $t('message.login.googleSuccess') }}</p>
            <button v-if="showReturnButton" @click="closeWindow" class="return-btn">Close Current Tab And
                Coutinue</button>
        </div>
    </div>
</template>

<script>
import { loadHomeData, getWarehouseRelatedInfo } from '@/common/common-func'
export default {
    name: 'thirdpart-success-redirect',
    computed: {
        showReturnButton() {
            // 根据 this.$store.init.state.mainFunction 是否为 'Homepage' 决定是否显示 button
            return this.$store.state.init.isHomePage();
        }
    },
    data() {
        return {
            isLoggingIn: false, // 登录中状态
            accessToken: null, // 存储accessToken
            signInType: '',
        }
    },
    created() {
        this.accessToken = this.$route.query.access_token; // 从 URL 中获取access_token
        if (this.accessToken) {
            if (this.$store.state.init.isHomePage()) {
                return
            }
            this.handleAccessToken();
        } else {
            this.$router.push('/login'); // 如果没有access_token，跳转到登录页面
        }
    },
    methods: {
        closeWindow() {
            window.close();
        },
        handleAccessToken() {
            this.isLoggingIn = true;
            // 使用accessToken直接进行后续处理
            localStorage.setItem(this.config[this.roleType].accessToken, this.accessToken); // 保存accessToken到localStorage

            // 加载首页数据
            this.loadHomeData()
                .then((resData) => {
                    const { user, user_avatar_url, shops, default_settings } = resData;
                    this.roleType = user.user_role
                    console.log(this.config[this.roleType].homePath)
                    // 将用户信息存储到localStorage
                    localStorage.setItem(this.config[this.roleType].userName, user.username);
                    localStorage.setItem(this.config[this.roleType].userRole, user.user_role);
                    localStorage.setItem(this.config[this.roleType].userRelatedId, user.user_related_id);

                    // 保存店铺信息
                    localStorage.setItem(this.config[this.roleType].shopList, JSON.stringify(shops));

                    // 清空标签视图
                    this.$store.dispatch('tagsView/delAllPDSViews');

                    // 设置用户偏好的语言
                    const defaultLanguage = default_settings?.defaultLanguage || 'en_us';
                    this.$store.dispatch('user/getDefaultLanguage', defaultLanguage);
                    this.$i18n.locale = defaultLanguage;

                    // 设置主题
                    const defaultTheme = default_settings?.defaultTheme || 'defaultTheme';
                    this.$store.dispatch('user/changeSetting', {
                        key: 'theme',
                        value: defaultTheme,
                        persist: false
                    });
                    if (this.config.roleNames.includes(user.user_role)) {
                        return this.getRelatedInfo()
                    } else {
                        // 角色信息错误 跳转到登录页面
                        if (this.config.roles.includes(this.roleType)) {
                            this.$router.push(this.config[this.roleType].loginPath)
                        } else {
                            this.$router.push(this.config.dropShipper.loginPath)
                        }
                    }
                })
                .catch((error) => {
                    console.error('处理access_token失败:', error);
                    this.$router.push('/login'); // 错误时跳转到登录页面
                })
                .finally(() => {
                    this.isLoggingIn = false; // 登录过程结束
                });
        },
        loadHomeData,
        getWarehouseRelatedInfo,
        getRelatedInfo() {
            return this.getWarehouseRelatedInfo()
                .then((resData) => {
                    if (resData && resData.length === 0) {
                        if (this.signInType === 'relateUser') {
                            // 如果是关联用户登录 需要跳转到第三方关联仓储的步骤
                            this.$emit('changeActive', 1)
                        } else {
                            this.$router.push(this.config[this.roleType].keyInformationPath)
                        }
                    } else {
                        if (this.signInType === 'relateUser') {
                            // 如果是关联用户登录 需要跳转到第三方同步产品的步骤
                            this.$emit('changeActive', 2)
                        } else {
                            this.$router.push(this.config[this.roleType].homePath)
                        }
                    }
                })
                .catch((error) => {
                    this.shopList = []
                    console.error(error)
                    throw error
                })
        },
    }
}
</script>
<style scoped>
#thirdpart-success-redirect {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.success-text {
    font-size: 2rem;
    font-weight: bold;
    background: linear-gradient(45deg, #ff6a00, #ee0979, #9b00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
    /* 调整间距确保按钮正下方 */
}

.return-btn {
    padding: 8px 15px;
    font-size: 1.2rem;
    border: none;
    border-radius: 6px;
    background: black;
    color: #fff;
    cursor: pointer;
    transition: background 0.3s ease;
}

.return-btn:hover {
    opacity: 0.8;
}
</style>
