<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-primary">Recuperar Contraseña</h2>
        <p class="mt-2 text-sm text-gray-600">
          Ingresa tu correo electrónico para recibir instrucciones
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <div class="mt-1">
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="text-center">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Success -->
        <div v-if="success" class="text-center">
          <p class="text-sm text-green-600">
            Se han enviado las instrucciones a tu correo electrónico
          </p>
        </div>

        <!-- Submit button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <span v-if="loading">Enviando...</span>
            <span v-else>Enviar instrucciones</span>
          </button>
        </div>

        <!-- Back to login -->
        <div class="text-center">
          <router-link
            to="/auth/login"
            class="font-medium text-primary hover:text-primary-dark"
          >
            Volver al inicio de sesión
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = false

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (resetError) throw resetError

    success.value = true
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script> 