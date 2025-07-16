import { getCookie } from '@/common/common-func'
import enLang from 'element-ui/lib/locale/lang/en'
import zhCnLang from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
export function getLanguage () {
  // const localLanguage = getCookie('language_type') || 'en_us' zh_cn
  let localLanguage = 'zh_cn'
  try {
    localLanguage = getCookie('language_type')
    if (!localLanguage) {
      locale.use(zhCnLang)
      return 'zh_cn'
    }

  } catch (e) {
    locale.use(zhCnLang)
    return 'zh_cn'
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