<template>
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Aseguradoras</h1>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-[600px]">
              <SearchBar
                v-model="searchQuery"
                placeholder="Buscar aseguradora por nombre, descripción o servicios..."
              />
            </div>
            <button
              class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
              @click="showAddModal = true"
            >
              <Plus class="w-5 h-5" />
              <span>Agregar Aseguradora</span>
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="filteredInsurers.length === 0"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Search class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No se encontraron resultados</h3>
          <p class="text-text/70 text-center max-w-md">
            No hay aseguradoras que coincidan con "{{ searchQuery }}". Intenta con otros términos o
            revisa la ortografía.
          </p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="aseguradora in aseguradoras"
          :key="aseguradora.id_aseguradora"
          class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
        >
          <div class="p-6">
            <h3 class="text-xl font-semibold text-text mb-3">{{ aseguradora.nombre }}</h3>
            <p class="text-sm text-text/70 mb-4 line-clamp-2">{{ aseguradora.descripcion }}</p>
            <div class="p-3 bg-input-bg rounded-xl border border-input-border mb-4">
              <div class="flex flex-col items-center">
                <span class="text-lg font-semibold text-primary">Algo aquí</span>
                <span class="text-xs text-text/70">Clientes</span>
              </div>
            </div>
            <button
              class="w-full px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
            >
              Ver más
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AddInsurerModal :show="showAddModal" @close="showAddModal = false" @save="handleAddInsurer" />

  <ViewInsurerModal
    :show="showViewModal"
    :insurer="selectedInsurer"
    @close="showViewModal = false"
    @save="handleSaveInsurer"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import AddInsurerModal from '@/components/AddInsurerModal.vue';
  import ViewInsurerModal from '@/components/ViewInsurerModal.vue';
  import SearchBar from '@/components/SearchBar.vue';
  import { Plus, Search } from 'lucide-vue-next';
  import { useSearch } from '@/composables/useSearch';
  import { useColorThief } from '@/composables/useColorThief';
  import { useQuery } from '@tanstack/vue-query';
  import { getAseguradorasAction } from '../actions/get_aseguradoras_action';

  //! Query principal para obtener todos los registros
  //const queryClient = useQueryClient(); //Viene con el plugin de tanstack/vue-query

  //Obtener el id_correduria del localstorage
  const id_correduria = localStorage.getItem('id_correduria') ?? '';

  const { data: aseguradoras } = useQuery({
    queryKey: ['aseguradoras', id_correduria],
    queryFn: () => getAseguradorasAction(1, 10, id_correduria),
  });

  console.log(aseguradoras);

  //utilizando un watchEffect, el cual está pendiente de cualquier variable reactiva
  // watchEffect(() => {
  //   //Precargado de la SIGUIENTE página
  //   queryClient.prefetchQuery({
  //     queryKey: ['aseguradoras'],
  //     queryFn: () => getAseguradorasAction(1, 10, id_correduria),
  //   });
  // });

  interface Insurer {
    name: string;
    logo: string;
    description: string;
    stats: {
      clients: string;
    };
    contact?: {
      phone: string;
      email: string;
      address: string;
    };
    services?: string[];
  }

  // Función para verificar si es una URL de avatar generado
  const isGeneratedAvatar = (url: string): boolean => {
    return url.includes('ui-avatars.com');
  };

  // Función para generar URL del avatar con iniciales
  const generateAvatarUrl = (name: string): string => {
    const initials = name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=8CBFCF&color=fff&size=120&bold=true&format=svg`;
  };

  // Función para obtener colores predefinidos para avatares generados
  const getDefaultColors = (name: string) => {
    // Usar el primer carácter del nombre para seleccionar un color
    const colors = [
      {
        base: '#8CBFCF',
        gradient: 'linear-gradient(to bottom, rgba(140,191,207,0.5), rgba(140,191,207,0.2))',
      },
      {
        base: '#9BC53D',
        gradient: 'linear-gradient(to bottom, rgba(155,197,61,0.5), rgba(155,197,61,0.2))',
      },
      {
        base: '#373F51',
        gradient: 'linear-gradient(to bottom, rgba(55,63,81,0.5), rgba(55,63,81,0.2))',
      },
      {
        base: '#E76F51',
        gradient: 'linear-gradient(to bottom, rgba(231,111,81,0.5), rgba(231,111,81,0.2))',
      },
      {
        base: '#2A9D8F',
        gradient: 'linear-gradient(to bottom, rgba(42,157,143,0.5), rgba(42,157,143,0.2))',
      },
    ];
    const index = name.charCodeAt(0) % colors.length;
    return {
      colors: [colors[index].base],
      gradient: colors[index].gradient,
    };
  };

  const insurers = ref<Insurer[]>([
    {
      name: 'Aseguradora 1',
      logo: 'https://ui-avatars.com/api/?name=A1&background=8CBFCF&color=fff&size=120&bold=true&format=svg',
      description: 'Líder en seguros con más de 50 años de experiencia en el mercado.',
      stats: {
        clients: '100+',
      },
      contact: {
        phone: '+504 2234-5678',
        email: 'contacto@aseguradora1.com',
        address: 'Col. Palmira, Tegucigalpa, Honduras',
      },
      services: ['Seguro de Vida', 'Seguro de Auto', 'Seguro de Hogar', 'Seguro Médico'],
    },
    {
      name: 'Aseguradora 2',
      logo: 'https://ui-avatars.com/api/?name=A2&background=9BC53D&color=fff&size=120&bold=true&format=svg',
      description: 'Soluciones innovadoras en seguros para particulares y empresas.',
      stats: {
        clients: '250+',
      },
      contact: {
        phone: '+504 2234-5679',
        email: 'info@aseguradora2.com',
        address: 'Col. Lomas del Guijarro, Tegucigalpa, Honduras',
      },
      services: ['Seguro de Vida', 'Seguro de Auto', 'Seguro Empresarial'],
    },
    {
      name: 'Aseguradora 3',
      logo: 'https://ui-avatars.com/api/?name=A3&background=373F51&color=fff&size=120&bold=true&format=svg',
      description: 'Comprometidos con la excelencia y la satisfacción del cliente.',
      stats: {
        clients: '50+',
      },
      contact: {
        phone: '+504 2234-5680',
        email: 'servicio@aseguradora3.com',
        address: 'Col. El Prado, Tegucigalpa, Honduras',
      },
      services: ['Seguro de Vida', 'Seguro de Salud'],
    },
    {
      name: 'Seguros del Pacífico',
      logo: 'https://ui-avatars.com/api/?name=SP&background=8CBFCF&color=fff&size=120&bold=true&format=svg',
      description: 'Especialistas en seguros marítimos y de transporte internacional.',
      stats: {
        clients: '75+',
      },
      contact: {
        phone: '+504 2234-5681',
        email: 'info@segurospacifico.com',
        address: 'Col. Las Minitas, Tegucigalpa, Honduras',
      },
      services: ['Seguro Marítimo', 'Seguro de Carga', 'Seguro de Transporte'],
    },
    {
      name: 'Aseguradora Nacional',
      logo: 'https://ui-avatars.com/api/?name=AN&background=9BC53D&color=fff&size=120&bold=true&format=svg',
      description: 'Cobertura nacional con presencia en todas las principales ciudades.',
      stats: {
        clients: '300+',
      },
      contact: {
        phone: '+504 2234-5682',
        email: 'contacto@aseguradoranacional.com',
        address: 'Col. Kennedy, Tegucigalpa, Honduras',
      },
      services: [
        'Seguro de Vida',
        'Seguro de Auto',
        'Seguro de Hogar',
        'Seguro Médico',
        'Seguro Empresarial',
      ],
    },
  ]);

  const showAddModal = ref(false);
  const showViewModal = ref(false);
  const selectedInsurer = ref<Insurer | null>(null);
  const insurerColors = ref<Map<string, { colors: string[]; gradient: string }>>(new Map());

  const { searchQuery, filteredItems: filteredInsurers } = useSearch(insurers.value, [
    'name',
    'description',
  ]);
  const { extractColors, createOverlay } = useColorThief();

  // Función para extraer y guardar colores del logo
  const extractLogoColors = async (insurer: Insurer) => {
    // Si es un avatar generado, usar colores predefinidos
    if (isGeneratedAvatar(insurer.logo)) {
      insurerColors.value.set(insurer.name, getDefaultColors(insurer.name));
      return;
    }

    // Si es una imagen real, intentar extraer colores
    try {
      const colors = await extractColors(insurer.logo);
      insurerColors.value.set(insurer.name, {
        colors: [colors.dominantColor, ...colors.palette.slice(0, 2)],
        gradient: createOverlay(colors.dominantColor),
      });
    } catch (error) {
      console.error('Error al extraer colores:', error);
      // Usar colores predefinidos en caso de error
      insurerColors.value.set(insurer.name, getDefaultColors(insurer.name));
    }
  };

  const handleAddInsurer = async (data: { name: string; description: string; logo: string }) => {
    const newInsurer: Insurer = {
      ...data,
      stats: {
        clients: '0',
      },
    };
    insurers.value.push(newInsurer);
    showAddModal.value = false;
  };

  const handleViewInsurer = (insurer: Insurer) => {
    selectedInsurer.value = insurer;
    showViewModal.value = true;
  };

  const handleSaveInsurer = async (updatedInsurer: Insurer) => {
    const index = insurers.value.findIndex((i) => i.name === selectedInsurer.value?.name);
    if (index !== -1) {
      // Mantener el número de clientes original
      updatedInsurer.stats.clients = insurers.value[index].stats.clients;
      insurers.value[index] = updatedInsurer;
    }
    showViewModal.value = false;
    selectedInsurer.value = null;
  };
</script>
