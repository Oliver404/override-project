import { initTheme } from './theme.js';
import { initializeI18n } from './i18n.js';
import { initHeader } from './header.js';
import { initSidebar } from './sidebar.js';
import { initDocs } from './markdown.js';

// --- MAIN APPLICATION INITIALIZATION ---

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize the theme immediately to prevent flash of wrong theme
    initTheme();

    // 2. Initialize the header on all pages
    initHeader();

    // 3. Initialize internationalization on all pages
    const { lang, translations } = await initializeI18n();

    // 4. Initialize documentation-specific components only if on the docs page
    if (document.body.classList.contains('page-docs')) {
        initSidebar(lang, translations);
        initDocs(lang, translations);
    }
});