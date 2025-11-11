<template>
  <ul>
    <h3 v-if="group.title" class="text-lg font-bold text-gray-800 dark:text-white mb-2">{{ group.title }}</h3>

    <li v-for="item in group.children" :key="item.slug">

      <template v-if="!('children' in item)">
        <router-link
          :to="`/docs/${item.slug}`"
          class="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white pl-4"
          :class="{ 'font-bold text-indigo-600 dark:text-indigo-400': activeSlug === item.slug }"
        >
          {{ item.title }}
        </router-link>
      </template>

      <template v-else>
        <NavGroup :group="item" :activeSlug="activeSlug" class="pl-4" />
      </template>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

// Define tus interfaces Doc y DocGroup aquí o impórtalas
interface Doc { slug: string; title: string; /* ... */ }
interface DocGroup { slug: string; title: string; children: (Doc | DocGroup)[]; }

const props = defineProps<{
  group: DocGroup;
  activeSlug: string | undefined;
}>();
</script>

<script lang="ts">
// ¡Importante para la recursividad!
export default {
  name: 'NavGroup',
}
</script>
