<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex">
    <aside class="w-1/4 pr-8">
      <div class="sticky top-20">
        <div class="mb-4">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search docs..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
          />
        </div>

        <nav>
          <ul>
            <li v-for="item in filteredDocs" :key="item.slug" class="mb-4">

              <template v-if="'children' in item">
                <NavGroup :group="item" :activeSlug="activeSlug" />
              </template>

              <template v-else>
                <router-link
                  :to="`/docs/${item.slug}`"
                  class="block py-2 text-lg font-bold text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-white"
                  :class="{ 'font-bold text-indigo-600 dark:text-indigo-400': activeSlug === item.slug }"
                >
                  {{ item.title }}
                </router-link>
              </template>
            </li>
          </ul>
        </nav>

      </div>
    </aside>
    <main class="w-3/4">
      <div v-if="currentDoc" class="prose dark:prose-invert max-w-none">
        <div v-html="currentDoc.content"></div>
        <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p v-if="currentDoc.createdAt" class="text-sm text-gray-500 dark:text-gray-400">
            Created on: {{ new Date(currentDoc.createdAt).toLocaleDateString() }}
          </p>
          <p v-if="currentDoc.updatedAt" class="text-sm text-gray-500 dark:text-gray-400">
            Last updated on: {{ new Date(currentDoc.updatedAt).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </main>
    <aside class="w-1/4 pl-8">
      <div class="sticky top-20">
        <TableOfContents v-if="headings.length" :headings="headings" />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, h, render, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getDocs, getDoc } from '@/services/contentService'
import TableOfContents from '@/components/TableOfContents.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import NavGroup from '@/components/NavGroup.vue'

const components = {
  CodeBlock,
};

interface Doc {
  slug: string
  title: string
  content: string
  createdAt?: string
  updatedAt?: string
}

// Un Grupo puede contener un array de Docs o de otros DocGroups
type DocChild = Doc | DocGroup;

interface DocGroup {
  slug: string
  title: string
  children: DocChild[] // ¡Cambio importante!
}

// El array principal de docs contiene Doc's sueltos o DocGroups
type NavItem = Doc | DocGroup;

interface Heading {
  id: string;
  text: string;
  level: number;
}

const { locale } = useI18n()
const route = useRoute()
// const docs = ref<Doc[]>([])
const docs = ref<(Doc | DocGroup)[]>([])
const searchQuery = ref('')
const currentDoc = ref<Doc | null>(null)
const headings = ref<Heading[]>([])

// const activeSlug = computed(() => route.params.slug as string)
const activeSlug = computed(() => route.params.pathMatch?.at(0))

const loadDocs = async () => {
  docs.value = await getDocs(locale.value)
  console.log("Hola");
}

const loadCurrentDoc = async () => {
  let slug = activeSlug.value

  // Si no hay un slug activo en la URL, encontramos el primer slug
  if (!slug && docs.value.length > 0) {
    const firstItem = docs.value[0]

    // 1. Es un grupo: toma el slug del primer hijo
    if ('children' in firstItem && firstItem.children.length > 0) {
      slug = firstItem.children[0].slug
    }
    // 2. Es un documento suelto: toma su slug
    else if (!('children' in firstItem)) {
      slug = firstItem.slug
    }
  }

  if (slug) {
    currentDoc.value = await getDoc(locale.value, slug)
  }
}

// const loadCurrentDoc = async () => {
//   const slug = activeSlug.value || docs.value[0]?.children?.[0]?.slug
//   if (slug) {
//     currentDoc.value = await getDoc(locale.value, slug)
//   }
// }

onMounted(async () => {
  await loadDocs()
  await loadCurrentDoc()
})

watch(locale, async () => {
  await loadDocs()
  await loadCurrentDoc()
})

watch(activeSlug, async () => {
  await loadCurrentDoc()
})

watch(() => currentDoc.value, (newDoc) => {
  if (newDoc) {
    nextTick(() => {
      const contentDiv = document.querySelector('.prose > div');
      if (contentDiv) {
        // Mount dynamic components
        contentDiv.querySelectorAll('[data-component]').forEach(el => {
          const componentName = el.getAttribute('data-component');
          const props = JSON.parse(el.getAttribute('data-props') || '{}');
          console.log(componentName);
          console.log(components['CodeBlock']);
          if (componentName && components[componentName]) {
            const vnode = h(components[componentName], props);
            render(vnode, el);
          }
        });

        // Extract headings for TOC
        const newHeadings: Heading[] = [];
        contentDiv.querySelectorAll('h2, h3, h4, h5, h6').forEach((heading) => {
          const text = heading.textContent || '';
          const id = heading.id;
          if (id) {
            newHeadings.push({
              id,
              text,
              level: parseInt(heading.tagName.substring(1), 10),
            });
          }
        });
        headings.value = newHeadings;
      }
    });
  }
}, { deep: true, immediate: true });

// const filteredDocs = computed(() => {
//   if (!searchQuery.value) {
//     return docs.value
//   }
//   return docs.value.map(group => {
//     const filteredChildren = group.children?.filter(doc =>
//       doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//       doc.content.toLowerCase().includes(searchQuery.value.toLowerCase())
//     )
//     return { ...group, children: filteredChildren }
//   }).filter(group => group.children && group.children.length > 0)
// })
const filteredDocs = computed(() => {
  if (!searchQuery.value) {
    return docs.value
  }

  const query = searchQuery.value.toLowerCase()

  return docs.value.map(item => {
    // Si es un grupo
    if ('children' in item) {
      const filteredChildren = item.children?.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query)
      )
      // Devuelve el grupo con los hijos filtrados
      return { ...item, children: filteredChildren }
    } else {
      // Si es un documento suelto
      // Devuelve el documento solo si coincide con la búsqueda
      if (item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)) {
        return item
      }
      // Si no coincide, devolvemos null para filtrarlo más tarde
      return null
    }
  }).filter(item => {
    if (!item) return false // Filtrar documentos sueltos que no coinciden
    if ('children' in item) {
      return item.children && item.children.length > 0 // Filtrar grupos sin hijos
    }
    return true // Mantener documentos sueltos que sí coinciden
  }) as (Doc | DocGroup)[] // Aseguramos el tipo de retorno
})
</script>

<style>
/* Styles remain the same */
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}
.prose p {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>
