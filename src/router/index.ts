import { createRouter, createWebHistory } from 'vue-router';
import { authRoutes } from '@/modules/auth/routes';
import { adminRoutes } from '@/modules/admin/routes';
import { commonRoutes } from '@/modules/common/routes';
import { authMiddleware } from '@/modules/auth/middleware/auth.middleware';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  ...authRoutes,
  ...adminRoutes,
  ...commonRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/modules/common/pages/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Aplicar el middleware de autenticación a todas las rutas
router.beforeEach(authMiddleware);

export default router;
