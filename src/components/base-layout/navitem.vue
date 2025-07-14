<!--
* @Description: 导航组件
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div v-if="item.condition === undefined || item.condition">
    <!-- 父级菜单项 -->
    <el-menu-item v-if="!item.children" :index="item.path" @click.native="addTabs(item)">
      <i :class="item.icon"></i>
      <span slot="title">{{ $t(item.title) }}</span>
    </el-menu-item>

    <!-- 父级子菜单 -->
    <el-submenu v-else :index="item.path">
      <template slot="title">
        <i :class="item.icon"></i>
        <span slot="title">{{ $t(item.title) }}</span>
      </template>
      <!-- 递归渲染子菜单 -->
      <NavItem v-for="subNav in item.children" :key="subNav.path" :item="subNav" @click.native="handleClick(subNav)" />
    </el-submenu>
  </div>
</template>


<script>
export default {
  name: 'NavItem',
  props: ['item', 'handleNavItemClick'],
  components: {},
  data() {
    return {
      currentName: ''
    }
  },
  watch: {},
  computed: {},
  created() { },
  methods: {
    // 导航切换
    handleSelect(key, keyPath) {
    },
    addTabs(child) {
      // this.$store.dispatch('tagsView/addView', child)

      console.log("here1...")
      this.$store.dispatch('tagsView/addPDSView', child)
    },
    // 处理点击事件
    handleClick(item) {

      // 调用父组件传递的 handleNavItemClick 方法
      if (this.handleNavItemClick) {
        if (!item.children) {

          return
        }
        console.log("here2...")
        this.handleNavItemClick(item); // 执行父组件的逻辑
      }
    }
  }
}
</script>
<style scoped lang="scss">
.select-shop {
  padding: 10px;
}
</style>
