<template>
  <div>
    <el-select
      v-model="languageType"
      @change="changeLanguage"
      :disabled="disabled"
    >
      <el-option
        v-for="item in languageOptions"
        :key="item.value"
        :label="item.label[$languageType]"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { languageOptions } from '@/common/field-maping';

export default {
  name: 'LanguageSelect',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      languageOptions,
      languageType: ''
    }
  },
  computed: {
    defaultLanguage () {
      return this.$store.state.user.defaultLanguage
    },

  },
  methods: {
    changeLanguage (newValue) {
      this.languageType = newValue; // 触发 setter，更新 Vuex
      this.$store.dispatch('user/getDefaultLanguage', newValue)
      this.$i18n.locale = newValue;
      this.$forceUpdate()

    }
  },
  mounted () {
    this.languageType = this.defaultLanguage
  },
  watch: {
    defaultLanguage (newLang) {
      // 当 Vuex 中的 defaultLanguage 变化时，更新 languageType
      this.languageType = newLang;
    }
  },
}
</script>
