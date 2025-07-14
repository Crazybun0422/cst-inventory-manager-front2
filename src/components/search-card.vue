<!--
* @Description: 搜索卡片
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <el-card class="box-card" shadow="never">
    <slot></slot>
  </el-card>
</template>
<script>
export default {}
</script>
<style lang='scss' scoped>
.box-card {
  margin-top: 10px;
  border-radius: 16px !important;
}

::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 4px;
}
</style>
