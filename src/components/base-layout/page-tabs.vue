<!--
* @Description: layout tab页签切换
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div>
    <!-- TODO: 修改为面包屑形式 -->
    <el-tabs
      v-model="editableTabsValue"
      @tab-remove="removeTab"
      @tab-click="onClickTab"
    >
      <el-tab-pane
        :key="item.name"
        :name="item.name"
        v-for="item in visitedViews"
        :label="$t(item.title)"
        :closable="item.name !== 'p-home' && item.name !== 'ds-home'"
      >
      </el-tab-pane>
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </el-tabs>
  </div>
</template>
<script>
import { dropShipper, provider } from '@/common/commonconfig'
export default {
  props: {},
  components: {},
  data () {
    return {
      editableTabsValue: null,
      editableTabs: []
    }
  },
  // 当路由改变的时候重新初始化
  watch: {
    $route () {
      this.initTabs()
      this.addTags()
    }
  },
  computed: {
    // ...mapGetters(['visitedViews', 'cachedViews']),
    cachedViews () {
      if (this.config.pRoleList.includes(this.roleType)) {
        return this.$store.state.tagsView.pCachedViews
      } else if (this.roleType === dropShipper) {
        return this.$store.state.tagsView.dsCachedViews
      }
    },
    visitedViews () {
      if (this.config.pRoleList.includes(this.roleType)) {
        return this.$store.state.tagsView.pVisitedViews
      } else if (this.roleType === dropShipper) {
        return this.$store.state.tagsView.dsVisitedViews
      }
    }
  },
  mounted () {
    this.initTabs()
    this.addTags()
  },
  methods: {
    // 初始化tabs
    initTabs () {
      const tabsName = this.config[this.roleType].homePathName
      const tabsPath = this.config[this.roleType].homePath
      const tabs = {
        name: tabsName,
        title: 'navigate.home',
        path: tabsPath,
        roleType: this.roleType
      }
      // this.$store.dispatch('tagsView/addVisitedView', tabs)
      this.$store.dispatch('tagsView/addPDSVisitedView', tabs)
      this.editableTabsValue = tabs.name
    },
    // 添加tabs 用于实现刷新页面时，保留当前页面
    addTags () {
      const tabs = {
        title: this.$route.meta.title,
        name: this.$route.name,
        path: this.$route.path,
        roleType: this.roleType
      }
      if (
        tabs.name &&
        tabs.name !== this.config[this.roleType].keyInformationPath
      ) {
        // this.$store.dispatch('tagsView/addView', tabs)
        this.$store.dispatch('tagsView/addPDSView', tabs)
        this.editableTabsValue = tabs.name
      }
    },
    removeTab (targetName) {
      const tabs = this.visitedViews.filter((el) => el.name === targetName)
      if (tabs && tabs.length !== 0) {
        // this.$store.dispatch('tagsView/delView', tabs[0])
        this.$store.dispatch('tagsView/delPDSView', tabs[0])
        this.$router.push(
          this.visitedViews[this.visitedViews.length - 1].path,
          () => { }
        )
      }
      this.editableTabsValue =
        this.visitedViews[this.visitedViews.length - 1].name
    },
    onClickTab () {
      const arr = this.visitedViews.filter((el) => {
        return el.name === this.editableTabsValue
      })
      if (arr && arr.length !== 0) {
        this.$router.push(arr[0].path, () => { })
      }
    },
    getCurrentTab (arr) {
      const path = this.$route.path
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].path === path) {
          return arr[i]
        } else if (arr[i].children) {
          const result = this.getCurrentTab(arr[i].children)
          if (result) {
            return result
          }
        }
      }
      return null
    }
  }
}
</script>
