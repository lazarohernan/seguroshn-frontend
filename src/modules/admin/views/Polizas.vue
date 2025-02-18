<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
      <!-- Encabezado y acciones -->
      <div class="mb-8">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Pólizas</h1>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-[600px]">
              <SearchBar
                v-model="searchQuery"
                placeholder="Buscar por nombre, descripción o número de póliza..."
              />
            </div>
            <button
              class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
              @click="showAddModal = true"
            >
              <Plus class="w-5 h-5" />
              <span>Nueva Póliza</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Estado sin pólizas -->
      <div
        v-if="policies.length === 0"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Shield class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No hay pólizas registradas</h3>
          <p class="text-text/70 text-center max-w-md">
            Aún no hay pólizas registradas en el sistema. Haz clic en el botón "Nueva Póliza" para
            comenzar a agregar pólizas.
          </p>
        </div>
      </div>

      <!-- Estado sin resultados de búsqueda -->
      <div
        v-else-if="searchQuery && filteredPolicies.length === 0"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Search class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No se encontraron resultados</h3>
          <p class="text-text/70 text-center max-w-md">
            No se encontraron pólizas que coincidan con tu búsqueda. Intenta con otros términos o
            revisa la ortografía.
          </p>
        </div>
      </div>

      <!-- Lista de pólizas -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="policy in filteredPolicies"
          :key="policy.id"
          class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
        >
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div
                class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <component :is="getPolicyIcon(policy.type)" class="w-8 h-8 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-text mb-2">{{ policy.name }}</h3>
                <p class="text-sm text-text/70 line-clamp-2">{{ policy.description }}</p>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              class="w-full px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5"
              @click="handleViewPolicy(policy)"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AddPolicyModal :show="showAddModal" @close="showAddModal = false" @save="handleAddPolicy" />

  <ViewPolicyModal
    v-if="selectedPolicy"
    :show="showViewModal"
    :policy="selectedPolicy"
    @close="handleCloseViewModal"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import AddPolicyModal from '@/components/AddPolicyModal.vue';
  import ViewPolicyModal from '@/components/ViewPolicyModal.vue';
  import SearchBar from '@/components/SearchBar.vue';
  import { Car, Home, Heart, Umbrella, Shield, Plus, Search } from 'lucide-vue-next';
  import { useSearch } from '@/composables/useSearch';

  interface Policy {
    id: string;
    type: 'auto' | 'home' | 'life' | 'health' | 'business';
    name: string;
    description: string;
    insurer: string;
    policyNumber: string;
    startDate: string;
  }

  const showAddModal = ref(false);
  const showViewModal = ref(false);
  const selectedPolicy = ref<Policy | null>(null);

  const getPolicyIcon = (type: Policy['type']) => {
    const icons = {
      auto: Car,
      home: Home,
      life: Heart,
      health: Umbrella,
      business: Shield,
    };
    return icons[type];
  };

  const policies = ref<Policy[]>([
    {
      id: 'POL-001',
      type: 'auto',
      name: 'Seguro de Vehículo Total',
      description:
        'Cobertura completa para su vehículo incluyendo daños por colisión, robo y responsabilidad civil.',
      insurer: 'Seguros XYZ',
      policyNumber: 'AUTO-2024-001',
      startDate: '2024-01-15',
    },
    {
      id: 'POL-002',
      type: 'life',
      name: 'Seguro de Vida Plus',
      description:
        'Plan de vida con cobertura extendida, beneficios por fallecimiento y ahorro programado.',
      insurer: 'Aseguradora ABC',
      policyNumber: 'LIFE-2024-001',
      startDate: '2024-01-20',
    },
    {
      id: 'POL-003',
      type: 'home',
      name: 'Protección Hogar Completo',
      description:
        'Seguro residencial que cubre daños estructurales, contenido y responsabilidad civil.',
      insurer: 'Seguros 123',
      policyNumber: 'HOME-2024-001',
      startDate: '2024-01-25',
    },
  ]);

  const { searchQuery, filteredItems: filteredPolicies } = useSearch(policies.value, [
    'name',
    'description',
    'policyNumber',
  ]);

  const handleAddPolicy = (data: {
    type: Policy['type'];
    name: string;
    description: string;
    insurer: string;
    policyNumber: string;
    startDate: string;
  }) => {
    const newPolicy: Policy = {
      id: `POL-${String(policies.value.length + 1).padStart(3, '0')}`,
      ...data,
    };
    policies.value.push(newPolicy);
    showAddModal.value = false;
  };

  const handleViewPolicy = (policy: Policy) => {
    selectedPolicy.value = policy;
    showViewModal.value = true;
  };

  const handleCloseViewModal = () => {
    selectedPolicy.value = null;
    showViewModal.value = false;
  };
</script>
