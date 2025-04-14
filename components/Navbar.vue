<template>
  <nav style="background-color: #03256C; color: white;" class="py-4">
    <div class="container mx-auto flex items-center justify-between px-4">
      <div class="flex items-center">
        <span class="text-xl font-bold" style="color: white;">Gestor de Reservas</span>
      </div>
      <div class="flex space-x-4">
        <a
          href="#"
          class="flex items-center transition-colors duration-200 rounded-md px-3 py-1"
          style="color: white;"
          @mouseover="hover1 = true"
          @mouseleave="hover1 = false"
          :style="hover1 ? hoverStyle : {}"
        >
          <i class="i-heroicons-outline-home mr-1"></i>
          Dashboard
        </a>
        <NuxtLink
          to="/reservas"
          class="flex items-center transition-colors duration-200 rounded-md px-3 py-1"
          style="color: white;"
          @mouseover="hover2 = true"
          @mouseleave="hover2 = false"
          :style="hover2 ? hoverStyle : {}"
        >
          <i class="i-heroicons-outline-calendar mr-1"></i>
          Reservas
        </NuxtLink>
        <a
          href="#"
          class="flex items-center transition-colors duration-200 rounded-md px-3 py-1"
          style="color: white;"
          @mouseover="hover3 = true"
          @mouseleave="hover3 = false"
          :style="hover3 ? hoverStyle : {}"
        >
          <i class="i-heroicons-outline-document-report mr-1"></i>
          Reportes
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const hover1 = ref(false)
const hover2 = ref(false)
const hover3 = ref(false)

const hoverStyle = {
  backgroundColor: '#06BEE1',
  color: '#03256C',
}
</script>

<style scoped>
/* Si usas íconos de Heroicons con una librería como unplugin-icons o similar, asegúrate de que estén bien configurados */
</style>
