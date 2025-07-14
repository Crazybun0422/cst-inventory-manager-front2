<!--
* @Description: 表格头组件
* @Author: tj
* @FileName index.vue
* @Date: 2023年05月17日 11:40:00
* @LastEditors: tj
* @LastEditTime: 2023年05月17日 11:40:00
-->
<template>
  <div class="cst-table-head">
    <div class="table-head-content">
      <div
        class="flex-class mb-14"
        v-if="$slots['top-left'] || $slots['top-right']"
      >
        <div class="flex1">
          <slot name="top-left"></slot>
        </div>
        <div
          class="flex1 table-head-align-right"
          style="display: flex; flex-direction: row; align-items: center"
        >
          <transition name="fade">
            <div v-show="expanded">
              <slot name="top-right"></slot>
            </div>
          </transition>
          <div v-if="$slots['top-right']">
            <i
              @click="toggleExpand"
              style="margin-left: 10px; font-size: 22px"
              :class="expanded ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
            ></i>
          </div>
        </div>
      </div>
      <div class="flex-class">
        <div class="flex1">
          <slot name="bottom-left"></slot>
        </div>
        <div class="flex2 table-head-align-right">
          <slot name="bottom-right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      expanded: true
    };
  },
  props: {
    count: {
      type: Number,
      default: 0
    },
    clear: {
      type: Boolean,
      default: true
    },
    filter: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleExpand () {
      this.expanded = !this.expanded;
    },
    handleClearClick () {
      emit('clear')
    }
  }
}
</script>

<style lang="scss" scoped>
.cst-table-head {
  width: 100%;
  background-color: var(--custom-background-color);
  // border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  .table-head-content {
    padding: 16px 20px;
    border-radius: 3px 3px 0 0;
  }
  .flex-class {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  // .flex1 {
  //   flex: 1;
  // }
  // .flex2 {
  //   flex: 1;
  // }
}
.table-head-align-right {
  text-align: right;
}
.clear-class {
  border-radius: 4px;
  padding: 2px 4px;
  background: rgba(0, 128, 255, 0.1);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
