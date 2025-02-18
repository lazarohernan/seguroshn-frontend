/**
 * AddInsurerModal.vue
 * 
 * Modal para agregar nuevas aseguradoras al sistema.
 * Características:
 * - Formulario con validación de campos
 * - Diseño responsivo con Tailwind CSS
 * - Secciones organizadas para información de la aseguradora y del gestor
 * - Feedback visual en interacciones
 * - Soporte para tema claro/oscuro
 */

<script setup lang="ts">
import { ref } from 'vue'
import { X, Upload, Building2, User, Phone, Mail } from 'lucide-vue-next'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [data: {
    name: string
    description: string
    logo: string
    managerName: string
    managerPhone: string
    managerEmail: string
  }]
}>()

const name = ref('')
const description = ref('')
const logo = ref('https://ui-avatars.com/api/?name=New&background=8CBFCF&color=fff&size=120&bold=true&format=svg')
const managerName = ref('')
const managerPhone = ref('')
const managerEmail = ref('')

const handleSubmit = () => {
  if (name.value && description.value) {
    emit('save', {
      name: name.value,
      description: description.value,
      logo: logo.value,
      managerName: managerName.value,
      managerPhone: managerPhone.value,
      managerEmail: managerEmail.value
    })
    resetForm()
  }
}

const resetForm = () => {
  name.value = ''
  description.value = ''
  logo.value = 'https://ui-avatars.com/api/?name=New&background=8CBFCF&color=fff&size=120&bold=true&format=svg'
  managerName.value = ''
  managerPhone.value = ''
  managerEmail.value = ''
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
      class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1100] p-6 sm:p-4"
      @click="handleClose"
    >
      <!-- Contenedor del modal -->
      <div 
        class="w-full max-w-[800px] max-h-[calc(100vh-3rem)] overflow-y-auto bg-background rounded-3xl sm:rounded-2xl border border-container-border shadow-[0_8px_32px_var(--container-shadow)]"
        @click.stop
      >
        <!-- Encabezado del modal -->
        <div class="sticky top-0 z-10 p-8 sm:p-5 border-b border-container-border flex items-center justify-between bg-background backdrop-blur-md">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Building2 class="w-6 h-6 text-white" />
            </div>
            <h2 class="text-2xl sm:text-xl font-semibold text-text m-0">Nueva Aseguradora</h2>
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
              <!-- Sección de logo -->
              <div class="flex flex-col items-center gap-4">
                <div class="w-[100px] h-[100px] rounded-xl overflow-hidden border-2 border-container-border hover:border-primary hover:scale-105 transition-all duration-300">
                  <img :src="logo" alt="Logo preview" class="w-full h-full object-cover" />
                </div>
                <button 
                  type="button" 
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-0.5"
                >
                  <Upload class="w-5 h-5" />
                  <span>Subir Logo</span>
                </button>
              </div>
              
              <!-- Sección de información de la aseguradora -->
              <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
                <div class="flex items-center gap-3 mb-6 sm:mb-5">
                  <Building2 class="w-5 h-5 text-primary" />
                  <h3 class="text-lg font-semibold text-text m-0">Información de la Aseguradora</h3>
                </div>
                <div class="flex flex-col gap-5">
                  <div class="flex flex-col gap-2">
                    <label for="name" class="text-sm font-medium text-text">Nombre de la Aseguradora</label>
                    <div class="relative flex items-center">
                      <Building2 class="absolute left-4 w-5 h-5 text-text opacity-50 transition-opacity duration-300 group-focus-within:opacity-100" />
                      <input 
                        id="name"
                        v-model="name"
                        type="text"
                        class="w-full py-3.5 pl-12 pr-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Ingrese el nombre"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <label for="description" class="text-sm font-medium text-text">Descripción</label>
                    <textarea
                      id="description"
                      v-model="description"
                      class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[100px]"
                      placeholder="Ingrese una descripción detallada de la aseguradora"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <!-- Sección de información del gestor -->
              <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
                <div class="flex items-center gap-3 mb-6 sm:mb-5">
                  <User class="w-5 h-5 text-primary" />
                  <h3 class="text-lg font-semibold text-text m-0">Información del Gestor</h3>
                </div>
                <div class="grid grid-cols-2 gap-5 sm:grid-cols-1 sm:gap-4">
                  <div class="flex flex-col gap-2">
                    <label for="managerName" class="text-sm font-medium text-text">Nombre del Gestor</label>
                    <div class="relative flex items-center">
                      <User class="absolute left-4 w-5 h-5 text-text opacity-50 transition-opacity duration-300 group-focus-within:opacity-100" />
                      <input 
                        id="managerName"
                        v-model="managerName"
                        type="text"
                        class="w-full py-3.5 pl-12 pr-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Ingrese el nombre completo"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <label for="managerPhone" class="text-sm font-medium text-text">Teléfono del Gestor</label>
                    <div class="relative flex items-center">
                      <Phone class="absolute left-4 w-5 h-5 text-text opacity-50 transition-opacity duration-300 group-focus-within:opacity-100" />
                      <input 
                        id="managerPhone"
                        v-model="managerPhone"
                        type="tel"
                        class="w-full py-3.5 pl-12 pr-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="+504 XXXX XXXX"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="col-span-2 flex flex-col gap-2">
                    <label for="managerEmail" class="text-sm font-medium text-text">Correo del Gestor</label>
                    <div class="relative flex items-center">
                      <Mail class="absolute left-4 w-5 h-5 text-text opacity-50 transition-opacity duration-300 group-focus-within:opacity-100" />
                      <input 
                        id="managerEmail"
                        v-model="managerEmail"
                        type="email"
                        class="w-full py-3.5 pl-12 pr-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
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
                Guardar Aseguradora
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>
