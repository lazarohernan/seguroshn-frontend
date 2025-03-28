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
        v-if="polizas.length === 0"
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
          v-for="poliza in filteredPolicies"
          :key="poliza.id_poliza"
          class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
        >
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div
                class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <component :is="getPolicyIcon()" class="w-8 h-8 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-text mb-2">{{ poliza.nombre }}</h3>
                <p class="text-sm text-text/70 line-clamp-2">{{ poliza.descripcion }}</p>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              class="w-full px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5"
              @click="handleViewPolicy(poliza)"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para Crear una Póliza -->
  <AddPolicyModal :show="showAddModal" @close="showAddModal = false" @save="handleAddPolicy" />

  <!-- Modal para visualizar o editar Póliza -->
  <ViewPolicyModal
    v-if="selectedPolicy"
    :show="showViewModal"
    :policy="selectedPolicy"
    :id-poliza="selectedPolicy.id_poliza ?? ''"
    @edit="handleSavePoliza"
    @delete="handleDeletePoliza"
    @close="handleCloseViewModal"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useQuery, useQueryClient } from '@tanstack/vue-query';
  import { useToast } from 'vue-toastification';
  import { Shield, Plus, Search } from 'lucide-vue-next';
  import { supabase } from '@/lib/supabase';

  import { useSearch } from '@/composables/useSearch';
  import { Poliza } from '../interfaces/polizas_interface';
  import {
    createPolizaAction,
    deletePolizaAction,
    getPolizasAction,
    updatePolizaAction,
  } from '../actions/polizas_actions';

  import AddPolicyModal from '@/modules/admin/components/AddPolicyModal.vue';
  import ViewPolicyModal from '@/modules/admin/components/ViewPolicyModal.vue';
  import SearchBar from '@/modules/common/components/SearchBar.vue';

  const toast = useToast();
  //Obtener una instancia del queryClient
  const queryClient = useQueryClient();

  //Obtener el id_correduria del localstorage
  const id_correduria = localStorage.getItem('id_correduria') ?? '';

  //Llamada a la API para obtener todas las aseguradoras
  const { data: response } = useQuery({
    queryKey: [{ action: 'polizas' }],
    queryFn: async () => {
      return await getPolizasAction(id_correduria, 1, 1000); // Página 1, límite alto para obtener todos
    },
  });

  // Desestructuramos response para obtener aseguradoras
  const polizas = computed(() => response.value?.data ?? []);
  const showAddModal = ref(false);
  const showViewModal = ref(false);
  const selectedPolicy = ref<Poliza | null>(null);

  const getPolicyIcon = () => {
    const icons = {
      business: Shield,
    };
    return icons['business'];
  };

  const { searchQuery, filteredItems: filteredPolicies } = useSearch(polizas, [
    'nombre',
    'descripcion',
  ]);

  //!--------------------FUNCIONES PARA VER, EDITAR O AGREGAR PÓLIZA
  //AGREGAR PÓLIZA
  const handleAddPolicy = async (data: FormData) => {
    try {
      const file = data.get('archivo') as File;
      let archivoUrl = '';

      // Si hay un archivo, subirlo al storage
      if (file && file instanceof File) {
        const filePath = `polizas/${id_correduria}/${file.name}`;
        const uploadResult = await supabase.storage
          .from('archivos')
          .upload(filePath, file);

        if (uploadResult.error) throw uploadResult.error;

        // Obtener la URL pública del archivo
        const { data: { publicUrl } } = supabase.storage
          .from('archivos')
          .getPublicUrl(filePath);

        archivoUrl = publicUrl;
      }

      // Crear la póliza
      const resp = await createPolizaAction(
        id_correduria,
        data.get('nombre') as string,
        data.get('descripcion') as string,
        data.get('id_aseguradora') as string,
        data.get('id_cliente') as string,
        data.get('prima_total') as string,
        data.get('plazo') as string,
        data.get('fecha_inicio') as string,
        data.get('fecha_fin') as string,
        localStorage.getItem('uuid') ?? '',
        archivoUrl
      );

      if (resp.ok) {
        // Invalidar la consulta para forzar actualización de datos
        await queryClient.invalidateQueries({ queryKey: [{ action: 'polizas' }] });

        // Cerrar el modal
        showAddModal.value = false;
        toast.success('Registro agregado exitosamente!');
      } else {
        toast.error('Ocurrió un error al agregar el registro!');
      }
    } catch (error) {
      console.error('Error al agregar póliza:', error);
      toast.error('Ocurrió un error al agregar el registro!');
    }
  };

  const handleViewPolicy = (policy: Poliza) => {
    selectedPolicy.value = policy;
    showViewModal.value = true;
  };

  const handleCloseViewModal = () => {
    selectedPolicy.value = null;
    showViewModal.value = false;
  };

  //ACTUALIZAR PÓLIZA
  const handleSavePoliza = async (data: FormData) => {
    try {
      const file = data.get('archivo') as File;
      let archivoUrl = selectedPolicy.value?.archivo || '';

      // Si hay un archivo nuevo, subirlo al storage
      if (file && file instanceof File) {
        // Si ya había un archivo, eliminarlo
        if (selectedPolicy.value?.archivo && typeof selectedPolicy.value.archivo === 'string') {
          const oldPath = selectedPolicy.value.archivo.split('/').pop();
          if (oldPath) {
            await supabase.storage
              .from('archivos')
              .remove([`polizas/${id_correduria}/${oldPath}`]);
          }
        }

        // Subir el nuevo archivo
        const filePath = `polizas/${id_correduria}/${file.name}`;
        const uploadResult = await supabase.storage
          .from('archivos')
          .upload(filePath, file);

        if (uploadResult.error) throw uploadResult.error;

        // Obtener la URL pública del archivo
        const { data: { publicUrl } } = supabase.storage
          .from('archivos')
          .getPublicUrl(filePath);

        archivoUrl = publicUrl;
      }

      // Actualizar la póliza
      const resp = await updatePolizaAction(
        selectedPolicy.value?.id_poliza ?? '',
        data.get('nombre') as string,
        data.get('descripcion') as string,
        data.get('id_aseguradora') as string,
        data.get('id_cliente') as string,
        data.get('prima_total') as string,
        data.get('plazo') as string,
        data.get('fecha_inicio') as string,
        data.get('fecha_fin') as string,
        localStorage.getItem('uuid') ?? '',
        archivoUrl
      );

      if (resp.ok) {
        // Invalidar la consulta para forzar actualización de datos
        await queryClient.invalidateQueries({ queryKey: [{ action: 'polizas' }] });

        // Cerrar el modal
        handleCloseViewModal();
        toast.info('Registro actualizado exitosamente!');
      } else {
        toast.error('Ocurrió un error al actualizar el registro!');
      }
    } catch (error) {
      console.error('Error al actualizar póliza:', error);
      toast.error('Ocurrió un error al actualizar el registro!');
    }
  };

  //BORRAR PÓLIZA
  const handleDeletePoliza = async (id_poliza: string) => {
    try {
      const resp = await deletePolizaAction(id_poliza);

      if (resp.ok) {
        if (resp.ok) {
          // ❗ Invalidar la consulta para forzar actualización de datos
          await queryClient.invalidateQueries({ queryKey: [{ action: 'polizas' }] });

          // Cerrar el modal
          showViewModal.value = false;
          toast.warning('Registro borrado exitosamente!');
        } else {
          toast.error('Ocurrió un error al borrar el registro!');
        }
      }
    } catch (error) {
      console.error('Error al borrar póliza:', error);
      toast.error('Ocurrió un error al borrar el registro!');
    }
  };
</script>
