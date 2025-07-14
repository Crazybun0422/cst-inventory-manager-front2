import { getCookie } from '@/common/common-func'
import enLang from 'element-ui/lib/locale/lang/en'
import zhCnLang from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
export function getLanguage () {
  // const localLanguage = getCookie('language_type') || 'en_us' zh_cn
  let localLanguage = 'en_us'
  try {
    localLanguage = getCookie('language_type')
    if (!localLanguage) {
      locale.use(enLang)
      return 'en_us'
    }

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
    document.cookie = `language_type=${lan}; expires=${expiryDate.toUTCString()}; path=/`;  // 添加 SameSite=None; Secure   将会只允许https请求
  } catch (e) {
  }
}