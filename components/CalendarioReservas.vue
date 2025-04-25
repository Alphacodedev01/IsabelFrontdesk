<template>
  <div class="calendario-container">
    <!-- Barra de navegación superior -->
    <div class="calendar-header">
      <div class="navigation-controls">
        <button class="nav-btn" @click="prevMonth">&lt;</button>
        <button class="today-btn" @click="goToToday">Hoy</button>
        <button class="nav-btn" @click="nextMonth">&gt;</button>
      </div>
      <div class="view-controls">
        <button :class="{ active: viewMode === '10days' }" @click="setViewMode('10days')">10 días</button>
        <button :class="{ active: viewMode === 'month' }" @click="setViewMode('month')">Mes</button>
      </div>
    </div>

    <!-- Contenedor principal del calendario -->
    <div class="calendar-body">
      <!-- Columna fija de habitaciones -->
      <div class="rooms-column">
        <div class="room-header">Habitación</div>
        <div v-for="room in rooms" :key="room.number" class="room-row">
          <div class="room-info">
            <span :class="{'room-indicator': true, [room.type.toLowerCase()]: true}"></span>
            {{ room.number }} {{ room.type }}
          </div>
        </div>
      </div>

      <!-- Área scrollable de días -->
      <div class="days-area" @scroll="handleScroll">
        <div class="calendar-content">
          <!-- Header de meses -->
          <div class="months-header">
            <div v-for="(month, index) in currentMonths" 
                 :key="index" 
                 class="month-header"
                 :style="getMonthHeaderStyle(month)"
                 :ref="el => { if (el) monthRefs[index] = el }">
              <div class="month-name" :style="getMonthNameStyle(index)">
                {{ month.fullName }}
              </div>
            </div>
          </div>
          <!-- Header de días -->
          <div class="days-header">
            <div v-for="day in currentWeek" :key="day.date" class="day-header">
              <div class="day-number">{{ day.dayNumber }}</div>
              <div class="day-name">{{ getDayName(day.date) }}</div>
            </div>
          </div>

          <!-- Grid de días -->
          <div class="days-grid">
            <div v-for="room in rooms" :key="room.number" class="room-days">
              <div
                v-for="day in currentWeek"
                :key="day.date"
                class="day-cell"
                :class="{ 'selecting': isInSelectionRange(room.number, day.date) }"
                @mousedown="startSelection(room.number, day.date)"
                @mouseenter="updateSelection(room.number, day.date)"
                @mouseup="endSelection"
              >
                <template v-if="getReservation(room.number, day.date)">
                  <div
                    v-if="isFirstDayOfReservation(room.number, day.date)"
                    :class="['reservation', getReservationClass(room.number, day.date)]"
                    :style="getReservationStyle(room.number, day.date)"
                  >
                    <div class="reservation-content">
                      <span class="guest-name">{{ getReservation(room.number, day.date).guestName }}</span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para nueva reserva -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Nueva Reserva</h3>
        <p>{{ selectedRoom }} del {{ selectionStart }} al {{ selectionEnd }}</p>
        <label>Nombre:</label>
        <input v-model="newReservation.guestName" />
        <label>Precio:</label>
        <input v-model="newReservation.price" type="number" />
        <button @click="saveReservation">Guardar</button>
        <button @click="cancelReservation">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);
dayjs.locale('es');

export default {
  setup() {
    const rooms = ref([
      { number: '101', type: 'INDI' },
      { number: '102', type: 'INDI' },
      { number: '103', type: 'INDI' },
      { number: '104', type: 'INDI' },
      { number: '202', type: 'DOBL' },
      { number: '203', type: 'DOBL' },
      { number: '204', type: 'DOBL' },
      { number: '205', type: 'DOBL' },
      { number: '206', type: 'DOBL' }
    ]);

    const reservations = ref([
      {
        roomNumber: '101',
        startDate: '2024-03-14',
        endDate: '2024-03-16',
        guestName: 'BERTA Aizperro',
        price: '270',
        status: 'confirmed'
      }
    ]);

    const currentDate = ref(dayjs());
    const currentMonth = computed(() => {
      const month = currentDate.value.format('MMMM YYYY');
      return month.charAt(0).toUpperCase() + month.slice(1);
    });

    const currentWeek = computed(() => {
      const start = dayjs(startDate.value);
      const end = dayjs(endDate.value);
      const daysToShow = end.diff(start, 'day') + 1;
      const days = [];
      
      for (let i = 0; i < daysToShow; i++) {
        const day = start.add(i, 'day');
        days.push({
          dayNumber: day.format('D'),
          date: day.format('YYYY-MM-DD')
        });
      }
      return days;
    });

    const getReservation = (roomNumber, date) => {
      return reservations.value.find(r => {
        const checkDate = dayjs(date);
        const startDate = dayjs(r.startDate);
        const endDate = dayjs(r.endDate);
        
        return r.roomNumber === roomNumber &&
               (checkDate.isBetween(startDate, endDate.subtract(1, 'day'), 'day', '[]') ||
                checkDate.isSame(startDate, 'day'));
      });
    };

    const isFirstDayOfReservation = (roomNumber, date) => {
      const reservation = getReservation(roomNumber, date);
      return reservation && dayjs(date).isSame(reservation.startDate, 'day');
    };

    const getReservationClass = (roomNumber, date) => {
      const reservation = getReservation(roomNumber, date);
      return reservation ? reservation.status : '';
    };

    const getReservationStyle = (roomNumber, date) => {
      const reservation = getReservation(roomNumber, date);
      if (!reservation) return {};

      const startDate = dayjs(reservation.startDate);
      const endDate = dayjs(reservation.endDate);
      const duration = endDate.diff(startDate, 'day') + 1;

      return {
        width: `calc(${duration * 100}% - 140%)`,
        position: 'absolute',
        left: '70%',
        height: '80%',
        top: '10%',
        zIndex: 1
      };
    };

    const nextWeek = () => {
      currentDate.value = currentDate.value.add(1, 'week');
    };

    const prevWeek = () => {
      currentDate.value = currentDate.value.subtract(1, 'week');
    };

    // Selección para nueva reserva
    const showModal = ref(false);
    const selectedRoom = ref(null);
    const selectionStart = ref(null);
    const selectionEnd = ref(null);
    const isSelecting = ref(false);

    const newReservation = ref({
      guestName: '',
      price: '',
    });

    const isDateAvailable = (roomNumber, date) => {
      const reservations = reservations.value.filter(r => r.roomNumber === roomNumber);
      const checkDate = dayjs(date);
      
      // Verificar si hay alguna reserva que bloquee la fecha
      return !reservations.some(reservation => {
        const startDate = dayjs(reservation.startDate);
        const endDate = dayjs(reservation.endDate);
        
        // Una fecha está bloqueada solo si:
        // 1. Es la fecha de inicio de una reserva
        // 2. O es un día entre el inicio y el día anterior al checkout
        return checkDate.isSame(startDate, 'day') || 
               checkDate.isBetween(startDate, endDate.subtract(1, 'day'), 'day');
      });
    };

    const startSelection = (room, date) => {
      selectedRoom.value = room;
      selectionStart.value = date;
      selectionEnd.value = date;
      isSelecting.value = true;
    };

    const updateSelection = (roomNumber, date) => {
      if (isSelecting.value && roomNumber === selectedRoom.value) {
        selectionEnd.value = date;
      }
    };

    const endSelection = () => {
      if (isSelecting.value) {
        isSelecting.value = false;
        
        if (selectionStart.value === selectionEnd.value) {
          alert('Debes seleccionar al menos una noche');
          selectionStart.value = null;
          selectionEnd.value = null;
          return;
        }
        
        showModal.value = true;
      }
    };

    const saveReservation = () => {
      const start = dayjs(selectionStart.value);
      const end = dayjs(selectionEnd.value);
      
      const [startDate, endDate] = start.isAfter(end) 
        ? [end.format('YYYY-MM-DD'), start.format('YYYY-MM-DD')]
        : [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')];

      reservations.value.push({
        roomNumber: selectedRoom.value,
        startDate,
        endDate,
        guestName: newReservation.value.guestName,
        price: newReservation.value.price,
        status: 'pending'
      });

      showModal.value = false;
      newReservation.value = { guestName: '', price: '' };
      selectionStart.value = null;
      selectionEnd.value = null;
    };

    const cancelReservation = () => {
      showModal.value = false;
      newReservation.value = { guestName: '', price: '' };
    };

    const isInSelectionRange = (roomNumber, date) => {
      if (!isSelecting.value || roomNumber !== selectedRoom.value) return false;
      if (!selectionStart.value || !selectionEnd.value) return false;

      const currentDate = dayjs(date);
      const start = dayjs(selectionStart.value);
      const end = dayjs(selectionEnd.value);

      // Permitir que la fecha de inicio y fin sean la misma
      return currentDate.isBetween(
        start.isBefore(end) ? start : end,
        start.isBefore(end) ? end : start,
        'day',
        '[]'
      );
    };

    const getSelectionStyle = (roomNumber, date) => {
      if (!isInSelectionRange(roomNumber, date)) return {};

      const isFirst = date === selectionStart.value;
      if (!isFirst) return {};

      const start = dayjs(selectionStart.value);
      const end = dayjs(selectionEnd.value);
      
      const [actualStart, actualEnd] = start.isAfter(end) 
        ? [end, start] 
        : [start, end];
      
      const duration = actualEnd.diff(actualStart, 'day') + 1;

      return {
        width: `calc(${duration * 100}% - 130%)`,
        position: 'absolute',
        left: '70%',
        height: '80%',
        top: '10%',
        zIndex: 1
      };
    };

    const startDate = ref(dayjs().format('YYYY-MM-DD'));
    const endDate = ref(dayjs().add(1, 'month').format('YYYY-MM-DD'));

    const viewMode = ref('month');
    const setViewMode = (mode) => {
      viewMode.value = mode;
      if (mode === '10days') {
        endDate.value = dayjs(startDate.value).add(10, 'days').format('YYYY-MM-DD');
      } else {
        endDate.value = dayjs(startDate.value).endOf('month').format('YYYY-MM-DD');
      }
    };

    const getDayName = (date) => {
      return dayjs(date).format('ddd');
    };

    const goToToday = () => {
      startDate.value = dayjs().format('YYYY-MM-DD');
      if (viewMode.value === '10days') {
        endDate.value = dayjs().add(10, 'days').format('YYYY-MM-DD');
      } else {
        endDate.value = dayjs().endOf('month').format('YYYY-MM-DD');
      }
    };

    const nextMonth = () => {
      startDate.value = dayjs(startDate.value).add(1, 'month').startOf('month').format('YYYY-MM-DD');
      endDate.value = dayjs(startDate.value).endOf('month').format('YYYY-MM-DD');
    };

    const prevMonth = () => {
      startDate.value = dayjs(startDate.value).subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
      endDate.value = dayjs(startDate.value).endOf('month').format('YYYY-MM-DD');
    };

    const currentMonths = computed(() => {
      const months = [];
      let currentMonth = null;
      let daysInMonth = 0;
      let currentYear = null;
      
      currentWeek.value.forEach(day => {
        const monthDate = dayjs(day.date);
        const monthName = monthDate.format('MMMM');
        const year = monthDate.format('YYYY');
        
        if (monthName !== currentMonth || year !== currentYear) {
          if (currentMonth) {
            months.push({
              name: currentMonth,
              year: currentYear,
              days: daysInMonth,
              fullName: `${currentMonth} ${currentYear}`
            });
          }
          currentMonth = monthName;
          currentYear = year;
          daysInMonth = 1;
        } else {
          daysInMonth++;
        }
      });
      
      if (currentMonth) {
        months.push({
          name: currentMonth,
          year: currentYear,
          days: daysInMonth,
          fullName: `${currentMonth} ${currentYear}`
        });
      }
      
      return months;
    });

    const handleScroll = (event) => {
      const scrollLeft = event.target.scrollLeft;
      const containerLeft = event.target.getBoundingClientRect().left;
      let accumulatedWidth = 0;
      
      monthRefs.value.forEach((monthEl, index) => {
        if (!monthEl) return;
        
        const rect = monthEl.getBoundingClientRect();
        const monthWidth = rect.width;
        const monthLeft = accumulatedWidth;
        const monthRight = monthLeft + monthWidth;
        const viewportStart = 200; // Ancho de la columna de habitaciones
        
        let translateX = 0;
        
        // Calculamos la posición del texto del mes
        if (scrollLeft >= monthLeft && scrollLeft < monthRight) {
          // Calculamos cuánto espacio queda disponible
          const availableSpace = monthRight - scrollLeft;
          
          // Si hay suficiente espacio para mostrar el texto completo
          if (availableSpace >= 150) { // Asumimos que 150px es suficiente para el texto
            translateX = scrollLeft - monthLeft + viewportStart;
            
            // Nos aseguramos de que no se pase del límite derecho
            const maxTranslate = monthWidth - 150; // Dejamos espacio para el texto
            translateX = Math.min(translateX, maxTranslate);
          } else {
            // Si no hay suficiente espacio, lo mantenemos al final del mes actual
            translateX = monthWidth - 150;
          }
        }
        
        monthNamePositions.value[index] = translateX;
        accumulatedWidth += monthWidth;
      });
    };

    const getMonthHeaderStyle = (month) => {
      return {
        width: `calc(${month.days * 150}px)`,
        position: 'relative',
        overflow: 'hidden'
      };
    };

    const monthRefs = ref([]);
    const monthNamePositions = ref([]);

    const getMonthNameStyle = (index) => {
      return {
        transform: `translate(${monthNamePositions.value[index] || 0}px, -50%)`,
        position: 'absolute',
        left: '0',
        top: '50%',
        transition: 'transform 0.1s ease-out'
      };
    };

    onMounted(() => {
      monthNamePositions.value = new Array(currentMonths.value.length).fill(0);
    });

    return {
      rooms,
      reservations,
      currentDate,
      currentWeek,
      currentMonth,
      nextWeek,
      prevWeek,
      getReservation,
      isFirstDayOfReservation,
      getReservationClass,
      getReservationStyle,
      startSelection,
      updateSelection,
      endSelection,
      showModal,
      selectedRoom,
      selectionStart,
      selectionEnd,
      newReservation,
      saveReservation,
      cancelReservation,
      isInSelectionRange,
      getSelectionStyle,
      startDate,
      endDate,
      viewMode,
      setViewMode,
      getDayName,
      goToToday,
      nextMonth,
      prevMonth,
      currentMonths,
      getMonthHeaderStyle,
      monthRefs,
      handleScroll,
      getMonthNameStyle,
    };
  }
};
</script>

<style scoped>
.calendario-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  background: white;
  overflow: hidden;
}

.calendar-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.calendar-body {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.rooms-column {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background: white;
  z-index: 2;
  border-right: 2px solid #e0e0e0;
}

.room-header {
  height: 100px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  font-weight: 500;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.room-row {
  height: 50px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  background: white;
}

.days-area {
  position: absolute;
  left: 200px;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-x: auto;
  overflow-y: auto;
  will-change: transform;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.days-header {
  height: 60px;
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  min-width: max-content;
}

.days-grid {
  display: inline-flex;
  flex-direction: column;
  min-width: max-content;
}

.room-days {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #e0e0e0;
}

.day-cell {
  min-width: 150px;
  height: 100%;
  border-right: 1px solid #e0e0e0;
  position: relative;
}

.day-header {
  min-width: 150px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.day-number {
  font-size: 1.2rem;
  font-weight: 500;
}

.day-name {
  font-size: 0.875rem;
  color: #666;
}

/* Contenedor para el grid y el header */
.calendar-content {
  position: relative;
  min-width: max-content;
}

.room-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.room-indicator.indi {
  background-color: #4285f4;
}

.room-indicator.dobl {
  background-color: #34a853;
}

.reservation {
  position: absolute;
  height: 80%;
  top: 10%;
  background: #4285f4;
  border-radius: 4px;
  color: white;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.reservation-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estilos para el scrollbar */
.days-area::-webkit-scrollbar {
  height: 8px;
}

.days-area::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.days-area::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.days-area::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Estilos para la selección */
.selecting {
  background-color: rgba(66, 133, 244, 0.1);
}

/* Ajustes para los controles de navegación */
.navigation-controls, .view-controls {
  display: flex;
  gap: 0.5rem;
}

.nav-btn, .today-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.view-controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.view-controls button.active {
  background: #1a73e8;
  color: white;
  border-color: #1a73e8;
}

/* Estilos para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.modal button {
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal button:first-of-type {
  background: #1a73e8;
  color: white;
}

.modal button:last-of-type {
  background: #f1f3f4;
  color: #3c4043;
}

.months-header {
  height: 40px;
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  min-width: max-content;
  position: relative;
  z-index: 2;
  overflow: hidden;
}

.month-header {
  height: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 500;
  text-transform: capitalize;
  border-right: 1px solid #e0e0e0;
  background: #f8f9fa;
  position: relative;
  overflow: hidden;
}

.month-name {
  position: absolute;
  white-space: nowrap;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  pointer-events: none;
  will-change: transform;
  left: 0;
  top: 50%;
  min-width: 140px;
  text-align: center;
}
</style>
