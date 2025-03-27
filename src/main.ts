import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Importar TokenManager para inicializarlo al arranque
import { tokenManager } from '@/lib/supabase-enhanced';

import './style.css';

// Inicializar el sistema de gestión de tokens de Supabase y verificar su estado
// Esto hará que el TokenManager inicie el listener de eventos y el refresco proactivo
console.log('Supabase TokenManager iniciado', 
  tokenManager ? 'Estado: Activo' : 'Estado: Error de inicialización');

// Verificar sesión al inicio para activar el refresh proactivo si hay una sesión activa
(async () => {
  try {
    await tokenManager.refreshToken();
  } catch (err) {
    console.log('No hay sesión activa para refrescar');
  }
})();

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
