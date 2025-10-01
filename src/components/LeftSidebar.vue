<template>
  <aside id="sidebar" class="w-64 bg-white dark:bg-gray-800 p-4 space-y-4 shadow-lg h-screen sticky top-16 hidden md:block flex-shrink-0">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">{{ store.translations.documentation || 'Documentation' }}</h2>
    </div>
    <div class="relative">
      <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      <input type="text" v-model="searchTerm" :placeholder="store.translations.search_docs || 'Search docs...'" class="w-full p-2 pl-10 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
    </div>
    <nav id="sidebar-menu" class="overflow-y-auto">
      <ul class="space-y-1">
        <li v-for="category in filteredDocs" :key="category.title" class="category">
          <button @click="toggleCategory(category)" class="w-full text-left py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-bold flex justify-between items-center" :aria-expanded="!category.collapsed">
            <span>{{ category.title }}</span>
            <i class="fas transition-transform" :class="category.collapsed ? 'fa-chevron-right' : 'fa-chevron-down'"></i>
          </button>
          <ul v-show="!category.collapsed" class="pl-4 mt-1 space-y-1">
            <li v-for="doc in category.children" :key="doc.file">
              <!-- This RouterLink now correctly uses a named route with dynamic params -->
              <RouterLink :to="{ name: 'docs', params: { lang: store.language, page: doc.file } }" class="block py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" active-class="bg-gray-200 dark:bg-gray-700 font-bold">
                {{ doc.title }}
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { store } from '../store';
import docsConfig from '/docs.json';

const route = useRoute();
const searchTerm = ref('');
const docs = ref([]);

/**
 * Sets up the documentation structure based on the current language and expands the
 * category containing the currently active page.
 */
const setupDocs = () => {
  docs.value = (docsConfig[store.language] || []).map(category => {
    const isCurrentCategory = category.isCategory && category.children.some(child => child.file === route.params.page);
    return { ...category, collapsed: !isCurrentCategory };
  });
};

onMounted(setupDocs);

// Re-build the sidebar when the language changes
watch(() => store.language, setupDocs);

// Expand the correct category when the page changes
watch(() => route.params.page, (newPage) => {
    docs.value.forEach(category => {
        const isCurrentCategory = category.isCategory && category.children.some(child => child.file === newPage);
        category.collapsed = !isCurrentCategory;
    });
});

const filteredDocs = computed(() => {
  if (!searchTerm.value) {
    return docs.value;
  }
  const lowerCaseSearch = searchTerm.value.toLowerCase();

  // When searching, map the categories and show only those with matching children
  return docs.value
    .map(category => {
      const filteredChildren = category.children.filter(doc =>
        doc.title.toLowerCase().includes(lowerCaseSearch)
      );
      if (filteredChildren.length > 0) {
        // Expand categories with search results
        return { ...category, children: filteredChildren, collapsed: false };
      }
      return null;
    })
    .filter(Boolean); // Remove null entries
});

const toggleCategory = (category) => {
  category.collapsed = !category.collapsed;
};
</script>