<template>
  <el-switch
    class="tableScopeSwitch"
    v-model="currentTheme"
    ref="switchButton"
    style="margin: 0px 10px"
    @change="themeChange"
  >
  </el-switch>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      currentTheme: true, // true for white, false for black
      themesName: 'defaultTheme'
    }
  },
  computed: {
    ...mapGetters(['theme'])
  },
  watch: {
    theme (val) {
      const theme = val == 'defaultTheme' ? true : false
      this.currentTheme = theme
      this.themeChange(theme)
    }
  },
  methods: {
    themeChange (val) {
      this.themesName = val ? 'defaultTheme' : 'darkTheme';

      // window.document.documentElement.setAttribute(
      //   'data-theme',
      //   this.themesName
      // );
      document.documentElement.classList.remove(
        this.themesName === 'defaultTheme' ? 'darkTheme' : 'defaultTheme'
      );
      document.documentElement.classList.add(this.themesName);
      // 获取按钮的坐标
      const switchButton = this.$refs.switchButton.$el; // 确保正确访问 Element UI 组件内的根 DOM 元素
      const rect = switchButton.getBoundingClientRect();
      const clientX = rect.left + rect.width / 2; // 按钮中心点 X 坐标
      const clientY = rect.top + rect.height / 2; // 按钮中心点 Y 坐标

      const radius = Math.hypot(
        Math.max(clientX, innerWidth - clientX),
        Math.max(clientY, innerHeight - clientY)
      );
      const clipPath = [
        `circle(0% at ${clientX}px ${clientY}px)`,
        `circle(${radius}px at ${clientX}px ${clientY}px)`
      ]
      const isDark = this.themesName === 'darkTheme'
      // 圆形动画扩散开始
      document.documentElement.animate(
        {
          // clipPath: isDark ? clipPath.reverse() : clipPath,
          clipPath: clipPath,
        },
        {
          duration: 500,
          // pseudoElement: isDark ? "::view-transition-old(root)" : "::view-transition-new(root)",
        }
      )
      this.$emit('change', this.themesName);
    }

  },
  mounted () {
    const storedTheme = localStorage.getItem('theme') == 'defaultTheme' ? true : false
    this.currentTheme = storedTheme
    this.themeChange(storedTheme)
  }
}
</script>
<style lang="scss" scoped>
// ::v-deep .el-switch__core {
//   width: 80;
//   height: 24px;
// }
::v-deep .el-switch__core:after {
  background-image: var(--cusom-switch-background-svg);
  background-color: transparent; /* 去掉背景色 */
  background-size: cover;
  width: 16px;
  height: 16px;
}
</style>