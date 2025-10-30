<template>
  <header class="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-50 flex-shrink-0">
    <nav class="container mx-auto flex justify-between items-center">
      <!-- The home link is now dynamic, pointing to the current language's home page -->
      <RouterLink :to="`/${store.language}`" class="text-2xl font-bold text-gray-900 dark:text-white">Override Project</RouterLink>
      <div class="flex items-center space-x-6">
        <!-- The nav links are also dynamic, preserving the language in the URL -->
        <RouterLink :to="`/${store.language}`" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors" data-i18n="home">Home</RouterLink>
        <a href="/docs-vitepress/" rel="noopener noreferrer" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors" data-i18n="documentation">Documentation</a>

        <SearchBar />
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { store } from '../store';
import SearchBar from './SearchBar.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';
</script>
