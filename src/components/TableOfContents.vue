<template>
  <div class="toc-sidebar">
    <h4>On this page</h4>
    <ul>
      <li v-for="heading in headings" :key="heading.id" :class="`level-${heading.level}`">
        <a :href="`#${heading.id}`">{{ heading.text }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headings: { id: string; text: string; level: number }[];
}>();
</script>

<style scoped>
.toc-sidebar {
  width: 250px;
  padding-left: 1rem;
}

.toc-sidebar h4 {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.toc-sidebar ul {
  list-style: none;
  padding: 0;
}

.toc-sidebar li {
  margin-bottom: 0.25rem;
}

.toc-sidebar a {
  text-decoration: none;
  color: #333;
}

.toc-sidebar a:hover {
  text-decoration: underline;
}

.level-2 { margin-left: 0; }
.level-3 { margin-left: 1rem; }
.level-4 { margin-left: 2rem; }
.level-5 { margin-left: 3rem; }
.level-6 { margin-left: 4rem; }
</style>
