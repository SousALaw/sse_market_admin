<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 被禁言用户数据
const mutedUsers = ref([
  { id: 1, username: 'user1', muteEndDate: '2023-12-31', reason: '发布不当内容' },
  { id: 2, username: 'user2', muteEndDate: '2023-11-15', reason: '恶意刷屏' },
  { id: 3, username: 'user3', muteEndDate: '2023-10-20', reason: '违反社区规则' },
]);

// 当前页码
const currentPage = ref(1);

// 每页显示数量
const pageSize = ref(5);

// 总页数
const totalPages = computed(() => {
  return Math.ceil(mutedUsers.value.length / pageSize.value);
});

// 当前页的用户
const currentUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return mutedUsers.value.slice(start, end);
});

// 编辑禁言终止日期
const selectedUser = ref(null);
const newEndDate = ref('');

// const editMuteEndDate = (user) => {
//   selectedUser.value = user;
//   newEndDate.value = user.muteEndDate;
// };

const saveMuteEndDate = async () => {
  if (!selectedUser.value || !newEndDate.value) {
    alert('请选择用户并输入禁言终止日期');
    return;
  }

  try {
    // 这里应该是调用后端 API 更新禁言终止日期的逻辑
    // 示例：
    // await updateMuteEndDate(selectedUser.value.id, newEndDate.value);

    // const userIndex = mutedUsers.value.findIndex(u => u.id === selectedUser.value.id);
    // if (userIndex !== -1) {
    //   mutedUsers.value[userIndex].muteEndDate = newEndDate.value;
    // }

    // alert('禁言终止日期已更新');
    // selectedUser.value = null;
    // newEndDate.value = '';
  } catch (error) {
    console.error('更新失败:', error);
    alert('更新失败，请稍后再试');
  }
};

// 取消禁言
const cancelMute = async (id: number) => {
  if (!confirm('确定要取消禁言吗？')) return;

  try {
    // 这里应该是调用后端 API 取消禁言的逻辑
    // 示例：
    // await cancelUserMute(id);

    mutedUsers.value = mutedUsers.value.filter(user => user.id !== id);
    alert('已取消禁言');
  } catch (error) {
    console.error('取消禁言失败:', error);
    alert('取消禁言失败，请稍后再试');
  }
};

// 切换页码
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

// 获取后端禁言用户数据（示例）
const fetchMutedUsers = async () => {
  try {
    // 这里应该是调用后端 API 获取禁言用户数据的逻辑
    // 示例：
    // const response = await getMutedUsers();
    // mutedUsers.value = response;
    console.log('后端返回的数据:', mutedUsers.value);
  } catch (error) {
    console.error('获取数据时出错:', error);
    alert('获取数据失败，请稍后再试');
  }
};

onMounted(() => {
  fetchMutedUsers();
});
</script>

<template>
  <div class="admin-container">
    <div class="admin-content">
      <h1>小黑屋管理(该功能暂未开放，请移步服务器手动小黑屋)</h1>

      <!-- 用户列表 -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>禁言终止日期</th>
              <th>禁言原因</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in currentUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.muteEndDate }}</td>
              <td>{{ user.reason }}</td>
              <td>
                <button class="edit-btn">编辑日期</button>
                <button class="cancel-btn" @click="cancelMute(user.id)">取消禁言</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 编辑禁言终止日期 -->
      <div v-if="selectedUser" class="edit-container">
        <h3>编辑禁言终止日期</h3>
        <div class="edit-form">
          <label for="newEndDate">新禁言终止日期：</label>
          <input
            id="newEndDate"
            type="date"
            v-model="newEndDate"
          />
          <div class="edit-buttons">
            <button class="save-btn" @click="saveMuteEndDate">保存</button>
            <button class="cancel-edit-btn" @click="selectedUser = null">取消</button>
          </div>
        </div>
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

button {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn {
  background-color: #1890ff;
  color: white;
}

.edit-btn:hover {
  background-color: #40a9ff;
}

.cancel-btn {
  background-color: #f5222d;
  color: white;
}

.cancel-btn:hover {
  background-color: #cf1322;
}

.edit-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.save-btn {
  background-color: #52c41a;
  color: white;
}

.save-btn:hover {
  background-color: #389e0d;
}

.cancel-edit-btn {
  background-color: #d9d9d9;
  color: #333;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
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