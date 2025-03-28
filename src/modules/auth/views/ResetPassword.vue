<template>
  <div class="w-full lg:flex-1 lg:max-w-[600px] flex flex-col justify-center text-center lg:text-left">
    <h2 class="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-semibold text-white leading-tight mb-4">
      Establece tu<br />nueva contraseña
    </h2>
  </div>
  <div class="w-full lg:flex-1 lg:max-w-[440px] flex justify-center lg:justify-end items-center">
    <div class="w-full max-w-[440px] rounded-2xl p-6 lg:p-8 bg-white border border-container-border shadow-lg">
      <div class="mb-4">
        <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-text transition-colors duration-300">
          Plataforma de Seguros
        </h2>
      </div>
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 text-text leading-tight transition-colors duration-300">
        🔐 Nueva contraseña
      </h1>

      <!-- Formulario de cambio de contraseña -->
      <form class="flex flex-col gap-4" @submit.prevent="onResetPassword">
        <!-- Campo de contraseña con toggle de visibilidad -->
        <div class="flex flex-col w-full relative">
          <div class="relative rounded-xl bg-input-bg border border-input-border transition-all duration-300 overflow-hidden hover:border-primary hover:shadow-md focus-within:border-primary focus-within:shadow-lg">
            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text opacity-50 transition-all duration-300 group-focus-within:text-primary group-focus-within:opacity-100" />
            <input
              id="password"
              ref="inputPasswordRef"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full py-3 lg:py-4 px-12 pr-12 border-none rounded-xl bg-transparent text-input-text text-base transition-all duration-200 focus:outline-none placeholder:text-input-placeholder"
              aria-label="Nueva contraseña"
              placeholder="Nueva contraseña"
              required
              minlength="8"
            />
            <button
              :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none text-text opacity-50 cursor-pointer transition-all duration-200 flex items-center justify-center hover:opacity-100 hover:text-primary focus:outline-none focus:opacity-100 focus:text-primary"
              aria-controls="password"
              @click="togglePassword"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Campo de confirmación de contraseña -->
        <div class="flex flex-col w-full relative">
          <div class="relative rounded-xl bg-input-bg border border-input-border transition-all duration-300 overflow-hidden hover:border-primary hover:shadow-md focus-within:border-primary focus-within:shadow-lg">
            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text opacity-50 transition-all duration-300 group-focus-within:text-primary group-focus-within:opacity-100" />
            <input
              id="confirmPassword"
              ref="inputConfirmPasswordRef"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="w-full py-3 lg:py-4 px-12 pr-12 border-none rounded-xl bg-transparent text-input-text text-base transition-all duration-200 focus:outline-none placeholder:text-input-placeholder"
              aria-label="Confirmar contraseña"
              placeholder="Confirmar contraseña"
              required
              minlength="8"
            />
            <button
              :title="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none text-text opacity-50 cursor-pointer transition-all duration-200 flex items-center justify-center hover:opacity-100 hover:text-primary focus:outline-none focus:opacity-100 focus:text-primary"
              aria-controls="confirmPassword"
              @click="toggleConfirmPassword"
            >
              <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Mensaje de error/éxito -->
        <div v-if="message.text" :class="['text-center mt-2 text-sm', message.type === 'error' ? 'text-red-500' : 'text-green-500']" role="alert">
          {{ message.text }}
        </div>

        <!-- Botón de submit -->
        <button
          :disabled="loading"
          :aria-label="loading ? 'Cambiando contraseña...' : 'Cambiar contraseña'"
          type="submit"
          class="w-full py-3 lg:py-4 bg-primary text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 mt-4 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          {{ loading ? 'Cambiando contraseña...' : 'Cambiar contraseña' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Lock, Eye, EyeOff } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

const router = useRouter();
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const message = ref({ text: '', type: '' });
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const inputPasswordRef = ref<HTMLInputElement | null>(null);
const inputConfirmPasswordRef = ref<HTMLInputElement | null>(null);
const hasValidToken = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

onMounted(async () => {
  try {
    // Obtener el hash de la URL
    const hash = window.location.hash;
    console.log('Hash de la URL:', hash);

    if (!hash) {
      throw new Error('No se encontró el token de recuperación');
    }

    // Extraer los tokens del hash
    const params = new URLSearchParams(hash.replace('#', ''));
    const accessToken = params.get('access_token');
    const type = params.get('type');

    console.log('Tipo de operación:', type);

    if (!accessToken) {
      throw new Error('Token de recuperación inválido');
    }

    // Establecer la sesión con el token
    const { data: { session }, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: accessToken // En este caso usamos el mismo token
    });

    if (sessionError) {
      console.error('Error al establecer la sesión:', sessionError);
      throw sessionError;
    }

    if (!session) {
      throw new Error('No se pudo establecer la sesión');
    }

    console.log('Sesión establecida:', session);
    hasValidToken.value = true;

  } catch (error) {
    console.error('Error al validar la sesión:', error);
    message.value = {
      text: 'El enlace de recuperación ha expirado o no es válido. Por favor, solicita uno nuevo.',
      type: 'error',
    };
    // Redirigir al login después de 3 segundos
    setTimeout(() => {
      router.push({ name: 'login' });
    }, 3000);
  }
});

const onResetPassword = async () => {
  if (!hasValidToken.value) {
    message.value = {
      text: 'El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.',
      type: 'error',
    };
    return router.push({ name: 'login' });
  }

  // Validaciones
  if (password.value === '') {
    message.value = { text: 'La contraseña es obligatoria', type: 'error' };
    return inputPasswordRef.value?.focus();
  }

  if (password.value.length < 8) {
    message.value = { text: 'La contraseña debe tener al menos 8 caracteres', type: 'error' };
    return inputPasswordRef.value?.focus();
  }

  if (confirmPassword.value === '') {
    message.value = { text: 'Debes confirmar la contraseña', type: 'error' };
    return inputConfirmPasswordRef.value?.focus();
  }

  if (password.value !== confirmPassword.value) {
    message.value = { text: 'Las contraseñas no coinciden', type: 'error' };
    return inputConfirmPasswordRef.value?.focus();
  }

  loading.value = true;
  message.value = { text: '', type: '' };

  try {
    console.log('Intentando actualizar contraseña...');
    const { error } = await supabase.auth.updateUser({
      password: password.value,
    });

    if (error) {
      console.error('Error al actualizar contraseña:', error);
      throw error;
    }

    console.log('Contraseña actualizada exitosamente');
    message.value = {
      text: 'Contraseña actualizada correctamente. Redirigiendo al login...',
      type: 'success',
    };

    // Cerrar sesión y redirigir al login después de 3 segundos
    setTimeout(async () => {
      await supabase.auth.signOut();
      router.push({ name: 'login' });
    }, 3000);
  } catch (error: unknown) {
    console.error('Error completo:', error);
    if (error instanceof AuthError) {
      message.value = {
        text: error.message,
        type: 'error',
      };
    } else {
      message.value = {
        text: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
        type: 'error',
      };
    }
  } finally {
    loading.value = false;
  }
};
</script> 