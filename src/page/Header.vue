<template>
  <header class="header-container">
    <div class="brand-wrapper">
      <div class="logo-orb">
        <div class="inner-glow"></div>
      </div>
      <h1 class="system-title">SSE_Market<span class="admin-text">ADMIN</span></h1>
    </div>

    <div class="action-wrapper">
      <div class="user-card">
        <div class="avatar-container">
          <svg class="user-avatar" viewBox="0 0 36 36">
            <path fill="#409EFF" 
                  d="M18 3c-4.971 0-9 4.029-9 9 0 4.967 4.029 9 9 9 4.971 0 9-4.029 9-9s-4.029-9-9-9zm0 16.5c-5.247 0-9.5-4.253-9.5-9.5S12.753 0 18 0s9.5 4.253 9.5 9.5-4.253 9.5-9.5 9.5zM30 36v-3c0-3.315-2.685-6-6-6H12c-3.315 0-6 2.685-6 6v3h24z"/>
          </svg>
        </div>
        <div class="user-meta">
          <p class="welcome-text">Welcome back</p>
          <p class="username">秋</p>
        </div>
      </div>

      <div class="action-group">
        <button 
          @click="password_change"
          class="action-btn password-btn"
          aria-label="修改密码"
        >
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,2C9.243,2,7,4.243,7,7v3H6c-1.103,0-2,0.897-2,2v8c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2v-8c0-1.103-0.897-2-2-2h-1V7C17,4.243,14.757,2,12,2z M12,4c1.654,0,3,1.346,3,3v3H9V7C9,5.346,10.346,4,12,4z M6,12h12v8H6V12z M12,14c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2C13,14.448,12.552,14,12,14z"/>
          </svg>
        </button>

        <button 
          @click="logout"
          class="action-btn logout-btn"
          aria-label="退出登录"
        >
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M16 13v-2H7V8l-5 4 5 4v-3h9zm12-4l-5-4v3H9v2h10v3l5-4z"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  --primary-color: #409EFF;
  --accent-color: #66b3ff;
  --text-dark: #2c3e50;
  --text-light: #f8f9fa;
  --transition-speed: 0.3s;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2.5rem;
  height: 80px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  position: relative;
}

/* 品牌标识 */
.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.logo-orb {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), #66b3ff);
  position: relative;
  overflow: hidden;
}

.inner-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 65% 35%, 
    rgba(255,255,255,0.4) 0%, 
    rgba(255,255,255,0) 70%);
}

.system-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark);
  letter-spacing: -0.5px;
  position: relative;
}

.admin-text {
  font-size: 0.7em;
  font-weight: 500;
  color: var(--primary-color);
  margin-left: 0.5rem;
  vertical-align: super;
}



.action-wrapper {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1.2rem;
  background: rgba(240, 245, 255, 0.6);
  border-radius: 12px;
  transition: all var(--transition-speed) ease;
}

.user-card:hover {
  background: rgba(240, 245, 255, 0.9);
  transform: translateY(-1px);
}

.user-avatar {
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 2px 4px rgba(64, 158, 255, 0.2));
}

.user-meta {
  line-height: 1.3;
}

.welcome-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
}

.username {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}




.action-group {
  display: flex;
  gap: 1rem;
}

.action-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: var(--text-light);
  cursor: pointer;
  transition: all var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.password-btn:hover {
  background: var(--primary-color);
  transform: rotate(8deg) scale(1.1);
}

.password-btn:hover .btn-icon {
  filter: brightness(0) invert(1);
}

.logout-btn:hover {
  background: #ff4d4f;
  transform: scale(1.1);
}

.logout-btn:hover .btn-icon {
  filter: brightness(0) invert(1);
}



@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.logo-orb {
  animation: float 4s ease-in-out infinite;
}
</style>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      this.$router.push('/login');
    },
    password_change() {
      this.$router.push('/passwordchange');
    }
  }
}
</script>