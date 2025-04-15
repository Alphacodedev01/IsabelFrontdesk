<script setup>
import {
  CalendarDaysIcon,
  AdjustmentsHorizontalIcon,
  WrenchScrewdriverIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="menu">
    <NuxtLink to="/" class="link dashboard">
      <span class="link-icon">
        <HomeIcon class="icon-hero" />
      </span>
      <span class="link-title">Dashboard</span>
    </NuxtLink>

    <NuxtLink to="/reservas" class="link reservas">
      <span class="link-icon">
        <CalendarDaysIcon class="icon-hero" />
      </span>
      <span class="link-title">Reservas</span>
    </NuxtLink>

    <NuxtLink to="/parametrizacion" class="link parametrizacion">
      <span class="link-icon">
        <AdjustmentsHorizontalIcon class="icon-hero" />
      </span>
      <span class="link-title">Parametrización</span>
    </NuxtLink>

    <NuxtLink to="/mantenimiento" class="link mantenimiento">
      <span class="link-icon">
        <WrenchScrewdriverIcon class="icon-hero" />
      </span>
      <span class="link-title">Mantenimiento</span>
    </NuxtLink>

    <NuxtLink to="/reportes" class="link reportes">
      <span class="link-icon">
        <ChartBarIcon class="icon-hero" />
      </span>
      <span class="link-title">Reportes</span>
    </NuxtLink>
  </div>
</template>

<style scoped>
.menu {
  padding: 0.5rem;
  background-color: #03256C;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0;
  box-shadow: 10px 0 25px 0 rgba(0, 0, 0, 0.075);
  transition: width 0.2s ease-in;
  overflow: hidden;
  z-index: 10;
}

.menu:hover,
.menu:focus {
  width: 220px;
}

.link {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 50px;
  border-radius: 0;
  position: relative;
  z-index: 1;
  overflow: hidden;
  transform-origin: center left;
  text-decoration: none;
  color: #FFFFFF;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.link:hover,
.link:focus {
  color: var(--main-color);
}

.link::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--main-color-opacity) 0%, rgba(0, 0, 0, 0) 100%);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: -1;
}

.link:hover::before,
.link:focus::before {
  transform: translateX(0);
}

.link-icon {
  width: 28px;
  height: 28px;
  display: block;
  flex-shrink: 0;
  position: relative;
  margin-right: 10px;
}

.link-icon svg,
.icon-hero {
  width: 28px;
  height: 28px;
  color: white;
}

.link-title {
  transform: translateX(0);
  transition: transform 0.2s ease-in, opacity 0.2s ease-in;
  transform-origin: center right;
  display: block;
  text-align: left;
  width: 100%;
  opacity: 0;
  white-space: nowrap;
}

.menu:hover .link-title,
.menu:focus .link-title {
  opacity: 1;
}

.dashboard {
  --main-color: #06BEE1;
  --main-color-opacity: #06BEE11c;
}

.reservas {
  --main-color: #06BEE1;
  --main-color-opacity: #1768AC1c;
}

.parametrizacion {
  --main-color: #06BEE1;
  --main-color-opacity: #00BFA61c;
}

.mantenimiento {
  --main-color: #06BEE1;
  --main-color-opacity: #F293251c;
}

.reportes {
  --main-color: #06BEE1;
  --main-color-opacity: #FFFFFF1c;
}
</style>
