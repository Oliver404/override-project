import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    language: 'en',
    selectedCodeLang: 'Kotlin', // Default language for code blocks
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
    setCodeLang(lang: string) {
      this.selectedCodeLang = lang;
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
