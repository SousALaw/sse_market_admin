<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getPosts } from '@/api/browse/adminGet.js';
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
      <h1>帖子管理</h1>

      <div class="search-container">
        <input type="number" v-model.number="searchId" placeholder="输入ID搜索">
        <input type="text" v-model="searchTitle" placeholder="输入标题搜索">
        <input type="text" v-model="searchUser_id" placeholder="输入发帖人搜索">
      </div>

      <div class="filter-container">
        <label for="status-filter">状态筛选：</label>
        <select id="status-filter" v-model="filterStatus">
          <option value="全部">全部</option>
          <option value="已发布">已发布</option>
          <option value="优质贴">优质贴</option>
        </select>
        <span v-if="filterStatus !== '全部'">已筛选：{{ filterStatus }}</span>
      </div>

      <div class="table-wrapper">
        <table>
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
            <tr v-for="item in filteredItemsOnCurrentPage" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.user_id }}</td>
              <td>{{ item.status }}</td>
              <td>
                <button class="quality-btn" @click="toggleQuality(item.id)">
                  {{ item.status === '已发布' ? '设为优质贴' : '取消优质贴' }}
                </button>
                <button class="mute-btn" @click="handleMute(item.id)">禁言发帖人</button>
                <button class="delete-btn" @click="handleDelete(item.id)">删除</button>
                <button class="top-btn" @click="handleMute(item.id)">置顶</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="totalPages > 1">
        <button
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
          class="pagination-btn prev-btn"
        >
          上一页
        </button>
        <span class="pagination-info">
          {{ currentPage }} / {{ totalPages }} 
        </span>
        <button
          :disabled="currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)"
          class="pagination-btn next-btn"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
}

.admin-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h1 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.filter-container label {
  margin-right: 10px;
}

.filter-container select {
  padding: 5px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-right: 10px;
}

.filter-container span {
  color: #67c23a;
  font-size: 14px;
}

.search-container {
  margin-bottom: 20px;
}

.search-container input {
  width: 200px;
  padding: 8px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
  margin-right: 10px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}

th {
  background-color: #fafafa;
  color: #666;
}

tr:hover {
  background-color: #f9f9f9;
}

button {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.quality-btn {
  background-color: #1890ff;
  color: white;
}

.quality-btn:hover {
  background-color: #40a9ff;
}

.mute-btn {
  background-color: #faad14;
  color: white;
}

.mute-btn:hover {
  background-color: #f5a623;
}

.delete-btn {
  background-color: #f5222d;
  color: white;
}

.delete-btn:hover {
  background-color: #cf1322;
}

.top-btn {
  background-color: #429891;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
}

.pagination-btn {
  margin: 0 5px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.pagination-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 15px;
  font-size: 14px;
  color: #666;
}
</style>