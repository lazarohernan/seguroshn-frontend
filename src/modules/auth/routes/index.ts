import type { RouteRecordRaw } from 'vue-router';
// El guardián de autenticación se aplica globalmente en router/index.ts
// por lo que no es necesario importarlo aquí

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
        path: 'recover-password',
        name: 'recover-password',
        component: () => import('../views/RecoverPassword.vue'),
        meta: { requiresGuest: true }
      }
    ]
  }
];
