<!--

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12" style="background-color: red;">
    <div class="text-center">
      <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
        {{ $t('project_name') }}
      </h1>
      <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        This is a modern, clean, and beautiful Vue 3 application.
      </p>
    </div>
  </div>
</template>
-->


<template>
  <div
    class="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8"
  >
    <h1
      class="text-8xl font-extrabold text-gray-900 dark:text-white sm:text-7xl md:text-8xl mb-6"
    >
      404
    </h1>

    <p class="max-w-md text-base text-gray-500 sm:text-lg md:text-xl md:max-w-3xl">
      Page not found
    </p>

    <!-- Íconos de redes sociales -->
    <!-- Íconos de redes sociales -->
    <div class="flex space-x-6 justify-center mb-6 mt-10">
      <a
        href="https://twitter.com/OverridePjt"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <i class="fa-brands fa-x-twitter fa-2x"></i>
      </a>

      <a
        href="https://www.instagram.com/overrideproject"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <i class="fa-brands fa-instagram fa-2x"></i>
      </a>

      <a
        href="https://www.threads.net/@overrideproject"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <i class="fa-brands fa-threads fa-2x"></i>
      </a>

      <a
        href="https://www.facebook.com/profile.php?id=61579024295567"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <i class="fa-brands fa-facebook fa-2x"></i>
      </a>

      <a
        href="https://discord.gg/ZsbQDWPy"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <i class="fa-brands fa-discord fa-2x"></i>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Github, Twitter, Linkedin } from "lucide-vue-next";
</script>
