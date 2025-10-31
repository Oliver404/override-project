<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search blog posts..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
      />
    </div>
    <div class="space-y-12">
      <div v-for="post in filteredPosts" :key="post.slug">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
          <a :href="`#${post.slug}`" class="hover:underline">{{ post.title }}</a>
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ new Date(post.date).toLocaleDateString() }}</p>
        <div class="mt-4 prose dark:prose-invert max-w-none" v-html="post.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBlogPosts } from '@/services/contentService'

interface Post {
  slug: string
  title: string
  date: string
  content: string
}

const { locale } = useI18n()
const posts = ref<Post[]>([])
const searchQuery = ref('')

onMounted(async () => {
  posts.value = await getBlogPosts(locale.value)
})

watch(locale, async (newLocale) => {
  posts.value = await getBlogPosts(newLocale)
})

const filteredPosts = computed(() => {
  if (!searchQuery.value) {
    return posts.value
  }
  return posts.value.filter(post =>
    post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
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
