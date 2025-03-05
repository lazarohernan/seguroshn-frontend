<script setup lang="ts">
import { ref, watch } from 'vue'
import { Edit, Save, Image, ArrowLeftRight, CreditCard, BanknoteIcon } from 'lucide-vue-next'

interface Payment {
  id: number
  amount: number
  date: string
  method: 'efectivo' | 'tarjeta' | 'transferencia'
  receipt?: File
}

const props = defineProps<{
  payment: Payment
  isEditing: boolean
}>()

const emit = defineEmits<{
  edit: []
  save: [payment: Payment]
  close: []
  viewReceipt: []
}>()

const localPayment = ref<Payment>({
  id: 0,
  amount: 0,
  date: '',
  method: 'efectivo'
})

// Actualizar el pago local cuando cambia el prop
watch(() => props.payment, (newPayment) => {
  localPayment.value = { ...newPayment }
}, { immediate: true })

const paymentMethods = [
  {
    id: 'efectivo' as const,
    label: 'Efectivo',
    icon: BanknoteIcon
  },
  {
    id: 'tarjeta' as const,
    label: 'Tarjeta',
    icon: CreditCard
  },
  {
    id: 'transferencia' as const,
    label: 'Transferencia',
    icon: ArrowLeftRight
  }
]

const handleSave = () => {
  emit('save', localPayment.value)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-text">{{ isEditing ? 'Editar Pago' : 'Detalles del Pago' }}</h3>
      <button 
        v-if="!isEditing"
        class="group flex items-center gap-2 px-4 py-2 rounded-lg bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white"
        @click="emit('edit')"
      >
        <Edit class="w-4 h-4 text-text group-hover:text-white" />
        <span>Editar</span>
      </button>
    </div>

    <div class="p-5 bg-input-bg rounded-xl flex flex-col gap-5">
      <div class="grid grid-cols-[1.5fr_1fr] gap-4">
        <!-- Monto del Abono -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-text">Monto del Abono</label>
          <div class="relative flex items-center">
            <div class="absolute left-4 text-text/50">L</div>
            <input
              v-model="localPayment.amount"
              type="number"
              min="0"
              step="0.01"
              :disabled="!isEditing"
              class="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <!-- Fecha de Pago -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-text">Fecha de Pago</label>
          <div class="relative flex items-center">
            <input
              v-model="localPayment.date"
              type="date"
              :disabled="!isEditing"
              class="w-full px-4 py-3 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <!-- Método de Pago -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-text">Método de Pago</label>
        <div class="flex gap-3">
          <label 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="flex-1 relative flex flex-col items-center gap-2 p-4 rounded-xl border border-input-border bg-background cursor-pointer transition-all duration-300 hover:border-primary disabled:opacity-70 disabled:cursor-not-allowed"
            :class="{ 
              'border-primary bg-primary/10': localPayment.method === method.id,
              'opacity-70 cursor-not-allowed hover:border-input-border': !isEditing 
            }"
          >
              <input
                v-model="localPayment.method"
                type="radio"
                :value="method.id"
                name="viewPaymentMethod"
                :disabled="!isEditing"
                class="absolute opacity-0"
              />
            <component 
              :is="method.icon" 
              class="w-6 h-6 text-text/70 transition-colors duration-300"
              :class="{ 'text-primary': localPayment.method === method.id }"
            />
            <span class="text-sm text-text">{{ method.label }}</span>
          </label>
        </div>
      </div>

      <!-- Comprobante -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-text">Comprobante</label>
        <div v-if="localPayment.receipt" class="flex items-center gap-3">
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white"
            @click="emit('viewReceipt')"
          >
            <Image class="w-4 h-4" />
            <span>Ver Comprobante</span>
          </button>
        </div>
        <div v-else class="flex items-center gap-3 p-3 border border-input-border rounded-lg bg-background">
          <span class="text-sm text-text/70">Comprobante no subido</span>
        </div>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="flex gap-4 pt-5 border-t border-input-border">
      <button 
        type="button" 
        class="flex-1 px-6 py-3 rounded-lg bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white"
        @click="emit('close')"
      >
        Cerrar
      </button>
      <button 
        v-if="isEditing"
        type="button" 
        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
        @click="handleSave"
      >
        <Save class="w-4 h-4" />
        Guardar Cambios
      </button>
    </div>
  </div>
</template>
