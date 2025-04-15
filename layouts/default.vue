<template>
    <div class="layout-container">
      <div class="navbar-container">
        <Navbar />
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  import Navbar from '~/components/Navbar.vue'
  </script>
  
  <style scoped>
  .layout-container {
    display: flex;
  }
  
  .navbar-container:hover ~ .content {
    margin-left: 220px;
  }
  
  .content {
    margin-left: 70px; /* ancho mínimo de la navbar */
    padding: 1rem;
    flex-grow: 1;
    transition: margin-left 0.3s ease;
  }
  </style>
  
  