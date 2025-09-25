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
    
    <!-- 轮播图部分 -->
    <div class="carousel-container" @mouseenter="pauseCarousel" @mouseleave="resumeCarousel">
      <div class="carousel">
        <div class="carousel-inner">
          <div 
            v-for="(image, index) in carouselImages" 
            :key="index"
            :class="['carousel-item', { active: currentImageIndex === index }]"
          >
            <img :src="image" :alt="'Carousel image ' + (index + 1)" @click="enlargeImage(image)">
          </div>
        </div>
        
        <button class="carousel-control prev" @click="prevImage">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="carousel-control next" @click="nextImage">
          <i class="fas fa-chevron-right"></i>
        </button>
        
        <div class="carousel-indicators">
          <span 
            v-for="(image, index) in carouselImages" 
            :key="index"
            :class="['carousel-indicator', { active: currentImageIndex === index }]"
            @click="setImage(index)"
          ></span>
        </div>
      </div>
    </div>
    
    <!-- 图片放大模态框 -->
    <div v-if="showEnlarged" class="image-modal" @click="closeEnlarged">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeEnlarged">&times;</button>
        <img :src="enlargedImageUrl" :alt="'Enlarged image'" class="enlarged-image">
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      menuItems: [
        { path: '/', icon: '📚', title: '帖子总览' },
        { path: '/keymanage', icon: '🔐', title: '邀请码管理' },
        { path: '/feedback', icon: '💡', title: '反馈建议' },
        { path: '/c', icon: '⛔', title: '禁言管理' }
      ],
      carouselImages: [
          new URL(`${import.meta.env.BASE_URL}dangan.jpg`, window.location.origin).pathname,
          new URL(`${import.meta.env.BASE_URL}dfproject.jpg`, window.location.origin).pathname,
          new URL(`${import.meta.env.BASE_URL}moon.jpg`, window.location.origin).pathname,
      ],
      currentImageIndex: 0,
      carouselInterval: null,
      showEnlarged: false,
      enlargedImageUrl: ''
    }
  },
  methods: {
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
    },
    setImage(index) {
      this.currentImageIndex = index;
    },
    startCarousel() {
      this.carouselInterval = setInterval(() => {
        this.nextImage();
      }, 5000);
    },
    pauseCarousel() {
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval);
        this.carouselInterval = null;
      }
    },
    resumeCarousel() {
      if (!this.carouselInterval) {
        this.startCarousel();
      }
    },
    // 放大图片 - 修复：传递正确的图片URL
    enlargeImage(imageUrl) {
      this.enlargedImageUrl = imageUrl;
      this.showEnlarged = true;
      this.pauseCarousel();
    },
    // 关闭放大图片
    closeEnlarged() {
      this.showEnlarged = false;
      this.resumeCarousel();
    }
  },
  mounted() {
    this.startCarousel();
  },
  beforeUnmount() {
    this.pauseCarousel();
  }
}
</script>

<style scoped>
.sidebar {
  --primary-color: #3A86FF; 
  --bg-color: linear-gradient(195deg, #F8FBFF 0%, #EBF2FF 100%); 
  --text-color: #2D3748; 
  --hover-bg: rgba(58, 134, 255, 0.1);
  
  width: 200px;
  height: 100vh;
  background: var(--bg-color);
  box-shadow: 6px 0 24px rgba(0, 0, 0, 0.08);
  padding: 32px 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  font-size: 1.2rem;
  transition: all 0.3s ease;
  width: 24px;
  text-align: center;
}

.title {
  font-size: 1rem;
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

/* 轮播图样式 */
.carousel-container {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  position: relative;
}

.carousel {
  width: 180px;
  height: 320px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.carousel-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none; /* 非激活项不响应点击 */
}

.carousel-item.active {
  opacity: 1;
  z-index: 1; /* 置于顶层，确保点击命中当前项 */
  pointer-events: auto; /* 仅激活项可点击 */
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.carousel-item img:hover {
  transform: scale(1.02);
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.7);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-control:hover {
  background: rgba(255, 255, 255, 0.9);
}

.carousel-control.prev {
  left: -15px;
}

.carousel-control.next {
  right: -15px;
}

.carousel-indicators {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.carousel-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicator.active {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.2);
}

/* 图片放大模态框样式 - 修复：限制图片最大尺寸为70% */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 90vw; /* 限制模态框最大宽度 */
  max-height: 90vh; /* 限制模态框最大高度 */
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  z-index: 1001;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.enlarged-image {
  max-width: 70vw; /* 限制图片最大宽度为视口宽度的70% */
  max-height: 70vh; /* 限制图片最大高度为视口高度的70% */
  object-fit: contain; /* 保持原图比例 */
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: zoomIn 0.3s ease;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from { 
    opacity: 0;
    transform: scale(0.8);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式设计 */
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
    font-size: 1.4rem;
  }
  
  .active-indicator {
    top: 0;
    right: 50%;
    transform: translateX(50%);
    height: 3px;
    width: 60%;
    border-radius: 0 0 2px 2px;
  }
  
  .carousel {
    width: 72px;
    height: 128px;
  }
  
  .carousel-control {
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
  }
  
  .carousel-control.prev {
    left: -10px;
  }
  
  .carousel-control.next {
    right: -10px;
  }
  
  .carousel-indicator {
    width: 6px;
    height: 6px;
  }
  
  /* 移动端模态框调整 */
  .enlarged-image {
    max-width: 85vw; /* 移动端可以稍微大一些 */
    max-height: 85vh;
  }
  
  .close-btn {
    top: -35px;
    right: -10px;
  }
}
</style>