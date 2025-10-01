<template>
  <main class="flex-grow flex items-center justify-center p-4">
    <div class="text-center max-w-4xl mx-auto">
      <h1 class="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 leading-tight">
        Override Project
      </h1>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
        {{ store.translations.subtitle || '...' }}
      </p>
       <div class="mt-12 flex justify-center space-x-6">
          <a href="https://twitter.com/OverridePjt" target="_blank" class="text-gray-400 hover:text-purple-600 transform transition-transform duration-300 hover:scale-110">
              <i class="fa-brands fa-x-twitter fa-2x"></i>
          </a>
          <a href="https://www.instagram.com/overrideproject" target="_blank" class="text-gray-400 hover:text-purple-600 transform transition-transform duration-300 hover:scale-110">
              <i class="fa-brands fa-instagram fa-2x"></i>
          </a>
          <a href="https://www.threads.net/@overrideproject" target="_blank" class="text-gray-400 hover:text-purple-600 transform transition-transform duration-300 hover:scale-110">
              <i class="fa-brands fa-threads fa-2x"></i>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61579024295567" target="_blank" class="text-gray-400 hover:text-purple-600 transform transition-transform duration-300 hover:scale-110">
              <i class="fa-brands fa-facebook fa-2x"></i>
          </a>
          <a href="https://discord.gg/ZsbQDWPy" target="_blank" class="text-gray-400 hover:text-purple-600 transform transition-transform duration-300 hover:scale-110">
              <i class="fa-brands fa-discord fa-2x"></i>
          </a>
      </div>
    </div>
  </main>
</template>

<script setup>
import { store } from '../store';
</script>