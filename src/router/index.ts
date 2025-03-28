import { adminRoutes } from '@/modules/admin/routes';
import { authRoutes } from '@/modules/auth/routes';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/auth-store';
import { supabase } from '@/lib/supabase';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    authRoutes,
    adminRoutes,

    // Rutas públicas
    {
      path: '/registration-pending',
      name: 'registration-pending',
      component: () => import('@/modules/common/pages/RegistrationPending.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/check-registration-status',
      name: 'check-registration-status',
      component: () => import('@/modules/common/pages/CheckRegistrationStatus.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/modules/common/pages/Onboarding.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/terminos-de-uso',
      name: 'terminos-de-uso',
      component: () => import('@/modules/common/pages/TerminosDeUso.vue'),
      meta: { requiresAuth: false },
      beforeEnter: (_to, from, next) => {
        if (from.name === 'register' || from.name === 'login') {
          next();
        } else {
          next('/dashboard');
        }
      },
    },
    {
      path: '/politica-de-privacidad',
      name: 'politica-de-privacidad',
      component: () => import('@/modules/common/pages/PoliticaDePrivacidad.vue'),
      meta: { requiresAuth: false },
      beforeEnter: (_to, from, next) => {
        if (from.name === 'register' || from.name === 'login') {
          next();
        } else {
          next('/dashboard');
        }
      },
    },
    // Ruta 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/modules/common/pages/NotFound.vue'),
      meta: { requiresAuth: false },
    },
  ],
});

// Guard de navegación global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  try {
    // Verificar sesión actual de Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    // Si la ruta requiere autenticación
    if (to.meta.requiresAuth) {
      if (!session) {
        // No hay sesión, redirigir a login
        return next({ 
          name: 'login',
          query: { redirect: to.fullPath } // Guardamos la ruta a la que intentaba acceder
        });
      }

      // Verificar estado de autenticación en el store
      const isAuthenticated = await authStore.checkAuthStatus();
      
      if (!isAuthenticated) {
        // La verificación falló, redirigir a login
        return next({ 
          name: 'login',
          query: { redirect: to.fullPath }
        });
      }

      // Todo bien, continuar
      return next();
    }

    // Si la ruta NO requiere autenticación (como login o registro)
    if (session) {
      // Si ya estamos autenticados y tratamos de acceder a login/registro
      if (to.name === 'login' || to.name === 'register') {
        return next({ name: 'dashboard' });
      }
    }

    // Para todas las demás rutas, continuar normalmente
    return next();
  } catch (error) {
    console.error('Error en guard de navegación:', error);
    // En caso de error, redirigir a login
    return next({ 
      name: 'login',
      query: { redirect: to.fullPath }
    });
  }
});

export default router;
