<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, FileText, Plus, AlertTriangle } from 'lucide-vue-next'
import ClientPolicyList from './ClientPolicyList.vue'
import AssignPolicyForm from './AssignPolicyForm.vue'

interface ClientPolicy {
  id: number
  number: string
  name: string
  term: number
  status: 'vigente' | 'vencida'
}

interface Client {
  id: number
  name: string
  dni: string
  email: string
}

interface PaymentRow {
  number: number
  amount: number
  dueDate: string
}

interface AssignPolicyData {
  policyId: number
  totalPremium: number
  term: number
  paymentDate: string
  paymentPlan: PaymentRow[]
}

const props = defineProps<{
  show: boolean
  client: Client
  policies: ClientPolicy[]
}>()

const emit = defineEmits<{
  close: []
  viewPayments: [policyId: number]
}>()

const formMode = ref<'view' | 'edit' | 'create'>('create')
const selectedPolicyId = ref<number | null>(null)
const showCloseConfirm = ref(false)
const hasFormChanges = ref(false)

const handleViewPolicy = (policyId: number) => {
  selectedPolicyId.value = policyId
  formMode.value = 'view'
}

const handleEditPolicy = () => {
  formMode.value = 'edit'
}

const handleSavePolicy = (data: AssignPolicyData) => {
  console.log('Saving policy:', data)
  formMode.value = 'view'
  hasFormChanges.value = false
}

const handleCancelEdit = () => {
  if (formMode.value === 'edit') {
    formMode.value = 'view'
  } else {
    selectedPolicyId.value = null
    formMode.value = 'create'
    isAssignPolicyVisible.value = false
  }
}

const selectedPolicy = computed(() => {
  if (!selectedPolicyId.value) return undefined
  const policy = props.policies.find(p => p.id === selectedPolicyId.value)
  if (!policy) return undefined

  return {
    id: policy.id,
    name: policy.name,
    totalPremium: 0, // Estos valores deberían venir de la API
    term: policy.term,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentPlan: []
  }
})

const modalTitle = computed(() => {
  if (formMode.value === 'view') {
    return 'Detalles de la Póliza'
  }
  if (formMode.value === 'edit') {
    return 'Editar Póliza'
  }
  return isAssignPolicyVisible.value ? 'Asignar Nueva Póliza' : 'Pólizas del Cliente'
})

const isAssignPolicyVisible = ref(false)

const handleModalClose = () => {
  if (!hasFormChanges.value || formMode.value === 'view') {
    handleClose()
    return
  }
  showCloseConfirm.value = true
}

const handleClose = () => {
  isAssignPolicyVisible.value = false
  hasFormChanges.value = false
  emit('close')
}

const confirmClose = () => {
  showCloseConfirm.value = false
  handleClose()
}

const handleAssignPolicy = () => {
  isAssignPolicyVisible.value = true
}

const handleFormChanges = (changes: boolean) => {
  hasFormChanges.value = changes
}

const availablePolicies = [
  { id: 1, name: 'Seguro de Vida Plus' },
  { id: 2, name: 'Seguro de Auto Completo' },
  { id: 3, name: 'Seguro de Hogar Básico' }
]
</script>

<template>
  <Teleport to="body">
    <!-- Modal principal -->
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1100] p-4"
      @click="handleModalClose"
    >
      <div 
        class="w-full max-w-[800px] h-[calc(100vh-4rem)] max-h-[700px] bg-background rounded-xl border border-container-border shadow-[0_8px_32px_var(--container-shadow)] flex flex-col overflow-y-auto"
        @click.stop
      >
        <!-- Header -->
        <div class="sticky top-0 z-10 flex-shrink-0 p-4 border-b border-container-border flex items-center justify-between bg-background">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText class="w-4 h-4 text-white" />
            </div>
            <h2 class="text-lg font-semibold text-text m-0">{{ modalTitle }}</h2>
            <button 
              v-if="formMode === 'create' && !isAssignPolicyVisible"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5" 
              @click="handleAssignPolicy"
            >
              <Plus class="w-4 h-4" />
              <span>Asignar Póliza</span>
            </button>
          </div>
          <button 
            class="p-2 rounded-lg border-none bg-input-bg text-text transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5 flex items-center justify-center"
            @click="handleModalClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Body -->
        <div class="flex-1 min-h-0 bg-background p-4">
          <ClientPolicyList
            v-if="!isAssignPolicyVisible && formMode === 'create'"
            :client="client"
            :policies="policies"
            @view-policy="handleViewPolicy"
            @view-payments="(id) => {
              emit('viewPayments', id)
              handleClose()
            }"
          />
          <AssignPolicyForm
            v-else
            :mode="formMode"
            :client="client"
            :available-policies="availablePolicies"
            :existing-policy="selectedPolicy"
            @save="handleSavePolicy"
            @edit="handleEditPolicy"
            @cancel="handleCancelEdit"
            @has-changes="handleFormChanges"
          />
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div 
      v-if="showCloseConfirm"
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1200] p-4"
      @click="showCloseConfirm = false"
    >
      <div 
        class="w-full max-w-[400px] bg-background rounded-xl border border-container-border shadow-lg p-4"
        @click.stop
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 rounded-lg bg-amber-100">
            <AlertTriangle class="w-5 h-5 text-amber-500" />
          </div>
          <h3 class="text-lg font-semibold text-text">Confirmar Salida</h3>
        </div>

        <p class="text-text/70 mb-4 text-sm">
          Hay cambios sin guardar. ¿Está seguro que desea salir? Los cambios se perderán.
        </p>

        <div class="flex justify-end gap-3">
          <button 
            class="px-3 py-1.5 rounded-lg bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-md"
            @click="showCloseConfirm = false"
          >
            Cancelar
          </button>
          <button 
            class="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-lg"
            @click="confirmClose"
          >
            Salir sin Guardar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
