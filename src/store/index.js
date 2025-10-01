import { reactive } from 'vue'

export const store = reactive({
  // Global reactive state
  theme: 'light',
  language: 'en',
  translations: {},

  /**
   * Toggles the theme between 'light' and 'dark', saves the preference,
   * and updates the class on the <html> element.
   */
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    document.documentElement.className = this.theme;
  },
});