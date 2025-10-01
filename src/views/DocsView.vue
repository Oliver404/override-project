<template>
  <div class="flex-grow container mx-auto flex w-full">
    <LeftSidebar />
    <main class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-3xl mx-auto">
        <Breadcrumbs />

        <!-- Conditional rendering for loading and error states -->
        <div v-if="isLoading" class="text-center p-8" data-i18n="loading">Loading...</div>
        <div v-else-if="error" class="p-4 my-4 bg-red-100 text-red-700 rounded-md">{{ error }}</div>

        <!-- Rendered Markdown content -->
        <article v-else id="documentation-content" v-html="renderedContent" class="prose dark:prose-invert max-w-none"></article>

        <DocsFooter v-if="!isLoading && !error" />
      </div>
    </main>
    <TableOfContents ref="toc" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useMarkdown } from '../composables/useMarkdown.js';

// Import all child components
import LeftSidebar from '@/components/LeftSidebar.vue';
import TableOfContents from '@/components/TableOfContents.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import DocsFooter from '@/components/DocsFooter.vue';

const route = useRoute();
const { renderedContent, isLoading, error, renderMarkdown } = useMarkdown();
const toc = ref(null); // A template ref to access the TableOfContents component instance

/**
 * Loads and renders the Markdown document based on the current route parameters.
 * It is triggered by the watcher whenever the route changes.
 * @param {object} params - The route parameters object, containing lang and page.
 */
const loadContent = async (params) => {
  const lang = params.lang || 'en';
  const pageFile = params.page || 'getting-started.md';
  const filePath = `/docs/${lang}/${pageFile}`;

  await renderMarkdown(filePath);

  // After the DOM has been updated with the new content...
  await nextTick();
  // ...tell the TableOfContents component to update its headings.
  if (toc.value) {
    toc.value.updateHeadings();
  }
};

// Watch for changes to the route parameters.
// This single watcher handles both language and page changes efficiently,
// making the component reactive to URL state.
watch(
  () => route.params,
  (newParams) => {
    if (newParams.lang && newParams.page) {
        loadContent(newParams);
    } else if (newParams.lang) {
        // Handle case where only language is present, load default page
        loadContent({ lang: newParams.lang, page: 'getting-started.md' });
    }
  },
  { immediate: true, deep: true } // `immediate` loads content on initial mount
);
</script>

<style>
/* Styles for the prose class to format rendered markdown */
.prose { text-align: left; }
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 { color: inherit; }
.prose a { @apply text-blue-600 dark:text-blue-400 hover:underline; }
.prose code:not(pre code) { @apply bg-gray-200 dark:bg-gray-700 rounded-md px-1.5 py-1 text-sm; }
.prose pre { @apply bg-gray-800 text-white rounded-lg p-4; }
.prose blockquote { @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic; }
.prose table { @apply w-full; }
.prose th { @apply bg-gray-100 dark:bg-gray-700; }
.prose th, .prose td { @apply border border-gray-300 dark:border-gray-600 px-4 py-2; }
</style>