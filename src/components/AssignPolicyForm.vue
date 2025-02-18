<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { User, Mail, Hash } from 'lucide-vue-next'

interface AssignPolicyData {
  policyId: number
  totalPremium: number
  term: number
  paymentDate: string
  paymentPlan: PaymentRow[]
}

interface Client {
  id: number
  name: string
  dni: string
  email: string
}

interface Policy {
  id: number
  name: string
}

interface PaymentRow {
  number: number
  amount: number
  dueDate: string
  pending: number
}

interface ExistingPolicy {
  id: number
  name: string
  totalPremium: number
  term: number
  paymentDate: string
  paymentPlan: PaymentRow[]
}

const props = defineProps<{
  mode: 'view' | 'edit' | 'create'
  client: Client
  availablePolicies: Policy[]
  existingPolicy?: ExistingPolicy
}>()

const emit = defineEmits<{
  save: [data: AssignPolicyData]
  cancel: []
  edit: []
  hasChanges: [hasChanges: boolean]
}>()

// Form state
const selectedPolicy = ref<number | null>(props.existingPolicy?.id ?? null)
const totalPremium = ref<number>(props.existingPolicy?.totalPremium ?? 0)
const term = ref<number>(props.existingPolicy?.term ?? 0)
const paymentDate = ref(props.existingPolicy?.paymentDate ?? '')

// Watch for changes
watch([selectedPolicy, totalPremium, term, paymentDate], () => {
  if (props.mode === 'view') {
    emit('hasChanges', false)
    return
  }

  const hasChanges = 
    selectedPolicy.value !== (props.existingPolicy?.id ?? null) ||
    totalPremium.value !== (props.existingPolicy?.totalPremium ?? 0) ||
    term.value !== (props.existingPolicy?.term ?? 0) ||
    paymentDate.value !== (props.existingPolicy?.paymentDate ?? '')

  emit('hasChanges', hasChanges)
}, { deep: true, immediate: true })

// Computed properties
const isViewMode = computed(() => props.mode === 'view')

const buttonText = computed(() => {
  switch (props.mode) {
    case 'view':
      return 'Editar Póliza'
    case 'edit':
      return 'Guardar Cambios'
    case 'create':
      return 'Asignar Póliza'
    default:
      return 'Asignar Póliza'
  }
})

// Computed payment plan
const paymentPlan = computed(() => {
  if (!totalPremium.value || !term.value || !paymentDate.value) return []

  const rows: PaymentRow[] = []
  const monthlyPayment = totalPremium.value / term.value
  const startDate = new Date(paymentDate.value)

  let pendingAmount = totalPremium.value

  // Generar filas de pagos mensuales
  for (let i = 0; i < term.value; i++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + i)
    
    rows.push({
      number: i + 1,
      amount: monthlyPayment,
      dueDate: date.toISOString().split('T')[0],
      pending: pendingAmount
    })
    
    pendingAmount -= monthlyPayment
  }

  return rows
})

const handleSave = () => {
  if (!selectedPolicy.value || !totalPremium.value || !term.value || !paymentDate.value) return

  emit('save', {
    policyId: selectedPolicy.value,
    totalPremium: totalPremium.value,
    term: term.value,
    paymentDate: paymentDate.value,
    paymentPlan: paymentPlan.value
  })
}

const handleCancel = () => {
  // Solo emitir cancel si no hay cambios o si estamos en modo vista
  const hasChanges = 
    selectedPolicy.value !== (props.existingPolicy?.id ?? null) ||
    totalPremium.value !== (props.existingPolicy?.totalPremium ?? 0) ||
    term.value !== (props.existingPolicy?.term ?? 0) ||
    paymentDate.value !== (props.existingPolicy?.paymentDate ?? '')

  if (!hasChanges || props.mode === 'view') {
    emit('cancel')
  }
}
</script>

<template>
  <div class="flex flex-col min-h-full">
    <div class="flex flex-col gap-4 mb-4">
      <!-- Información del Cliente - Siempre 3 columnas -->
      <div class="p-4 bg-input-bg rounded-xl">
        <div class="grid grid-cols-3 gap-4">
          <div class="flex items-start gap-3 p-3 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5">
            <User class="w-4 h-4 text-primary opacity-70 flex-shrink-0" />
            <div class="min-w-0">
              <label class="block text-xs font-semibold text-text/70 uppercase tracking-wider mb-1">Nombre Completo</label>
              <p class="m-0 text-sm font-medium text-text truncate">{{ client.name }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5">
            <Hash class="w-4 h-4 text-primary opacity-70 flex-shrink-0" />
            <div class="min-w-0">
              <label class="block text-xs font-semibold text-text/70 uppercase tracking-wider mb-1">DNI</label>
              <p class="m-0 text-sm font-medium text-text truncate">{{ client.dni }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5">
            <Mail class="w-4 h-4 text-primary opacity-70 flex-shrink-0" />
            <div class="min-w-0">
              <label class="block text-xs font-semibold text-text/70 uppercase tracking-wider mb-1">Correo</label>
              <p class="m-0 text-sm font-medium text-text truncate">{{ client.email }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario de Asignación -->
      <div class="p-4 bg-input-bg rounded-xl">
        <div class="flex flex-col gap-4">
          <!-- Primera fila: Póliza, Prima total y Fecha de pago -->
          <div class="grid grid-cols-[2fr_1fr_1fr] gap-4 sm:grid-cols-1">
            <div class="flex flex-col gap-1.5 min-w-0">
              <label for="policy" class="text-xs font-semibold text-text uppercase tracking-wider pl-1">Póliza</label>
              <select 
                id="policy"
                v-model="selectedPolicy"
                class="w-full h-[1.875rem] px-2 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:0.875rem] bg-[center_right_0.5rem] pr-7 disabled:bg-none"
                required
                :disabled="isViewMode"
              >
                <option value="" disabled>Seleccione una póliza</option>
                <option 
                  v-for="policy in availablePolicies" 
                  :key="policy.id"
                  :value="policy.id"
                >
                  {{ policy.name }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-1.5 min-w-0">
              <label for="premium" class="text-xs font-semibold text-text uppercase tracking-wider pl-1">Prima Total (LP)</label>
              <div class="relative flex items-center min-w-0">
                <span class="absolute left-2.5 text-sm font-medium text-text/80 pointer-events-none">L.</span>
                <input
                  id="premium"
                  v-model.number="totalPremium"
                  type="number"
                  class="w-full h-[1.875rem] pl-7 pr-2 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  :disabled="isViewMode"
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5 min-w-0">
              <label for="payment-date" class="text-xs font-semibold text-text uppercase tracking-wider pl-1">Fecha de Pago</label>
              <div class="relative flex items-center min-w-0">
                <input
                  id="payment-date"
                  v-model="paymentDate"
                  type="date"
                  class="w-full h-[1.875rem] px-2 pr-7 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border cursor-pointer"
                  required
                  :disabled="isViewMode"
                />
                <div class="absolute right-2 w-3.5 h-3.5 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%223%22%20y%3D%224%22%20width%3D%2218%22%20height%3D%2218%22%20rx%3D%222%22%20ry%3D%222%22%3E%3C%2Frect%3E%3Cline%20x1%3D%2216%22%20y1%3D%222%22%20x2%3D%2216%22%20y2%3D%226%22%3E%3C%2Fline%3E%3Cline%20x1%3D%228%22%20y1%3D%222%22%20x2%3D%228%22%20y2%3D%226%22%3E%3C%2Fline%3E%3Cline%20x1%3D%223%22%20y1%3D%2210%22%20x2%3D%2221%22%20y2%3D%2210%22%3E%3C%2Fline%3E%3C%2Fsvg%3E')] bg-center bg-no-repeat bg-contain"></div>
              </div>
            </div>
          </div>

          <!-- Segunda fila: Plazo -->
          <div class="flex flex-col gap-1.5 min-w-0">
            <label for="term" class="text-xs font-semibold text-text uppercase tracking-wider pl-1">Plazo (Meses)</label>
            <div class="relative flex items-center min-w-0">
              <input
                id="term"
                v-model.number="term"
                type="number"
                class="w-full h-[1.875rem] px-2 pr-12 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border"
                min="1"
                required
                placeholder="0"
                :disabled="isViewMode"
              />
              <span class="absolute right-2.5 text-sm font-medium text-text/80 pointer-events-none">meses</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Plan de Pagos -->
      <div class="flex flex-col gap-3 p-4 bg-input-bg rounded-xl">
        <div class="flex justify-between items-center">
          <h3 class="text-base font-semibold text-text m-0">Plan de Pagos</h3>
          <div v-if="term && totalPremium" class="flex gap-6 text-sm text-text font-medium">
            <span>{{ term }} meses</span>
            <span>L. {{ totalPremium.toFixed(2) }}</span>
          </div>
        </div>

        <div v-if="paymentPlan.length > 0" class="-mx-2 px-2">
          <table class="w-full border-separate border-spacing-0">
            <thead class="sticky top-0 z-[1] bg-input-bg">
              <tr>
                <th class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border">#</th>
                <th class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border">Cuota</th>
                <th class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border">Fecha</th>
                <th class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border">Pendiente</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paymentPlan" :key="row.number" class="hover:bg-background">
                <td class="py-2 px-3 text-sm text-text border-b border-input-border">{{ row.number }}</td>
                <td class="py-2 px-3 text-sm text-text border-b border-input-border">L. {{ row.amount.toFixed(2) }}</td>
                <td class="py-2 px-3 text-sm text-text border-b border-input-border">{{ new Date(row.dueDate).toLocaleDateString('es-HN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) }}</td>
                <td class="py-2 px-3 text-sm text-text border-b border-input-border">L. {{ row.pending.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="flex-1 flex items-center justify-center text-center p-6 text-sm text-text/70">
          <p class="m-0">Complete los campos del formulario para generar el plan de pagos</p>
        </div>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="flex justify-end gap-3 py-4 bg-background border-t border-input-border mt-auto">
      <button 
        class="px-4 py-2 rounded-lg text-sm font-semibold border border-input-border text-text transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:-translate-y-0.5"
        @click="handleCancel"
      >
        Cancelar
      </button>
      <button 
        v-if="isViewMode"
        class="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
        @click="$emit('edit')"
      >
        {{ buttonText }}
      </button>
      <button 
        v-else
        :disabled="!selectedPolicy || !totalPremium || !term || !paymentDate"
        class="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleSave"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>
