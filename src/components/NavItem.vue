<template>
  <div class="nav-item">
    <div @click="toggle" :class="{ 'has-children': isGroup }">
      <router-link v-if="!isGroup" :to="link">{{ item.title || item }}</router-link>
      <span v-else>{{ item.title }}</span>
    </div>
    <div v-if="isGroup && isOpen" class="children">
      <NavItem
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        :lang="lang"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  item: string | { title: string; children: any[] };
  lang: string;
}>();

const isOpen = ref(false);

const isGroup = computed(() => {
  return typeof props.item === 'object' && props.item.children;
});

const link = computed(() => {
  return `/${props.lang}/docs/${props.item}`;
});

const toggle = () => {
  if (isGroup.value) {
    isOpen.value = !isOpen.value;
  }
};
</script>

<style scoped>
.nav-item {
  margin-left: 1rem;
}

.has-children {
  cursor: pointer;
  font-weight: bold;
}

.children {
  margin-left: 1rem;
}
</style>
