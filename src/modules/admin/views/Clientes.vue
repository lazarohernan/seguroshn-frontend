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
            <Fl class="w-5 h-5" />
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
      (policyId: number) => {
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

<script src="./clientes.ts" lang="ts"></script>
