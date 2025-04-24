<template>
  <div class="dashboard-container">
    <div class="cards-container">
      <!-- Tarjeta de Llegadas -->
      <div class="card">
        <div class="card-header">
          <h2>Llegadas</h2>
          <span class="card-number">2</span>
        </div>
        <div class="card-content">
          <div class="reservation-list">
            <div class="reservation-item">
              <div class="guest-info">
                <span class="guest-name">Emily Beach</span>
                <span class="reservation-id">7791-U78-054</span>
              </div>
              <div class="status">
                <span class="status-badge">Arrival</span>
              </div>
            </div>
            <div class="reservation-item">
              <div class="guest-info">
                <span class="guest-name">Eva Fortune</span>
                <span class="reservation-id">7791-U78-054</span>
              </div>
              <div class="status">
                <span class="status-badge">Arrival</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjeta de Salidas -->
      <div class="card">
        <div class="card-header">
          <h2>Salidas</h2>
          <span class="card-number">1</span>
        </div>
        <div class="card-content">
          <div class="reservation-list">
            <div class="reservation-item">
              <div class="guest-info">
                <span class="guest-name">Todd Brown</span>
                <span class="reservation-id">7791-U78-054</span>
              </div>
              <div class="status">
                <span class="status-badge departure">Departure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjeta de Reservas -->
      <div class="card">
        <div class="card-header">
          <h2>Reservas de Hoy</h2>
          <div class="card-stats">
            <div class="stat">
              <span class="stat-number">3</span>
              <span class="stat-label">NOCHES</span>
            </div>
            <div class="stat">
              <span class="stat-number">€1,230.00</span>
              <span class="stat-label">INGRESOS</span>
            </div>
          </div>
        </div>
        <div class="card-content">
          <div class="reservation-list">
            <div class="reservation-item">
              <div class="guest-info">
                <span class="guest-name">Todd Brown</span>
                <span class="price">€350.00</span>
              </div>
              <div class="stay-info">
                <span class="check-in">13/06/2023</span>
                <span class="nights">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: #03256C;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.card-number {
  background: #2541B2;
  padding: 4px 12px;
  border-radius: 15px;
  font-weight: bold;
}

.card-content {
  padding: 15px;
}

.reservation-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reservation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.guest-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.guest-name {
  font-weight: 500;
  color: #03256C;
}

.reservation-id {
  font-size: 0.85rem;
  color: #666;
}

.status-badge {
  background: #06BEE1;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.status-badge.departure {
  background: #1768AC;
}

.card-stats {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stat-number {
  font-weight: bold;
  font-size: 1.1rem;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.8;
}

.price {
  color: #1768AC;
  font-weight: 500;
}

.stay-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.check-in {
  color: #666;
  font-size: 0.9rem;
}

.nights {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
</style>