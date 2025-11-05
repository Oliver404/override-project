<template>
  <div class="code-block">
    <div v-if="tabs" class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = index"
        :class="{ 'active': activeTab === index }"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="code-container">
      <pre ref="codeContainer"><code :class="language">{{ currentCode }}</code></pre>
      <button @click="copyToClipboard" class="copy-button">
        <span v-if="!copied">Copy</span>
        <span v-else>Copied!</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Or any other theme

const props = defineProps<{
  code: string | { label: string; code: string; lang: string }[];
  lang?: string;
}>();

const codeContainer = ref<HTMLElement | null>(null);
const copied = ref(false);
const activeTab = ref(0);

const tabs = computed(() => {
  if (Array.isArray(props.code)) {
    return props.code;
  }
  return null;
});

const currentCode = computed(() => {
  if (tabs.value) {
    return tabs.value[activeTab.value].code;
  }
  return props.code as string;
});

const language = computed(() => {
  if (tabs.value) {
    return `language-${tabs.value[activeTab.value].lang}`;
  }
  return `language-${props.lang}`;
});

onMounted(() => {
  if (codeContainer.value) {
    hljs.highlightElement(codeContainer.value.querySelector('code') as HTMLElement);
  }
});

const copyToClipboard = () => {
  navigator.clipboard.writeText(currentCode.value).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  });
};
</script>

<style scoped>
.code-block {
  position: relative;
  margin-bottom: 1rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ccc;
}

.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
}

.tabs button.active {
  font-weight: bold;
  border-bottom: 2px solid #000;
}

.code-container {
  position: relative;
}

.copy-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f0f0f0;
  cursor: pointer;
}
</style>
