<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {getKeys} from '@/api/browse/adminGet.js';
import {addKey} from'@/api/ad/Key.js';

// 邀请码数据
const invites = ref([
  { id: 1, code: 'INVITE123', status: '未使用', createdAt: '2023-10-01' },
]);

// 筛选状态
const filterStatus = ref('全部');

// 当前页码
const currentPage = ref(1);

// 每页显示数量
const pageSize = ref(10);

// 总页数
const totalPages = computed(() => {
  const totalItems = filteredInvites.value.length;
  return Math.ceil(totalItems / pageSize.value);
});

// 筛选后的邀请码列表
const filteredInvites = computed(() => {
  if (filterStatus.value === '全部') {
    return invites.value;
  }
  return invites.value.filter(invite => invite.status === filterStatus.value);
});

// 当前页的邀请码
const currentInvites = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredInvites.value.slice(start, end);
});

// 添加单个邀请码
const newInviteCode = ref('');

const addInvite = async () => {
  if (!newInviteCode.value.trim()) {
    alert('请输入邀请码');
    return;
  }

  try { 
    await addKey(newInviteCode.value);
    alert('邀请码添加成功');
    location.reload();
  } catch ( error ) {
    console.error('操作失败:', error);
    alert('操作失败，请稍后再试');
  }
};

// 一键添加多个邀请码
const bulkInviteCodes = ref('');

const addBulkInvites = () => {
  alert(`该功能暂未开放`);
};

// 删除邀请码
const deleteInvite = (id: number) => {
  if (!confirm('确定要删除这个邀请码吗？')) return;
  alert('该功能暂未开放');
  // invites.value = invites.value.filter(invite => invite.id !== id);
  // alert('邀请码已删除');
};

// 切换页码
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

// 获取后端邀请码数据（示例）
const fetchInvites = async () => {
  try {
    const response = await getKeys();
    invites.value = response;
    console.log('后端返回的数据:', invites.value);
  } catch (error) {
    console.error('获取数据时出错:', error);
    alert('获取数据失败，请稍后再试');
  }
};

onMounted(() => {
  fetchInvites();
});
</script>

<template>
  <div class="admin-container">
    <div class="admin-content">
      <h1>邀请码管理</h1>

      <!-- 筛选功能 -->
      <div class="filter-container">
        <label for="status-filter">状态筛选：</label>
        <select id="status-filter" v-model="filterStatus">
          <option value="全部">全部</option>
          <option value="未使用">未使用</option>
          <option value="已使用">已使用</option>
        </select>
        <span v-if="filterStatus !== '全部'">已筛选：{{ filterStatus }}</span>
      </div>

      <!-- 添加邀请码 -->
      <div class="add-invite-container">
        <div class="add-single-invite">
          <input v-model="newInviteCode" placeholder="输入邀请码" />
          <button class="add-btn" @click="addInvite">添加</button>
          <button class="add-bulk-btn" @click="addBulkInvites">批量生成邀请码</button>
        </div>
      </div>

      <!-- 邀请码列表 -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>邀请码</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invite in currentInvites" :key="invite.id">
              <td>{{ invite.id }}</td>
              <td>{{ invite.code }}</td>
              <td :class="invite.status === '已使用' ? 'used-status' : 'unused-status'">
                {{ invite.status }}
              </td>
              <td>{{ invite.createdAt }}</td>
              <td>
                <button class="delete-btn" @click="deleteInvite(invite.id)">删除</button>
              </td>
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

.add-invite-container {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
}

.add-single-invite, .add-bulk-invite {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

input, textarea {
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-btn {
  background-color: #1890ff;
  color: white;
}

.add-btn:hover {
  background-color: #40a9ff;
}

.add-bulk-btn {
  background-color: #52c41a;
  color: white;
}

.add-bulk-btn:hover {
  background-color: #389e0d;
}

.delete-btn {
  background-color: #f5222d;
  color: white;
}

.delete-btn:hover {
  background-color: #cf1322;
}

.unused-status {
  color: #52c41a;
}

.used-status {
  color: #f5222d;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 20px;
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