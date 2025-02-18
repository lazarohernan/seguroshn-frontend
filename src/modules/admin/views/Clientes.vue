<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
      <!-- Encabezado y acciones -->
      <div class="mb-8">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Clientes</h1>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-[600px]">
              <SearchBar
                v-model="searchQuery"
                placeholder="Buscar por nombre completo, DNI, teléfono o correo electrónico..."
              />
            </div>
            <button
              class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
              @click="showAddModal = true"
            >
              <Plus class="w-5 h-5" />
              <span>Nuevo Cliente</span>
            </button>
          </div>
          <button
            title="Exportar datos"
            class="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-text dark:text-gray-200 text-sm font-medium border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
            @click="showExportModal = true"
          >
            <Filter class="w-5 h-5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <!-- Estado sin clientes -->
      <div
        v-if="clients.length === 0"
        class="bg-container-bg border border-container-border rounded-2xl shadow-[0_8px_32px_var(--container-shadow)] p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Users class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No hay clientes registrados</h3>
          <p class="text-text/70 text-center max-w-md">
            Aún no hay clientes registrados en el sistema. Haz clic en el botón "Nuevo Cliente" para
            comenzar a agregar clientes.
          </p>
        </div>
      </div>

      <!-- Estado sin resultados de búsqueda -->
      <div
        v-else-if="searchQuery && filteredItems.length === 0"
        class="bg-container-bg border border-container-border rounded-2xl shadow-[0_8px_32px_var(--container-shadow)] p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Search class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No se encontraron resultados</h3>
          <p class="text-text/70 text-center max-w-md">
            No se encontraron clientes que coincidan con tu búsqueda. Intenta con otros términos o
            revisa la ortografía.
          </p>
        </div>
      </div>

      <!-- Tabla de clientes -->
      <div
        v-else
        class="bg-container-bg border border-container-border rounded-2xl shadow-[0_8px_32px_var(--container-shadow)] overflow-x-auto"
      >
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Cliente
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                DNI
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Contacto
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Dirección
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Pólizas
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Estado
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Última Actualización
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="client in filteredItems"
              :key="client.id"
              class="border-b border-container-border last:border-b-0 hover:bg-input-bg"
            >
              <!-- Información del cliente -->
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <!-- Avatar del cliente con iniciales -->
                  <div
                    class="w-12 h-12 rounded-lg flex items-center justify-center bg-[#8CBFCF] text-white font-bold text-xl shadow-md"
                    :title="client.name"
                  >
                    {{ getInitials(client.name) }}
                  </div>
                  <div class="font-medium text-text">{{ client.name }}</div>
                </div>
              </td>

              <!-- DNI -->
              <td class="p-4">
                <div class="font-mono text-sm text-text/80 px-2 py-1 bg-input-bg rounded">
                  {{ client.dni }}
                </div>
              </td>

              <!-- Información de contacto -->
              <td class="p-4">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <Mail class="w-4 h-4 text-text/50" />
                    <span class="text-sm text-text">{{ client.email }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Phone class="w-4 h-4 text-text/50" />
                    <span class="text-sm text-text">{{ client.phone }}</span>
                  </div>
                </div>
              </td>

              <!-- Dirección -->
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <MapPin class="w-4 h-4 text-text/50" />
                  <span class="text-sm text-text">{{ client.address }}</span>
                </div>
              </td>

              <!-- Contador de pólizas -->
              <td class="p-4">
                <div class="font-semibold text-primary">
                  {{ client.insuranceCount }}
                </div>
              </td>

              <!-- Estado -->
              <td class="p-4">
                <span
                  class="inline-flex px-3 py-1 rounded-full text-xs font-medium"
                  :class="
                    client.status === 'active'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-red-100 text-red-600'
                  "
                >
                  {{ client.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <!-- Última actualización -->
              <td class="p-4">
                <div class="text-sm text-text/70">
                  {{
                    new Date(client.lastUpdate).toLocaleDateString('es-HN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                </div>
              </td>

              <!-- Botones de acción -->
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <button
                    title="Ver detalles del cliente"
                    class="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input-border bg-input-bg transition-all duration-300 hover:border-primary hover:bg-primary hover:-translate-y-0.5"
                    @click="handleViewClient(client.id)"
                  >
                    <Eye class="w-4 h-4 text-text/50 group-hover:text-white" />
                    <span class="text-xs font-medium text-text group-hover:text-white">Ver</span>
                  </button>
                  <button
                    title="Ver pólizas del cliente"
                    class="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input-border bg-input-bg transition-all duration-300 hover:border-primary hover:bg-primary hover:-translate-y-0.5"
                    @click="handleViewPolicies(client.id)"
                  >
                    <FileText class="w-4 h-4 text-text/50 group-hover:text-white" />
                    <span class="text-xs font-medium text-text group-hover:text-white">Póliza</span>
                  </button>
                  <button
                    title="Ver pagos del cliente"
                    class="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input-border bg-input-bg transition-all duration-300 hover:border-primary hover:bg-primary hover:-translate-y-0.5"
                    @click="
                      () => {
                        selectedClient = clients.find((c) => c.id === client.id) || null;
                        if (selectedClient) {
                          showPaymentsModal = true;
                        }
                      }
                    "
                  >
                    <Coins class="w-4 h-4 text-text/50 group-hover:text-white" />
                    <span class="text-xs font-medium text-text group-hover:text-white">Pagos</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modales -->
  <ViewClientModal
    v-if="selectedClient"
    :show="showClientModal"
    :client="selectedClient"
    @close="handleCloseModal"
    @update-client="handleUpdateClient"
  />

  <AddClientModal :show="showAddModal" @close="showAddModal = false" @save="handleAddClient" />

  <ViewClientPaymentsModal
    v-if="selectedClient && selectedPolicy"
    :show="showPaymentsModal"
    :client="selectedClient"
    :policy="selectedPolicy"
    @close="showPaymentsModal = false"
  />

  <ViewClientPolicyModal
    v-if="selectedClient"
    :show="showPolicyModal"
    :client="selectedClient"
    :policies="clientPolicies"
    @close="showPolicyModal = false"
    @view-payments="
      (policyId) => {
        showPolicyModal = false;
        selectedPolicy = clientPolicies.find((p) => p.id === policyId) || null;
        if (selectedPolicy) {
          showPaymentsModal = true;
        }
      }
    "
    @assign-policy="() => console.log('Assign policy')"
  />

  <ExportOptionsModal
    :show="showExportModal"
    :data="filteredItems"
    @close="showExportModal = false"
    @export="handleExport"
  />
</template>

<script setup lang="ts">
  /**
   * Vista de Clientes
   *
   * Características principales:
   * - Listado de clientes con búsqueda y filtrado
   * - Avatares con iniciales para identificación visual
   * - Acciones rápidas por cliente (ver detalles, pólizas, pagos)
   * - Exportación de datos en diferentes formatos
   */

  import { ref } from 'vue';
  import SearchBar from '@/components/SearchBar.vue';
  import { useSearch } from '@/composables/useSearch';
  import { useExport } from '@/composables/useExport';
  import ViewClientModal from '@/components/ViewClientModal.vue';
  import AddClientModal from '@/components/AddClientModal.vue';
  import ViewClientPaymentsModal from '@/components/ViewClientPaymentsModal.vue';
  import ViewClientPolicyModal from '@/components/ViewClientPolicyModal.vue';
  import ExportOptionsModal from '@/components/ExportOptionsModal.vue';
  import {
    Plus,
    Mail,
    Phone,
    MapPin,
    Eye,
    FileText,
    Coins,
    Filter,
    Users,
    Search,
  } from 'lucide-vue-next';

  import type { Client } from '@/types/client';

  // Interfaz para las pólizas de clientes
  interface Policy {
    id: number;
    number: string;
    name: string;
    term: number;
    status: 'vigente' | 'vencida';
  }

  // Datos de ejemplo de clientes
  const clients = ref<Client[]>([
    {
      id: 1,
      name: 'Juan Pérez',
      dni: '0801-1990-12345',
      rtn: '08011990123459',
      birthDate: '1990-05-15',
      email: 'juan.perez@email.com',
      phone: '+504 9876-5432',
      alternativePhone: '+504 9876-5433',
      address: 'Col. Palmira, Tegucigalpa',
      insuranceCount: 3,
      status: 'active',
      lastUpdate: '2024-02-15',
    },
    {
      id: 2,
      name: 'María López',
      dni: '0501-1985-67890',
      rtn: '05011985678904',
      birthDate: '1985-08-22',
      email: 'maria.lopez@email.com',
      phone: '+504 8765-4321',
      alternativePhone: '+504 8765-4322',
      address: 'Res. El Trapiche, San Pedro Sula',
      insuranceCount: 2,
      status: 'active',
      lastUpdate: '2024-02-14',
    },
    {
      id: 3,
      name: 'Carlos Mendoza',
      dni: '0101-1995-54321',
      rtn: '01011995543215',
      birthDate: '1995-03-10',
      email: 'carlos.mendoza@email.com',
      phone: '+504 9988-7766',
      alternativePhone: '+504 9988-7767',
      address: 'Bo. El Centro, La Ceiba',
      insuranceCount: 1,
      status: 'inactive',
      lastUpdate: '2024-02-10',
    },
  ]);

  // Composables para funcionalidades específicas
  const { searchQuery, filteredItems } = useSearch<Client>(clients.value, [
    'name',
    'dni',
    'phone',
    'email',
  ]);
  const { exportToCSV, exportToPDF } = useExport();

  // Estados para control de modales
  const showClientModal = ref(false);
  const showAddModal = ref(false);
  const showPaymentsModal = ref(false);
  const showPolicyModal = ref(false);
  const showExportModal = ref(false);
  const selectedClient = ref<Client | null>(null);
  const selectedPolicy = ref<Policy | null>(null);

  // Datos de ejemplo de pólizas
  const clientPolicies = ref<Policy[]>([
    {
      id: 1,
      number: '001',
      name: 'Seguro de Vida Plus',
      term: 12,
      status: 'vigente',
    },
    {
      id: 2,
      number: '002',
      name: 'Seguro de Auto Completo',
      term: 24,
      status: 'vigente',
    },
    {
      id: 3,
      number: '003',
      name: 'Seguro de Hogar Básico',
      term: 6,
      status: 'vencida',
    },
  ]);

  /**
   * Obtiene las iniciales de un nombre completo
   * @param name Nombre completo
   * @returns Las dos primeras iniciales
   */
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  /**
   * Maneja la visualización del modal de detalles del cliente
   */
  const handleViewClient = (clientId: number): void => {
    selectedClient.value = clients.value.find((c) => c.id === clientId) || null;
    showClientModal.value = true;
  };

  /**
   * Cierra el modal de detalles del cliente y limpia la selección
   */
  const handleCloseModal = (): void => {
    showClientModal.value = false;
    selectedClient.value = null;
  };

  /**
   * Maneja la visualización del modal de pólizas del cliente
   */
  const handleViewPolicies = (clientId: number): void => {
    selectedClient.value = clients.value.find((c) => c.id === clientId) || null;
    if (selectedClient.value) {
      showPolicyModal.value = true;
    }
  };

  /**
   * Actualiza los datos de un cliente existente
   */
  const handleUpdateClient = (data: Client): void => {
    const index = clients.value.findIndex((c) => c.id === data.id);
    if (index !== -1) {
      clients.value[index] = {
        id: data.id,
        name: data.name,
        dni: data.dni,
        rtn: data.rtn,
        birthDate: data.birthDate,
        email: data.email,
        company: data.company,
        phone: data.phone,
        alternativePhone: data.alternativePhone,
        address: data.address,
        insuranceCount: data.insuranceCount,
        status: data.status,
        lastUpdate: new Date().toISOString().split('T')[0],
      };
    }
    handleCloseModal();
  };

  // Interfaz para los datos del formulario de nuevo cliente
  interface AddClientData {
    firstName: string;
    lastName: string;
    dni: string;
    rtn?: string;
    birthDate?: string;
    email: string;
    company?: string;
    phone?: string;
    alternativePhone?: string;
    address?: string;
  }

  /**
   * Agrega un nuevo cliente a la lista
   */
  const handleAddClient = async (data: AddClientData): Promise<void> => {
    const newClient: Client = {
      id: clients.value.length + 1,
      name: `${data.firstName} ${data.lastName}`,
      dni: data.dni,
      rtn: data.rtn || '',
      birthDate: data.birthDate || '',
      email: data.email,
      company: data.company,
      phone: data.phone || '',
      alternativePhone: data.alternativePhone,
      address: data.address || '',
      insuranceCount: 0,
      status: 'active',
      lastUpdate: new Date().toISOString().split('T')[0],
    };
    clients.value.push(newClient);
    showAddModal.value = false;
  };

  /**
   * Maneja la exportación de datos de clientes
   *
   * @param format - Formato de exportación ('pdf' o 'csv')
   * @param data - Lista de clientes a exportar
   */
  const handleExport = (format: 'pdf' | 'csv', data: Client[]) => {
    const exportData = data.map((client) => ({
      Nombre: client.name,
      DNI: client.dni,
      RTN: client.rtn || 'N/A',
      'Fecha de Nacimiento': client.birthDate
        ? new Date(client.birthDate).toLocaleDateString('es-HN')
        : 'N/A',
      Email: client.email,
      Empresa: client.company || 'N/A',
      'Teléfono Principal': client.phone || 'N/A',
      'Teléfono Alternativo': client.alternativePhone || 'N/A',
      Dirección: client.address || 'N/A',
      Pólizas: client.insuranceCount,
      Estado: client.status === 'active' ? 'Activo' : 'Inactivo',
      'Última Actualización': new Date(client.lastUpdate).toLocaleDateString('es-HN'),
    }));

    if (format === 'pdf') {
      exportToPDF(exportData, { filename: 'clientes.pdf' });
    } else {
      exportToCSV(exportData, { filename: 'clientes.csv' });
    }
  };
</script>
