<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {getFeedback} from '@/api/browse/adminGet.js';

// 定义反馈数据的接口
interface FeedbackItem {
  id: number;
  text: string;
  time: string;
}

// 建议数据
const feedbacks = ref<FeedbackItem[]>([
  { id: 1, text: '网站加载速度有点慢，建议优化', time: '2023-10-01 14:30:00' },
]);

// 筛选条件
const filterContent = ref<string>('');

// 当前页码
const currentPage = ref<number>(1);

// 每页显示数量
const pageSize = ref<number>(13);

// 总页数
const totalPages = computed(() => {
  const totalItems = filteredFeedbacks.value.length;
  return Math.ceil(totalItems / pageSize.value);
});

// 筛选后的建议列表
const filteredFeedbacks = computed(() => {
  if (!filterContent.value) {
    return feedbacks.value;
  }
  return feedbacks.value.filter(feedback => feedback.text.includes(filterContent.value));
});

// 当前页的建议
const currentFeedbacks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredFeedbacks.value.slice(start, end);
});

// 切换页码
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

// 获取后端建议数据并处理
const fetchFeedbacks = async () => {
  try {
    const response: FeedbackItem[] = await getFeedback(); // 使用接口明确类型
    // 原始数据处理：删除相邻且内容相同的反馈（保留ID较小的那条）
    for (let i = response.length - 1; i > 0; i--) { // 从后往前比较，避免索引错乱
      if (response[i].text === response[i - 1].text) {
        response.splice(i, 1);
      }
    }
    feedbacks.value = response;
    console.log('后端返回的数据:', feedbacks.value);
  } catch (error) {
    console.error('获取数据时出错:', error);
    alert('获取数据失败，请稍后再试');
  }
};

onMounted(() => {
  fetchFeedbacks();
});
</script>

<template>
  <div class="admin-container">
    <div class="admin-content">
      <h1>反馈建议管理</h1>

      <!-- 筛选功能 -->
      <div class="filter-container">
        <label for="content-filter">内容筛选：</label>
        <input id="content-filter" v-model="filterContent" placeholder="输入关键词" />
        <span v-if="filterContent">已筛选：包含 {{ filterContent }}</span>
      </div>

      <!-- 建议列表 -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>建议内容</th>
              <th>建议时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="feedback in currentFeedbacks" :key="feedback.id">
              <td>{{ feedback.id }}</td>
              <td>{{ feedback.text }}</td>
              <td>{{ feedback.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">上一页</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">下一页</button>
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

.filter-container input {
  padding: 5px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-right: 10px;
}

.filter-container span {
  color: #67c23a;
  font-size: 14px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
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

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.pagination button {
  padding: 5px 10px;
  background-color: #fff;
  border: 1px solid #d9d9d9;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>