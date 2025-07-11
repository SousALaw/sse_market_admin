<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getPosts, getPostDetail } from '@/api/browse/adminGet.js';
import { deletePost, isHighQuality, removeHighQuality, muteUser } from '@/api/browse/controlPost.js';

// 预设数据
const items = ref([
  { id: 1, title: '帖子1', user_id: 123, status: '已发布' },
]);

// 搜索结果相关的响应式变量
const searchId = ref(''); // 搜索框绑定的变量
const searchTitle = ref(''); // 标题搜索绑定的变量
const searchUser_id = ref(''); // 发帖人搜索绑定的变量

// 筛选条件
const filterStatus = ref('全部');

// 筛选后的帖子列表（不考虑分页）
const allFilteredItems = computed(() => {
  let result = items.value;
  const idNumber = parseInt(searchId.value);

  // 按搜索框中的ID筛选
  if (!isNaN(idNumber)) {
    result = result.filter(item => item.id === idNumber);
  }

  // 按搜索框中的标题筛选
  if (searchTitle.value) {
    result = result.filter(item => item.title.toLowerCase().includes(searchTitle.value.toLowerCase()));
  }

  // 按搜索框中的发帖人筛选
  if (searchUser_id.value) {
    result = result.filter(item => item.id === idNumber);
  }


  // 根据状态筛选
  if (filterStatus.value !== '全部') {
    result = result.filter(item => item.status === filterStatus.value);
  }

  return result;
});

// 当前页码
const currentPage = ref(1);
// 每页显示的记录数
const pageSize = ref(13);

// 总页数
const totalPages = computed(() => {
  return Math.ceil(allFilteredItems.value.length / pageSize.value);
});

// 当前页的帖子
const filteredItemsOnCurrentPage = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return allFilteredItems.value.slice(startIndex, endIndex);
});
// 新增的响应式变量
const showDetailDialog = ref(false);
const selectedPost = ref<Post | null>(null);

// 新增的类型定义
interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
}

// 查看处理方法 
const handleView = async (id: number) => {
  try {
    const response = await getPostDetail(id);
    console.log('后端返回的数据:', response);
    selectedPost.value = {
      id: id,
      title: response.title, 
      content: response.text, 
      user_id: response.user_id, 
    };
    showDetailDialog.value = true;
  } catch (error) {
    console.error('获取数据时出错:', error);
    alert('获取数据失败，请稍后再试');
  }
  
};
// 切换优质贴状态
const toggleQuality = async (id: number) => {
  const item = items.value.find(item => item.id === id);

  if (!item) {
    alert('帖子不存在或已删除');
    return;
  }
  const action = item.status === '已发布' ? '设为优质贴' : '取消优质贴';
  if (!confirm(`确定要${action}吗？`)) return;

  try {
    if (item.status === '已发布') {
      await isHighQuality(id);
      item.status = '优质贴';
      alert(`已设为优质贴：${item.title}`);
    } else if (item.status === '优质贴') {
      await removeHighQuality(id);
      item.status = '已发布';
      alert(`已取消优质贴：${item.title}`);
    }
  } catch (error) {
    console.error('操作失败:', error);
    alert('操作失败，请稍后再试');
  } 
};

// 删除操作
const handleDelete = async (id: number) => {
  if (!confirm('确定要删除这条帖子吗？')) return
  try {
    await deletePost(id)
    items.value = items.value.filter(item => item.id !== id);
    alert('已删除这条帖子')
  } catch (error) {
    console.error('操作失败:', error);
    alert('操作失败，请稍后再试');
  }
};

// 禁言发帖人
const handleMute = async (id: number) => {
  if (confirm('确定要禁言这个发帖人')) {
    if (!confirm('不是哥们，真禁言啊？')) return;
    alert(`已禁言发帖人：${items.value.find(item => item.id === id)?.title}`);
  }
};

// 获取后端帖子数据
const fetchItems = async () => {
  try {
    const response = await getPosts();
    items.value = response;
    console.log('后端返回的数据:', items.value); // 打印后端返回的数据
    currentPage.value = 1; // 重置当前页为第一页
  } catch (error) {
    console.error('获取数据时出错:', error);
    alert('获取数据失败，请稍后再试');
  }
};

// 页码改变处理函数
const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};

onMounted(() => {
  fetchItems();
});
</script>

<template>
  <div class="admin-container">
    <div class="admin-content">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="page-title">📚 帖子管理</h1>
        <div class="refresh-area" @click="fetchItems" title="刷新数据">
          <svg class="refresh-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </div>
      </div>

      <!-- 过滤控制区 -->
      <div class="control-section">
        <div class="search-group">
          <div class="search-input-wrapper">
            <input 
              type="number" 
              v-model.number="searchId" 
              placeholder="帖子ID"
              class="search-input id-input">
            <span class="input-badge">ID</span>
          </div>
          
          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchTitle" 
              placeholder="搜索标题..."
              class="search-input">
            <svg class="search-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>

          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchUser_id" 
              placeholder="发帖人ID"
              class="search-input user-input">
            <span class="input-badge">UID</span>
          </div>
        </div>

        <div class="filter-group">
          <div class="filter-item">
            <label class="filter-label">状态筛选：</label>
            <select v-model="filterStatus" class="filter-select">
              <option value="全部">全部状态</option>
              <option value="已发布">已发布</option>
              <option value="优质贴">优质内容</option>
            </select>
          </div>
          <div v-if="filterStatus !== '全部'" class="active-filter">
            {{ filterStatus }}
            <button @click="filterStatus = '全部'" class="clear-filter">×</button>
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
        <div class="table-header">
          <span class="total-count">共 {{ allFilteredItems.length }} 条记录</span>
        </div>
        
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>标题</th>
                <th>发帖人ID</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="item in filteredItemsOnCurrentPage" 
                :key="item.id"
                class="table-row">
                <td>{{ item.id }}</td>
                <td class="title-cell">{{ item.title }}</td>
                <td>{{ item.user_id }}</td>
                <td>
                  <span :class="['status-tag', item.status === '优质贴' ? 'premium' : 'published']">
                    {{ item.status }}
                  </span>
                </td>
                <td class="action-cell">
                  <button @click="handleView(item.id)" class="action-btn view-btn">
                    <svg class="btn-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    查看
                  </button>
                  <button 
                    @click="toggleQuality(item.id)" 
                    class="action-btn quality-btn"
                    :class="{ 'active': item.status === '优质贴' }">
                    <svg class="btn-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 1l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 14.14 2 9.27l6.91-1.01L12 1z"/>
                    </svg>
                    {{ item.status === '已发布' ? '设为优质' : '取消优质' }}
                  </button>
                  <button @click="handleMute(item.id)" class="action-btn mute-btn">
                    <svg class="btn-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18 11h-2v2h2v-2zm-4 0h-2v2h2v-2zm-4 0H8v2h2v-2zM6 11H4v2h2v-2zm16-4v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-2 0H4v12h16V7z"/>
                    </svg>
                    禁言
                  </button>
                  <button @click="handleDelete(item.id)" class="action-btn delete-btn">
                    <svg class="btn-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    删除
                  </button>
                  
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="allFilteredItems.length === 0" class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 5C5.92 5 1 10.29 1 16.56c0 1.9.75 3.63 2 4.95V23l4-2h.5c3.53 0 6.5-2.6 6.5-6.44 0-.26-.02-.52-.05-.78.91-.84 1.55-1.95 1.55-3.22 0-2.39-2.15-4.34-4.8-4.34H12m0 1.5h1.7c1.93 0 3.3 1.43 3.3 2.84 0 1.05-.79 2.03-2.07 2.73l-.27.13.07.29c.06.25.1.52.1.79 0 2.37-.35 4.1-2.34 4.1-4.95C19 11.14 15.86 6.5 12 6.5z"/>
            </svg>
            <p>暂无相关数据</p>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="totalPages > 1">
          <button
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
            class="pagination-btn prev">
            <svg class="pagination-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
            </svg>
          </button>
          
          <span class="page-indicator">
            第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
          </span>
          
          <button
            :disabled="currentPage === totalPages"
            @click="handlePageChange(currentPage + 1)"
            class="pagination-btn next">
            <svg class="pagination-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showDetailDialog" class="preview-modal">
  <div class="modal-mask"></div>
  <div class="modal-container">
    <div class="modal-header">
      <h3>{{ selectedPost?.title }}</h3>
      <button @click="showDetailDialog = false" class="close-btn">&times;</button>
    </div>
    <div class="modal-content">
      <div class="post-meta">
        <span>ID: {{ selectedPost?.id }}</span>
        <span>发帖人: {{ selectedPost?.user_id }}</span>
      </div>
      <div class="post-content">
        {{ selectedPost?.content }}
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.view-btn {
  background: rgba(103, 194, 58, 0.1);
  color: var(--success-color);
}

/* 弹窗样式 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: relative;
  width: 600px;
  max-width: 90%;
  margin: 20px auto;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.close-btn:hover {
  color: var(--primary-color);
}

.post-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.post-content {
  line-height: 1.6;
  padding: 16px;
  background: var(--bg-light);
  border-radius: 8px;
}
.admin-container {
  --primary-color: #409EFF;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --text-primary: #303133;
  --text-secondary: #606266;
  --border-color: #ebeef5;
  --bg-light: #f5f7fa;
  flex: 1;
  padding: 24px;
  background: var(--bg-light);
  min-height: 100vh;
}

.admin-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 24px;
}

/* 头部区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 0;
  font-weight: 600;
}

.refresh-area {
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s;
}

.refresh-icon {
  width: 24px;
  height: 24px;
  color: var(--text-secondary);
  transition: transform 0.3s;
}

.refresh-area:hover .refresh-icon {
  transform: rotate(180deg);
}

/* 搜索过滤 */
.control-section {
  margin-bottom: 24px;
}

.search-group {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 240px;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.input-badge {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-light);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

/* 状态过滤 */
.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-select {
  padding: 8px 36px 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  appearance: none;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2360666C'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 12px center/16px;
}

.active-filter {
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-filter {
  border: none;
  background: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 1.2rem;
}

/* 表格样式 */
.table-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  padding: 16px;
  background: var(--bg-light);
  border-bottom: 1px solid var(--border-color);
}

.total-count {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 16px;
  background: var(--bg-light);
  color: var(--text-secondary);
  font-weight: 500;
  text-align: left;
}

.table-row td {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.table-row:hover {
  background: rgba(64, 158, 255, 0.03);
}

/* 状态标签 */
.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.published {
  background: rgba(103, 194, 58, 0.1);
  color: var(--success-color);
}

.premium {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

/* 操作按钮 */
.action-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.quality-btn {
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.quality-btn.active {
  background: var(--primary-color);
  color: white;
}

.mute-btn {
  background: rgba(230, 162, 60, 0.1);
  color: var(--warning-color);
}

.delete-btn {
  background: rgba(245, 108, 108, 0.1);
  color: var(--danger-color);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  margin: 0 24px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.pagination-icon {
  width: 20px;
  height: 20px;
}

/* 空状态 */
.empty-state {
  padding: 48px 0;
  text-align: center;
  color: var(--text-secondary);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}
</style>