<template>
  <header class="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-50 flex-shrink-0">
    <nav class="container mx-auto flex justify-between items-center">
      <!-- The home link is now dynamic, pointing to the current language's home page -->
      <RouterLink :to="`/${store.language}`" class="text-2xl font-bold text-gray-900 dark:text-white">Override Project</RouterLink>
      <div class="flex items-center space-x-6">
        <!-- The nav links are also dynamic, preserving the language in the URL -->
        <RouterLink :to="`/${store.language}`" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors" data-i18n="home">Home</RouterLink>
        <RouterLink :to="`/${store.language}/docs`" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors" data-i18n="documentation">Documentation</RouterLink>

        <div class="relative">
          <select id="language-switcher" v-model="currentLanguage" @change="switchLanguage" class="appearance-none bg-transparent text-gray-600 dark:text-gray-300 py-1 pl-2 pr-8 rounded-md leading-tight focus:outline-none cursor-pointer">
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
          <i class="fas fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none"></i>
        </div>

        <button @click="store.toggleTheme" id="theme-toggle" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
          <i :class="store.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun'"></i>
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { store } from '../store';

const router = useRouter();
const route = useRoute();
const currentLanguage = ref(store.language);

/**
 * Switches the language by programmatically pushing a new route.
 * This updates the URL without a full page reload, creating a smooth SPA experience.
 */
const switchLanguage = () => {
  const newLang = currentLanguage.value;

  // Construct the new route parameters, keeping the current page if it exists
  const newParams = { ...route.params, lang: newLang };

  // Use router.push to navigate to the new URL
  router.push({ name: route.name, params: newParams, query: route.query });
};

// Watch for changes in the URL's language parameter and update the component's state
watch(
  () => route.params.lang,
  (newLang) => {
    if (newLang && ['en', 'es'].includes(newLang)) {
      currentLanguage.value = newLang;
      store.language = newLang; // Keep the global store in sync
    }
  },
  { immediate: true }
);
</script>