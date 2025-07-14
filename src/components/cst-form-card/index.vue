<!--
* @Description:
* @Author: tj
* @Date: 2022
* @LastEditors: tj
* @LastEditTime: 2022
-->
<template>
  <div class="cst-form-card">
    <div
      class="form-card-head"
      v-if="title || $slots.head || $slots['head-left'] || $slots['head-right']"
    >
      <slot name="head">
        <div class="card-head-wrap">
          <div class="col head-left">
            <slot name="head-left">
              <div class="title">{{ title }}</div>
            </slot>
          </div>
          <div class="col head-right">
            <slot name="head-right"></slot>
          </div>
        </div>
      </slot>
    </div>
    <div class="form-card-body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'cst-form-card',
  props: {
    title: { type: String, default: '' }
  }
}
</script>
<style scoped lang="scss">
.cst-form-card {
  background-color: var(--custom-background-color7);
  border-radius: 8px;
  padding: 8px;
  .form-card-head {
    /* color: $--color-primary; */
    border-bottom: 0;
    padding: 12px 10px;
    border-bottom: 1px solid #bbb;
    .title {
      font-weight: 600;
    }
    .head-right {
      text-align: right;
    }
  }
  .card-head-wrap {
    display: flex;
    align-items: center;
    .col {
      flex: 1;
    }
  }
  .form-card-body {
    padding: 12px 10px;
  }
}
</style>
