<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <header class="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-gray-800 dark:text-white">
            MyApp
          </router-link>
        </div>
        <div class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">{{ $t('home') }}</router-link>
          <router-link to="/docs" class="text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">{{ $t('documentation') }}</router-link>
          <router-link to="/blog" class="text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">{{ $t('blog') }}</router-link>
        </div>
        <div class="flex items-center space-x-4">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </nav>
    </header>

    <main class="flex-grow">
      <router-view />
    </main>

    <footer class="mt-auto w-full bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div class="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} MyApp. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>
