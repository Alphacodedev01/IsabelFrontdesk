<script>
import CalendarioReservas from '../components/CalendarioReservas.vue';

export default {
  name: 'ReservasPage',
  components: {
    CalendarioReservas
  }
}
</script>

<template>
  <div class="reservas-container">
    <h1>Página de Reservas</h1>
    <CalendarioReservas />
    <p>Aquí podrás realizar tus reservas.</p>
  </div>
</template>

<style scoped>
.reservas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
