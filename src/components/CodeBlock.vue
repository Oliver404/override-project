<template>
  <div class="code-block">
    <div v-if="tabs" class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="setActiveTab(tab.label)"
        :class="{ 'active': activeTabLabel === tab.label }"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="code-container">
      <pre ref="codeContainer" style="--tw-prose-pre-bg: #2b2b2b"><code :class="language">{{ currentCode }}</code></pre>
      <button @click="copyToClipboard" class="copy-button">
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6zm2 10a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
        </svg>
        <span v-else>Copied!</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import hljs from 'highlight.js';
import 'highlight.js/styles/base16/darcula.min.css';


const props = defineProps<{
  code: string | { label: string; code: string; lang: string }[];
  lang?: string;
}>();

const settings = useSettingsStore();
const codeContainer = ref<HTMLElement | null>(null);
const copied = ref(false);
const localActiveTab = ref(0);

const tabs = computed(() => {
  if (Array.isArray(props.code)) {
    return props.code;
  }
  return null;
});

const groupKey = computed(() => {
  if (tabs.value) {
    return tabs.value.map(tab => tab.label).sort().join(',');
  }
  return null;
});

const activeTabLabel = computed(() => {
  if (tabs.value && groupKey.value) {
    return settings.codeLangGroups[groupKey.value] || tabs.value[0].label;
  }
  return null;
});

const activeTabIndex = computed(() => {
  if (tabs.value) {
    const label = activeTabLabel.value;
    return tabs.value.findIndex(tab => tab.label === label);
  }
  return -1;
});

const setActiveTab = (label: string) => {
  if (groupKey.value) {
    settings.setCodeLangForGroup(groupKey.value, label);
  }
};

const currentCode = computed(() => {
  if (tabs.value) {
    const index = activeTabIndex.value !== -1 ? activeTabIndex.value : 0;
    return tabs.value[index].code;
  }
  return props.code as string;
});

const language = computed(() => {
  if (tabs.value) {
    const index = activeTabIndex.value !== -1 ? activeTabIndex.value : 0;
    return `language-${tabs.value[index].lang}`;
  }
  return `language-${props.lang}`;
});

const highlightCode = () => {
  if (codeContainer.value) {
    const codeElement = codeContainer.value.querySelector('code');
    if (codeElement) {
      codeElement.removeAttribute('data-highlighted');
      hljs.highlightElement(codeElement);
    }
  }
};

onMounted(highlightCode);
watch(currentCode, () => {
  nextTick(highlightCode);
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
/* Styles remain the same */
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
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
}

.copy-button:hover {
  color: #111827;
}

.copy-button span {
  font-size: 0.875rem;
}
</style>
