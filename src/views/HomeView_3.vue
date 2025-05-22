<script setup lang="ts">
import Blackroom from '@/page/Blackroom.vue'
import Aside from '@/page/Aside.vue';
import Header from '@/page/Header.vue';
</script>

<template>
    <!-- 外层容器使用flex列布局 -->
    <div class="container">
      <Header />
      <!-- 内容区域包裹Aside和Main -->
      <div class="content-wrapper">
        <Aside />
        <Blackroom />
      </div>
    </div>
  </template>
  
  <style scoped>
  /* 基础重置确保无外边距影响布局 */
  html, body {
    margin: 0;
    height: 100%;
  }
  
  /* 外层容器样式 */
  .container {
    display: flex;
    flex-direction: column; /* 垂直排列 */
    min-height: 100vh; /* 至少占满整个视口高度 */
  }
  
  /* Header样式 */
  .header-container {
    /* 可根据需要添加高度，示例使用6rem */
    height: 6rem;
    background: #a8cdf0; /* 可选背景色 */
  }
  
  /* 内容区域容器 */
  .content-wrapper {
    justify-content: space-between;
    flex: 1; /* 填满剩余空间 */
    display: flex;
    width: 100%;
  }
  
  /* Aside侧边栏样式 */
  .aside-container {
    width: 15%; /* 宽度10% */
    min-width: 120px; /* 防止内容过窄 */
    background: #e8faff; /* 可选背景色 */
  }
  
  /* Main主体内容样式 */
  .main-container {
    flex: 0.97; /* 占据剩余宽度 */
    background: #e2edf3; /* 可选背景色 */
  }
  </style>
