<template>
  <div class="relative">
    <select
      id="language-switcher"
      v-model="currentLanguage"
      @change="switchLanguage"
      class="appearance-none bg-transparent text-gray-600 dark:text-gray-300 py-1 pl-2 pr-8 rounded-md leading-tight focus:outline-none cursor-pointer"
    >
      <option value="en">EN</option>
      <option value="es">ES</option>
    </select>
    <i class="fas fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none"></i>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { store } from '../store';

const router = useRouter();
const route = useRoute();
const currentLanguage = ref(store.language);

const switchLanguage = () => {
  const newLang = currentLanguage.value;
  const newParams = { ...route.params, lang: newLang };
  router.push({ name: route.name, params: newParams, query: route.query });
  store.setLanguage(newLang);
};

watch(
  () => route.params.lang,
  (newLang) => {
    if (newLang && ['en', 'es'].includes(newLang)) {
      currentLanguage.value = newLang;
      store.setLanguage(newLang);
    }
  },
  { immediate: true }
);
</script>
