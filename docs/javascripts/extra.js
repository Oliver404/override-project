document.addEventListener('DOMContentLoaded', () => {
  const GITHUB_EDIT_URL_PREFIX = 'https://github.com/Oliver404/override-project/edit/main/docs/';

  const getTheme = () => {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  };

  const setTheme = (theme) => {
    document.body.setAttribute('data-md-color-scheme', theme === 'dark' ? 'slate' : 'default');
  };

  const getLanguage = () => {
    return localStorage.getItem('language') || 'en';
  };

  const setLanguage = (lang) => {
    if (window.location.pathname.startsWith(`/${lang}/`)) {
      return;
    }
    const newPath = window.location.pathname.replace(/^\/[a-z]{2}\//, `/${lang}/`);
    if (newPath !== window.location.pathname) {
      window.location.pathname = newPath;
    }
  };

  setTheme(getTheme());
  setLanguage(getLanguage());

  window.addEventListener('storage', (event) => {
    if (event.key === 'theme') {
      setTheme(event.newValue);
    }
    if (event.key === 'language') {
      setLanguage(event.newValue);
    }
  });

  // Edit button functionality
  const editButton = document.querySelector('.md-content__button[title="Edit this page"]');
  if (editButton) {
    const currentPage = window.location.pathname.split('/').pop();
    const editUrl = `${GITHUB_EDIT_URL_PREFIX}${currentPage || 'index'}.md`;
    editButton.href = editUrl;
    editButton.target = '_blank';
    editButton.rel = 'noopener noreferrer';
  }
});
