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

  /**
   * Initializes the theme based on user preference or system settings.
   * Esta función es llamada de forma síncrona por main.js.
   */
  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme = savedTheme;
    } else {
      // Determina el tema basado en la preferencia del sistema operativo
      this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // Aplica la clase del tema al elemento <html> inmediatamente
    document.documentElement.className = this.theme;
  },

  /**
   * Initializes the language and loads initial translations.
   * Es asíncrona y devuelve una Promesa, ya que main.js espera su resolución.
   */
  async initializeLanguage() {
    // Aquí es donde iría la lógica real para cargar el archivo de traducción
    // por defecto antes de que la aplicación se monte.
    // Por ahora, devolvemos una Promesa que resuelve inmediatamente para permitir que main.js continúe.
    return new Promise(resolve => {
        // console.log('Simulating initial language load...');
        resolve(true); 
    });
  }
});
