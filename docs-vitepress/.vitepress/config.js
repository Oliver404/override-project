// .vitepress/config.js
export default {
  title: 'Override Project',
  description: 'Landing page and documentation for the Override Project',
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Features', link: '/features-test' },
      { text: 'Development', link: '/development' },
      { text: 'Contributing', link: '/contributing' },
      { text: 'Changelog', link: '/changelog' },
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/getting-started' },
            { text: 'Features', link: '/features-test' },
            { text: 'Development', link: '/development' },
            { text: 'Contributing', link: '/contributing' },
            { text: 'Changelog', link: '/changelog' },
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Oliver404/override-project' }
    ],
    search: {
      provider: 'local'
    },
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'es'],
      messages: {
        en: {
          'Getting started': 'Getting started',
          'Features': 'Features'
        },
        es: {
          'Getting started': 'Empezando',
          'Features': 'Características'
        }
      }
    }
  }
}
