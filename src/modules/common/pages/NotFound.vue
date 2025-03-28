<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-background">
    <div class="max-w-md w-full p-8 text-center">
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
        <p class="text-xl text-text/70 mb-8">Página no encontrada</p>
        <p class="text-text/60 mb-8">
          La página que estás buscando no existe o no tienes permisos para acceder a ella.
        </p>
        <RouterLink
          :to="{ name: 'login' }"
          class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1a84ef] text-white font-medium transition-all duration-300 hover:bg-[#1a84ef]/90 active:bg-[#1a84ef]/80 hover:shadow-lg hover:-translate-y-0.5"
        >
          Ir al inicio de sesión
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script> 