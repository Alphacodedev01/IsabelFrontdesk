<template>
  <div>
    <h1>Reservas</h1>
    <!-- Aquí insertamos el componente del calendario -->
    <Calendario />
  </div>
</template>

<script>
// Importa el componente del calendario
import Calendario from '@/components/CalendarioReservas.vue';

export default {
  components: {
    Calendario // Registra el componente para usarlo
  }
};
</script>

<style scoped>
/* Estilos para la página de reservas */
</style>
