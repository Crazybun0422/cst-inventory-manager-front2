import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh_cn from '@/assets/i18/zh'
import en_us from '@/assets/i18/en'
import { getLanguage } from '@/common/language'
// 配置中英文全局变量
Vue.prototype.$languageType = getLanguage()
// 配置中英文
Vue.use(VueI18n)
export default new VueI18n({
  locale: getLanguage(),
  messages: {
    en_us: en_us,
    zh_cn: zh_cn
  }
})