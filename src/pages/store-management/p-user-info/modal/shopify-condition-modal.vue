<template>
    <el-dialog :visible="visible" :title="$t('common.shopifyReminder')" width="40%" @close="handleClose" append-to-body>
        <el-form :model="formData" ref="form" label-width="110px" :rules="formRules" v-loading="loading">
            <el-form-item :label="$t('navigate.shopify')" prop="shopUrl">
                <el-input v-model="formData.shopUrl" :placeholder="$t('common.enterShopUrl')"
                    :disabled="loading"></el-input>
            </el-form-item>

            <div class="dialog-footer">
                <el-button @click="closeDialog" :disabled="loading">{{ $t('common.cancel') }}</el-button>
                <el-button type="primary" @click="submitForm" :loading="loading" :disabled="loading">{{
                    $t('common.confirm') }}</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
    name: 'ShopifyConditionModal',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        loading: {  // 接收父组件传递的 loading 属性
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            formData: {
                shopUrl: ''
            },
            formRules: {
                shopUrl: [
                    { required: true, message: this.$t('common.shopUrlRequired'), trigger: 'blur' },
                    {
                        pattern: /^[a-z0-9\-_]+\.myshopify\.com$/,
                        message: this.$t('common.shopUrlInvalid'),
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$emit('confirmed', this.formData.shopUrl); // 传递输入的店铺地址
                } else {
                    return false;
                }
            });
        },
        closeDialog() {
            this.$emit('closed');  // 通过事件通知父组件更新 visible
        },
        handleClose() {
            this.$emit('closed');
        }
    }
}
</script>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: flex-end;
}
</style>
