import type { RouteRecordRaw } from 'vue-router';
import isNotAuthenticatedGuard from '../guards/is-not-authenticated-guard';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('../layout/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/Login.vue'),
        meta: { requiresGuest: true }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/Register.vue'),
        meta: { requiresGuest: true }
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('../views/ForgotPassword.vue'),
        meta: { requiresGuest: true }
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('../views/ResetPassword.vue'),
        meta: { requiresGuest: true }
      }
    ]
  }
];
