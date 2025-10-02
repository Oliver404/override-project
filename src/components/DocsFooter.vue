<template>
  <footer id="docs-footer" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
    <p><span data-i18n="last_updated">Last Updated</span>: <span>{{ lastUpdated }}</span></p>
    <p>Version: 1.0.0</p>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { store } from '../store';

const lastUpdated = ref('');

onMounted(() => {
  lastUpdated.value = new Date().toLocaleDateString(store.language, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});
</script>