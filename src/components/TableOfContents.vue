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
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  content: string;
}>();

const headings = ref<{ id: string; text: string; level: number }[]>([]);

const parseHeadings = () => {
  const newHeadings: { id: string; text: string; level: number }[] = [];
  const div = document.createElement('div');
  div.innerHTML = props.content;
  div.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
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
};

onMounted(() => {
  parseHeadings();
});

watch(() => props.content, () => {
  parseHeadings();
});
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

.level-1 { margin-left: 0; }
.level-2 { margin-left: 1rem; }
.level-3 { margin-left: 2rem; }
.level-4 { margin-left: 3rem; }

</style>
