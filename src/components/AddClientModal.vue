/**
 * AddClientModal.vue
 * 
 * Modal para agregar nuevos clientes al sistema.
 * Características:
 * - Formulario con validación de campos
 * - Diseño responsivo con Tailwind CSS
 * - Secciones organizadas para información personal y de contacto
 * - Feedback visual en interacciones
 * - Soporte para tema claro/oscuro
 */

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, User, Mail, Phone, MapPin, Calendar, CreditCard, FileText, Building2, AlertTriangle } from 'lucide-vue-next'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [data: {
    firstName: string
    lastName: string
    dni: string
    rtn?: string
    birthDate?: string
    email: string
    company?: string
    phone?: string
    alternativePhone?: string
    address?: string
  }]
}>()

const firstName = ref('')
const lastName = ref('')
const dni = ref('')
const rtn = ref('')
const birthDate = ref('')
const email = ref('')
const company = ref('')
const phone = ref('')
const alternativePhone = ref('')
const address = ref('')
const showCloseConfirm = ref(false)
const hasChanges = ref(false)

// Observar cambios en los campos
watch([firstName, lastName, dni, rtn, birthDate, email, company, phone, alternativePhone, address], () => {
  hasChanges.value = firstName.value !== '' || 
    lastName.value !== '' || 
    dni.value !== '' || 
    rtn.value !== '' || 
    birthDate.value !== '' || 
    email.value !== '' || 
    company.value !== '' || 
    phone.value !== '' || 
    alternativePhone.value !== '' || 
    address.value !== ''
}, { deep: true })

// Validación para permitir solo letras y espacios
const onlyLetters = (e: KeyboardEvent) => {
  const char = String.fromCharCode(e.keyCode || e.charCode)
  if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]$/.test(char)) {
    e.preventDefault()
  }
}

// Validación para permitir solo números
const onlyNumbers = (e: KeyboardEvent) => {
  const char = String.fromCharCode(e.keyCode || e.charCode)
  if (!/^[0-9]$/.test(char)) {
    e.preventDefault()
  }
}

const handleSubmit = () => {
  if (firstName.value && lastName.value && dni.value && email.value) {
    emit('save', {
      firstName: firstName.value,
      lastName: lastName.value,
      dni: dni.value.replace(/[^0-9]/g, ''), // Eliminar guiones si existen
      rtn: rtn.value || undefined,
      birthDate: birthDate.value || undefined,
      email: email.value,
      company: company.value || undefined,
      phone: phone.value ? `+504 ${phone.value}` : undefined,
      alternativePhone: alternativePhone.value ? `+504 ${alternativePhone.value}` : undefined,
      address: address.value || undefined
    })
    resetForm()
  }
}

const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  dni.value = ''
  rtn.value = ''
  birthDate.value = ''
  email.value = ''
  company.value = ''
  phone.value = ''
  alternativePhone.value = ''
  address.value = ''
  hasChanges.value = false
}

const handleClose = () => {
  if (hasChanges.value) {
    showCloseConfirm.value = true
  } else {
    confirmClose()
  }
}

const confirmClose = () => {
  resetForm()
  showCloseConfirm.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <!-- Overlay con efecto de desenfoque -->
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1100] p-6 sm:p-4"
      @click="handleClose"
    >
      <!-- Contenedor del modal -->
      <div 
        class="w-full max-w-[600px] max-h-[calc(100vh-3rem)] overflow-y-auto bg-background rounded-3xl border border-container-border shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-transform duration-300 sm:rounded-2xl"
        @click.stop
      >
        <!-- Encabezado del modal -->
        <div class="sticky top-0 z-10 px-6 py-4 border-b border-container-border flex items-center justify-between bg-background/80 backdrop-blur-xl">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-primary/10">
              <User class="w-5 h-5 text-primary" />
            </div>
            <h2 class="text-xl font-semibold text-text">Nuevo Cliente</h2>
          </div>
          <button 
            class="p-2 rounded-lg hover:bg-input-bg text-text/70 transition-all duration-300 hover:text-text hover:-translate-y-0.5"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Cuerpo del modal -->
        <div class="p-6">
          <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
            <!-- Sección de información personal -->
            <div class="bg-input-bg border border-input-border rounded-xl p-5">
              <div class="flex items-center gap-3 mb-4">
                <User class="w-5 h-5 text-primary/70" />
                <h3 class="text-base font-medium text-text">Información Personal</h3>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <!-- Primera fila: Nombres y Apellidos -->
                <div class="flex flex-col gap-1.5">
                  <label for="firstName" class="text-sm font-medium text-text/70">Nombres</label>
                  <div class="relative group">
                    <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                    <input 
                      id="firstName"
                      v-model="firstName"
                      type="text"
                      required
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="Ingrese los nombres"
                      @keypress="onlyLetters"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="lastName" class="text-sm font-medium text-text/70">Apellidos</label>
                  <div class="relative group">
                    <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                    <input 
                      id="lastName"
                      v-model="lastName"
                      type="text"
                      required
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="Ingrese los apellidos"
                      @keypress="onlyLetters"
                    />
                  </div>
                </div>

                <!-- Segunda fila: DNI y RTN -->
                <div class="flex flex-col gap-1.5">
                  <label for="dni" class="text-sm font-medium text-text/70">DNI</label>
                  <div class="relative group">
                    <CreditCard class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                    <input 
                      id="dni"
                      v-model="dni"
                      type="text"
                      maxlength="13"
                      required
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="0801199012345"
                      @keypress="onlyNumbers"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="rtn" class="text-sm font-medium text-text/70">RTN</label>
                  <div class="relative group">
                    <FileText class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                    <input 
                      id="rtn"
                      v-model="rtn"
                      type="text"
                      maxlength="13"
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="0801199012345"
                      @keypress="onlyNumbers"
                    />
                  </div>
                </div>

                <!-- Tercera fila: Fecha de Nacimiento -->
                <div class="flex flex-col gap-1.5 col-span-2">
                  <label for="birthDate" class="text-sm font-medium text-text/70">Fecha de Nacimiento</label>
                  <div class="relative group">
                    <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                    <input 
                      id="birthDate"
                      v-model="birthDate"
                      type="date"
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección de información de contacto -->
            <div class="bg-input-bg border border-input-border rounded-xl p-5">
              <div class="flex items-center gap-3 mb-4">
                <Mail class="w-5 h-5 text-primary/70" />
                <h3 class="text-base font-medium text-text">Información de Contacto</h3>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <!-- Primera fila: Correo Electrónico y Empresa -->
                <div class="flex flex-col gap-1.5">
                  <label for="email" class="text-sm font-medium text-text/70">Correo Electrónico</label>
                  <div class="relative group">
                    <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                    <input 
                      id="email"
                      v-model="email"
                      type="email"
                      required
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="company" class="text-sm font-medium text-text/70">Empresa</label>
                  <div class="relative group">
                    <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                    <input 
                      id="company"
                      v-model="company"
                      type="text"
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                </div>

                <!-- Teléfonos -->
                <div class="grid grid-cols-2 gap-4 col-span-2">
                  <!-- Teléfono Principal -->
                  <div class="flex flex-col gap-1.5">
                    <label for="phone" class="text-sm font-medium text-text/70">Teléfono Principal</label>
                    <div class="relative group">
                      <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                      <input 
                        id="phone"
                        v-model="phone"
                        type="tel"
                        maxlength="8"
                        class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="3344-5566"
                        @keypress="onlyNumbers"
                      />
                    </div>
                  </div>

                  <!-- Teléfono Alternativo -->
                  <div class="flex flex-col gap-1.5">
                    <label for="alternativePhone" class="text-sm font-medium text-text/70">Teléfono Alternativo</label>
                    <div class="relative group">
                      <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                      <input 
                        id="alternativePhone"
                        v-model="alternativePhone"
                        type="tel"
                        maxlength="8"
                        class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="3344-5566"
                        @keypress="onlyNumbers"
                      />
                    </div>
                  </div>
                </div>

                <!-- Dirección y Empresa -->
                <div class="grid grid-cols-2 gap-4 col-span-2">
                  <!-- Dirección -->
                  <div class="flex flex-col gap-1.5">
                    <label for="address" class="text-sm font-medium text-text/70">Dirección</label>
                    <div class="relative group">
                      <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                      <input 
                        id="address"
                        v-model="address"
                        type="text"
                        class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="Ingrese la dirección completa"
                      />
                    </div>
                  </div>

                  <!-- Empresa -->
                  <div class="flex flex-col gap-1.5">
                    <label for="company" class="text-sm font-medium text-text/70">Empresa</label>
                    <div class="relative group">
                      <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary" />
                      <input 
                        id="company"
                        v-model="company"
                        type="text"
                        class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones del formulario -->
            <div class="sticky bottom-0 px-6 py-4 -mx-6 -mb-6 border-t border-container-border bg-background/80 backdrop-blur-xl">
              <div class="flex justify-end gap-3">
                <button 
                  type="button" 
                  class="px-6 py-2.5 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
                  @click="handleClose"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Guardar Cliente
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para cerrar -->
    <Teleport to="body">
      <div 
        v-if="showCloseConfirm"
        class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1200] p-6"
        @click="showCloseConfirm = false"
      >
        <div 
          class="w-full max-w-[400px] bg-background rounded-3xl border border-container-border shadow-lg p-6"
          @click.stop
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 rounded-xl bg-amber-100">
              <AlertTriangle class="w-6 h-6 text-amber-500" />
            </div>
            <h3 class="text-xl font-semibold text-text">Confirmar Salida</h3>
          </div>

          <p class="text-text/70 mb-6">
            Hay cambios sin guardar. ¿Está seguro que desea salir? Los cambios se perderán.
          </p>

          <div class="flex justify-end gap-3">
            <button 
              class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
              @click="showCloseConfirm = false"
            >
              Cancelar
            </button>
            <button 
              class="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-lg"
              @click="confirmClose"
            >
              Salir sin Guardar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </Teleport>
</template>
