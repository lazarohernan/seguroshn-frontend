import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { AuthStatus } from '../interfaces';
import { useAuthStore } from '../stores/auth-store';

const isAuthenticatedGuard = async (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  await authStore.checkAuthStatus();

  if (authStore.authStatus === AuthStatus.Unauthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
};

export default isAuthenticatedGuard;
