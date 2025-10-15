<template>
  <div class="auto-onboarding">
    <div class="top-hint">
      <span class="gradient-text flicker">Authorizing…</span>
    </div>
    <div class="panel">
      <div class="panel-title gradient-text">{{ $t('common.shopifyReminder') }}</div>
      <el-steps :active="active" finish-status="success" align-center class="gradient-steps">
        <el-step :title="step1Title" />
        <el-step :title="$t('message.storage.associatedWarehousing')" />
        <el-step :title="$t('message.storage.synchronizeProducts')" />
      </el-steps>

      <div class="status-area">
        <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon :closable="false" />
      </div>
    </div>

    <!-- Initial password modal for first-time accounts -->
    <el-dialog :visible.sync="passwordModalVisible" :append-to-body="true" :z-index="4000" :modal="true"
      modal-class="light-modal" width="520px" top="18vh" :close-on-click-modal="false"
      :before-close="onPasswordBeforeClose">
      <div class="pwd-title">{{ $t('message.signUp.initialPassword') }}</div>
      <div class="pwd-desc">{{ $t('message.signUp.keepPasswordSafe') }}</div>
      <div class="creds-lines" v-if="generatedPassword || generatedUsername">
        <div class="line"><span class="k">username:</span><span class="v">{{ generatedUsername }}</span></div>
        <div class="line"><span class="k">password:</span><span class="v">{{ showPassword ? generatedPassword : '••••••••' }}</span></div>
      </div>
      <div class="pwd-row">
        <el-input :type="showPassword ? 'text' : 'password'" v-model="generatedPassword" readonly>
          <i slot="suffix" class="el-icon-view action-icon" @click="showPassword = !showPassword"></i>
        </el-input>
        <el-button class="copy-btn" type="primary" icon="el-icon-document-copy" @click="copyPassword"
          :disabled="!generatedPassword"></el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onPasswordConfirm">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import storageMixin from '@/common/storage/storage-mixin'
import {
  loadHomeData,
  getWarehouseRelatedInfo,
  getStoreDetail,
  startSyncProducts,
  createOrAddProvider
} from '@/common/common-func'

export default {
  name: 'auto-onboarding-steps',
  mixins: [storageMixin],
  data() {
    return {
      active: 0,
      isNewAccount: false,
      generatedUsername: '',
      generatedPassword: '',
      passwordModalVisible: false,
      showPassword: false,
      copied: false,
      errorMsg: '',
      shopUrl: ''
    }
  },
  computed: {
    step1Title() {
      return this.isNewAccount ? (this.$t('message.signUp.generateNewAccount') || 'Generate New Account') : (this.$t('message.signUp.linkedExistingAccounts') || 'Link Existing Account')
    },
    step1Desc() {
      return this.isNewAccount ? (this.$t('message.signUp.autoCreatedAccount') || 'Account created automatically') : (this.$t('message.signUp.linkedExistingAccountsDescription') || 'Linked to your existing account')
    }
  },
  methods: {
    loadHomeData,
    getWarehouseRelatedInfo,
    getStoreDetail,
    startSyncProducts,
    createOrAddProvider,
    async run() {
      try {
        await this.ensureAccount()
        if (this.passwordModalVisible) {
          await new Promise(resolve => { this.$once('password-confirmed', resolve) })
        }
        this.active = 1
      } catch (e) {
        this.errorMsg = this.pickEnglishMsg(e) || 'Operation failed'
        return
      }
      try {
        await this.autoAssociateAllWarehouses()
        this.active = 2
      } catch (e) {
        // 即使关联失败，也继续尝试启动同步，确保用户可进入系统
        console.error('autoAssociateAllWarehouses error:', e)
        this.active = 2
      }
      try {
        await this.autoStartSync()
        this.active = 3
        setTimeout(() => {
          this.$router.push({ path: this.config.dropShipper.homePath })
        }, 600)
      } catch (e) {
        console.error('startSync error:', e)
        // 进入首页，由用户稍后手动触发也可
        this.$router.push({ path: this.config.dropShipper.homePath })
      }
    },
    async ensureAccount() {
      // Always call backend to ensure link or create using current query params
      const { host, hmac, timestamp, session, shop } = this.$route.query
      this.shopUrl = shop || this.shopUrl
      const payload = { host, hmac, timestamp, session, shop }
      // Clean undefined keys
      Object.keys(payload).forEach(k => (payload[k] === undefined || payload[k] === '') && delete payload[k])
      const res = await this.$ajax({
        url: '/api-prefix/auth/third-part-create-account/',
        method: 'post',
        data: payload
      })
      if (!this.$isRequestSuccessful(res.code)) {
        const english = this.pickEnglishMsg(res) || 'Create/link account failed'
        this.errorMsg = english
        // If account already exists, continue onboarding without throwing
        if (res && Number(res.code) === 3001) {
          this.isNewAccount = false
          return
        }
        throw new Error(english)
      }
      const { username, password, email, access, shop_url } = res.data || {}
      // If backend indicates duplicate username, treat as existing account and skip password modal
      const duplicateFlagRaw = res?.data?.duplicate_username
      const duplicateUsername = duplicateFlagRaw === true || String(duplicateFlagRaw).toLowerCase() === 'true'
      if (access) {
        localStorage.setItem(this.config.dropShipper.accessToken, access)
        localStorage.setItem(this.config.dropShipper.userName, username)
        localStorage.setItem(this.config.dropShipper.userRole, 'Drop shipper')
      }
      if (shop_url) this.shopUrl = shop_url
      if (password && !duplicateUsername) {
        this.isNewAccount = true
        this.generatedUsername = username || ''
        this.generatedPassword = password
        this.passwordModalVisible = true
      } else {
        this.isNewAccount = false
      }
    },
    pickEnglishMsg(obj) {
      // Accept either response object or error object
      try {
        if (!obj) return ''
        const msg = obj.msg || obj?.response?.data?.msg || obj?.data?.msg
        if (!msg) return (obj.message && typeof obj.message === 'string') ? obj.message : ''
        if (typeof msg === 'string') return msg
        if (msg.en_us) return msg.en_us
        return ''
      } catch (_) { return '' }
    },
    async autoAssociateAllWarehouses() {
      // Build provider list from top providers and existing relations
      let providers = []
      try {
        const home = await this.loadHomeData()
        providers = (home && home.top_providers) || []
      } catch (e) {
        providers = []
      }
      try {
        const related = await this.getWarehouseRelatedInfo()
        if (Array.isArray(related)) {
          const mapped = related.map(it => ({ name_of_provider: it.name, uuid: it.provider_uuid }))
          providers = [...mapped, ...providers]
        }
      } catch (e) { /* ignore */ }
      // De-duplicate by name
      const mapByName = new Map()
      providers.forEach(p => {
        if (!p) return
        const key = p.name_of_provider || p.name || p.provider_name
        if (key && !mapByName.has(key)) mapByName.set(key, p)
      })
      const uniqueProviders = Array.from(mapByName.values())
      for (const p of uniqueProviders) {
        const name = p.name_of_provider || p.name || p.provider_name
        if (!name) continue
        const detailRes = await this.getStoreDetail(name)
        const provider_uuid = detailRes?.data?.[0]?.provider_uuid
        if (!provider_uuid) continue
        // Fetch storage definitions and existing relations
        const defs = await this.getStorageDefinitionList(provider_uuid)
        const exist = await this.getAssociatedStorageList(provider_uuid)
        const existIds = Array.isArray(exist) ? exist.map(i => i.storage_uuid) : []
        const leafs = this.flattenLeafStorages(defs)
        const toAdd = leafs.filter(r => !existIds.includes(r.storage_define_uuid))
        if (!toAdd.length) continue
        const storages = toAdd.map(item => ({
          storage_uuid: item.storage_define_uuid,
          ava_number: parseInt(item.ava_inventory || 0),
          name: `${name} (${item.name})`
        }))
        try {
          // Ensure provider created/linked for DS
          await this.createOrAddProvider({ uuid_of_provider: provider_uuid })
        } catch (e) { /* ignore duplicate */ }
        await this.dsAddStorageAndReflashStorageList({ storages, provider_uuid })
      }
    },
    flattenLeafStorages(list = []) {
      const out = []
      const walk = (arr) => {
        if (!Array.isArray(arr)) return
        for (const it of arr) {
          if (it.children && it.children.length) {
            walk(it.children)
          } else {
            out.push(it)
          }
        }
      }
      walk(list)
      return out
    },
    async autoStartSync() {
      if (!this.shopUrl) return
      await this.startSyncProducts({ shop_url: this.shopUrl })
    },
    async copyPassword() {
      try {
        const u = this.generatedUsername || ''
        const p = this.generatedPassword || ''
        const text = `username:${u}\npassword:${p}`
        await navigator.clipboard.writeText(text)
        this.copied = true
        setTimeout(() => (this.copied = false), 1200)
      } catch (e) {
        this.$message.warning(this.$t('common.copyFailed') || 'Copy failed')
      }
    },
    onPasswordConfirm() {
      this.passwordModalVisible = false
      this.$emit('password-confirmed')
    },
    onPasswordBeforeClose(done) {
      this.passwordModalVisible = false
      this.$emit('password-confirmed')
      if (typeof done === 'function') done()
    }
  },
  mounted() {
    this.run()
  }
}
</script>

<style scoped lang="scss">
.top-hint {
  position: fixed;
  top: 6px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 3500;
  font-size: 16px;
}
 
.top-hint .flicker {
  animation: blinkGlow 1.6s ease-in-out infinite;
}

.panel {
  width: 720px;
  margin: 8px auto;
  padding: 18px 18px 8px 18px;
  border-radius: 10px;
  background: #0f0f12;
  /* soft glow using logo palette */
  box-shadow:
    0 10px 26px rgba(255, 215, 0, 0.14),
    0 6px 14px rgba(255, 69, 0, 0.10),
    0 0 18px rgba(166, 124, 82, 0.10);
}

.panel-title {
  text-align: center;
  font-size: 18px;
  margin-bottom: 6px;
}

.gradient-text {
  background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
  background-clip: text; /* standard */
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.gradient-steps {
  margin: 6px 10px 12px 10px;
}

::v-deep .gradient-steps .el-step__title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

/* Gradient theming for Element Steps */
::v-deep .gradient-steps .el-step__head.is-process .el-step__icon,
::v-deep .gradient-steps .el-step__head.is-finish .el-step__icon {
  background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
  border: none;
  color: #111;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.25), 0 0 18px rgba(255, 100, 0, 0.35);
}

/* Loading effect for current step */
@keyframes spinRing {
  to {
    transform: rotate(360deg);
  }
}

::v-deep .gradient-steps .el-step__head.is-process .el-step__icon {
  position: relative;
}

::v-deep .gradient-steps .el-step__head.is-process .el-step__icon::after {
  content: '';
  position: absolute;
  left: -5px;
  top: -5px;
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #FFD700;
  border-right-color: #FF8C00;
  animation: spinRing 1s linear infinite;
}

::v-deep .gradient-steps .el-step__title.is-process,
::v-deep .gradient-steps .el-step__title.is-finish {
  background: linear-gradient(90deg, #FFD700, #FF8C00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

::v-deep .gradient-steps .el-step__line {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.45), rgba(255, 69, 0, 0.45));
}

.status-area {
  text-align: center;
  margin: 8px 0 4px 0;
}

.pwd-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.pwd-desc {
  font-size: 13px;
  margin-bottom: 12px;
  background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
  background-clip: text; /* standard */
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: blinkGlow 1.1s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5), 0 0 16px rgba(255, 140, 0, 0.35);
}

.creds-lines {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 10px;
  color: #ddd;
}
.creds-lines .line { line-height: 1.6; }
.creds-lines .k { color: #bfbfbf; margin-right: 6px; }
.creds-lines .v { color: #f0f0f0; }

.pwd-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Center the eye icon vertically while keeping x unchanged */
.pwd-row :deep(.el-input__suffix) {
  display: flex;
  align-items: center;
}

.pwd-row .copy-btn {
  padding: 0 16px;
  height: 40px;
  font-size: 16px;
}

::v-deep .action-icon {
  cursor: pointer;
  color: #909399;
  font-size: 20px;
}

::v-deep .action-icon:hover {
  color: var(--custom-color-primary, #409EFF);
}

/* Light overlay for nested modal */
::v-deep .light-modal {
  background: rgba(0, 0, 0, 0.25) !important;
  backdrop-filter: blur(2px);
}

@keyframes blinkGlow {
  0% { opacity: 0.5; text-shadow: 0 0 20px rgba(255, 215, 0, 0.85), 0 0 32px rgba(255, 140, 0, 0.65); }
  50% { opacity: 1; text-shadow: 0 0 6px rgba(255, 215, 0, 0.25), 0 0 10px rgba(255, 140, 0, 0.25); }
  100% { opacity: 0.5; text-shadow: 0 0 20px rgba(255, 215, 0, 0.85), 0 0 32px rgba(255, 140, 0, 0.65); }
}
</style>
