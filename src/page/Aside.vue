<template>
  <aside class="sidebar">
    <nav class="nav-menu">
      <router-link 
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        active-class="active"
      >
        <div class="item-content">
          <span class="icon">{{ item.icon }}</span>
          <span class="title">{{ item.title }}</span>
        </div>
        <div class="active-indicator"></div>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  --primary-color: #3A86FF; 
  --bg-color: linear-gradient(195deg, #F8FBFF 0%, #EBF2FF 100%); 
  --text-color: #2D3748; 
  --hover-bg: rgba(58, 134, 255, 0.1);
  
  width: 200px;
  height: 1;
  background: var(--bg-color);
  box-shadow: 6px 0 24px rgba(0, 0, 0, 0.08);
  padding: 32px 16px;
  position: relative;
  overflow: hidden;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  position: relative;
  display: block;
  padding: 18px 24px;
  border-radius: 14px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
}

.menu-item:hover {
  background: var(--hover-bg);
  transform: translateX(8px);
  box-shadow: 2px 4px 12px rgba(58, 134, 255, 0.1);
}

.active {
  background: var(--hover-bg);
  color: var(--primary-color);
  font-weight: 600;
}

.active .icon {
  color: var(--primary-color);
  transform: scale(1.1);
}

.item-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon {
  font-size: 1.5rem; 
  transition: all 0.3s ease;
}

.title {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.active-indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 60%;
  width: 3px;
  background: var(--primary-color);
  border-radius: 2px 0 0 2px;
  opacity: 0;
  transition: all 0.3s ease;
}

.active .active-indicator {
  opacity: 1;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
    padding: 24px 8px;
  }
  
  .title {
    display: none;
  }
  
  .menu-item {
    padding: 18px;
    justify-content: center;
  }
  
  .icon {
    font-size: 1.8rem;
  }
}
</style>

<script>
export default {
  data() {
    return {
      menuItems: [
        { path: '/', icon: '📚', title: '帖子总览' },
        { path: '/keymanage', icon: '🔐', title: '邀请码管理' },
        { path: '/feedback', icon: '💡', title: '反馈建议' },
        { path: '/c', icon: '⛔', title: '禁言管理' }
      ]
    }
  }
}
</script>