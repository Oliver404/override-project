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
            <li v-for="doc in filteredDocs" :key="doc.slug">
              <a
                :href="`#${doc.slug}`"
                @click.prevent="scrollTo(doc.slug)"
                class="block py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                :class="{ 'font-bold text-indigo-600 dark:text-indigo-400': activeSlug === doc.slug }"
              >
                {{ doc.title }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
    <main class="w-3/4">
      <div v-for="doc in filteredDocs" :key="doc.slug" :id="doc.slug" class="mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ doc.title }}</h2>
        <div class="prose dark:prose-invert max-w-none" v-html="doc.content"></div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getDocs } from '@/services/contentService'

interface Doc {
  slug: string
  title: string
  content: string
}

const { locale } = useI18n()
const docs = ref<Doc[]>([])
const searchQuery = ref('')
const activeSlug = ref('')

onMounted(async () => {
  docs.value = await getDocs(locale.value)
  if (docs.value.length > 0) {
    activeSlug.value = docs.value[0]?.slug ?? ''
  }
})

watch(locale, async (newLocale) => {
  docs.value = await getDocs(newLocale)
  if (docs.value.length > 0) {
    activeSlug.value = docs.value[0]?.slug ?? ''
  }
})

const filteredDocs = computed(() => {
  if (!searchQuery.value) {
    return docs.value
  }
  return docs.value.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const scrollTo = (slug: string) => {
  const element = document.getElementById(slug)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSlug.value = slug
  }
}
</script>

<style>
/* Add some styles for the prose class to make the rendered markdown look good */
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}
.prose p {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>
