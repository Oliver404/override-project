// Function to create and inject the header
const createHeader = () => {
    const headerHTML = `
        <header class="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-50">
            <nav class="container mx-auto flex justify-between items-center">
                <a href="index.html" class="text-2xl font-bold text-gray-900 dark:text-white">Override Project</a>
                <div class="flex items-center space-x-6">
                    <a href="index.html" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors" data-i18n="home">Home</a>
                    <a href="documentation.html" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors" data-i18n="documentation">Documentation</a>

                    <!-- Language Switcher -->
                    <div class="relative">
                        <select id="language-switcher" class="appearance-none bg-transparent text-gray-600 dark:text-gray-300 py-1 pl-2 pr-8 rounded-md leading-tight focus:outline-none cursor-pointer">
                            <option value="en">EN</option>
                            <option value="es">ES</option>
                        </select>
                        <i class="fas fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none"></i>
                    </div>

                    <!-- Theme Toggle -->
                    <button id="theme-toggle" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                        <i class="fas fa-sun"></i>
                    </button>
                </div>
            </nav>
        </header>
    `;
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }
};

// Function to handle theme toggling
const themeHandler = () => {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    const setDarkTheme = () => {
        html.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    };

    const setLightTheme = () => {
        html.classList.remove('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    };

    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkTheme();
    } else {
        setLightTheme();
    }

    themeToggle.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
            setLightTheme();
        } else {
            setDarkTheme();
        }
    });
};

// Function to handle the language switcher UI
const languageSwitcherHandler = () => {
    const languageSwitcher = document.getElementById('language-switcher');
    if (!languageSwitcher) return;

    // Set the dropdown to the current language (from app.js)
    languageSwitcher.value = getLanguage();

    // Add event listener to handle language change
    languageSwitcher.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem('language', selectedLang);
        // Reload the page to apply the new language everywhere
        window.location.reload();
    });
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    createHeader();
    themeHandler();
    languageSwitcherHandler();
    // initializeI18n() is called automatically from app.js
});