<template>
  <div class="login">
    <h1>This is an login page</h1>

    <el-form :model="loginform" ref="ruleFormRef" :rules="rules" 
      class="demo-ruleForm">
      <el-form-item prop="username" label="Username">
        <el-input v-model="loginform.username" type="text" id="username" :suffix-icon="User"
          placeholder="Enter your username" />
      </el-form-item>

      <el-form-item prop="password" label="Password">
        <el-input v-model="loginform.password" type="password" id="password" :suffix-icon="Lock"
          placeholder="Enter your password" />
      </el-form-item>

      <el-button type="primary" class="submit-btn" @click="login">
        Login
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { userLogin } from '@/api/LoginAndRegister/login.js'

const loginform = reactive({
  username: '',
  password: '',
});

const rules = reactive({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' }
  ]
});


import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import  router  from '../router/index.ts';
const emit = defineEmits(['send-login-success']);
// 定义登录响应类型
interface LoginResponse {
  token: string;
  userId: number;
}

const login = async () => {
  try {
    const res = await userLogin(loginform.username, loginform.password);
		if (res) {
      localStorage.rememberMe = true;
		  localStorage.email = loginform.username;
		  localStorage.password = loginform.password;
      emit('send-login-success', true);
			alert('sendLoginSuccess');
      router.push('/');
		} else {
			alert('登录失败');
		}
    
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.log('请求失败:', error.response.data);
      } else if (error.request) {
        console.log('请求发送但未收到响应:', error.request);
      } else {
        console.log('请求配置错误:', error.message);
      }
    } else {
      console.error('未知错误:', error);
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  width: 100%;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  margin-top: 15px;
}
</style>
