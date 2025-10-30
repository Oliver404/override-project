<template>
  <button
    @click="store.toggleTheme"
    id="theme-toggle"
    class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors"
  >
    <i :class="store.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun'"></i>
  </button>
</template>

<script setup>
import { store } from '../store';
</script>
