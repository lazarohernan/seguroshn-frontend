import { defineComponent } from 'vue';
import { ref } from 'vue';
import SearchBar from '@/modules/common/components/SearchBar.vue';
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
  Filter as Fl,
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

export default defineComponent({
  components: {
    SearchBar,
    ViewClientModal,
    AddClientModal,
    ViewClientPaymentsModal,
    ViewClientPolicyModal,
    ExportOptionsModal,
    Plus,
    Mail,
    Phone,
    MapPin,
    Eye,
    FileText,
    Coins,
    Fl,
    Users,
    Search,
  },
  setup() {
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

    return {
      //Properties
      clients,
      searchQuery,
      filteredItems,
      showClientModal,
      showAddModal,
      showPaymentsModal,
      showPolicyModal,
      showExportModal,
      selectedClient,
      selectedPolicy,
      clientPolicies,

      //Actions
      getInitials,
      handleViewClient,
      handleCloseModal,
      handleViewPolicies,
      handleUpdateClient,
      handleAddClient,
      handleExport,
    };
  },
});
