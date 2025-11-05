<template>
  <div class="side-nav">
    <NavItem
      v-for="(item, index) in navigation"
      :key="index"
      :item="item"
      :lang="lang"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import NavItem from './NavItem.vue';
import navData from '@/../docs/nav.json';
import { useSettingsStore } from '@/stores/settings';

const navigation = ref([]);
const settings = useSettingsStore();
const lang = ref(settings.language);

const loadNav = () => {
  navigation.value = navData[lang.value];
};

onMounted(() => {
  loadNav();
});

watch(() => settings.language, (newLang) => {
  lang.value = newLang;
  loadNav();
});
</script>

<style scoped>
.side-nav {
  width: 250px;
  padding: 1rem;
  border-right: 1px solid #ccc;
}
</style>
