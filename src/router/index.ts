import { createRouter, createWebHistory } from 'vue-router';
import { authRoutes } from '@/modules/auth/routes';
import { adminRoutes } from '@/modules/admin/routes';
import { authMiddleware } from '@/modules/auth/middleware/auth.middleware';

// Rutas comunes definidas directamente
const commonRoutes = [
  {
    path: '/registration-pending',
    name: 'registration-pending',
    component: () => import('@/modules/common/pages/RegistrationPending.vue')
  },
  {
    path: '/check-registration-status',
    name: 'check-registration-status',
    component: () => import('@/modules/common/pages/CheckRegistrationStatus.vue')
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('@/modules/common/pages/Onboarding.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/terminos-de-uso',
    name: 'terminos-de-uso',
    component: () => import('@/modules/common/pages/TerminosDeUso.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/politica-de-privacidad',
    name: 'politica-de-privacidad',
    component: () => import('@/modules/common/pages/PoliticaDePrivacidad.vue'),
    meta: { requiresGuest: true }
  }
];

// Definir rutas como un array simple de objetos
const routes = [
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
