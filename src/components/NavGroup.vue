<template>
  <div :class="{'mb-2': group.children && group.children.length}">
    <button
      v-if="group.title"
      @click="toggleCollapse"
      class="w-full px-3 text-left py-2 px-0 flex justify-between items-center font-bold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
      :class="{ '': isSubGroup, }">
      {{ group.title }}
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{'rotate-90': !isCollapsed}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5l7 7-7 7"></path>
      </svg>
    </button>

    <ul v-show="!isCollapsed"
        :class="{'border-l border-gray-200 dark:border-gray-700 ml-4 pl-4': group.title}">

      <li v-for="item in group.children" :key="item.slug">

        <template v-if="!('children' in item)">
          <router-link
            :to="`/docs/${item.slug}`"
            class="block py-2 px-3 rounded-r-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-150"

            :class="{'font-bold text-gray-900 dark:text-indigo-400 bg-indigo-200 dark:bg-gray-700/50': activeSlug === item.slug}"
          >
            {{ item.title }}
          </router-link>
        </template>

        <template v-else>
          <NavGroup :group="item" :activeSlug="activeSlug" :is-sub-group="true" />
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watch } from 'vue'

// Define tus interfaces Doc y DocGroup aquí o impórtalas
interface Doc {
  slug: string;
  title: string; /* ... */
}

interface DocGroup {
  slug: string;
  title: string;
  children: (Doc | DocGroup)[];
}

const props = defineProps<{
  group: DocGroup;
  activeSlug: string | undefined;
  isSubGroup: boolean | undefined;
}>()

// Estado local para controlar si el grupo está colapsado (true por defecto)
const isCollapsed = ref(true)

// Lógica para alternar el estado
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// **Mejora:** Calcula si alguno de los hijos es el documento activo.
// Esto es útil para mantener el grupo expandido si un documento interno está activo.
const containsActiveSlug = (children: (Doc | DocGroup)[]): boolean => {
  return children.some(child => {
    if (!('children' in child)) {
      return child.slug === props.activeSlug
    } else {
      return containsActiveSlug(child.children)
    }
  })
}

// Si el grupo contiene el slug activo, debe estar expandido (false)
const isActiveBranch = computed(() => {
  return containsActiveSlug(props.group.children)
})

// Watcher para forzar la expansión si se navega a un sub-documento
watch(isActiveBranch, (newVal) => {
  if (newVal) {
    isCollapsed.value = false
  }
}, { immediate: true })


</script>

<script lang="ts">
export default {
  name: 'NavGroup'
}
</script>
