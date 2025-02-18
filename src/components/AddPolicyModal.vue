/**
 * AddPolicyModal.vue
 * 
 * Modal para agregar nuevas pólizas al sistema.
 * Características:
 * - Selector visual de tipos de póliza
 * - Formulario con validación de campos
 * - Diseño responsivo con Tailwind CSS
 * - Feedback visual en interacciones
 * - Soporte para tema claro/oscuro
 */

<script setup lang="ts">
import { ref } from 'vue'
import { X, Car, Home, Heart, Umbrella, Shield, Building2, Hash, Calendar } from 'lucide-vue-next'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [data: {
    type: 'auto' | 'home' | 'life' | 'health' | 'business'
    name: string
    description: string
    insurer: string
    policyNumber: string
    startDate: string
  }]
}>()

const policyTypes = [
  { id: 'auto', label: 'Automóvil', icon: Car },
  { id: 'home', label: 'Hogar', icon: Home },
  { id: 'life', label: 'Vida', icon: Heart },
  { id: 'health', label: 'Salud', icon: Umbrella },
  { id: 'business', label: 'Negocio', icon: Shield }
]

const insurers = [
  { id: 1, name: 'Seguros XYZ' },
  { id: 2, name: 'Aseguradora ABC' },
  { id: 3, name: 'Seguros 123' }
]

const selectedType = ref<'auto' | 'home' | 'life' | 'health' | 'business'>('auto')
const name = ref('')
const description = ref('')
const selectedInsurer = ref('')
const policyNumber = ref('')
const startDate = ref('')

const handleSubmit = () => {
  if (name.value && description.value && selectedInsurer.value && policyNumber.value && startDate.value) {
    emit('save', {
      type: selectedType.value,
      name: name.value,
      description: description.value,
      insurer: selectedInsurer.value,
      policyNumber: policyNumber.value,
      startDate: startDate.value
    })
    resetForm()
  }
}

const resetForm = () => {
  selectedType.value = 'auto'
  name.value = ''
  description.value = ''
  selectedInsurer.value = ''
  policyNumber.value = ''
  startDate.value = ''
}

const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <!-- Overlay con efecto de desenfoque -->
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1100] p-6 sm:p-0"
      @click="handleClose"
    >
      <!-- Contenedor del modal -->
      <div 
        class="w-full max-w-[800px] max-h-[calc(100vh-3rem)] sm:max-h-screen overflow-y-auto bg-background rounded-3xl sm:rounded-none border border-container-border shadow-[0_8px_32px_var(--container-shadow)]"
        @click.stop
      >
        <!-- Encabezado del modal -->
        <div class="sticky top-0 z-10 p-8 sm:p-5 border-b border-container-border flex items-center justify-between bg-background backdrop-blur-md">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <component :is="policyTypes.find(t => t.id === selectedType)?.icon" class="w-6 h-6 text-white" />
            </div>
            <h2 class="text-2xl sm:text-xl font-semibold text-text m-0">Nueva Póliza</h2>
          </div>
          <button 
            class="p-2 rounded-lg border-none bg-transparent text-text cursor-pointer transition-all duration-300 hover:bg-input-bg hover:-translate-y-0.5 flex items-center justify-center"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Cuerpo del modal -->
        <div class="p-8 sm:p-5">
          <form @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-8 sm:gap-6">
              <!-- Selector de tipo de póliza -->
              <div>
                <h3 class="text-sm font-medium text-text mb-4">Tipo de Póliza</h3>
                <div class="grid grid-cols-5 sm:grid-cols-2 gap-3">
                  <button
                    v-for="type in policyTypes"
                    :key="type.id"
                    type="button"
                    class="flex flex-col items-center gap-2 p-4 rounded-xl bg-input-bg border border-input-border text-text text-xs transition-all duration-300 hover:border-primary hover:-translate-y-0.5"
                    :class="{ 'bg-primary !border-primary text-white': selectedType === type.id }"
                    @click="selectedType = type.id as typeof selectedType"
                  >
                    <component :is="type.icon" class="w-6 h-6" :class="{ 'text-white': selectedType === type.id }" />
                    <span>{{ type.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Sección de información básica -->
              <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
                <div class="grid grid-cols-2 gap-5 sm:grid-cols-1 sm:gap-4">
                  <div class="flex flex-col gap-2">
                    <label for="insurer" class="flex items-center gap-2 text-sm font-medium text-text">
                      <Building2 class="w-5 h-5 text-primary" />
                      Aseguradora
                    </label>
                    <select
                      id="insurer"
                      v-model="selectedInsurer"
                      class="w-full py-3.5 pl-4 pr-10 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:16px] bg-[center_right_1rem]"
                      required
                    >
                      <option value="" disabled>Seleccione una aseguradora</option>
                      <option v-for="insurer in insurers" :key="insurer.id" :value="insurer.name">
                        {{ insurer.name }}
                      </option>
                    </select>
                  </div>

                  <div class="flex flex-col gap-2">
                    <label for="policyNumber" class="flex items-center gap-2 text-sm font-medium text-text">
                      <Hash class="w-5 h-5 text-primary" />
                      Número de Póliza
                    </label>
                    <input 
                      id="policyNumber"
                      v-model="policyNumber"
                      type="text"
                      class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Ingrese el número"
                      required
                    />
                  </div>
                </div>
              </div>

              <!-- Sección de detalles -->
              <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
                <div class="grid grid-cols-2 gap-5 sm:grid-cols-1 sm:gap-4">
                  <div class="flex flex-col gap-2">
                    <label for="name" class="text-sm font-medium text-text">Nombre de la Póliza</label>
                    <input
                      id="name"
                      v-model="name"
                      type="text"
                      class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Ingrese el nombre de la póliza"
                      required
                    />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label for="startDate" class="flex items-center gap-2 text-sm font-medium text-text">
                      <Calendar class="w-5 h-5 text-primary" />
                      Fecha de Inicio
                    </label>
                    <input
                      id="startDate"
                      v-model="startDate"
                      type="date"
                      class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div class="col-span-2 flex flex-col gap-2">
                    <label for="description" class="text-sm font-medium text-text">Descripción</label>
                    <textarea
                      id="description"
                      v-model="description"
                      class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[100px]"
                      placeholder="Ingrese una descripción detallada de la póliza"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones del formulario -->
            <div class="flex flex-row gap-4 mt-8 pt-6 border-t border-container-border sm:flex-col-reverse sm:gap-3">
              <button 
                type="button" 
                class="flex-1 px-7 py-3.5 rounded-xl text-sm font-medium bg-transparent border border-input-border text-text transition-all duration-300 hover:bg-input-bg hover:border-primary sm:w-full"
                @click="handleClose"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="flex-1 px-7 py-3.5 rounded-xl text-sm font-medium bg-primary text-white border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg sm:w-full"
              >
                Guardar Póliza
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>
