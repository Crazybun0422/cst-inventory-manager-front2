<!--
* @description  基本框架
* @fileName  base-layout
* @author tj
* @date 2023-05-28 18:31:36
!-->
<template>
  <el-container
    class="base-layout"
    v-loading="containerLoading"
    element-loading-background="rgba(255, 255, 255, 0.6)"
  >
    <el-aside
      class="el-aside-transition"
      :width="isCollapse ? '78px' : collapseWidth"
    >
      <div class="sidebar-scroll-area">
        <Navigate
          @loading="(loading) => (containerLoading = loading)"
          @toggle-collapse="toggleExpand"
          :isCollapse="isCollapse"
        >
        </Navigate>
      </div>
    </el-aside>

    <el-container class="container-main">
      <el-header class="layout-header">
        <HomeHeader></HomeHeader>
      </el-header>
      <el-main>
        <PageTabs v-if="!containerLoading"></PageTabs>
      </el-main>
    </el-container>
    <!-- <el-footer class="layout-footer">Footer</el-footer> -->
  </el-container>
</template>

<script>
import HomeHeader from '@/components/home-header.vue'
import Navigate from '@/components/base-layout/navigate.vue'
import PageTabs from '@/components/base-layout/page-tabs.vue'
export default {
  name: 'base-layout',
  components: {
    HomeHeader,
    PageTabs,
    Navigate
  },
  data () {
    return {
      containerLoading: false,
      isCollapse: false,
      collapseWidth: '270px'
    }
  },
  methods: {
    toggleExpand () {
      this.isCollapse = !this.isCollapse;

    },
  },
  computed: {

  },
  watch: {
    $languageType (newVal) {
      this.collapseWidth = newVal === 'zh_cn' ? '220px' : '270px'
    }
  },
  mounted () {
  }
}
</script>
<style scoped lang="scss">
.el-aside-transition {
  transition: width 0.4s ease-in-out; /* 定义宽度变化的动画时间和效果 */
}
.base-layout {
  width: 100%;
  height: 100vh;
  color: #333;
  .layout-header {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0;
  }
  .container-main {
    padding: 0px 0px;
    // background-color: #f7fafc;
    min-height: calc(100vh - 120px);
    border-radius: 12px;
    overflow: hidden; /* Ensure inner content (tabs/pages/backgrounds) clip to rounded corners */
  }
  .layout-footer {
    border-top: 1px solid #ebebeb;
    padding: 0 20px;
  }
}
</style>
