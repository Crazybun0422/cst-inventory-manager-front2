<template>
  <div>
    <el-select :placeholder="$t('message.myAccount.country')" filterable clearable :value="value" :disabled="disabled"
      @change="handleChange">
      <el-option v-for="(item, index) in countries" :key="index" :label="item.country[language]"
        :value="item.abbreviation">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import countries from '@/common/country-by-abbreviation.json';
import i18n from "@/common/vuei18n"

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    language() {
      // 通过内部 vm 的 data.locale 建立响应式依赖
      return this.$i18n.locale || 'en_us';
    }
  },
  data() {
    return {
      countries, // 从JSON文件加载的国家列表
      selectedCountry: '' // 选中的国家缩写
    };
  },
  methods: {
    handleChange(newValue) {
      this.$emit('input', newValue);
    }
  }
};
</script>
