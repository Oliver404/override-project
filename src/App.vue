<template>
  <div :class="store.theme" class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header />
    <RouterView :key="route.fullPath" class="flex-grow" />
    <GlobalFooter v-if="!isDocsPage" />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'; // Eliminamos 'onMounted'
import { useRoute } from 'vue-router';
import { RouterView } from 'vue-router';
import { store } from './store';
import Header from '@/components/Header.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';

const route = useRoute();

// Determines if the current page is a documentation page to conditionally show the footer.
const isDocsPage = computed(() => route.path.includes('/docs'));

/**
 * Fetches the translation file for the given language and updates the global store.
 * @param {string} lang - The language code (e.g., 'en', 'es').
 */
const loadTranslations = async (lang) => {
  if (!['en', 'es'].includes(lang)) {
    lang = 'en'; // Default to English if the language is invalid
  }
  try {
    const response = await fetch(`/locales/${lang}.json`);
    if (!response.ok) throw new Error('Translation file not found');
    store.translations = await response.json();
    store.language = lang;
    document.documentElement.lang = lang;
  } catch (error) {
    console.error(`Could not load translations for ${lang}.`, error);
  }
};

// Watch for changes in the route's language parameter.
// This makes the entire app reactive to URL changes, y también se ejecuta 
// al montar el componente (gracias a { immediate: true }).
watch(
  () => route.params.lang,
  (newLang) => {
    if (newLang) {
      loadTranslations(newLang);
    }
  },
  { immediate: true } // Run the watcher immediately on component mount
);
</script>
