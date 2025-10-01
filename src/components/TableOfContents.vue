<template>
  <aside id="toc-sidebar" class="w-56 p-4 h-screen sticky top-16 hidden lg:block flex-shrink-0">
    <h3 class="font-semibold mb-2" data-i18n="on_this_page">On this page</h3>
    <nav id="toc-menu">
      <ul class="space-y-2">
        <li v-for="heading in headings" :key="heading.id">
          <a :href="`#${heading.id}`"
             @click.prevent="scrollTo(heading.id)"
             class="block text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
             :class="{
               'font-bold text-blue-600 dark:text-blue-400': activeHeading === heading.id,
               'ml-4': heading.level === 3
             }">
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const headings = ref([]);
const activeHeading = ref('');
let observer = null;

const updateHeadings = () => {
  const content = document.querySelector('#documentation-content');
  if (!content) return;

  const newHeadings = Array.from(content.querySelectorAll('h2, h3')).map(h => ({
    id: h.id,
    text: h.textContent,
    level: parseInt(h.tagName.substring(1), 10)
  }));
  headings.value = newHeadings;

  // Re-initialize the observer with the new headings
  setupObserver();
};

const setupObserver = () => {
  if (observer) {
    observer.disconnect();
  }

  const headingElements = Array.from(document.querySelectorAll('#documentation-content h2, #documentation-content h3'));
  if (headingElements.length === 0) return;

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeHeading.value = entry.target.id;
      }
    });
  }, {
    rootMargin: '0px 0px -80% 0px',
    threshold: 1.0
  });

  headingElements.forEach(h => observer.observe(h));
};

const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Expose updateHeadings to be called from parent
defineExpose({
  updateHeadings
});

onMounted(() => {
  // Initial scan
  updateHeadings();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>