import type { RouteRecordRaw } from 'vue-router'

export const commonRoutes: RouteRecordRaw[] = [
  {
    path: '/registration-pending',
    name: 'registration-pending',
    component: () => import('../pages/RegistrationPending.vue')
  },
  {
    path: '/check-registration-status',
    name: 'check-registration-status',
    component: () => import('../pages/CheckRegistrationStatus.vue')
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('../pages/Onboarding.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/terminos-de-uso',
    name: 'terminos-de-uso',
    component: () => import('../pages/TerminosDeUso.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/politica-de-privacidad',
    name: 'politica-de-privacidad',
    component: () => import('../pages/PoliticaDePrivacidad.vue'),
    meta: { requiresGuest: true }
  }
] 