<template>
  <section class="edit-modal">
    <el-form :model="submitData" ref="form" label-position="left" label-width="110px" :rules="formRules"
      v-loading="modalLoading">
      <el-form-item :label="$t('message.userInfo.formLabelShopUrl')" prop="ewis_shop_url">
        <el-input v-model="submitData.ewis_shop_url" disabled></el-input>
      </el-form-item>

      <el-form-item :label="$t('message.userInfo.formLabelUserCode')" prop="ewis_user_code">
        <el-input v-model="submitData.ewis_user_code" disabled></el-input>
      </el-form-item>

      <el-form-item :label="$t('message.userInfo.formLabelUserName')" prop="ewis_user_name">
        <el-input v-model="submitData.ewis_user_name" disabled></el-input>
      </el-form-item>

      <el-form-item :label="$t('message.userInfo.formLabelTrackingUrl')" prop="tracking_url">
        <el-input v-model="submitData.tracking_url"></el-input>
      </el-form-item>

      <el-form-item :label="$t('message.userInfo.formLabelDelayFullfillTime')" prop="delay_secs">
        <el-select v-model="submitData.delay_secs" style="width: 100%">
          <el-option v-for="item in delaySecsOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('navigate.warehousing')">
        <el-select v-model="submitData.storage_uuid" filterable clearable style="width: 100%"
          :placeholder="$t('message.storage.warehouseSelect')">
          <el-option v-for="item in storageList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 替换原有的 target country 表单项 -->
      <el-form-item :label="$t('message.userInfo.formLabelTargetCountry')" prop="country">
        <div style="display: flex; align-items: center;">
          <!-- 复用已有的 SelectCountry 组件，用于选中当前国家 -->
          <SelectCountry v-model="currentSelectedCountry" style="width: 200px; margin-right: 10px;"></SelectCountry>
          <!-- 两个按钮分别添加到包含和排除列表 -->
          <el-button type="primary" @click="addCountry('include')">{{
            $t('message.userInfo.logisticInclude') }}</el-button>
          <el-button type="warning" @click="addCountry('exclude')" style="margin-left: 10px;">{{
            $t('message.userInfo.logisticExclude') }}</el-button>
        </div>
      </el-form-item>

      <el-form-item :label="$t('message.userInfo.logisticIncludeCountries')">
        <!-- 使用 Element UI 的 Tag 展示包含列表，支持关闭删除 -->
        <el-tag v-for="(country, index) in includeCountries" :key="country" closable
          @close="removeCountry('include', index)" style="margin-right: 5px;">
          {{ getCountryByAbbreviation(country) }}
        </el-tag>
      </el-form-item>

      <el-form-item :label="$t('message.userInfo.logisticExcludeCountries')">
        <!-- 使用 Element UI 的 Tag 展示排除列表 -->
        <el-tag v-for="(country, index) in excludeCountries" :key="country" closable
          @close="removeCountry('exclude', index)" style="margin-right: 5px;">
          {{ getCountryByAbbreviation(country) }}
        </el-tag>
      </el-form-item>

    </el-form>
  </section>
</template>

<script>
/**
 * @file 编辑用户信息弹窗
 * @date 2024/03/24
 */

// 组件
import PageHead from '@/components/page-head.vue'

// mixins
import formMixin from '@/common/form-mixin'
import storageMixin from '@/common/storage/storage-mixin'
// 函数
import pick from 'lodash/pick'
import { getUserInfo } from '@/common/common-func'
import SelectCountry from '@/pages/components/select-country.vue'
import { getCountryByAbbreviation } from '@/common/common-func'
// 常量

export default {
  name: 'edit-modal',
  components: {
    PageHead,
    SelectCountry
  },
  mixins: [formMixin, storageMixin],
  props: {
    shop_url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      submitData: {
        ewis_shop_url: '',
        ewis_user_code: '',
        ewis_user_name: '',
        tracking_url: '',
        delay_secs: '',
        storage_uuid: ''
      },
      currentSelectedCountry: '',
      modalLoading: true,
      delaySecsOptions: [
        {
          value: 0,
          label: this.$t('message.userInfo.nothing')
        },
        {
          value: 900,
          label: this.$t('message.userInfo.delay15Minutes')
        },
        {
          value: 1800,
          label: this.$t('message.userInfo.delay30Minutes')
        },
        {
          value: 3600,
          label: this.$t('message.userInfo.delay1Hour')
        },
        {
          value: 7200,
          label: this.$t('message.userInfo.delay2Hours')
        },
        {
          value: 10800,
          label: this.$t('message.userInfo.delay3Hours')
        },
        {
          value: 14400,
          label: this.$t('message.userInfo.delay4Hours')
        }
      ],
      formRules: {
        // 验证规则
        tracking_url: [
          {
            message: this.$t('message.common.trackingURlIsRequired'),
            trigger: 'change'
          }
        ]
      },
      storageList: [],
      // 新增：
      includeCountries: [],
      excludeCountries: []
    }
  },
  methods: {
    getUserInfo,
    getCountryByAbbreviation,
    getData() {
      return {
        ...pick(this.submitData, [
          'tracking_url',
          'delay_secs',
          'storage_uuid'
        ]),
        include_countries: this.includeCountries,
        exclude_countries: this.excludeCountries
      }
    },
    // 添加国家到对应列表的方法
    addCountry(listType) {
      const selectedCountry = this.currentSelectedCountry;
      if (!selectedCountry) {
        this.$message.error(this.$t('message.userInfo.pleaseSelectCountry'));
        return;
      }
      if (listType === 'include') {
        if (this.includeCountries.includes(selectedCountry)) {
          this.$message.error(this.$t('message.userInfo.countryAlreadyInInclude'));
          return;
        }
        if (this.excludeCountries.includes(selectedCountry)) {
          this.$message.error(this.$t('message.userInfo.countryAlreadyInExclude'));
          return;
        }
        this.includeCountries.push(selectedCountry);
      } else if (listType === 'exclude') {
        if (this.excludeCountries.includes(selectedCountry)) {
          this.$message.error(this.$t('message.userInfo.countryAlreadyInExclude'));
          return;
        }
        if (this.includeCountries.includes(selectedCountry)) {
          this.$message.error(this.$t('message.userInfo.countryAlreadyInInclude'));
          return;
        }
        this.excludeCountries.push(selectedCountry);
      }
    },

    // 删除列表中已添加的国家
    removeCountry(listType, index) {
      if (listType === 'include') {
        this.includeCountries.splice(index, 1);
      } else if (listType === 'exclude') {
        this.excludeCountries.splice(index, 1);
      }
    },

    async formatStorageList(provider_uuid) {
      const resData = await this.getAssociatedStorageList(provider_uuid)
      if (!Array.isArray(resData)) {
        return
      }
      this.storageList = resData.map((item) => ({
        label: item.name,
        value: item.storage_uuid
      }))
    }
  },
  computed: {},
  watch: {
    providerUuidBySelectStore: {
      handler(newValue) {
        this.formatStorageList(newValue)
      }
    }
  },
  async mounted() {
    await this.formatStorageList(this.providerUuidBySelectStore)
    this.getUserInfo({ shop_url: this.shop_url })
      .then((res) => {
        this.submitData = {
          ...this.submitData,
          ...res.data,
          tracking_url: res.data.ewis_tracking_url,
          delay_secs: res.data.ewis_delay_secs
        }
        // this.submitData = res.data
        // 新增：同步后端返回的物流国家数据
        this.includeCountries = res.data.include_countries || [];
        this.excludeCountries = res.data.exclude_countries || [];
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        this.modalLoading = false
      })
  }
}
</script>

<style scoped lang="scss"></style>
