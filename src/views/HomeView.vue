<template>
  <main class="flex-grow flex items-center justify-center p-4">
    <div class="text-center max-w-4xl mx-auto">
      <h1 class="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 leading-tight">
        Override Project
      </h1>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
        {{ store.translations.subtitle || '...' }}
      </p>
    </div>
  </main>
</template>

<script setup>
import { store } from '../store';
</script>