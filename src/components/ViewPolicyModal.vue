/**
 * ViewPolicyModal.vue
 * 
 * Modal para ver y editar detalles de pólizas.
 * Características:
 * - Vista detallada de información de póliza
 * - Modo de edición integrado
 * - Confirmación de eliminación
 * - Diseño responsivo con Tailwind CSS
 * - Feedback visual en interacciones
 */

<script setup lang="ts">
import { ref } from 'vue'
import { X, Car, Home, Heart, Umbrella, Shield, Building2, Hash, Calendar, Edit2, Trash2 } from 'lucide-vue-next'

interface Policy {
  id: string
  type: 'auto' | 'home' | 'life' | 'health' | 'business'
  name: string
  description: string
  insurer: string
  policyNumber: string
  startDate: string
}

const props = defineProps<{
  show: boolean
  policy: Policy
}>()

const emit = defineEmits<{
  close: []
  edit: [policy: Policy]
  delete: [policy: Policy]
}>()

const editMode = ref(false)
const showDeleteConfirm = ref(false)

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

const editedPolicy = ref<Policy>({ ...props.policy })

const handleEdit = () => {
  editMode.value = true
  editedPolicy.value = { ...props.policy }
}

const handleSave = () => {
  emit('edit', editedPolicy.value)
  editMode.value = false
}

const handleDelete = () => {
  showDeleteConfirm.value = true
}

const confirmDelete = () => {
  emit('delete', props.policy)
  showDeleteConfirm.value = false
  emit('close')
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}

const handleClose = () => {
  editMode.value = false
  showDeleteConfirm.value = false
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
              <component :is="policyTypes.find(t => t.id === policy.type)?.icon" class="w-6 h-6 text-white" />
            </div>
            <h2 class="text-2xl sm:text-xl font-semibold text-text m-0">{{ editMode ? 'Editar Póliza' : 'Detalles de la Póliza' }}</h2>
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
          <!-- Vista de detalles -->
          <div v-if="!editMode" class="flex flex-col gap-8">
            <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
              <h3 class="text-lg font-semibold text-primary border-b-2 border-primary pb-2 mb-6">Información General</h3>
              <div class="grid grid-cols-2 gap-5 sm:grid-cols-1">
                <div class="bg-background border border-input-border rounded-xl p-4">
                  <label class="block text-xs font-medium text-text/70 mb-2">Tipo de Póliza</label>
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium">
                    <component :is="policyTypes.find(t => t.id === policy.type)?.icon" class="w-4 h-4" />
                    <span>{{ policyTypes.find(t => t.id === policy.type)?.label }}</span>
                  </div>
                </div>

                <div class="bg-background border border-input-border rounded-xl p-4">
                  <label class="block text-xs font-medium text-text/70 mb-2">Número de Póliza</label>
                  <div class="flex items-center gap-2 text-sm text-text">
                    <Hash class="w-4 h-4 text-primary opacity-70" />
                    <span>{{ policy.policyNumber }}</span>
                  </div>
                </div>

                <div class="col-span-2 sm:col-span-1 bg-background border border-input-border rounded-xl p-4">
                  <label class="block text-xs font-medium text-text/70 mb-2">Nombre de la Póliza</label>
                  <p class="m-0 text-sm text-text">{{ policy.name }}</p>
                </div>
              </div>
            </div>

            <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
              <h3 class="text-lg font-semibold text-primary border-b-2 border-primary pb-2 mb-6">Detalles de Cobertura</h3>
              <div class="grid grid-cols-2 gap-5 sm:grid-cols-1">
                <div class="bg-background border border-input-border rounded-xl p-4">
                  <label class="block text-xs font-medium text-text/70 mb-2">Aseguradora</label>
                  <div class="flex items-center gap-2 text-sm text-text">
                    <Building2 class="w-4 h-4 text-primary opacity-70" />
                    <span>{{ policy.insurer }}</span>
                  </div>
                </div>

                <div class="bg-background border border-input-border rounded-xl p-4">
                  <label class="block text-xs font-medium text-text/70 mb-2">Fecha de Inicio</label>
                  <div class="flex items-center gap-2 text-sm text-text">
                    <Calendar class="w-4 h-4 text-primary opacity-70" />
                    <span>{{ new Date(policy.startDate).toLocaleDateString('es-HN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) }}</span>
                  </div>
                </div>

                <div class="col-span-2 sm:col-span-1 bg-background border border-input-border rounded-xl p-4">
                  <label class="block text-xs font-medium text-text/70 mb-2">Descripción</label>
                  <p class="m-0 text-sm text-text whitespace-pre-line">{{ policy.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulario de edición -->
          <form class="flex flex-col gap-8" @submit.prevent="handleSave">
            <!-- Selector de tipo de póliza -->
            <div>
              <h3 class="text-sm font-medium text-text mb-4">Tipo de Póliza</h3>
              <div class="grid grid-cols-5 sm:grid-cols-2 gap-3">
                <button
                  v-for="type in policyTypes"
                  :key="type.id"
                  type="button"
                  class="flex flex-col items-center gap-2 p-4 rounded-xl bg-input-bg border border-input-border text-text text-xs transition-all duration-300 hover:border-primary hover:-translate-y-0.5"
                  :class="{ 'bg-primary !border-primary text-white': editedPolicy.type === type.id }"
                  @click="editedPolicy.type = type.id as Policy['type']"
                >
                  <component :is="type.icon" class="w-6 h-6" :class="{ 'text-white': editedPolicy.type === type.id }" />
                  <span>{{ type.label }}</span>
                </button>
              </div>
            </div>

            <!-- Campos de edición -->
            <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
              <div class="grid grid-cols-2 gap-5 sm:grid-cols-1">
                <div class="flex flex-col gap-2">
                  <label for="insurer" class="flex items-center gap-2 text-sm font-medium text-text">
                    <Building2 class="w-5 h-5 text-primary" />
                    Aseguradora
                  </label>
                  <select
                    id="insurer"
                    v-model="editedPolicy.insurer"
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
                    v-model="editedPolicy.policyNumber"
                    type="text"
                    class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Ingrese el número"
                    required
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label for="name" class="text-sm font-medium text-text">Nombre de la Póliza</label>
                  <input
                    id="name"
                    v-model="editedPolicy.name"
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
                    v-model="editedPolicy.startDate"
                    type="date"
                    class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div class="col-span-2 flex flex-col gap-2">
                  <label for="description" class="text-sm font-medium text-text">Descripción</label>
                  <textarea
                    id="description"
                    v-model="editedPolicy.description"
                    class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[100px]"
                    placeholder="Ingrese una descripción detallada de la póliza"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Pie del modal -->
        <div class="sticky bottom-0 bg-background border-t border-container-border p-8 sm:p-5">
          <div v-if="!editMode" class="flex justify-end gap-4 sm:flex-col-reverse sm:gap-3">
            <button 
              class="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium border border-red-500 text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white hover:-translate-y-0.5 sm:w-full sm:justify-center"
              @click="handleDelete"
            >
              <Trash2 class="w-5 h-5" />
              Eliminar
            </button>
            <button 
              class="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium bg-primary text-white border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg sm:w-full sm:justify-center"
              @click="handleEdit"
            >
              <Edit2 class="w-5 h-5" />
              Editar
            </button>
          </div>
          <div v-else class="flex justify-end gap-4 sm:flex-col-reverse sm:gap-3">
            <button 
              type="button"
              class="px-7 py-3.5 rounded-xl text-sm font-medium bg-transparent border border-input-border text-text transition-all duration-300 hover:bg-input-bg hover:border-primary sm:w-full"
              @click="editMode = false"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-7 py-3.5 rounded-xl text-sm font-medium bg-primary text-white border-none min-w-[160px] transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg sm:w-full sm:min-w-0"
              @click="handleSave"
            >
              Guardar Cambios
            </button>
          </div>
        </div>

        <!-- Confirmación de eliminación -->
        <div 
          v-if="showDeleteConfirm" 
          class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1200] p-6"
          @click="cancelDelete"
        >
          <div 
            class="w-full max-w-[400px] bg-background rounded-2xl border border-container-border shadow-[0_8px_32px_var(--container-shadow)] p-6 sm:p-5"
            @click.stop
          >
            <h3 class="text-xl font-semibold text-text mb-2">¿Eliminar póliza?</h3>
            <p class="text-sm text-text/70 mb-6">Esta acción no se puede deshacer.</p>
            <div class="flex gap-4 sm:flex-col-reverse sm:gap-3">
              <button 
                class="flex-1 px-5 py-3 rounded-xl text-sm font-medium bg-transparent border border-input-border text-text transition-all duration-300 hover:bg-input-bg hover:border-primary"
                @click="cancelDelete"
              >
                Cancelar
              </button>
              <button 
                class="flex-1 px-5 py-3 rounded-xl text-sm font-medium bg-red-500 text-white border-none transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
                @click="confirmDelete"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
