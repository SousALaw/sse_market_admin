<template>
  <div class="aside-container">
    <ul class="menu">
      <li class="menu-item">
        <router-link to="/" active-class="active">帖子总览</router-link>
      </li>
      <li class="menu-item">
        <router-link to="/keymanage" active-class="active">邀请码管理</router-link>
      </li>
      <li class="menu-item">
        <router-link to="/feedback" active-class="active">反馈建议</router-link>
      </li>
      <li class="menu-item">
        <router-link to="/c" active-class="active">禁言管理</router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>

.menu {
  list-style: none;
  padding: 0;
}

.menu-item {
  padding: 10px;
  margin: 5px 0;
  /* 添加上下外边距，使选项之间有间隔 */
}

.menu-item a {
  color: #333;
  /* 默认文字颜色为黑色 */
  text-decoration: none;
  display: block;
  text-align: center;
  /* 文字居中 */
  padding: 10px;
  /* 内边距 */
  background-color: #b4d5f5;
  border-radius: 4px;
  transition: all 0.3s ease;
  /* 添加过渡效果 */
}

.menu-item a:hover {
  color: white;
  /* 鼠标悬停时文字变为白色 */
  background-color: #409EFF;
  /* 鼠标悬停时背景变为深蓝色 */
}

.menu-item a.active {
  color: white;
  /* 选中时文字变为白色 */
  background-color: #409EFF;
  /* 选中时背景变为深蓝色 */
}
</style>