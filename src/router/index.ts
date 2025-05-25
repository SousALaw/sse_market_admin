import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // {
    //   path: '/register',
    //   name: 'register',
    //   component: () => import('../views/RegisterView.vue'),
    // },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/keymanage',
      name: 'keymanage',
      component: () => import('../views/HomeView_2.vue'),
    },
    {
      path: '/passwordchange',
      name: 'passwordchange',
      component: () => import('../views/PasswordChange.vue'),
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('../views/HomeView_4.vue'),
    },
    {
      path: '/c',
      name: 'c',
      component: () => import('../views/HomeView_3.vue'),
    },
  ],
})

export default router
