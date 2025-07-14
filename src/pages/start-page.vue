<!--
* @description  参数1
* @fileName  start-page
* @author wjp
* @date 2023-05-27 20:53:28
!-->
<template>
  <div class="first-login-page">
    <img src="@/assets/logo-no-background.svg" alt />
    <el-button type="primary" round @click="jumpLogin" class="start-button">
      <span>Go Start</span>
    </el-button>
    <!-- <a href="#" class="start-button">11111</a> -->
  </div>
</template>

<script>
export default {
  name: 'start-page',
  data() {
    return {}
  },
  methods: {
    jumpLogin() {
      this.$router.push({ name: 'ds-login' })
    }
  }
}
</script>
<style scoped lang="scss">
.start-button {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: none;
  width: 200px;
  height: 40px;
  font-size: 20px;
  text-decoration: none;
  box-sizing: border-box;
  color: #fff;
  background: linear-gradient(90deg, #f9cc0b, #ee6409, #f34d42, #f9cc0b);
  background-size: 400%;
  animation: animate 8s linear infinite;
}
// .start-button:hover {
//   animation: animate 8s linear infinite;
// }
.start-button::before {
  content: '';
  position: absolute;
  inset: -15px;
  z-index: -12;
  background: linear-gradient(90deg, #f9cc0b, #ee6409, #f34d42, #f9cc0b);
  background-size: 400%;
  border-radius: 60px;
  opacity: 0.3;
  filter: blur(10px);
  animation: animate 8s linear infinite;
}
// .start-button:hover::before {
//   filter: blur(20px);
//   opacity: 1;
//   animation: animation 8s linear infinite;
// }
@keyframes animate {
  from {
    background-position: 0%;
  }
  to {
    background-position: 400%;
  }
}
.first-login-page {
  text-align: center; /* 水平居中文本内容 */
  display: flex;
  flex-direction: column; /* 垂直居中元素 */
  align-items: center; /* 水平居中元素 */
  justify-content: center; /* 垂直居中元素 */
  height: 100vh; /* 使父元素占据整个视口高度 */
  background-image: url(@/assets/ct.jpg);
  // background-color: #fff;
  // background: linear-gradient(90deg, #409eff, #f441a5, #ffeb3b, #409eff);
  // background-size: 400%;
  // animation: gradient-move 8s linear infinite;
}
@keyframes gradient-move {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.first-login-page img {
  width: 500px;
  margin-bottom: 40px;
}
</style>
