<template>
  <nav aria-label="Breadcrumb" class="mb-4 text-sm text-gray-500 dark:text-gray-400">
    <ol class="flex items-center space-x-2">
      <li>
        <RouterLink to="/docs" class="hover:underline" data-i18n="documentation">Documentation</RouterLink>
      </li>
      <li v-if="category">
        <span class="mx-1">/</span>
        <span>{{ category }}</span>
      </li>
      <li v-if="pageTitle">
        <span class="mx-1">/</span>
        <span class="font-semibold text-gray-700 dark:text-gray-200">{{ pageTitle }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store';
import docsConfig from '/docs.json';

const route = useRoute();

const findDocInfo = () => {
  const pageFile = route.query.page;
  if (!pageFile) return { category: null, pageTitle: null };

  const langConfig = docsConfig[store.language] || [];
  for (const category of langConfig) {
    if (category.isCategory) {
      const doc = category.children.find(child => child.file === pageFile);
      if (doc) {
        return { category: category.title, pageTitle: doc.title };
      }
    }
  }
  return { category: null, pageTitle: null };
};

const docInfo = computed(() => findDocInfo());
const category = computed(() => docInfo.value.category);
const pageTitle = computed(() => docInfo.value.pageTitle);
</script>