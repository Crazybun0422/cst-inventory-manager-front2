// 防抖
const debounce = (fn, delay = 500) => {
  let timer
  return function (...args) {
    const ctx = this
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(ctx, args)
    }, delay)
  }
}

// 节流
const throttle = (fn, delay = 500) => {
  let flag = true
  return function (...args) {
    if (!flag) return
    const ctx = this
    flag = false
    setTimeout(() => {
      fn.apply(ctx, args)
      flag = true
    }, delay)
  }
}

// 深度克隆
const deepClone = val => {
  const isArr = Array.isArray(val)
  const isJson = Object.prototype.toString.call(val) === '[object Object]'
  if (isArr) {
    // 克隆数组
    const newObj = []
    for (let i = 0; i < val.length; i++) {
      newObj[i] = deepClone(val[i])
    }
    return newObj
  } else if (isJson) {
    // 克隆Object
    const newObj = {}
    for (const i in val) {
      newObj[i] = deepClone(val[i])
    }
    return newObj
  }
  // 不是引用类型直接返回
  return val
}

// UUID
const uuid = () => {
  let date = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (date + Math.random() * 16) % 16 | 0
    date = Math.floor(date / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

export default {
  debounce,
  throttle,
  deepClone,
  uuid
}
