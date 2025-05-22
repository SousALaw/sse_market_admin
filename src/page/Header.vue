<template>
  <div class="header-container">
    <div class="header-content">
      <h1>SSE_Market管理系统</h1>
    </div>
    <div class="user-info">
      <span>欢迎，秋</span>
      <button @click="password_change"class="ModifyPassword_button">修改密码</button>
      <span> </span>
      <button @click="logout" class="Exit_button">退出</button>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  /* 修改为两端对齐 */
  align-items: center;
  /* 垂直居中对齐 */
  padding: 0 20px;
  /* 添加内边距，防止文字贴边 */
  height: 60px;
  /* 设置固定高度 */
  background-color: #fff;
  /* 设置背景色 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  /* 添加阴影 */
}

/* .header-content { */
/* 标题样式 */
/* } */

.user-info {
  display: flex;
  align-items: center;
}

.user-info span {
  margin-right: 10px;
  /* 文字和按钮之间的间距 */
}
.ModifyPassword_button{
  padding: 5px 10px;
  /* 按钮内边距 */
  background-color: #ff5940;
  /* 按钮背景色 */
  color: white;
  /* 按钮文字颜色 */
  border: none;
  /* 去掉边框 */
  border-radius: 4px;
  /* 圆角 */
  cursor: pointer;
  /* 鼠标悬停样式 */
}
.Exit_button {
  padding: 5px 10px;
  /* 按钮内边距 */
  background-color: #409EFF;
  /* 按钮背景色 */
  color: white;
  /* 按钮文字颜色 */
  border: none;
  /* 去掉边框 */
  border-radius: 4px;
  /* 圆角 */
  cursor: pointer;
  /* 鼠标悬停样式 */
}

</style>

<script>
export default {
  methods: {
    logout() {
      // 退出登录逻辑
      localStorage.removeItem('email');
		  localStorage.removeItem('password');
      this.$router.push('/login');
    },
    password_change() {
      //密码修改
      this.$router.push('/passwordchange');
    }
  }
}
</script>