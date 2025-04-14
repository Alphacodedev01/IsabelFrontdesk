<template>
  <div class="calendario-container">
    <div class="navigation">
      <button @click="prevWeek">Semana Anterior</button>
      <span class="date-range">{{ currentMonth }}</span>
      <button @click="nextWeek">Semana Siguiente</button>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th class="room-header">Habitación</th>
            <th v-for="day in currentWeek" :key="day.date">{{ day.dayNumber }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.number">
            <td class="room-cell">
              <div class="room-info">
                <span :class="{'room-indicator': true, 'dobl': room.type === 'DOBL'}"></span>
                {{ room.number }} {{ room.type }}
              </div>
            </td>
            <td v-for="(day, index) in currentWeek" 
                :key="day.date" 
                class="day-cell"
                :style="{ position: 'relative' }">
              <template v-if="getReservation(room.number, day.date)">
                <div v-if="isFirstDayOfReservation(room.number, day.date)"
                     :class="['reservation', getReservationClass(room.number, day.date)]"
                     :style="getReservationStyle(room.number, day.date)">
                  <div class="reservation-content">
                    <span class="guest-name">{{ getReservation(room.number, day.date).guestName }}</span>
                    <span class="price">{{ getReservation(room.number, day.date).price }}€</span>
                  </div>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
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
      },
      {
        roomNumber: '101',
        startDate: '2025-04-17',
        endDate: '2025-04-19',
        guestName: 'Ainhoa Zuazu',
        price: '200',
        status: 'pending'
      },
      {
        roomNumber: '102',
        startDate: '2025-04-07',
        endDate: '2025-04-09',
        guestName: 'Lorena Aida',
        price: '630',
        status: 'pending'
      },
      {
        roomNumber: '102',
        startDate: '2024-03-14',
        endDate: '2024-03-16',
        guestName: 'BERTA Aizperro',
        price: '270',
        status: 'confirmed'
      },
      {
        roomNumber: '102',
        startDate: '2024-03-17',
        endDate: '2024-03-19',
        guestName: 'Paolo Rossi',
        price: '603',
        status: 'pending'
      }
    ]);

    const currentDate = ref(dayjs());

    const currentMonth = computed(() => {
      return currentDate.value.format('MMMM YYYY');
    });

    const currentWeek = computed(() => {
      const startOfWeek = currentDate.value.startOf('week');
      const week = [];
      for (let i = 0; i < 16; i++) {
        const day = startOfWeek.add(i, 'day');
        week.push({
          dayNumber: day.format('D'),
          date: day.format('YYYY-MM-DD')
        });
      }
      return week;
    });

    const getReservation = (roomNumber, date) => {
      return reservations.value.find(r => 
        r.roomNumber === roomNumber &&
        dayjs(date).isBetween(r.startDate, r.endDate, 'day', '[]')
      );
    };

    const getReservationClass = (roomNumber, date) => {
      const reservation = getReservation(roomNumber, date);
      if (!reservation) return '';
      return reservation.status;
    };

    const isFirstDayOfReservation = (roomNumber, date) => {
      const reservation = getReservation(roomNumber, date);
      if (!reservation) return false;
      return dayjs(date).isSame(reservation.startDate, 'day');
    };

    const getReservationStyle = (roomNumber, date) => {
      const reservation = getReservation(roomNumber, date);
      if (!reservation) return {};
      
      const startDate = dayjs(reservation.startDate);
      const endDate = dayjs(reservation.endDate);
      const duration = endDate.diff(startDate, 'day') + 1;
      
      return {
        width: `calc(${(duration - 1) * 100}%)`,
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)'
      };
    };

    const nextWeek = () => {
      currentDate.value = currentDate.value.add(1, 'week');
    };

    const prevWeek = () => {
      currentDate.value = currentDate.value.subtract(1, 'week');
    };

    return {
      rooms,
      currentWeek,
      currentMonth,
      nextWeek,
      prevWeek,
      getReservation,
      getReservationClass,
      getReservationStyle,
      isFirstDayOfReservation
    };
  }
}
</script>

<style scoped>
.calendario-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-container {
  overflow-x: auto;
  position: relative;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  height: 40px;
  box-sizing: border-box;
  width: 60px;
}

.room-header {
  width: 120px;
  background: #f5f5f5;
  font-weight: normal;
  position: sticky;
  left: 0;
  z-index: 2;
}

.room-cell {
  background: #f5f5f5;
  text-align: left;
  position: sticky;
  left: 0;
  z-index: 2;
}

.room-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.room-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4CAF50;
}

.room-indicator.dobl {
  background: #2196F3;
}

.day-cell {
  position: relative;
  padding: 0;
  height: 40px;
  min-width: 60px;
  overflow: visible;
}

.reservation {
  position: absolute;
  top: 0;
  height: 100%;
  background: #FF0000;
  padding: 4px;
  box-sizing: border-box;
  z-index: 1;
}

.reservation.confirmed {
  background: #4CAF50;
}

.reservation.pending {
  background: #FFA726;
}

.reservation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  padding: 0 8px;
}

.guest-name {
  font-weight: normal;
  margin-bottom: 2px;
}

.navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.navigation button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.navigation button:hover {
  background: #f5f5f5;
}

.date-range {
  font-weight: bold;
  font-size: 1.2em;
}
</style>
