<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  show: boolean
  receiptUrl: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1300] p-6"
      @click="emit('close')"
    >
      <div 
        class="w-full max-w-[600px] bg-background rounded-2xl border border-container-border shadow-[0_8px_32px_var(--container-shadow)] p-6 sm:p-5"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-text">Comprobante de Pago</h3>
          <button 
            class="p-1 rounded-lg text-text transition-all duration-300 hover:bg-primary hover:text-white"
            @click="emit('close')"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        
        <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
          <img 
            :src="receiptUrl" 
            alt="Comprobante de pago"
            class="absolute inset-0 w-full h-full object-contain bg-black/5"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
