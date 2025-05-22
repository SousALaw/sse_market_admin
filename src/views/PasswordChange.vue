<template>
    <div class="change-password">
      <h1>Change Your Password</h1>
      <el-form 
        :model="changeForm" 
        ref="formRef" 
        :rules="rules" 
        class="demo-ruleForm"
        @submit.prevent
      >
        <!-- Username Input -->
        <el-form-item prop="username" label="Username">
          <el-input 
            v-model="changeForm.username" 
            type="text" 
            placeholder="Enter your username" 
            :suffix-icon="User" 
          />
        </el-form-item>
  
        <!-- Old Password Input -->
        <el-form-item prop="oldPassword" label="Old Password">
          <el-input 
            v-model="changeForm.oldPassword" 
            type="password" 
            placeholder="Enter your old password" 
            :suffix-icon="Lock" 
          />
        </el-form-item>
  
        <!-- New Password Input -->
        <el-form-item prop="newPassword" label="New Password">
          <el-input 
            v-model="changeForm.newPassword" 
            type="password" 
            placeholder="Enter your new password" 
            :suffix-icon="Lock" 
          />
        </el-form-item>
  
        <!-- Confirm Password Input -->
        <el-form-item prop="confirmPassword" label="Confirm Password">
          <el-input 
            v-model="changeForm.confirmPassword" 
            type="password" 
            placeholder="Confirm your new password" 
            :suffix-icon="Lock" 
          />
        </el-form-item>
  
        <!-- Submit Button -->
        <el-button 
          type="primary" 
          class="submit-btn" 
          @click="submitChangePassword"
        >
          Change Password
        </el-button>
      </el-form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { User, Lock } from '@element-plus/icons-vue';
  import type { FormInstance } from 'element-plus';
  import { passwordChange } from '@/api/ad/Passwordchange.js';
  import  router  from '../router/index.ts';

  const formRef = ref<FormInstance>();
  
  const changeForm = reactive({
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const rules = reactive({
    username: [
      { required: true, message: 'Please input username', trigger: 'blur' },
      { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' }
    ],
    oldPassword: [
      { required: true, message: 'Please input old password', trigger: 'blur' },
      { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: 'Please input new password', trigger: 'blur' },
      { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: 'Please confirm new password', trigger: 'blur' },
      {
        validator: (rule: any, value: string) => {
          if (value !== changeForm.newPassword) {
            return new Error('The two passwords do not match');
          }
          return true;
        },
        trigger: 'blur'
      }
    ]
  });
  
  async function submitChangePassword() {
    const form = formRef.value;
    if (!form) return;
  
    await form.validate((valid: boolean) => {
      if (valid) {
        changePassword();
      } else {
        ElMessage.error('Please fill in the form correctly');
      }
    });
  }
  
  async function changePassword() {
    try {
      const response = await passwordChange(
        changeForm.username,
        changeForm.oldPassword,
        changeForm.newPassword
      );
  
      if (response) {
        alert('Password changed successfully');
        localStorage.removeItem('email');
		localStorage.removeItem('password');
        router.push('/login');
      } else {
        alert(response.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Password change failed');
    }
  }
  </script>
  
  <style scoped>
  .change-password {
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