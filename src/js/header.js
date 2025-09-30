// --- HEADER MANAGEMENT ---

import { getLanguage } from './i18n.js';
import { themeHandler } from './theme.js';

// Function to create and inject the header HTML
function createHeader() {
    const headerHTML = `
        <header class="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-50">
            <nav class="container mx-auto flex justify-between items-center">
                <a href="index.html" class="text-2xl font-bold text-gray-900 dark:text-white">Override Project</a>
                <div class="flex items-center space-x-6">
                    <a href="index.html" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors" data-i18n="home">Home</a>
                    <a href="documentation.html" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors" data-i18n="documentation">Documentation</a>

                    <div class="relative">
                        <select id="language-switcher" class="appearance-none bg-transparent text-gray-600 dark:text-gray-300 py-1 pl-2 pr-8 rounded-md leading-tight focus:outline-none cursor-pointer">
                            <option value="en">EN</option>
                            <option value="es">ES</option>
                        </select>
                        <i class="fas fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none"></i>
                    </div>

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
    }
}

// Function to handle the language switcher UI logic
function languageSwitcherHandler() {
    const languageSwitcher = document.getElementById('language-switcher');
    if (!languageSwitcher) return;

    languageSwitcher.value = getLanguage();
    languageSwitcher.addEventListener('change', (e) => {
        localStorage.setItem('language', e.target.value);
        window.location.reload();
    });
}

// Main initialization function for the header
export const initHeader = () => {
    createHeader();
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', themeHandler);
    }
    languageSwitcherHandler();
};