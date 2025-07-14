/**
 * @file 表格mixin
 * @date 2024/03/17
 */

// 组件

// mixins

// 函数

// 常量
import { DIRECTION } from '@/common/field-maping'

export default {
  components: {},
  props: {},
  data() {
    return {
      multipleSection: [], // 表格多选的数据
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页显示个数
      hasPrevPage: false, // 是否禁用上一页
      hasNextPage: true, // 是否禁用下一页
      direction: '', // before上一页、after下一页
    }
  },
  computed: {},
  methods: {
    $_tableMixin_getTable(table = 'table') {
      return this.$refs[table] || {}
    },

    // 获取批量勾选的数据
    $_tableMixin_handleSectionChange(val) {
      this.multipleSection = val
    },

    // 上一页
    $_tableMixin_prevChange() {
      this.direction = DIRECTION.before
      this.getTableData?.()
    },

    // 下一页
    $_tableMixin_nextChange() {
      this.direction = DIRECTION.after
      this.getTableData?.()
    },

    // 切换size
    $_tableMixin_sizeChange(pageSize) {
      this.pageSize = pageSize
      this.getTableData()
    },
  }
}