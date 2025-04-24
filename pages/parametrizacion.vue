<template>
  <div class="parametrizacion-container">
    <div class="cards-container">
      <!-- Tarjeta de Gestión de Huéspedes -->
      <div class="card">
        <div class="card-header">
          <div class="header-content">
            <UserGroupIcon class="card-icon" />
            <h2>Huéspedes</h2>
          </div>
          <div class="header-actions">
            <button class="action-button search" @click="showSearchModal = true">
              <MagnifyingGlassIcon class="button-icon" />
            </button>
            <button class="action-button add" @click="showGuestModal = true">
              <PlusIcon class="button-icon" />
            </button>
          </div>
        </div>
        <div class="card-content">
          <div class="guests-list" v-if="guests.length > 0">
            <div v-for="guest in guests.slice(0, 3)" :key="guest._id" class="guest-item">
              <div class="guest-info">
                <span class="guest-name">{{ guest.nombres }} {{ guest.apellidos }}</span>
                <span class="guest-id">{{ guest.cedula }}</span>
              </div>
            </div>
            <div class="show-more" v-if="guests.length > 3" @click="showSearchModal = true">
              Ver más...
            </div>
          </div>
          <div class="empty-state" v-else>
            <span>No hay huéspedes registrados</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Búsqueda -->
    <div v-if="showSearchModal" class="modal-overlay" @click="closeSearchModal">
      <div class="modal search-modal" @click.stop>
        <div class="modal-header">
          <h3>Buscar Huésped</h3>
          <button class="close-button" @click="closeSearchModal">
            <XMarkIcon class="button-icon" />
          </button>
        </div>
        <div class="search-container">
          <div class="search-input">
            <MagnifyingGlassIcon class="search-icon" />
            <input 
              v-model="searchQuery" 
              placeholder="Buscar por nombre o cédula..."
              @input="searchGuests"
            />
          </div>
          <div class="search-results">
            <div v-for="guest in filteredGuests" :key="guest._id" class="search-item">
              <div class="guest-info">
                <span class="guest-name">{{ guest.nombres }} {{ guest.apellidos }}</span>
                <span class="guest-details">
                  <span class="guest-id">{{ guest.cedula }}</span>
                  <span class="guest-location">{{ guest.ciudad }}, {{ guest.pais }}</span>
                </span>
              </div>
              <div class="item-actions">
                <button class="action-button edit" @click="editGuest(guest)">
                  <PencilIcon class="button-icon" />
                </button>
                <button class="action-button delete" @click="deleteGuest(guest._id)">
                  <TrashIcon class="button-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar huésped -->
    <div v-if="showGuestModal" class="modal-overlay" @click="closeGuestModal">
      <div class="modal guest-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingGuest ? 'Editar Huésped' : 'Nuevo Huésped' }}</h3>
          <button class="close-button" @click="closeGuestModal">
            <XMarkIcon class="button-icon" />
          </button>
        </div>
        <form @submit.prevent="saveGuest" class="guest-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nombres:</label>
              <input v-model="guestForm.nombres" required />
            </div>
            <div class="form-group">
              <label>Apellidos:</label>
              <input v-model="guestForm.apellidos" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Cédula:</label>
              <input v-model="guestForm.cedula" required />
            </div>
            <div class="form-group">
              <label>Teléfono:</label>
              <input v-model="guestForm.telefono" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Ciudad:</label>
              <input v-model="guestForm.ciudad" required />
            </div>
            <div class="form-group">
              <label>País:</label>
              <input v-model="guestForm.pais" required />
            </div>
          </div>
          <div class="form-group">
            <label>Dirección:</label>
            <input v-model="guestForm.direccion" required />
          </div>
          <div class="form-group">
            <label>Correo Electrónico:</label>
            <input type="email" v-model="guestForm.email" required />
          </div>
          <div class="modal-buttons">
            <button type="submit" class="save-button">Guardar</button>
            <button type="button" class="cancel-button" @click="closeGuestModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  PlusIcon, 
  XMarkIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';

const guests = ref([]);
const showSearchModal = ref(false);
const showGuestModal = ref(false);
const editingGuest = ref(null);
const searchQuery = ref('');

const guestForm = ref({
  nombres: '',
  apellidos: '',
  cedula: '',
  ciudad: '',
  pais: '',
  direccion: '',
  telefono: '',
  email: ''
});

const toast = useToast();

const filteredGuests = computed(() => {
  if (!searchQuery.value) return guests.value;
  const query = searchQuery.value.toLowerCase();
  return guests.value.filter(guest => 
    guest.nombres.toLowerCase().includes(query) ||
    guest.apellidos.toLowerCase().includes(query) ||
    guest.cedula.includes(query)
  );
});

const fetchGuests = async () => {
  try {
    const response = await fetch('/api/guests');
    const result = await response.json();
    
    if (result.success) {
      guests.value = result.data;
    } else {
      toast.error(result.message || 'Error al cargar huéspedes');
    }
  } catch (error) {
    console.error('Error al cargar huéspedes:', error);
    toast.error('Error al cargar huéspedes');
  }
};

const searchGuests = () => {
  // La búsqueda se realiza automáticamente gracias al computed filteredGuests
};

const editGuest = (guest) => {
  editingGuest.value = guest;
  guestForm.value = { ...guest };
  showGuestModal.value = true;
  showSearchModal.value = false;
};

const deleteGuest = async (guestId) => {
  if (!confirm('¿Está seguro de que desea eliminar este huésped?')) return;
  
  try {
    const response = await fetch(`/api/guests/${guestId}`, {
      method: 'DELETE'
    });
    const result = await response.json();

    if (result.success) {
      toast.success(result.message);
      await fetchGuests();
    } else {
      toast.error(result.message);
    }
  } catch (error) {
    console.error('Error al eliminar huésped:', error);
    toast.error('Error al eliminar huésped');
  }
};

const saveGuest = async () => {
  try {
    const method = editingGuest.value ? 'PUT' : 'POST';
    const url = editingGuest.value 
      ? `/api/guests/${editingGuest.value.id}`
      : '/api/guests';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(guestForm.value)
    });

    const result = await response.json();

    if (result.success) {
      toast.success(result.message);
      await fetchGuests();
      closeGuestModal();
    } else {
      toast.error(result.message);
    }
  } catch (error) {
    console.error('Error al guardar huésped:', error);
    toast.error('Error al guardar huésped');
  }
};

const closeSearchModal = () => {
  showSearchModal.value = false;
  searchQuery.value = '';
};

const closeGuestModal = () => {
  showGuestModal.value = false;
  editingGuest.value = null;
  guestForm.value = {
    nombres: '',
    apellidos: '',
    cedula: '',
    ciudad: '',
    pais: '',
    direccion: '',
    telefono: '',
    email: ''
  };
};

onMounted(fetchGuests);
</script>

<style scoped>
.parametrizacion-container {
  padding: 20px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 300px;
}

.card-header {
  background: #03256C;
  color: white;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon {
  width: 24px;
  height: 24px;
}

.card-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.button-icon {
  width: 20px;
  height: 20px;
  color: white;
}

.card-content {
  padding: 12px;
}

.guests-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guest-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.guest-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.guest-name {
  font-weight: 500;
  color: #03256C;
  font-size: 0.9rem;
}

.guest-id {
  font-size: 0.8rem;
  color: #666;
}

.show-more {
  text-align: center;
  color: #06BEE1;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 8px;
}

.show-more:hover {
  color: #1768AC;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #03256C;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.close-button .button-icon {
  width: 20px;
  height: 20px;
  color: #666;
}

.search-container {
  padding: 20px;
}

.search-input {
  position: relative;
  margin-bottom: 15px;
}

.search-input input {
  width: 100%;
  padding: 8px 35px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #666;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

.search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.guest-details {
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
  color: #666;
}

.guest-location {
  color: #1768AC;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.item-actions .action-button {
  padding: 6px;
}

.item-actions .button-icon {
  color: #666;
}

.edit:hover .button-icon {
  color: #06BEE1;
}

.delete:hover .button-icon {
  color: #ff4444;
}

.guest-form {
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-button,
.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.save-button {
  background: #06BEE1;
  color: white;
}

.save-button:hover {
  background: #1768AC;
}

.cancel-button {
  background: #f0f0f0;
  color: #333;
}

.cancel-button:hover {
  background: #e0e0e0;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 20px;
  font-size: 0.9rem;
}
</style>

