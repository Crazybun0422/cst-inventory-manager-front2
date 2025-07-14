/**
 * @file 表单mixin
 * @date 2024/03/17
 */

// 组件

// mixins

// 函数
import cloneDeep from 'lodash/cloneDeep'

// 常量

export default {
  components: {},
  props: {
    // formData字段与submitData字段一致时传入可快捷回填，否则推荐传rowData，手动实现回填逻辑
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      submitData: {}
    }
  },
  computed: {},
  watch: {
    formData: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (Object.keys(newVal).length) {

          // 回填表单
          this.submitData = { ...this.submitData, ...cloneDeep(newVal) }
        }
      }
    }
  },
  methods: {
    $_formMixin_getForm(form = 'form') {
      return this.$refs[form] || {}
    },

    // 校验表单
    $_formMixin_isValid(form = 'form') {
      let formRef = this.$_formMixin_getForm(form)

      if(!formRef) {
        return false
      }

      return formRef?.validate().then(_ => {
        return true
      }).catch(_ => {
        return false
      })
    },

    // 清空表单
    $_formMixin_resetFields(form = 'form') {
      this.$_formMixin_getForm(form)?.resetFields?.()
    },
  }
}