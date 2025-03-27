<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-primary">Bienvenido</h2>
        <p class="mt-2 text-sm text-gray-600">
          Inicia sesión para continuar
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <div class="mt-1">
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div class="mt-1">
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <!-- Error general -->
        <div v-if="auth.error" class="text-center">
          <p class="text-sm text-red-600">{{ auth.error }}</p>
        </div>

        <!-- Submit button -->
        <div>
          <button
            type="submit"
            :class="['w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary', { 'opacity-50 cursor-not-allowed': auth.loading }]"
          >
            <span v-if="auth.loading">Cargando...</span>
            <span v-else>Iniciar sesión</span>
          </button>
        </div>

        <!-- Links -->
        <div class="flex items-center justify-between">
          <div class="text-sm">
            <router-link
              to="/auth/forgot-password"
              class="font-medium text-primary hover:text-primary-dark"
            >
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>
          <div class="text-sm">
            <router-link
              to="/auth/register"
              class="font-medium text-primary hover:text-primary-dark"
            >
              Crear cuenta
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const route = useRoute()
const auth = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'El correo electrónico es requerido'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'El correo electrónico no es válido'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'La contraseña es requerida'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  const success = await auth.login(form.email, form.password)
  
  if (success) {
    // Redirigir a la ruta original o al dashboard
    const redirectTo = route.query.redirect?.toString() || '/dashboard'
    router.push(redirectTo)
  }
}
</script>
