// Function to set the theme
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.setAttribute('data-md-color-scheme', 'slate');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.setAttribute('data-md-color-scheme', 'default');
    localStorage.setItem('theme', 'light');
  }
}

// Function to get the theme from localStorage
function getTheme() {
  return localStorage.getItem('theme') || 'light';
}

// Apply the theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = getTheme();
  setTheme(currentTheme);

  // Add event listener to the theme toggle
  const toggle = document.querySelector('.md-header__button.md-icon[for="__palette_2"]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const newTheme = getTheme() === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }
});
