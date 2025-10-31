<template>
  <div class="relative">
    <select v-model="locale" class="w-20 pl-3 pr-8 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
      <option value="en">EN</option>
      <option value="es">ES</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
</script>
