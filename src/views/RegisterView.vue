<template>
  <div class="register">
    <h1>Register</h1>

    <el-form
      :model="registerForm"
      :rules="rules"
      ref="ruleFormRef"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item prop="username" label="Username">
        <el-input
          v-model="registerForm.username"
          type="text"
          placeholder="Enter your username"
          :suffix-icon="User"
        />
      </el-form-item>

      <el-form-item prop="password" label="Password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="Enter your password"
          :suffix-icon="Lock"
        />
      </el-form-item>

      <el-form-item prop="passwordConfirm" label="Confirm Pw">
        <el-input
          v-model="registerForm.passwordConfirm"
          type="password"
          placeholder="Confirm your password"
          :suffix-icon="Lock"
        />
      </el-form-item>

      <el-form-item prop="phone" label="Phone">
        <el-input
          v-model="registerForm.phone"
          type="text"
          placeholder="Enter your phone number"
          :suffix-icon="Phone"
        />
      </el-form-item>

      <el-form-item prop="email" label="Email">
        <el-input
          v-model="registerForm.email"
          type="email"
          placeholder="Enter your email"
          :suffix-icon="Message"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          class="submit-btn"
          @click="Register"
          :loading="loading"
        >
          Register
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { Lock, User, Phone, Message } from '@element-plus/icons-vue';
import api from '@/api/login.js';
import { useRouter } from 'vue-router';
import type { AxiosResponse } from 'axios';
import  { AxiosError} from 'axios';
import {userRegister}from  '@/api/LoginAndRegister/register.js'
// 获取路由实例
const router = useRouter();

// 表单引用
const ruleFormRef = ref<FormInstance>();

// 定义表单数据
const registerForm = reactive({
  username: '',
  password: '',
  passwordConfirm: '',
  phone: '',
  email: '',
});

// 定义表单验证规则
const rules = reactive({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' },
  ],
  passwordConfirm: [
    { required: true, message: 'Please confirm password', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback(new Error('Please confirm password'));
        } else if (value !== registerForm.password) {
          callback(new Error('The two passwords do not match'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  phone: [
    { required: false, message: 'Please input phone number', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: 'Invalid phone number format',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    {
      type: 'email',
      message: 'Invalid email format',
      trigger: ['blur', 'change'],
    },
  ],
});

// 加载状态
const loading = ref(false);
interface RegisterResponse {
  token: string;
  userId: number;
}
// 注册函数
const Register = async() => {
  try {
    const res = await userRegister(registerForm.email,registerForm.username,registerForm.password,registerForm.passwordConfirm,registerForm.phone);
		if (res) {
			alert('sendRegisterSuccess');
		} else {
			alert('注册失败');
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
  
}
</script>

<style scoped>
.register {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.submit-btn {
  width: 100%;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  margin-top: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #3aa975;
}
</style>