import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Importar TokenManager y cliente Supabase para inicialización
import { tokenManager, supabase } from '@/lib/supabase';

import './style.css';

// Inicializar el sistema de gestión de tokens de Supabase
console.log('Iniciando sistema de gestión de tokens Supabase...');

// Función para inicializar el TokenManager de manera robusta
const initializeTokenManager = async () => {
  if (!tokenManager) {
    console.error('Error crítico: TokenManager no pudo inicializarse');
    return;
  }
  
  console.log('TokenManager inicializado correctamente');
  
  try {
    // Intentar refrescar el token inmediatamente si hay una sesión
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
      console.log('Sesión activa detectada, refrescando token...');
      
      // Intentar refrescar de manera forzada para asegurar tokens válidos
      const refreshedSession = await tokenManager.refreshToken();
      
      if (refreshedSession) {
        console.log('Token refrescado exitosamente al inicio de la aplicación');
      } else {
        console.warn('No se pudo refrescar el token al inicio, pero se reintentará automáticamente');
      }
    } else {
      console.log('No hay sesión activa para refrescar');
    }
  } catch (err) {
    console.error('Error al comprobar/refrescar la sesión inicial:', err);
  }
};

// Iniciar el proceso de manera asíncrona pero sin bloquear el arranque de la app
initializeTokenManager();

// Configurar event listeners pasivos para mejorar el rendimiento de desplazamiento
const supportsPassive = (() => {
  let passive = false;
  try {
    const options = Object.defineProperty({}, 'passive', {
      get: function () {
        passive = true;
        return true;
      },
    });
    window.addEventListener('test', () => {}, options as EventListenerOptions);
    window.removeEventListener('test', () => {}, options as EventListenerOptions);
  } catch (e) {
    // Capturar error silenciosamente
  }
  return passive;
})();

if (supportsPassive) {
  const options = { passive: true };
  document.addEventListener('touchstart', () => {}, options);
  document.addEventListener('touchmove', () => {}, options);
  document.addEventListener('wheel', () => {}, options);
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VueQueryPlugin);
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: true,
  rtl: false,
});

app.mount('#app');
