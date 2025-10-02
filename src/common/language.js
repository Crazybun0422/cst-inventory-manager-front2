import { getCookie } from '@/common/common-func'
import enLang from 'element-ui/lib/locale/lang/en'
import zhCnLang from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
export function getLanguage () {
  // Default to English if no cookie
  let localLanguage = 'en_us'
  try {
    const cookieLang = getCookie('language_type')
    if (!cookieLang) {
      locale.use(enLang)
      return 'en_us'
    }
    localLanguage = cookieLang
  } catch (e) {
    locale.use(enLang)
    return 'en_us'
  }
  if (localLanguage === 'zh_cn') {
    locale.use(zhCnLang)
  } else {
    locale.use(enLang)
  }
  return localLanguage
}

export function setLanguge (lan) {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    document.cookie = `language_type=${lan}; expires=${expiryDate.toUTCString()}; path=/`;
  } catch (e) {
  }
}
