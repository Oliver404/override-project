import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    language: 'en',
    codeLangGroups: {} as Record<string, string>,
  }),
  actions: {
    initialize() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.theme = savedTheme;
      }
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        this.language = savedLanguage;
      }
      this.applyTheme();
    },
    setTheme(theme: string) {
      this.theme = theme;
      localStorage.setItem('theme', theme);
      this.applyTheme();
    },
    setLanguage(language: string) {
      this.language = language;
      localStorage.setItem('language', language);
    },
    setCodeLangForGroup(groupKey: string, lang: string) {
      this.codeLangGroups[groupKey] = lang;
    },
    applyTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});
