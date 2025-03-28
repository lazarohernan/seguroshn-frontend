<template>
  <div
    class="w-full lg:flex-1 lg:max-w-[600px] flex flex-col justify-center text-center lg:text-left"
  >
    <h2
      class="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-semibold text-white leading-tight mb-4"
    >
      Recupera tu<br />contraseña
    </h2>
  </div>
  <div class="w-full lg:flex-1 lg:max-w-[440px] flex justify-center lg:justify-end items-center">
    <div
      class="w-full max-w-[440px] rounded-2xl p-6 lg:p-8 bg-white border border-container-border shadow-lg"
    >
      <div class="mb-4">
        <h2
          class="text-lg sm:text-xl lg:text-2xl font-semibold text-text transition-colors duration-300"
        >
          Plataforma de Seguros
        </h2>
      </div>
      <h1
        class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 text-text leading-tight transition-colors duration-300"
      >
        🔑 Recupera tu<br />contraseña
      </h1>
      <p class="text-base lg:text-lg text-text opacity-90 mb-6">
        Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu
        contraseña.
      </p>
      <form class="flex flex-col gap-4" @submit.prevent="onRecover">
        <div class="flex flex-col w-full relative">
          <div
            class="relative rounded-xl bg-input-bg border border-input-border transition-all duration-300 overflow-hidden hover:border-primary hover:shadow-md focus-within:border-primary focus-within:shadow-lg"
          >
            <Mail
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text opacity-50 transition-all duration-300 group-focus-within:text-primary group-focus-within:opacity-100"
            />
            <input
              id="email"
              ref="inputEmailRef"
              v-model="email"
              type="email"
              class="w-full py-3 lg:py-4 px-12 border-none rounded-xl bg-transparent text-input-text text-base transition-all duration-200 focus:outline-none placeholder:text-input-placeholder"
              placeholder="Correo electrónico"
              required
              aria-label="Correo electrónico"
              autocomplete="email"
            />
          </div>
        </div>

        <div v-if="message.text" :class="['text-center mt-2 text-sm', message.type === 'error' ? 'text-red-500' : 'text-green-500']" role="alert">
          {{ message.text }}
        </div>

        <button
          :disabled="loading"
          :aria-label="loading ? 'Enviando...' : 'Enviar correo de recuperación'"
          type="submit"
          class="w-full py-3 lg:py-4 bg-primary text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-300 mt-4 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          {{ loading ? 'Enviando...' : 'Enviar correo de recuperación' }}
        </button>

        <p class="text-center text-sm text-text opacity-80 mt-4">
          ¿Recordaste tu contraseña?
          <router-link
            class="text-primary no-underline transition-colors duration-300 hover:text-primary-hover hover:underline"
            :to="{ name: 'login' }"
            >Iniciar sesión</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Mail } from 'lucide-vue-next';
  import { useRouter } from 'vue-router';
  import { supabase } from '@/lib/supabase';
  import { AuthError } from '@supabase/supabase-js';

  const router = useRouter();
  const email = ref('');
  const loading = ref(false);
  const message = ref({ text: '', type: '' });
  const inputEmailRef = ref<HTMLInputElement | null>(null);

  const onRecover = async () => {
    if (email.value === '') {
      message.value = { text: 'El correo electrónico es obligatorio', type: 'error' };
      return inputEmailRef.value?.focus();
    }

    loading.value = true;
    message.value = { text: '', type: '' };

    try {
      console.log('Enviando solicitud de recuperación a:', email.value);
      const redirectURL = `${window.location.origin}/auth/reset-password`;
      console.log('URL de redirección:', redirectURL);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email.value, {
        redirectTo: redirectURL,
      });

      console.log('Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
      }

      message.value = {
        text: 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña',
        type: 'success',
      };

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
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
